#!/usr/bin/env python3
import json, statistics, pathlib, sys, re
ROOT=pathlib.Path(__file__).resolve().parents[1]
src=ROOT/'reports/runtime_prompts.json'
if not src.exists():
    raise SystemExit('Falta reports/runtime_prompts.json; ejecuta export_runtime_prompts.js')
data=json.loads(src.read_text())
rows=data['prompts']; required=['ROL','OBJETIVO','QUÉ ES','QUÉ NO ES','SALIDA','QA']
issues=[]; scores=[]; words=[]
for r in rows:
    p=r['prompt']; w=len(p.split()); score=100; row_issues=[]
    if w<180: score-=30; row_issues.append(f'corto:{w}')
    for token in required:
        if token not in p: score-=8; row_issues.append(f'falta:{token}')
    if re.search(r'\b(?:TODO|TBD)\b',p) or re.search(r'lorem ipsum|placeholder prompt',p,re.I): score-=20; row_issues.append('placeholder')
    score=max(0,score); scores.append(score); words.append(w)
    if score<85: issues.append({'kind':r['kind'],'id':r['id'],'score':score,'words':w,'issues':row_issues})
report={'version':data['version'],'total':len(rows),'minimum':min(scores),'average':round(sum(scores)/len(scores),2),'median':statistics.median(scores),'minWords':min(words),'failed':len(issues),'failures':issues,'status':'PASS' if not issues else 'FAIL','rubric':'context + role + objective + is/is-not + output + QA + >=180 words'}
(ROOT/'reports/PROMPT_QUALITY_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='failures'},ensure_ascii=False,indent=2))
sys.exit(1 if issues else 0)
