from __future__ import annotations
import importlib.util, json, shutil, subprocess
from pathlib import Path
from .htmlio import compile_html_pair

def preflight(cfg,strict_hardware=True):
    checks=[]
    def add(name,ok,detail=''): checks.append({'name':name,'ok':bool(ok),'detail':str(detail)})
    for k in ('content_html','intro_html','vertical_master','horizontal_master'):
        p=Path(cfg['inputs'][k]).expanduser(); add(k,p.is_file(),p)
    try:
        b=compile_html_pair(cfg['inputs']['content_html'],cfg['inputs']['intro_html']); add('html_pair',True,f"{len(b['content']['verticals'])}V/{len(b['content']['horizontals'])}H/{len(b['intro']['intros'])}I")
    except Exception as e: add('html_pair',False,e)
    ff=cfg['render']['ffmpeg']; fp=cfg['render']['ffprobe']; add('ffmpeg',Path(ff).is_file() or shutil.which(ff),ff); add('ffprobe',Path(fp).is_file() or shutil.which(fp),fp)
    if checks[-2]['ok']:
        proc=subprocess.run([ff,'-hide_banner','-encoders'],capture_output=True,text=True); has='h264_videotoolbox' in (proc.stdout+proc.stderr); add('h264_videotoolbox',has,'required on Apple target')
    if cfg['mlx'].get('enabled'):
        py=cfg['mlx'].get('python','python3'); proc=subprocess.run([py,'-c','import mlx_whisper; print(mlx_whisper.__version__ if hasattr(mlx_whisper,"__version__") else "OK")'],capture_output=True,text=True); add('mlx_whisper',proc.returncode==0,(proc.stdout or proc.stderr).strip())
        for k in ('turbo_model','large_model'):
            val=cfg['mlx'].get(k,''); add('mlx_'+k,bool(val) and (Path(val).expanduser().exists() or '/' in val),val or 'not configured')
    ok=all(x['ok'] for x in checks if strict_hardware or x['name']!='h264_videotoolbox')
    return {'ok':ok,'checks':checks}
