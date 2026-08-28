#!/usr/bin/env python3
import argparse,json
from pathlib import Path
import mlx_whisper
ap=argparse.ArgumentParser(); ap.add_argument('--audio',required=True); ap.add_argument('--model',required=True); ap.add_argument('--language',default='es'); ap.add_argument('--initial-prompt',default=''); ap.add_argument('--out',required=True); a=ap.parse_args()
res=mlx_whisper.transcribe(a.audio,path_or_hf_repo=a.model,word_timestamps=True,verbose=None,language=a.language,condition_on_previous_text=False,initial_prompt=a.initial_prompt or None)
words=[]
for seg in res.get('segments',[]):
    words.extend(seg.get('words') or [])
Path(a.out).write_text(json.dumps({'text':res.get('text',''),'language':res.get('language'),'words':words,'segments':res.get('segments',[])},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
