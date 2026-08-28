#!/usr/bin/env python3
"""ABRAXAS v1.2 DaVinci importer.
Run from Resolve's scripting environment. It consumes the same confirmed manifest as Terminal.
It never changes the original source file.
"""
from __future__ import annotations
import json, os, sys
from pathlib import Path

def load_resolve():
    try:
        import DaVinciResolveScript as dvr
    except ImportError:
        util=os.getenv('RESOLVE_SCRIPT_API')
        if util and util not in sys.path: sys.path.append(util)
        import DaVinciResolveScript as dvr
    return dvr.scriptapp('Resolve')

def seconds(tc, fps):
    parts=str(tc).split(':')
    if len(parts)==4:
        h,m,s,f=map(int,parts); return h*3600+m*60+s+f/fps
    if len(parts)==3: return int(parts[0])*3600+int(parts[1])*60+float(parts[2].replace(',','.'))
    return float(tc)

def main(manifest_path):
    mp=Path(manifest_path).expanduser().resolve(); data=json.loads(mp.read_text(encoding='utf-8'))
    if data.get('manifestType')!='SHIM_CONFIRMED_MANIFEST' or data.get('sourceReadOnly') is not True:
        raise RuntimeError('Requires SHIM_CONFIRMED_MANIFEST with sourceReadOnly=true')
    vids=[v for v in data.get('confirmedVideos',[]) if v.get('selectionStatus','CONFIRMADO')=='CONFIRMADO']
    if not vids: raise RuntimeError('No confirmed videos')
    resolve=load_resolve(); pm=resolve.GetProjectManager(); project=pm.GetCurrentProject()
    if not project: raise RuntimeError('Open or create a DaVinci Resolve project first')
    media_pool=project.GetMediaPool(); root=media_pool.GetRootFolder(); media_pool.SetCurrentFolder(root)
    source=Path(data['sourceVideo']).expanduser(); source=(mp.parent/source).resolve() if not source.is_absolute() else source.resolve()
    imported=media_pool.ImportMedia([str(source)])
    if not imported: raise RuntimeError(f'Could not import source: {source}')
    source_item=imported[0]; fps=float(data.get('sourceMetadata',{}).get('fps') or project.GetSetting('timelineFrameRate') or 30)
    marker_colors={'HOOK':'Yellow','DEVELOPMENT':'Blue','PAYOFF':'Green','B-ROLL':'Cyan','VFX':'Purple','SFX':'Orange','CLAIM':'Red','REVIEW':'Pink'}
    results=[]
    for v in vids:
        timeline=media_pool.CreateEmptyTimeline(v['id'])
        if not timeline: raise RuntimeError(f"Could not create timeline {v['id']}")
        project.SetCurrentTimeline(timeline)
        segs=sorted(v.get('segments',[]),key=lambda x:x.get('order',0))
        records=[]; cursor=0
        for seg in segs:
            a=seconds(seg.get('sourceStart',seg.get('source_start')),fps); b=seconds(seg.get('sourceEnd',seg.get('source_end')),fps)
            start_frame=round(a*fps); end_frame=round(b*fps)
            clip_info={'mediaPoolItem':source_item,'startFrame':start_frame,'endFrame':end_frame,'trackIndex':1,'recordFrame':cursor}
            appended=media_pool.AppendToTimeline([clip_info])
            duration=max(1,end_frame-start_frame+1); role=str(seg.get('role','DEVELOPMENT')).upper(); timeline.AddMarker(cursor,marker_colors.get(role,'Blue'),role,seg.get('sourceLiteral',seg.get('reference_text','')),duration,'ABRAXAS')
            records.append({'role':role,'recordFrame':cursor,'durationFrames':duration,'sourceStart':seg.get('sourceStart'),'sourceEnd':seg.get('sourceEnd')}); cursor+=duration
        for note in v.get('markers',[]):
            frame=round(float(note.get('timelineSeconds',0))*fps); role=str(note.get('type','REVIEW')).upper(); timeline.AddMarker(frame,marker_colors.get(role,'Pink'),role,note.get('note',''),1,'ABRAXAS')
        results.append({'timeline':v['id'],'frames':cursor,'segments':records})
    out=mp.parent/'davinci'; out.mkdir(exist_ok=True)
    (out/'timeline_manifest.generated.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Created {len(results)} editable timeline(s). Review every cut, marker, subtitle and claim before delivery.')
if __name__=='__main__':
    if len(sys.argv)<2: raise SystemExit('Usage inside Resolve: python ABRAXAS_IMPORT_TO_RESOLVE.py /path/SHIM_CONFIRMED_MANIFEST.json')
    main(sys.argv[1])
