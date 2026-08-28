from __future__ import annotations
import hashlib, json, os, subprocess, time
from contextlib import contextmanager
from pathlib import Path


def parse_timecode(value):
    if value is None: return None
    if isinstance(value,(int,float)): return float(value)
    s=str(value).strip().replace(',', '.')
    parts=s.split(':')
    if len(parts)==1: return float(parts[0])
    if len(parts)==2: return int(parts[0])*60+float(parts[1])
    if len(parts)==3: return int(parts[0])*3600+int(parts[1])*60+float(parts[2])
    raise ValueError(f'Invalid timecode: {value}')


def format_timecode(seconds):
    seconds=max(0.0,float(seconds)); h=int(seconds//3600); seconds-=h*3600; m=int(seconds//60); seconds-=m*60
    return f'{h:02d}:{m:02d}:{seconds:06.3f}'


def stable_hash(obj):
    raw=json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8')
    return hashlib.sha256(raw).hexdigest()


def read_json(path, default=None):
    p=Path(path)
    if not p.exists(): return default
    return json.loads(p.read_text(encoding='utf-8'))


def write_json_atomic(path,obj):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
    tmp=p.with_name(p.name+'.partial')
    tmp.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    os.replace(tmp,p)


def partial_content_hash(path, chunk_size=4*1024*1024):
    p=Path(path); size=p.stat().st_size; h=hashlib.sha256()
    with p.open('rb') as f:
        if size <= chunk_size*3:
            h.update(f.read())
        else:
            for offset in (0, max(0,size//2-chunk_size//2), max(0,size-chunk_size)):
                f.seek(offset); h.update(f.read(chunk_size))
    return h.hexdigest()


def ffprobe(path, ffprobe_bin='/opt/homebrew/bin/ffprobe'):
    cmd=[ffprobe_bin,'-v','error','-show_streams','-show_format','-of','json',str(path)]
    proc=subprocess.run(cmd,capture_output=True,text=True)
    if proc.returncode!=0:
        raise RuntimeError(proc.stderr.strip() or f'ffprobe failed: {path}')
    return json.loads(proc.stdout)


def source_fingerprint(path, probe=True, ffprobe_bin='/opt/homebrew/bin/ffprobe'):
    p=Path(path).expanduser().resolve()
    if not p.is_file(): raise FileNotFoundError(p)
    st=p.stat()
    base={'path':str(p),'size':st.st_size,'mtime_ns':st.st_mtime_ns,'content_sample_sha256':partial_content_hash(p)}
    if probe:
        base['ffprobe']=ffprobe(p,ffprobe_bin)
    base['fingerprint']=stable_hash(base)
    return base


def ensure_dir(path):
    p=Path(path); p.mkdir(parents=True,exist_ok=True); return p


def output_partial_path(path):
    p=Path(path)
    return p.with_name(p.stem+'.partial'+p.suffix)


def run_checked(cmd, log_path=None, env=None):
    if log_path:
        Path(log_path).parent.mkdir(parents=True,exist_ok=True)
        with Path(log_path).open('a',encoding='utf-8') as log:
            proc=subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT,text=True,env=env)
    else:
        proc=subprocess.run(cmd,env=env)
    if proc.returncode!=0: raise RuntimeError(f'Command failed ({proc.returncode}): {cmd}')
    return proc


@contextmanager
def file_lock(path, wait_seconds=600, stale_seconds=7200, poll=.5):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True); start=time.time()
    while True:
        try:
            fd=os.open(str(p),os.O_CREAT|os.O_EXCL|os.O_WRONLY)
            os.write(fd,f'{os.getpid()}\n{time.time()}\n'.encode()); os.close(fd); break
        except FileExistsError:
            try:
                if time.time()-p.stat().st_mtime > stale_seconds: p.unlink(); continue
            except FileNotFoundError: continue
            if time.time()-start > wait_seconds: raise TimeoutError(f'Lock timeout: {p}')
            time.sleep(poll)
    try: yield
    finally:
        try: p.unlink()
        except FileNotFoundError: pass
