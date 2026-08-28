from __future__ import annotations
import json, os, shutil, subprocess, time
from pathlib import Path
from .core import parse_timecode, format_timecode, output_partial_path, file_lock, ffprobe, stable_hash, write_json_atomic, ensure_dir
from .render import video_toolbox_command, concat_command


def _profile_from_cfg(cfg):
    r=cfg['render']
    return {'encoder':r.get('encoder'),'bitrate':r.get('bitrate'),'maxrate':r.get('maxrate'),'bufsize':r.get('bufsize'),'audio_bitrate':r.get('audio_bitrate'),'hardware_decode':r.get('hardware_decode',True),'output_version':cfg.get('output_version','V3_1')}


def part_cache_key(source_fingerprint,start,end,orientation,cfg,tag=''):
    return stable_hash({'source':source_fingerprint,'start':format_timecode(parse_timecode(start)),'end':format_timecode(parse_timecode(end)),'orientation':orientation,'profile':_profile_from_cfg(cfg),'tag':tag})


def validate_media(path, ffprobe_bin='/opt/homebrew/bin/ffprobe'):
    p=Path(path)
    if not p.is_file() or p.stat().st_size<1024: return False, {'reason':'missing_or_too_small'}
    try: info=ffprobe(p,ffprobe_bin)
    except Exception as e: return False, {'reason':str(e)}
    streams=info.get('streams',[])
    if not any(s.get('codec_type')=='video' for s in streams): return False, {'reason':'no_video_stream'}
    dur=float(info.get('format',{}).get('duration') or 0)
    if dur<=0: return False, {'reason':'invalid_duration'}
    return True, {'duration':dur,'streams':streams}


def encode_part(cfg, source, start, end, target, metadata, dry_run=False):
    target=Path(target); target.parent.mkdir(parents=True,exist_ok=True)
    sidecar=target.with_suffix(target.suffix+'.json')
    if target.exists() and sidecar.exists():
        old=json.loads(sidecar.read_text(encoding='utf-8'))
        if old.get('cache_key')==metadata.get('cache_key'):
            ok,_=validate_media(target,cfg['render']['ffprobe'])
            if ok: return {'status':'CACHED','path':str(target)}
    cmd=video_toolbox_command(source,start,end,target,ffmpeg=cfg['render']['ffmpeg'],hwdecode=cfg['render'].get('hardware_decode',True))
    if dry_run: return {'status':'DRY_RUN','path':str(target),'command':cmd}
    partial=output_partial_path(target); partial.unlink(missing_ok=True)
    lock=Path(cfg['_paths']['locks'])/'hardware_encode.lock'
    with file_lock(lock, wait_seconds=cfg['render'].get('lock_wait_seconds',7200)):
        proc=subprocess.run(cmd,capture_output=True,text=True)
        if proc.returncode!=0 and cfg['render'].get('hardware_decode',True):
            # decode fallback, keep hardware encode
            cmd=video_toolbox_command(source,start,end,target,ffmpeg=cfg['render']['ffmpeg'],hwdecode=False)
            proc=subprocess.run(cmd,capture_output=True,text=True)
        if proc.returncode!=0:
            partial.unlink(missing_ok=True)
            raise RuntimeError((proc.stderr or proc.stdout)[-6000:])
    ok,probe=validate_media(partial,cfg['render']['ffprobe'])
    if not ok:
        partial.unlink(missing_ok=True); raise RuntimeError(f'Invalid encoded part: {probe}')
    os.replace(partial,target)
    write_json_atomic(sidecar,{**metadata,'probe':probe,'created_at':time.time()})
    return {'status':'ENCODED','path':str(target),'probe':probe}


def assemble(cfg, parts, target, metadata, dry_run=False):
    target=Path(target); target.parent.mkdir(parents=True,exist_ok=True)
    sidecar=target.with_suffix(target.suffix+'.json')
    assembly_key=stable_hash({'parts':[str(Path(x)) for x in parts],'metadata':metadata})
    if target.exists() and sidecar.exists():
        old=json.loads(sidecar.read_text(encoding='utf-8'))
        if old.get('assembly_key')==assembly_key:
            ok,_=validate_media(target,cfg['render']['ffprobe'])
            if ok: return {'status':'CACHED','path':str(target)}
    if not parts: raise ValueError(f'No parts for {target}')
    list_file=target.with_suffix('.concat.txt')
    list_file.write_text('\n'.join("file '"+str(Path(p).resolve()).replace("'","'\\''")+"'" for p in parts)+'\n',encoding='utf-8')
    cmd=concat_command(list_file,target,ffmpeg=cfg['render']['ffmpeg'])
    if dry_run: return {'status':'DRY_RUN','path':str(target),'command':cmd,'list_file':str(list_file)}
    for p in parts:
        if not Path(p).is_file(): raise FileNotFoundError(p)
    partial=output_partial_path(target); partial.unlink(missing_ok=True)
    proc=subprocess.run(cmd,capture_output=True,text=True)
    if proc.returncode!=0:
        partial.unlink(missing_ok=True); raise RuntimeError((proc.stderr or proc.stdout)[-6000:])
    ok,probe=validate_media(partial,cfg['render']['ffprobe'])
    if not ok:
        partial.unlink(missing_ok=True); raise RuntimeError(f'Invalid assembly: {probe}')
    os.replace(partial,target)
    write_json_atomic(sidecar,{**metadata,'assembly_key':assembly_key,'probe':probe,'created_at':time.time()})
    return {'status':'ASSEMBLED','path':str(target),'probe':probe}

def materialize_named_part(source,target):
    source=Path(source); target=Path(target); target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists() or target.is_symlink(): target.unlink()
    try:
        os.link(source,target)
    except Exception:
        try: target.symlink_to(source.resolve())
        except Exception: shutil.copy2(source,target)
    return target
