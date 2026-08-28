from __future__ import annotations
from pathlib import Path

def build_handoff_manifest(bundle,part_plan,output_root):
    out=Path(output_root); timelines=[]
    for p in part_plan.get('intros',[]):
        if p.get('status')!='READY': continue
        for variant in ('NO_VO','SOURCE_REPLACEMENT'):
            timelines.append({'timeline_name':f"{p['content_id']}_{variant}",'type':'INTRO','content_id':p['content_id'],'variant':variant,'orientation_variants':['VERTICAL','HORIZONTAL'],'part_ids':p.get('assemblies',{}).get(variant,[]),'markers_from_beats':True})
    for p in part_plan.get('verticals',[]):
        if p.get('status')=='PASS': timelines.append({'timeline_name':f"{p['content_id']}_VERTICAL",'type':'CONTENT','content_id':p['content_id'],'orientation':'VERTICAL','assembled_path':str(out/'03_VERTICALS'/p['content_id']/f"{p['content_id']}_VERTICAL.mp4")})
    for p in part_plan.get('horizontals',[]):
        if p.get('status')=='PASS': timelines.append({'timeline_name':f"{p['content_id']}_HORIZONTAL",'type':'CONTENT','content_id':p['content_id'],'orientation':'HORIZONTAL','assembled_path':str(out/'04_HORIZONTALS'/p['content_id']/f"{p['content_id']}_HORIZONTAL.mp4")})
    return {'schema_version':'abraxas.davinci-handoff.v3.1','timelines':timelines,'subtitle_policy':'PRESERVE_ORIGINAL','track_policy':{'V5':'subtitles','V4':'word_emphasis','V3':'vfx','V2':'broll','V1':'source','A1':'dialogue','A2':'music','A3':'sfx'}}
