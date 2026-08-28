from __future__ import annotations
import re, unicodedata
from difflib import SequenceMatcher


def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+',' ',s).strip()


def best_text_span(words,target):
    tokens=[norm(w.get('word') or w.get('text') or '') for w in words]
    tokens=[t for t in tokens]
    target_tokens=norm(target).split()
    if not target_tokens or not words: return {'start':None,'end':None,'score':0.0,'text':''}
    n=len(target_tokens); best=None
    minlen=max(1,int(n*.65)); maxlen=min(len(words),max(minlen,int(n*1.45)+2))
    for length in range(minlen,maxlen+1):
        for i in range(0,len(words)-length+1):
            cand=' '.join(tokens[i:i+length])
            score=SequenceMatcher(None,' '.join(target_tokens),cand).ratio()
            probs=[float(words[j].get('probability',1.0) or 0) for j in range(i,i+length)]
            prob=sum(probs)/len(probs) if probs else 0
            combined=.9*score+.1*prob
            if best is None or combined>best['combined']:
                best={'start':float(words[i]['start']),'end':float(words[i+length-1]['end']),'score':score,'combined':combined,'text':cand}
    return best


def consensus_resolution(a,b,min_score=.72,max_delta=.45):
    valid=(a and b and a.get('score',0)>=min_score and b.get('score',0)>=min_score and abs(a['start']-b['start'])<=max_delta and abs(a['end']-b['end'])<=max_delta)
    if not valid: return {'valid':False,'model_a':a,'model_b':b}
    return {'valid':True,'start':round((a['start']+b['start'])/2,3),'end':round((a['end']+b['end'])/2,3),'score':round((a['score']+b['score'])/2,4),'model_a':a,'model_b':b}
from .core import parse_timecode

def resolve_job_with_transcribers(job, transcribe_a, transcribe_b, min_score=.72, max_delta=.45):
    wa=transcribe_a(job); wb=transcribe_b(job)
    a=best_text_span(wa,job.get('text') or job.get('anchor_start') or '')
    b=best_text_span(wb,job.get('text') or job.get('anchor_start') or '')
    c=consensus_resolution(a,b,min_score=min_score,max_delta=max_delta)
    if not c.get('valid'): return {**c,'beat_id':job.get('beat_id'),'content_id':job.get('content_id')}
    base=parse_timecode(job.get('parent_start') or 0)
    return {**c,'beat_id':job.get('beat_id'),'content_id':job.get('content_id'),'start':round(base+c['start'],3),'end':round(base+c['end'],3)}
