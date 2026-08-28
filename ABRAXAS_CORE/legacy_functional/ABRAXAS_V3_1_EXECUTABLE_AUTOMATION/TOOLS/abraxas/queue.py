from __future__ import annotations
from pathlib import Path
from .core import write_json_atomic

def build_visual_queue(bundle,output_root):
    motion=[]; principal=[]; highlights=[]; phrases=[]
    for intro in bundle['intro'].get('intros',[]):
        beats=list(intro.get('source_beats',[]))+list(intro.get('source_replacement',[]))
        for vo in intro.get('voiceover_options',[]): beats+=vo.get('beats',[])
        for b in beats:
            for ori,t in (b.get('visual_treatment') or {}).items():
                if t.get('treatment_family')=='PRESENTER_ONLY': continue
                motion.append({'type':'MOTION','content_id':intro['id'],'beat_id':b['beat_id'],'orientation':ori,'family':t.get('treatment_family'),'spoken_context':t.get('spoken_context'),'asset_folder':str(Path(output_root)/'02_INTRO_LAB'/intro['id']/'VISUAL_MOTION'/b['beat_id']/ori.upper()),'status':'READY_FOR_REFERENCE_GENERATION'})
    c=bundle['content']
    for fam,folder in [('verticals','03_VERTICALS'),('horizontals','04_HORIZONTALS')]:
        for item in c.get(fam,[]):
            for op in item.get('visual_opportunities',[]):
                t=op.get('treatment',{})
                if t.get('treatment_family')=='PRESENTER_ONLY': continue
                motion.append({'type':'MOTION','content_id':item['id'],'beat_id':op['beat_id'],'orientation':'vertical' if fam=='verticals' else 'horizontal','family':t.get('treatment_family'),'spoken_context':op.get('spoken_text'),'asset_folder':str(Path(output_root)/folder/item['id']/'VISUAL_MOTION'/op['beat_id']),'status':'READY_FOR_REFERENCE_GENERATION'})
    for car in c.get('principal_carousels',[]):
        for slide in car.get('slides',[]):
            principal.append({'type':'CAROUSEL_IMAGE','carousel_id':car['id'],'slide':slide.get('slide'),'prompt_no_text':slide.get('prompt_no_text',''),'prompt_with_text':slide.get('prompt_with_text',''),'status':'READY_FOR_IMAGE_GENERATION'})
    for car in c.get('highlight_carousels',[]):
        for slide in car.get('slides',[]):
            highlights.append({'type':'HIGHLIGHT_CAROUSEL_IMAGE','carousel_id':car['id'],'slide':slide.get('slide'),'prompt_no_text':slide.get('prompt_no_text',''),'prompt_with_text':slide.get('prompt_with_text',''),'status':'READY_FOR_IMAGE_GENERATION'})
    for p in c.get('phrases',[]):
        phrases.append({'type':'PHRASE_IMAGE','id':f"FR_{int(p.get('idx',0)):03d}",'quote':p.get('quote',''),'speaker':p.get('speaker',''),'source_range':p.get('range',''),'status':'NEEDS_CREATIVE_DIRECTION','reason':'The V3.1 HTML contains the source quote but no approved scene/prompt. Rendering must not invent the visual silently.'})
    obj={'schema_version':'abraxas.visual-queue.v3.1','counts':{'motion':len(motion),'principal_carousel_slides':len(principal),'highlight_carousel_slides':len(highlights),'phrases':len(phrases)},'motion_items':motion,'principal_carousel_items':principal,'highlight_carousel_items':highlights,'phrase_items':phrases}
    target=Path(output_root)/'09_VISUAL_QUEUE'/'VISUAL_GENERATION_QUEUE.json'; write_json_atomic(target,obj); return target
