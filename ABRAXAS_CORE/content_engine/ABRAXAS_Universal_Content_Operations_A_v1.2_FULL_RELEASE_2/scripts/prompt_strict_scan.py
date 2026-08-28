#!/usr/bin/env python3
import json,re,pathlib,sys,collections
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'reports/runtime_prompts.json').read_text())
patterns=[(r'\bTODO\b',0),(r'\bTBD\b',0),(r'lorem ipsum',re.I),(r'placeholder prompt',re.I),(r'\[INSERT',re.I),(r'\[FILL',re.I),(r'completa aquí',re.I)]
short=[]; placeholders=[]; kinds=collections.Counter()
for r in data['prompts']:
    kinds[r['kind']]+=1;p=r['prompt'];w=len(p.split())
    if w<180: short.append({'id':r['id'],'kind':r['kind'],'words':w})
    for pattern,flags in patterns:
        if re.search(pattern,p,flags): placeholders.append({'id':r['id'],'kind':r['kind'],'pattern':pattern})
report={'version':data['version'],'total':len(data['prompts']),'byKind':dict(kinds),'shortPrompts':len(short),'placeholderHits':len(placeholders),'status':'PASS' if not short and not placeholders else 'FAIL','short':short[:50],'placeholders':placeholders[:50]}
(ROOT/'reports/PROMPT_STRICT_SCAN.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ('short','placeholders')},ensure_ascii=False,indent=2))
sys.exit(0 if report['status']=='PASS' else 1)
