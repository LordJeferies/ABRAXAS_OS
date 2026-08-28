from __future__ import annotations
import argparse, json, os, shutil, subprocess, sys, time
from pathlib import Path

from .assets import build_asset_tree
from .core import ensure_dir, format_timecode, parse_timecode, read_json, source_fingerprint, stable_hash, write_json_atomic
from .davinci import build_handoff_manifest
from .htmlio import compile_html_pair
from .microtrim_runner import resolve_microtrim_job
from .plan import build_part_plan, collect_microtrims, build_visual_placements, filter_microtrim_jobs
from .preflight import preflight
from .project import load_project, make_project_config
from .queue import build_visual_queue
from .runtime import assemble, encode_part, part_cache_key, validate_media, materialize_named_part
from .state import StateStore
from .verify import verify_content_contract, verify_render_artifact
from .workers import worker_assignments


def infer_package_root(file_path):
    p=Path(file_path).resolve()
    # Prefer the distributable layout PACKAGE/TOOLS/abraxas/cli.py.
    for candidate in p.parents:
        if (candidate/'TOOLS'/'abraxas_cli.py').exists():
            return candidate
    # Development layout keeps abraxas/ and abraxas_cli.py at the same root.
    for candidate in p.parents:
        if (candidate/'abraxas_cli.py').exists() and (candidate/'abraxas').is_dir():
            return candidate
    return p.parents[1]

def package_root(): return infer_package_root(__file__)

def hydrate_cfg(cfg):
    root=package_root(); out=Path(cfg['output_root']).expanduser()
    paths={
      'root':str(out),'manifest':str(out/'00_MANIFEST'),'state':str(out/'01_STATE'),'intro':str(out/'02_INTRO_LAB'),
      'vertical':str(out/'03_VERTICALS'),'horizontal':str(out/'04_HORIZONTALS'),'carousels':str(out/'05_CAROUSELS'),
      'phrases':str(out/'06_PHRASES'),'claims':str(out/'07_CLAIMS'),'potentials':str(out/'08_POTENTIALS'),
      'visual_queue':str(out/'09_VISUAL_QUEUE'),'davinci':str(out/'10_DAVINCI_HANDOFF'),'final':str(out/'11_FINAL'),
      'logs':str(out/'12_LOGS'),'cache':str(out/'13_CACHE'),'locks':str(out/'13_CACHE/LOCKS'),'microtrim':str(out/'13_CACHE/MICROTRIMS'),
      'backups':str(out/'14_BACKUPS')
    }
    cfg=dict(cfg); cfg['_package_root']=str(root); cfg['_paths']=paths
    for p in paths.values(): ensure_dir(p)
    return cfg

def load_cfg(path): return hydrate_cfg(load_project(path))

def bundle_path(cfg): return Path(cfg['_paths']['manifest'])/'COMPILED_BUNDLE.json'

def fingerprints_path(cfg): return Path(cfg['_paths']['manifest'])/'SOURCE_FINGERPRINTS.json'

def resolutions_path(cfg): return Path(cfg['_paths']['manifest'])/'MICROTRIM_RESOLUTIONS.json'

def part_plan_path(cfg): return Path(cfg['_paths']['manifest'])/'PART_PLAN.json'

def load_bundle(cfg):
    p=bundle_path(cfg)
    if p.exists(): return read_json(p)
    b=compile_html_pair(cfg['inputs']['content_html'],cfg['inputs']['intro_html']); write_json_atomic(p,b); return b

def load_resolutions(cfg):
    r=read_json(resolutions_path(cfg),{}) or {}; r.update(cfg.get('overrides',{}).get('manual_microtrims',{})); return r

def save_resolutions(cfg,obj): write_json_atomic(resolutions_path(cfg),obj)

def cmd_setup(args):
    root=package_root(); proj=root/'PROJECT'; proj.mkdir(exist_ok=True)
    def prompt(label,default=''):
        if args.non_interactive: return default
        raw=input(f'{label}' + (f' [{default}]' if default else '') + ': ').strip()
        raw=raw.strip('"').strip("'")
        return raw or default
    if args.joc55:
        content=str(root/'INPUT'/'JOC55_AMANDA_CONTENT_ENGINE_V3_1.html'); intro=str(root/'INPUT'/'JOC55_AMANDA_INTRO_LAB_V3_1.html')
        dv=str(Path.home()/"Desktop/Joc podcast next ep 55/riverside_dr._& joc 10_joc_lopez's studio V.mp4")
        dh=str(Path.home()/"Desktop/Joc podcast next ep 55/JOC55_MASTER_HORIZONTAL_SUBTITULADO.mp4")
        dout=str(Path.home()/"Desktop/JOC55_ABRAXAS_V3_1_OUTPUT")
        pid='JOC55_AMANDA'
    else:
        content=args.content or ''; intro=args.intro or ''; dv=args.vertical or ''; dh=args.horizontal or ''; dout=args.output or str(Path.home()/'Desktop/ABRAXAS_V3_1_OUTPUT'); pid=args.project_id or 'PROJECT'
    pid=prompt('Project ID',pid); content=prompt('Content Engine HTML',content); intro=prompt('Intro Lab HTML',intro); dv=prompt('Vertical master',dv); dh=prompt('Horizontal master',dh); dout=prompt('Output root',dout)
    cfg=make_project_config(pid,content,intro,dv,dh,dout)
    # Prefer local binaries actually found on this Mac.
    if shutil.which('ffmpeg'): cfg['render']['ffmpeg']=shutil.which('ffmpeg')
    if shutil.which('ffprobe'): cfg['render']['ffprobe']=shutil.which('ffprobe')
    auto_py=root/'CONFIG'/'mlx_python_auto.txt'
    if auto_py.exists() and auto_py.read_text(encoding='utf-8').strip(): cfg['mlx']['python']=auto_py.read_text(encoding='utf-8').strip()
    # Auto-detect previously downloaded MLX models without downloading anything.
    candidates=[Path.home()/"Desktop/Moka_Terminal_Cortes_48_FrameMatched_FINAL/Modelos_MLX", Path.home()/"Documents/Modelos_MLX"]
    for base in candidates:
        t=base/'whisper-large-v3-turbo'; l=base/'whisper-large-v3'
        if t.exists() and l.exists(): cfg['mlx']['turbo_model']=str(t); cfg['mlx']['large_model']=str(l); break
    if not args.non_interactive and not cfg['mlx']['turbo_model']:
        cfg['mlx']['turbo_model']=prompt('MLX turbo model path (leave blank to configure later)','')
        cfg['mlx']['large_model']=prompt('MLX large-v3 model path (leave blank to configure later)','')
    config_path=proj/'project_config.json'; write_json_atomic(config_path,cfg)
    print('CONFIG CREATED:',config_path); print('OUTPUT:',dout)
    print('NEXT: 01_VALIDATE_INPUTS.command')

def cmd_validate(args):
    cfg=load_cfg(args.config); report=preflight(cfg,strict_hardware=not args.allow_non_apple)
    write_json_atomic(Path(cfg['_paths']['manifest'])/'PREFLIGHT.json',report)
    for c in report['checks']: print(('OK' if c['ok'] else 'FAIL'), '·', c['name'], '·', c['detail'])
    if not report['ok']: raise SystemExit(2)

def cmd_compile(args):
    cfg=load_cfg(args.config); b=compile_html_pair(cfg['inputs']['content_html'],cfg['inputs']['intro_html']); write_json_atomic(bundle_path(cfg),b)
    summary={'verticals':len(b['content'].get('verticals',[])),'horizontals':len(b['content'].get('horizontals',[])),'principal_carousels':len(b['content'].get('principal_carousels',[])),'highlight_carousels':len(b['content'].get('highlight_carousels',[])),'phrases':len(b['content'].get('phrases',[])),'claims':len(b['content'].get('claims',[])),'potentials':len(b['content'].get('potentials',[])),'intros':len(b['intro'].get('intros',[]))}
    write_json_atomic(Path(cfg['_paths']['manifest'])/'COMPILE_SUMMARY.json',summary); print(json.dumps(summary,ensure_ascii=False,indent=2))

def cmd_fingerprint(args):
    cfg=load_cfg(args.config); out={}
    for ori,key in [('vertical','vertical_master'),('horizontal','horizontal_master')]:
        print('FINGERPRINT',ori,'...'); out[ori]=source_fingerprint(cfg['inputs'][key],probe=True,ffprobe_bin=cfg['render']['ffprobe'])
    write_json_atomic(fingerprints_path(cfg),out); print('SAVED:',fingerprints_path(cfg))

def cmd_assets(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); report=build_asset_tree(b,Path(cfg['_paths']['root'])); queue=build_visual_queue(b,Path(cfg['_paths']['root']))
    write_json_atomic(Path(cfg['_paths']['manifest'])/'ASSET_TREE_REPORT.json',report); print(json.dumps(report,indent=2)); print('VISUAL QUEUE:',queue)

def cmd_microtrim_list(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); res=load_resolutions(cfg); jobs=collect_microtrims(b,res)
    jobs=filter_microtrim_jobs(jobs,args.scope)
    print('UNRESOLVED:',len(jobs))
    for x in jobs[:args.limit]: print(x['beat_id'],'·',x['content_id'],'·',x.get('parent_start'),'→',x.get('parent_end'),'·',x.get('text','')[:100])

def cmd_microtrim_next(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); res=load_resolutions(cfg); jobs=collect_microtrims(b,res)
    jobs=filter_microtrim_jobs(jobs,args.scope)
    if not jobs: print('NO UNRESOLVED MICROTRIMS'); return
    job=jobs[0]; src_key=cfg['source_policy'].get('microtrim_source','vertical'); source=cfg['inputs'][src_key+'_master']
    if not cfg['mlx'].get('enabled'): raise SystemExit('MLX disabled')
    if not cfg['mlx'].get('turbo_model') or not cfg['mlx'].get('large_model'): raise SystemExit('MLX model paths/repositories not configured')
    print('RESOLVING',job['beat_id'],job['content_id'])
    result=resolve_microtrim_job(cfg,job,source,Path(cfg['_paths']['microtrim'])/job['content_id'])
    res[job['beat_id']]=result; save_resolutions(cfg,res)
    print(json.dumps(result,ensure_ascii=False,indent=2))
    if not result.get('valid'): raise SystemExit(3)

def cmd_set_microtrim(args):
    cfg=load_cfg(args.config); res=load_resolutions(cfg); s=parse_timecode(args.start); e=parse_timecode(args.end)
    if e<=s or e-s>9.0: raise SystemExit('Manual microtrim must be >0 and <=9s')
    res[args.beat_id]={'beat_id':args.beat_id,'valid':True,'start':s,'end':e,'start_tc':format_timecode(s),'end_tc':format_timecode(e),'method':'HUMAN_MANUAL_APPROVAL'}; save_resolutions(cfg,res); print('SAVED',args.beat_id)

def cmd_set_override(args):
    cfg_raw=load_project(args.config); over=cfg_raw.setdefault('overrides',{}).setdefault('content_overrides',{}); obj=over.setdefault(args.content_id,{})
    if args.start: obj['start']=args.start
    if args.end: obj['end']=args.end
    if args.duration is not None: obj['duration_seconds']=args.duration
    # If start/end changed and duration was omitted, compute duration from the current editorial segments.
    if args.duration is None and (args.start or args.end):
        try:
            b=compile_html_pair(cfg_raw['inputs']['content_html'],cfg_raw['inputs']['intro_html'])
            item=next(x for x in b['content']['horizontals'] if x['id']==args.content_id)
            segs=item.get('segments',[])
            total=0.0
            for idx,seg in enumerate(segs):
                start=obj.get('start',seg['start']) if idx==0 else seg['start']
                end=obj.get('end',seg['end']) if idx==len(segs)-1 else seg['end']
                total += parse_timecode(end)-parse_timecode(start)
            obj['duration_seconds']=round(total,3)
        except Exception as e:
            print('WARNING · duration could not be auto-computed:',e)
    write_json_atomic(args.config,cfg_raw); print('OVERRIDE SAVED',args.content_id,obj)

def cmd_plan(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); res=load_resolutions(cfg); fps=read_json(fingerprints_path(cfg),{}) or {}
    if not fps: print('WARNING: source fingerprints missing; run fingerprint stage before rendering')
    sources={'vertical':cfg['inputs']['vertical_master'],'horizontal':cfg['inputs']['horizontal_master']}; plan=build_part_plan(b,sources,res,cfg.get('overrides',{}).get('content_overrides',{})); write_json_atomic(part_plan_path(cfg),plan)
    placements=build_visual_placements(b,res); write_json_atomic(Path(cfg['_paths']['manifest'])/'VISUAL_PLACEMENTS.json',placements)
    summary={k:{'READY_OR_PASS':sum(1 for x in v if x['status'] in ('READY','PASS')),'BLOCKED':sum(1 for x in v if x['status']=='BLOCKED')} for k,v in plan.items() if isinstance(v,list)}
    summary['visual_placements']={'TOTAL':len(placements['items']),'UNRESOLVED_MICROTRIM':sum(1 for x in placements['items'] if x['timing_status']=='UNRESOLVED_MICROTRIM')}
    print(json.dumps(summary,indent=2));
    for fam in ('intros','horizontals','verticals'):
        for x in plan.get(fam,[]):
            if x.get('status')=='BLOCKED': print('BLOCKED',x['content_id'],x.get('reason') or ','.join(x.get('unresolved_microtrims',[])))

def _cache_target(cfg,ori,key): return Path(cfg['_paths']['cache'])/'PARTS'/ori.upper()/f'{key}.mp4'

def _render_intro(cfg,item,sourcefps,dry_run=False):
    if item['status']!='READY': return {'content_id':item['content_id'],'status':'BLOCKED'}
    out=[]
    for ori in ('vertical','horizontal'):
        source=item['source_by_orientation'][ori]; sf=(sourcefps.get(ori) or {}).get('fingerprint','NO_FINGERPRINT')
        pmap={}
        for beat_id,p in item['parts'].items():
            key=part_cache_key(sf,p['start'],p['end'],ori,cfg,beat_id); target=_cache_target(cfg,ori,key); meta={'cache_key':key,'source_fingerprint':sf,'beat_id':beat_id,'content_id':item['content_id'],'orientation':ori,'start':p['start'],'end':p['end']}
            r=encode_part(cfg,source,p['start'],p['end'],target,meta,dry_run=dry_run); pmap[beat_id]=str(target); out.append(r)
        # assemble source-only previews and expose human-readable named PARTS for DaVinci
        media=Path(cfg['_paths']['intro'])/item['content_id']/'MEDIA'/ori.upper(); ensure_dir(media)
        if not dry_run:
            named=ensure_dir(media/'PARTS')
            for beat_id, cache_path in list(pmap.items()):
                dst=materialize_named_part(cache_path,named/f'{beat_id}.mp4'); pmap[beat_id]=str(dst)
        for variant,ids in item['assemblies'].items():
            files=[pmap[x] for x in ids if x in pmap]
            target=media/f"{item['content_id']}_{ori.upper()}_{variant}.mp4"
            if files: out.append(assemble(cfg,files,target,{'content_id':item['content_id'],'orientation':ori,'variant':variant},dry_run=dry_run))
        write_json_atomic(media/'part_map.json',pmap)
    return {'content_id':item['content_id'],'status':'DRY_RUN' if dry_run else 'PASS','results':out}

def _render_content(cfg,item,sourcefps,kind,dry_run=False):
    if item['status']!='PASS': return {'content_id':item['content_id'],'status':'BLOCKED','reason':item.get('reason','')}
    ori=item['orientation']; source=item['source']; sf=(sourcefps.get(ori) or {}).get('fingerprint','NO_FINGERPRINT'); files=[]; results=[]
    for seg in item['segments']:
        key=part_cache_key(sf,seg['start'],seg['end'],ori,cfg,seg['part_id']); target=_cache_target(cfg,ori,key); meta={'cache_key':key,'source_fingerprint':sf,'part_id':seg['part_id'],'content_id':item['content_id'],'orientation':ori,'start':seg['start'],'end':seg['end']}
        results.append(encode_part(cfg,source,seg['start'],seg['end'],target,meta,dry_run=dry_run)); files.append(str(target))
    folder=Path(cfg['_paths']['vertical'] if ori=='vertical' else cfg['_paths']['horizontal'])/item['content_id']/'MEDIA'; ensure_dir(folder)
    if not dry_run:
        named_dir=ensure_dir(folder/'PARTS'); named_files=[]
        for seg, cache_path in zip(item['segments'],files): named_files.append(str(materialize_named_part(cache_path,named_dir/f"{seg['part_id']}.mp4")))
        files=named_files
    target=folder/f"{item['content_id']}_{ori.upper()}_SOURCE.mp4"
    results.append(assemble(cfg,files,target,{'content_id':item['content_id'],'orientation':ori,'kind':kind},dry_run=dry_run))
    return {'content_id':item['content_id'],'status':'DRY_RUN' if dry_run else 'PASS','results':results}

def cmd_render_worker(args):
    cfg=load_cfg(args.config); plan=read_json(part_plan_path(cfg)); sourcefps=read_json(fingerprints_path(cfg),{}) or {}; b=load_bundle(cfg); state=StateStore(cfg['_paths']['state']); a,bw=worker_assignments(b); assignment=a if args.worker=='A' else bw
    if not plan: raise SystemExit('PART_PLAN missing')
    log=[]
    for item in plan['intros']:
        if item['content_id'] not in assignment['intros']: continue
        print('INTRO',item['content_id']);
        try: r=_render_intro(cfg,item,sourcefps,args.dry_run); log.append(r); state.set(item['content_id'],'RENDER',r['status'])
        except Exception as e: state.fail(item['content_id'],'RENDER',str(e)); raise
    if 'verticals' in assignment['content_engine']:
        for item in plan['verticals']:
            print('VERTICAL',item['content_id']);
            try: r=_render_content(cfg,item,sourcefps,'vertical',args.dry_run); log.append(r); state.set(item['content_id'],'RENDER',r['status'])
            except Exception as e: state.fail(item['content_id'],'RENDER',str(e)); raise
    if 'horizontals' in assignment['content_engine']:
        for item in plan['horizontals']:
            print('HORIZONTAL',item['content_id']);
            try: r=_render_content(cfg,item,sourcefps,'horizontal',args.dry_run); log.append(r); state.set(item['content_id'],'RENDER',r['status'])
            except Exception as e: state.fail(item['content_id'],'RENDER',str(e)); raise
    write_json_atomic(Path(cfg['_paths']['logs'])/f'WORKER_{args.worker}_LAST.json',{'worker':args.worker,'dry_run':args.dry_run,'results':log}); print('WORKER',args.worker,'DONE')

def cmd_davinci(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); plan=read_json(part_plan_path(cfg));
    if not plan: raise SystemExit('PART_PLAN missing')
    m=build_handoff_manifest(b,plan,cfg['_paths']['root'])
    m['visual_placements']=read_json(Path(cfg['_paths']['manifest'])/'VISUAL_PLACEMENTS.json',{}) or build_visual_placements(b,load_resolutions(cfg))
    resolved=[]
    # Intro timelines use named PARTS so VO/SOURCE REPLACEMENT can be edited beat-by-beat.
    for item in plan.get('intros',[]):
        if item.get('status')!='READY': continue
        for ori in ('VERTICAL','HORIZONTAL'):
            media=Path(cfg['_paths']['intro'])/item['content_id']/'MEDIA'/ori
            pmap=read_json(media/'part_map.json',{}) or {}
            for variant,ids in item.get('assemblies',{}).items():
                paths=[pmap[x] for x in ids if x in pmap and Path(pmap[x]).is_file()]
                if paths:
                    resolved.append({'timeline_name':f"{item['content_id']}_{ori}_{variant}",'content_id':item['content_id'],'type':'INTRO_PARTS','orientation':ori,'variant':variant,'media_paths':paths,'vo_note':'SOURCE_REPLACEMENT is an alternative to VO; replace the SR slot with chosen VO later when required.'})
    for item in plan.get('verticals',[]):
        path=Path(cfg['_paths']['vertical'])/item['content_id']/'MEDIA'/f"{item['content_id']}_VERTICAL_SOURCE.mp4"
        if item.get('status')=='PASS' and path.is_file(): resolved.append({'timeline_name':f"{item['content_id']}_VERTICAL",'content_id':item['content_id'],'type':'CONTENT','orientation':'VERTICAL','media_paths':[str(path)]})
    for item in plan.get('horizontals',[]):
        path=Path(cfg['_paths']['horizontal'])/item['content_id']/'MEDIA'/f"{item['content_id']}_HORIZONTAL_SOURCE.mp4"
        if item.get('status')=='PASS' and path.is_file(): resolved.append({'timeline_name':f"{item['content_id']}_HORIZONTAL",'content_id':item['content_id'],'type':'CONTENT','orientation':'HORIZONTAL','media_paths':[str(path)]})
    m['resolved_timelines']=resolved
    target=Path(cfg['_paths']['davinci'])/'DAVINCI_HANDOFF.json'; write_json_atomic(target,m)
    # Copy a context-zero Workspace Console script that imports already rendered media safely.
    template=Path(cfg['_package_root'])/'TOOLS'/'davinci_workspace_import.py'; shutil.copy2(template,Path(cfg['_paths']['davinci'])/'DAVINCI_WORKSPACE_IMPORT.py')
    launcher=f"import os; p=os.path.expanduser(r'{str(Path(cfg['_paths']['davinci'])/'DAVINCI_WORKSPACE_IMPORT.py')}'); exec(compile(open(p,'r',encoding='utf-8').read(),p,'exec'),globals(),globals())"
    (Path(cfg['_paths']['davinci'])/'WORKSPACE_CONSOLE_COMMAND.txt').write_text(launcher+'\n',encoding='utf-8')
    print('DAVINCI HANDOFF:',target)

def cmd_verify(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); plan=read_json(part_plan_path(cfg)) or {}; report={'blockers':[],'passes':[],'warnings':[]}
    # manifest hard gates
    for x in b['content'].get('verticals',[]):
        r=verify_content_contract(x,'vertical'); (report['passes'] if r['status']=='PASS' else report['blockers']).append({'id':x['id'],'check':'vertical_contract','detail':r['reason']})
    for x in b['content'].get('horizontals',[]):
        over=cfg.get('overrides',{}).get('content_overrides',{}).get(x['id'],{}); xx=dict(x); xx['duration_seconds']=over.get('duration_seconds',xx.get('duration_seconds')); r=verify_content_contract(xx,'horizontal'); (report['passes'] if r['status']=='PASS' else report['blockers']).append({'id':x['id'],'check':'horizontal_contract','detail':r['reason']})
    for x in b['intro'].get('intros',[]):
        r=verify_content_contract({'duration_seconds':x.get('runtime_recommended_seconds',0)},'intro'); (report['passes'] if r['status']=='PASS' else report['blockers']).append({'id':x['id'],'check':'intro_contract','detail':r['reason']})
    # rendered media completeness: final verification does not treat DRY_RUN or missing outputs as PASS.
    state=StateStore(cfg['_paths']['state'])
    for item in plan.get('intros',[]):
        render_status=(state.get(item['content_id'],'RENDER') or {}).get('status')
        if item.get('status')!='READY':
            report['blockers'].append({'id':item['content_id'],'check':'intro_render','detail':'part plan not READY'})
            continue
        for ori in ('VERTICAL','HORIZONTAL'):
            media=Path(cfg['_paths']['intro'])/item['content_id']/'MEDIA'/ori
            for variant, ids in item.get('assemblies',{}).items():
                if not ids: continue
                path=media/f"{item['content_id']}_{ori}_{variant}.mp4"
                rr=verify_render_artifact(render_status,path)
                (report['passes'] if rr['status']=='PASS' else report['blockers']).append({'id':item['content_id'],'check':f'intro_render_{ori}_{variant}','detail':rr['reason']})
    for item in plan.get('verticals',[]):
        render_status=(state.get(item['content_id'],'RENDER') or {}).get('status')
        path=Path(cfg['_paths']['vertical'])/item['content_id']/'MEDIA'/f"{item['content_id']}_VERTICAL_SOURCE.mp4"
        rr=verify_render_artifact(render_status,path)
        (report['passes'] if rr['status']=='PASS' else report['blockers']).append({'id':item['content_id'],'check':'vertical_render','detail':rr['reason']})
    for item in plan.get('horizontals',[]):
        render_status=(state.get(item['content_id'],'RENDER') or {}).get('status')
        path=Path(cfg['_paths']['horizontal'])/item['content_id']/'MEDIA'/f"{item['content_id']}_HORIZONTAL_SOURCE.mp4"
        rr=verify_render_artifact(render_status,path)
        (report['passes'] if rr['status']=='PASS' else report['blockers']).append({'id':item['content_id'],'check':'horizontal_render','detail':rr['reason']})
    # unresolved intro microtrims
    unresolved=[j for j in collect_microtrims(b,load_resolutions(cfg)) if j['content_id'].startswith('INTRO_')]
    if unresolved: report['blockers'].append({'id':'INTRO_MICROTRIMS','check':'microtrim','detail':f'{len(unresolved)} unresolved intro microtrims'})
    # claims remain review, warning not global render blocker
    pending=sum(1 for x in b['content'].get('claims',[]) if x.get('status')!='VERIFIED');
    if pending: report['warnings'].append({'id':'CLAIMS','detail':f'{pending} claims not VERIFIED; do not publish as verified facts'})
    partials=list(Path(cfg['_paths']['root']).rglob('*.partial.mp4'))+list(Path(cfg['_paths']['root']).rglob('*.partial.wav'))
    if partials: report['blockers'].append({'id':'PARTIALS','detail':f'{len(partials)} partial files remain'})
    write_json_atomic(Path(cfg['_paths']['manifest'])/'VERIFY_REPORT.json',report)
    print('PASS CHECKS:',len(report['passes']),'BLOCKERS:',len(report['blockers']),'WARNINGS:',len(report['warnings']))
    for x in report['blockers']: print('BLOCKED',x)
    for x in report['warnings']: print('WARNING',x)
    if report['blockers']: raise SystemExit(2)

def cmd_status(args):
    cfg=load_cfg(args.config); b=load_bundle(cfg); res=load_resolutions(cfg); plan=read_json(part_plan_path(cfg),{}) or {}; print('PROJECT:',cfg['project_id']); print('OUTPUT:',cfg['_paths']['root']); print('MICROTRIMS RESOLVED:',sum(1 for x in res.values() if x.get('valid'))); print('MICROTRIMS UNRESOLVED:',len(collect_microtrims(b,res)))
    if plan:
        for fam in ('intros','verticals','horizontals'):
            d={};
            for x in plan.get(fam,[]): d[x['status']]=d.get(x['status'],0)+1
            print(fam.upper(),d)
    states=list(Path(cfg['_paths']['state']).glob('*.json')); print('CHECKPOINT FILES:',len(states))

def parser():
    ap=argparse.ArgumentParser(description='ABRAXAS V3.1 executable automation'); ap.add_argument('--config',default=str(package_root()/'PROJECT'/'project_config.json'))
    sub=ap.add_subparsers(dest='cmd',required=True)
    p=sub.add_parser('setup'); p.add_argument('--joc55',action='store_true'); p.add_argument('--non-interactive',action='store_true'); p.add_argument('--project-id'); p.add_argument('--content'); p.add_argument('--intro'); p.add_argument('--vertical'); p.add_argument('--horizontal'); p.add_argument('--output'); p.set_defaults(fn=cmd_setup)
    p=sub.add_parser('validate'); p.add_argument('--allow-non-apple',action='store_true'); p.set_defaults(fn=cmd_validate)
    sub.add_parser('compile').set_defaults(fn=cmd_compile); sub.add_parser('fingerprint').set_defaults(fn=cmd_fingerprint); sub.add_parser('assets').set_defaults(fn=cmd_assets)
    p=sub.add_parser('microtrim-list'); p.add_argument('--scope',choices=['intros','content','all'],default='intros'); p.add_argument('--limit',type=int,default=200); p.set_defaults(fn=cmd_microtrim_list)
    p=sub.add_parser('microtrim-next'); p.add_argument('--scope',choices=['intros','content','all'],default='intros'); p.set_defaults(fn=cmd_microtrim_next)
    p=sub.add_parser('set-microtrim'); p.add_argument('beat_id'); p.add_argument('start'); p.add_argument('end'); p.set_defaults(fn=cmd_set_microtrim)
    p=sub.add_parser('set-override'); p.add_argument('content_id'); p.add_argument('--start'); p.add_argument('--end'); p.add_argument('--duration',type=float); p.set_defaults(fn=cmd_set_override)
    sub.add_parser('plan').set_defaults(fn=cmd_plan)
    p=sub.add_parser('render-worker'); p.add_argument('--worker',choices=['A','B'],required=True); p.add_argument('--dry-run',action='store_true'); p.set_defaults(fn=cmd_render_worker)
    sub.add_parser('davinci').set_defaults(fn=cmd_davinci); sub.add_parser('verify').set_defaults(fn=cmd_verify); sub.add_parser('status').set_defaults(fn=cmd_status)
    return ap

def main(argv=None):
    ap=parser(); args=ap.parse_args(argv); return args.fn(args)
