#!/usr/bin/env python3
"""ABRAXAS v1.2 confirmed-selection exporter for Terminal/FFmpeg.
Source video is read-only. All outputs are derivatives under ABRAXAS_SHIM_EXPORT/.
"""
from __future__ import annotations
import argparse, csv, json, math, re, shlex, subprocess, sys
from pathlib import Path

def tc_seconds(value: str, fps: float) -> float:
    value=str(value).strip()
    if re.fullmatch(r'\d{2}:\d{2}:\d{2}:\d{2}', value):
        h,m,s,f=map(int,value.split(':')); return h*3600+m*60+s+f/fps
    if re.fullmatch(r'\d{2}:\d{2}:\d{2}[\.,]\d+', value):
        h,m,sec=value.replace(',','.').split(':'); return int(h)*3600+int(m)*60+float(sec)
    if re.fullmatch(r'\d{2}:\d{2}:\d{2}', value):
        h,m,s=map(int,value.split(':')); return h*3600+m*60+s
    try: return float(value)
    except Exception: raise ValueError(f'Unsupported timestamp: {value}')

def hhmmss(seconds: float) -> str:
    seconds=max(0.0,seconds); h=int(seconds//3600); m=int((seconds%3600)//60); s=seconds%60
    return f'{h:02d}:{m:02d}:{s:06.3f}'

def choose(prompt, options, default):
    print(prompt)
    for key,label in options: print(f'  {key}. {label}')
    ans=input(f'[{default}] > ').strip() or default
    return ans

def run(cmd, dry=False):
    print('$',shlex.join(cmd))
    if not dry: subprocess.run(cmd,check=True)

def normalize_segments(video, fps):
    segs=[]
    for i,s in enumerate(video.get('segments',[]),1):
        start=s.get('sourceStart',s.get('source_start',s.get('in')))
        end=s.get('sourceEnd',s.get('source_end',s.get('out')))
        if start is None or end is None: raise ValueError(f"{video.get('id')}: segment {i} missing start/end")
        a=tc_seconds(start,fps); b=tc_seconds(end,fps)
        if b<=a: raise ValueError(f"{video.get('id')}: segment {i} end <= start")
        segs.append({**s,'order':s.get('order',i),'start_seconds':a,'end_seconds':b,'sourceStart':start,'sourceEnd':end})
    return sorted(segs,key=lambda x:x['order'])

def main():
    ap=argparse.ArgumentParser(description='Render only CONFIRMADO Shim clips')
    ap.add_argument('manifest', nargs='?', default='SHIM_CONFIRMED_MANIFEST.json')
    ap.add_argument('--ids', help='comma separated confirmed video IDs')
    ap.add_argument('--selection', choices=['one','ids','all','saved'])
    ap.add_argument('--output-mode', choices=['segments','joined','both','instructions','full'])
    ap.add_argument('--precision', choices=['precise','fast'])
    ap.add_argument('--output-dir', default='ABRAXAS_SHIM_EXPORT')
    ap.add_argument('--dry-run', action='store_true')
    ns=ap.parse_args()
    mp=Path(ns.manifest).expanduser().resolve(); data=json.loads(mp.read_text(encoding='utf-8'))
    if data.get('manifestType')!='SHIM_CONFIRMED_MANIFEST' or data.get('sourceReadOnly') is not True:
        raise SystemExit('Refusing: requires SHIM_CONFIRMED_MANIFEST with sourceReadOnly=true')
    src=Path(data['sourceVideo']).expanduser(); src=(mp.parent/src).resolve() if not src.is_absolute() else src.resolve()
    if not src.exists(): raise SystemExit(f'Source not found: {src}')
    fps=float(data.get('sourceMetadata',{}).get('fps') or 30)
    confirmed=[v for v in data.get('confirmedVideos',[]) if v.get('selectionStatus','CONFIRMADO')=='CONFIRMADO']
    selection=ns.selection or choose('¿Qué quieres procesar?',[('one','Un video confirmado'),('ids','Varios por ID'),('all','Todos los confirmados'),('saved','Selección guardada actualmente')],'all')
    ids=[x.strip() for x in (ns.ids or '').split(',') if x.strip()]
    if selection=='one' and not ids:
        for i,v in enumerate(confirmed,1): print(f'  {i}. {v.get("id")} · {v.get("title","")}')
        idx=int(input('Número > ').strip()); ids=[confirmed[idx-1]['id']]
    elif selection=='ids' and not ids: ids=[x.strip() for x in input('IDs separados por coma > ').split(',') if x.strip()]
    elif selection=='saved': ids=data.get('currentSavedSelection',[])
    selected=confirmed if selection=='all' else [v for v in confirmed if v.get('id') in ids]
    if not selected: raise SystemExit('No confirmed videos selected')
    mode=ns.output_mode or choose('¿Qué quieres producir?',[('segments','Segmentos separados'),('joined','Video final unido'),('both','Ambas cosas'),('instructions','Solo generar instrucciones'),('full','Paquete completo')],'both')
    precision=ns.precision or choose('Precisión',[('precise','Corte preciso / recodificación'),('fast','Stream copy rápido / dependiente de keyframes')],'precise')
    out=Path(ns.output_dir).resolve(); out.mkdir(parents=True,exist_ok=True)
    (out/'MASTER_MANIFEST.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'CONFIRMED_SELECTION.json').write_text(json.dumps({'confirmedVideoIds':[v['id'] for v in selected],'confirmedCarouselIds':[c.get('carouselId',c.get('id')) for c in data.get('confirmedCarousels',[])]},ensure_ascii=False,indent=2),encoding='utf-8')
    commands=[]
    for video in selected:
        cid=video['id']; cdir=out/'clips'/cid; fragdir=cdir/'fragments'; joindir=cdir/'joined'
        for d in [fragdir,joindir,cdir/'copies',cdir/'covers',cdir/'visual',cdir/'prompts'/'omni',cdir/'prompts'/'images',cdir/'prompts'/'covers',cdir/'references']:
            d.mkdir(parents=True,exist_ok=True)
        segs=normalize_segments(video,fps); (cdir/'manifest.json').write_text(json.dumps(video,ensure_ascii=False,indent=2),encoding='utf-8')
        (cdir/'cutlist.json').write_text(json.dumps(segs,ensure_ascii=False,indent=2),encoding='utf-8')
        with (cdir/'cutlist.csv').open('w',newline='',encoding='utf-8') as f:
            w=csv.DictWriter(f,fieldnames=['order','role','sourceStart','sourceEnd','reference_text']); w.writeheader()
            for s in segs: w.writerow({k:s.get(k,'') for k in w.fieldnames})
        (cdir/'transcript.txt').write_text('\n\n'.join(f"[{s['sourceStart']} - {s['sourceEnd']}]\n{s.get('sourceLiteral',s.get('reference_text',''))}" for s in segs),encoding='utf-8')
        fragment_paths=[]
        for j,s in enumerate(segs,1):
            dest=fragdir/f'{j:02d}_{s.get("role","segment")}.mp4'; fragment_paths.append(dest)
            dur=s['end_seconds']-s['start_seconds']
            if precision=='fast': cmd=['ffmpeg','-y','-ss',hhmmss(s['start_seconds']),'-i',str(src),'-t',f'{dur:.3f}','-c','copy',str(dest)]
            else: cmd=['ffmpeg','-y','-ss',hhmmss(s['start_seconds']),'-i',str(src),'-t',f'{dur:.3f}','-c:v','libx264','-crf','18','-preset','medium','-c:a','aac','-b:a','192k',str(dest)]
            commands.append(cmd)
            if mode in ('segments','both','joined','full') and mode!='instructions': run(cmd,ns.dry_run)
        concat=cdir/'concat.txt'; concat.write_text('\n'.join("file '"+str(p).replace("'","'\\''")+"'" for p in fragment_paths)+'\n',encoding='utf-8')
        joined=joindir/f'{cid}_joined.mp4'; concat_cmd=['ffmpeg','-y','-f','concat','-safe','0','-i',str(concat),'-c','copy',str(joined)]
        commands.append(concat_cmd)
        if mode in ('joined','both','full') and mode!='instructions': run(concat_cmd,ns.dry_run)
        visual=video.get('visualProduction',{})
        for name,key in [('visual_plan.json','visualPlan'),('broll.json','broll'),('vfx.json','vfx'),('sfx.json','sfx'),('music.json','music')]:
            (cdir/'visual'/name).write_text(json.dumps(visual.get(key,video.get(key,{})),ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'terminal').mkdir(exist_ok=True); (out/'davinci').mkdir(exist_ok=True)
    (out/'terminal'/'ffmpeg_commands.txt').write_text('\n'.join(shlex.join(c) for c in commands)+'\n',encoding='utf-8')
    print(f'\nDone: {len(selected)} confirmed video(s) → {out}')
if __name__=='__main__': main()
