from __future__ import annotations
import json, os, subprocess, sys
from pathlib import Path
from .core import parse_timecode, format_timecode, output_partial_path, write_json_atomic, ensure_dir
from .microtrim import best_text_span, consensus_resolution


def extract_parent_audio(cfg,source,start,end,target):
    target=Path(target); target.parent.mkdir(parents=True,exist_ok=True)
    partial=target.with_name(target.stem+'.partial'+target.suffix)
    duration=parse_timecode(end)-parse_timecode(start)
    cmd=[cfg['render']['ffmpeg'],'-hide_banner','-y','-ss',str(start),'-t',f'{duration:.3f}','-i',str(source),'-vn','-ac','1','-ar','16000','-c:a','pcm_s16le',str(partial)]
    proc=subprocess.run(cmd,capture_output=True,text=True)
    if proc.returncode!=0: raise RuntimeError(proc.stderr[-4000:])
    os.replace(partial,target); return target


def _helper_path(cfg): return str(Path(cfg['_package_root'])/'TOOLS'/'mlx_transcribe_helper.py')

def transcribe_words(cfg,audio,model,output_json):
    py=cfg['mlx'].get('python') or 'python3'
    cmd=[py,_helper_path(cfg),'--audio',str(audio),'--model',str(model),'--language',cfg['mlx'].get('language','es'),'--out',str(output_json)]
    if cfg['mlx'].get('initial_prompt'): cmd += ['--initial-prompt',cfg['mlx']['initial_prompt']]
    proc=subprocess.run(cmd,capture_output=True,text=True)
    if proc.returncode!=0: raise RuntimeError((proc.stderr or proc.stdout)[-6000:])
    obj=json.loads(Path(output_json).read_text(encoding='utf-8')); return obj.get('words',[]),obj


def _candidate(words,job):
    full=best_text_span(words,job.get('text',''))
    if full.get('score',0)>=.65: return full
    sa=job.get('anchor_start',''); ea=job.get('anchor_end','')
    if sa and ea:
        a=best_text_span(words,sa); b=best_text_span(words,ea)
        if a.get('start') is not None and b.get('end') is not None and b['end']>=a['start']:
            return {'start':a['start'],'end':b['end'],'score':(a['score']+b['score'])/2,'text':f"{a.get('text','')} … {b.get('text','')}"}
    return full


def resolve_microtrim_job(cfg,job,source,workdir):
    workdir=ensure_dir(workdir); beat=job['beat_id']; audio=workdir/f'{beat}.wav'
    extract_parent_audio(cfg,source,job['parent_start'],job['parent_end'],audio)
    wa,audit_a=transcribe_words(cfg,audio,cfg['mlx']['turbo_model'],workdir/f'{beat}.turbo.json')
    wb,audit_b=transcribe_words(cfg,audio,cfg['mlx']['large_model'],workdir/f'{beat}.large.json')
    ca=_candidate(wa,job); cb=_candidate(wb,job)
    c=consensus_resolution(ca,cb,min_score=float(cfg['mlx'].get('min_score',.72)),max_delta=float(cfg['mlx'].get('max_delta',.45)))
    base=parse_timecode(job['parent_start'])
    result={'beat_id':beat,'content_id':job['content_id'],'job':job,'model_a':ca,'model_b':cb,'valid':False}
    if c.get('valid'):
        result.update({'valid':True,'start':round(base+c['start'],3),'end':round(base+c['end'],3),'start_tc':format_timecode(base+c['start']),'end_tc':format_timecode(base+c['end']),'score':c['score'],'method':'MLX_DUAL_MODEL_CONSENSUS'})
    else:
        result['reason']='MODEL_DISAGREEMENT_OR_LOW_SCORE'; result['audio_preview']=str(audio)
    write_json_atomic(workdir/f'{beat}.resolution.json',result); return result
