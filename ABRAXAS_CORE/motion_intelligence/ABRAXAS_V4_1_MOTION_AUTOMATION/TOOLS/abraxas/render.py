from __future__ import annotations
from pathlib import Path
from .core import output_partial_path

DEFAULT_FFMPEG='/opt/homebrew/bin/ffmpeg'

def video_toolbox_command(source,start,end,out,ffmpeg=DEFAULT_FFMPEG,hwdecode=True):
    partial=output_partial_path(out); cmd=[ffmpeg,'-hide_banner','-y']
    if hwdecode: cmd += ['-hwaccel','videotoolbox']
    from .core import parse_timecode
    duration=max(0.001,parse_timecode(end)-parse_timecode(start))
    cmd += ['-ss',str(start),'-t',f'{duration:.3f}','-i',str(source),'-map','0:v:0','-map','0:a:0?','-c:v','h264_videotoolbox','-profile:v','high','-b:v','40M','-maxrate','48M','-bufsize','80M','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart',str(partial)]
    return cmd

def concat_command(list_file,out,ffmpeg=DEFAULT_FFMPEG):
    partial=output_partial_path(out)
    return [ffmpeg,'-hide_banner','-y','-f','concat','-safe','0','-i',str(list_file),'-c','copy','-movflags','+faststart',str(partial)]
