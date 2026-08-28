from __future__ import annotations
import json,re
from pathlib import Path
from .core import ensure_dir, write_json_atomic


def slug(s):
    s=re.sub(r'[^A-Za-z0-9_-]+','_',str(s)).strip('_'); return s[:100] or 'asset'

def _write(path,text):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text(str(text or '').strip()+'\n',encoding='utf-8')

def _intro_beat_map(intro):
    beats={}
    for b in intro.get('source_beats',[]): beats[b.get('beat_id')]=b
    for b in intro.get('source_replacement',[]): beats[b.get('beat_id')]=b
    for vo in intro.get('voiceover_options',[]):
        for b in vo.get('beats',[]): beats[b.get('beat_id')]=b
    return beats

def _readthrough_text(intro, order, heading=''):
    beats=_intro_beat_map(intro); lines=[]
    if heading: lines.extend([heading,''])
    for beat_id in order:
        b=beats.get(beat_id)
        if not b: continue
        source_type=b.get('source_type','SOURCE'); speaker=b.get('speaker','')
        lines.append(f"[{source_type}] {speaker} · {b.get('planned_seconds','')}s")
        lines.append(b.get('text',''))
        lines.append('')
    return '\n'.join(lines).strip()

def _visual_pack(base,treatment):
    base=ensure_dir(base)
    _write(base/'LOGIC.txt', '\n'.join([f"FAMILY: {treatment.get('treatment_family','')}",f"WHY: {treatment.get('why','')}",f"LOGIC: {treatment.get('logic','')}",f"SCENE: {treatment.get('scene','')}",f"SUBTITLE_POLICY: {treatment.get('subtitle_policy','')}"]))
    states=treatment.get('states') or {}
    for state in ('START','MIDDLE','END'):
        obj=states.get(state) or {}
        if obj:
            _write(base/f'{state}_NO_TEXT.txt',obj.get('prompt_no_text',''))
            _write(base/f'{state}_WITH_TEXT.txt',obj.get('prompt_with_text',''))
    if treatment.get('treatment_family')!='PRESENTER_ONLY':
        _write(base/'ANIMATION_NO_TEXT.txt',treatment.get('animation_prompt_no_text',''))
        _write(base/'ANIMATION_WITH_TEXT.txt',treatment.get('animation_prompt_with_text',''))
    write_json_atomic(base/'treatment.json',treatment)

def build_asset_tree(bundle,root):
    root=ensure_dir(root)
    # intros
    for intro in bundle['intro'].get('intros',[]):
        ib=ensure_dir(root/'02_INTRO_LAB'/intro['id'])
        _write(ib/'README.txt',f"{intro['title']}\nTHESIS: {intro.get('thesis','')}\nPROMISE: {intro.get('promise','')}\nROUTE: {intro.get('route_class','')}")
        voice_dir=ensure_dir(ib/'VOICEOVERS')
        recommended=list(intro.get('assembly_recommended',[]))
        recommended_vo_ids=[x for x in recommended if '_VO_' in x]
        for vo in intro.get('voiceover_options',[]):
            lines=[vo.get('label',vo.get('id',''))]+[f"{b['beat_id']} · {b.get('planned_seconds')}s\n{b.get('text','')}" for b in vo.get('beats',[])]
            _write(ib/f"{vo['id']}.txt",'\n\n'.join(lines))
            _write(voice_dir/f"{vo['id']}_VOICEOVER.txt",'\n\n'.join(lines))
            # Preserve the approved source order and swap only the two VO beat IDs.
            vo_beats=[b.get('beat_id') for b in vo.get('beats',[])]
            substitution=dict(zip(recommended_vo_ids,vo_beats))
            order=[substitution.get(x,x) for x in recommended]
            vo_text=' '.join(b.get('text','').strip() for b in vo.get('beats',[]) if b.get('text'))
            readthrough=f"VOICE OVER\n{vo_text}\n\nREADTHROUGH COMPLETO\n{_readthrough_text(intro,order)}"
            _write(voice_dir/f"{vo['id']}_READTHROUGH.txt",readthrough)
            for b in vo.get('beats',[]):
                for ori,t in (b.get('visual_treatment') or {}).items(): _visual_pack(ib/'VISUAL_MOTION'/b['beat_id']/ori.upper(),t)
        sr_order=list(intro.get('assembly_source_replacement',[]))
        _write(ib/'SOURCE_REPLACEMENT_READTHROUGH.txt',_readthrough_text(intro,sr_order,'SOURCE REPLACEMENT READTHROUGH'))
        for group_name,beats in [('SOURCE',intro.get('source_beats',[])),('SOURCE_REPLACEMENT',intro.get('source_replacement',[]))]:
            for b in beats:
                _write(ib/'BEATS'/group_name/f"{b['beat_id']}.txt",f"{b.get('narrative_function','')}\n{b.get('text','')}\nplanned={b.get('planned_seconds')}\nkind={b.get('kind')}\n")
                for ori,t in (b.get('visual_treatment') or {}).items(): _visual_pack(ib/'VISUAL_MOTION'/b['beat_id']/ori.upper(),t)
        write_json_atomic(ib/'intro.json',intro)
    c=bundle['content']
    for fam,folder in [('verticals','03_VERTICALS'),('horizontals','04_HORIZONTALS')]:
        for item in c.get(fam,[]):
            b=ensure_dir(root/folder/item['id']); _write(b/'COPY.txt',item.get('copy','')); _write(b/'INFO.txt',f"{item.get('title','')}\nTHESIS: {item.get('thesis','')}\nDURATION: {item.get('duration_seconds')}\n")
            for op in item.get('visual_opportunities',[]): _visual_pack(b/'VISUAL_MOTION'/op['beat_id'],op.get('treatment',{}))
            write_json_atomic(b/'content.json',item)
    for key,sub in [('principal_carousels','PRINCIPAL'),('highlight_carousels','HIGHLIGHTS')]:
        for car in c.get(key,[]):
            b=ensure_dir(root/'05_CAROUSELS'/sub/car['id']); _write(b/'COPY.txt',car.get('copy','')); write_json_atomic(b/'carousel.json',car)
            for slide in car.get('slides',[]):
                s=ensure_dir(b/f"SLIDE_{int(slide.get('slide',1)):02d}")
                _write(s/'CONTENT.txt',f"FUNCTION: {slide.get('function','')}\nHEADLINE: {slide.get('headline','')}\nBODY: {slide.get('body','')}\n")
                _write(s/'PROMPT_NO_TEXT.txt',slide.get('prompt_no_text','')); _write(s/'PROMPT_WITH_TEXT.txt',slide.get('prompt_with_text',''))
    for p in c.get('phrases',[]):
        b=ensure_dir(root/'06_PHRASES'/f"FR_{int(p.get('idx',0)):03d}"); _write(b/'PHRASE.txt',p.get('quote','')); write_json_atomic(b/'source.json',p); _write(b/'VISUAL_PROMPT_STATUS.txt','REQUIRES_CONTENT_ENGINE_VISUAL_DIRECTION · no visual prompt was embedded in the HTML; do not invent during rendering.')
    for idx,cl in enumerate(c.get('claims',[]),1):
        b=ensure_dir(root/'07_CLAIMS'/f"CL_{idx:02d}"); _write(b/'CLAIM.txt',cl.get('title','')); _write(b/'STATUS.txt',cl.get('status','VERIFY_SOURCE')); write_json_atomic(b/'claim.json',cl)
    for p in c.get('potentials',[]):
        b=ensure_dir(root/'08_POTENTIALS'/p['id']); _write(b/'SOURCE.txt',p.get('source_text','')); _write(b/'WHY_POTENTIAL.txt',p.get('note','')); _write(b/'NEXT_ACTION.txt',p.get('next_action','')); write_json_atomic(b/'potential.json',p)
    return {'intro_count':len(bundle['intro'].get('intros',[])),'vertical_count':len(c.get('verticals',[])),'horizontal_count':len(c.get('horizontals',[])),'principal_carousels':len(c.get('principal_carousels',[])),'highlight_carousels':len(c.get('highlight_carousels',[]))}
