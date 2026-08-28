from __future__ import annotations
from .core import parse_timecode, stable_hash
from .verify import verify_content_contract


def _microtrim_job(content_id,beat,orientation='vertical'):
    return {'content_id':content_id,'beat_id':beat['beat_id'],'orientation':orientation,'text':beat.get('text',''),'parent_start':beat.get('parent_start'),'parent_end':beat.get('parent_end'),'anchor_start':beat.get('anchor_start',''),'anchor_end':beat.get('anchor_end',''),'speaker':beat.get('speaker','')}

def collect_microtrims(bundle,resolutions):
    out=[]
    # Content Engine resolves microtrims only for selected VFX/B-roll opportunities.
    # Base media cuts use the approved editorial segments, so resolving every internal beat
    # would create hundreds of unnecessary ASR jobs and violate the anti-timeout design.
    c=bundle['content']
    for fam,ori in [('verticals','vertical'),('horizontals','horizontal')]:
        for item in c.get(fam,[]):
            selected={op.get('beat_id') for op in item.get('visual_opportunities',[]) if op.get('beat_id')}
            for beat in item.get('beats',[]):
                if beat.get('beat_id') not in selected: continue
                if beat.get('requires_microtrim') and beat['beat_id'] not in resolutions: out.append(_microtrim_job(item['id'],beat,ori))
    for intro in bundle['intro'].get('intros',[]):
        beats=list(intro.get('source_beats',[]))+list(intro.get('source_replacement',[]))
        for vo in intro.get('voiceover_options',[]): beats.extend(vo.get('beats',[]))
        for beat in beats:
            if beat.get('requires_microtrim') and beat['beat_id'] not in resolutions: out.append(_microtrim_job(intro['id'],beat,'vertical'))
    # dedupe
    seen=set(); ded=[]
    for x in out:
        if x['beat_id'] in seen: continue
        seen.add(x['beat_id']); ded.append(x)
    return ded


def _resolved_range(beat,resolutions):
    if beat.get('requires_microtrim'):
        r=resolutions.get(beat['beat_id'])
        if not r or not r.get('valid'): return None
        return r['start'],r['end']
    s=beat.get('source_start') or beat.get('start'); e=beat.get('source_end') or beat.get('end')
    if s is None or e is None: return None
    return s,e


def build_part_plan(bundle,sources,resolutions,overrides=None):
    overrides=overrides or {}; plan={'schema_version':'abraxas.part-plan.v3.1','intros':[],'verticals':[],'horizontals':[]}
    for intro in bundle['intro'].get('intros',[]):
        unresolved=[]; parts={}
        all_beats=list(intro.get('source_beats',[]))+list(intro.get('source_replacement',[]))
        for beat in all_beats:
            rg=_resolved_range(beat,resolutions)
            if not rg: unresolved.append(beat['beat_id']); continue
            parts[beat['beat_id']]={'beat_id':beat['beat_id'],'start':rg[0],'end':rg[1],'speaker':beat.get('speaker'),'text':beat.get('text','')}
        plan['intros'].append({'content_id':intro['id'],'status':'BLOCKED' if unresolved else 'READY','unresolved_microtrims':unresolved,'parts':parts,'assemblies':{'NO_VO':[x for x in intro.get('assembly_recommended',[]) if '_VO_' not in x],'SOURCE_REPLACEMENT':intro.get('assembly_source_replacement',[])},'source_by_orientation':sources})
    for item in bundle['content'].get('verticals',[]):
        v=verify_content_contract(item,'vertical'); segs=[]
        for idx,s in enumerate(item.get('segments',[]),1): segs.append({'part_id':f"{item['id']}_SEG_{idx:02d}",'start':s['start'],'end':s['end'],'speaker':s.get('speaker'),'role':s.get('role')})
        plan['verticals'].append({'content_id':item['id'],'status':v['status'],'reason':v['reason'],'orientation':'vertical','source':sources.get('vertical'),'segments':segs})
    for item in bundle['content'].get('horizontals',[]):
        item2=dict(item)
        if item['id'] in overrides:
            o=overrides[item['id']]; item2['duration_seconds']=o.get('duration_seconds',item2.get('duration_seconds'))
        v=verify_content_contract(item2,'horizontal'); segs=[]
        for idx,s in enumerate(item.get('segments',[]),1):
            ov=overrides.get(item['id'],{})
            start=ov.get('start',s['start']) if idx==1 else s['start']
            end=ov.get('end',s['end']) if idx==len(item.get('segments',[])) else s['end']
            segs.append({'part_id':f"{item['id']}_SEG_{idx:02d}",'start':start,'end':end})
        plan['horizontals'].append({'content_id':item['id'],'status':v['status'],'reason':v['reason'],'orientation':'horizontal','source':sources.get('horizontal'),'segments':segs})
    return plan


def _placement_timing(beat,resolutions):
    """Return timing metadata for a visual treatment without inventing unresolved word trims."""
    beat_id=beat.get('beat_id','')
    if beat.get('source_type')=='VOICEOVER' or beat.get('kind')=='VOICEOVER':
        return {'timing_status':'VOICEOVER_SLOT','source_start':None,'source_end':None,
                'parent_start':None,'parent_end':None}
    if beat.get('requires_microtrim'):
        resolved=resolutions.get(beat_id) or {}
        if resolved.get('valid'):
            return {'timing_status':'RESOLVED','source_start':resolved.get('start'),'source_end':resolved.get('end'),
                    'parent_start':beat.get('parent_start'),'parent_end':beat.get('parent_end')}
        return {'timing_status':'UNRESOLVED_MICROTRIM','source_start':None,'source_end':None,
                'parent_start':beat.get('parent_start'),'parent_end':beat.get('parent_end')}
    return {'timing_status':'EXACT','source_start':beat.get('source_start') or beat.get('start'),
            'source_end':beat.get('source_end') or beat.get('end'),
            'parent_start':None,'parent_end':None}


def build_visual_placements(bundle,resolutions):
    """Compile source/VO timing + approved treatment family into a DaVinci/creative placement manifest.

    Content Engine includes only the editorially selected visual opportunities. Intro Lab includes every
    source/VO/source-replacement beat because every intro beat must receive a visual decision, including
    PRESENTER_ONLY. Unresolved microtrims are kept explicitly unresolved rather than inferred from planned time.
    """
    items=[]

    content=bundle.get('content',{})
    for family,orientation in (('verticals','vertical'),('horizontals','horizontal')):
        for content_item in content.get(family,[]):
            beat_by_id={b.get('beat_id'):b for b in content_item.get('beats',[]) if b.get('beat_id')}
            for opportunity in content_item.get('visual_opportunities',[]):
                beat_id=opportunity.get('beat_id')
                beat=beat_by_id.get(beat_id, {})
                treatment=opportunity.get('treatment') or {}
                timing=_placement_timing(beat,resolutions)
                items.append({
                    'content_id':content_item.get('id'),
                    'content_family':family,
                    'orientation':orientation,
                    'beat_id':beat_id,
                    'speaker':beat.get('speaker'),
                    'spoken_text':opportunity.get('spoken_text') or beat.get('text',''),
                    'planned_seconds':opportunity.get('planned_seconds') or beat.get('planned_seconds') or beat.get('duration_seconds'),
                    'treatment_family':treatment.get('treatment_family') or 'PRESENTER_ONLY',
                    'treatment':treatment,
                    **timing,
                })

    intro_bundle=bundle.get('intro',{})
    for intro in intro_bundle.get('intros',[]):
        intro_groups=[
            ('SOURCE', intro.get('source_beats',[])),
            ('SOURCE_REPLACEMENT', intro.get('source_replacement',[])),
        ]
        for vo in intro.get('voiceover_options',[]):
            intro_groups.append((vo.get('id','VOICEOVER'), vo.get('beats',[])))

        for variant,beats in intro_groups:
            for beat in beats:
                timing=_placement_timing(beat,resolutions)
                treatment_by_orientation=beat.get('visual_treatment') or {}
                for orientation in ('vertical','horizontal'):
                    treatment=treatment_by_orientation.get(orientation) or {'treatment_family':'PRESENTER_ONLY'}
                    items.append({
                        'content_id':intro.get('id'),
                        'content_family':'intros',
                        'route_class':intro.get('route_class'),
                        'variant':variant,
                        'orientation':orientation,
                        'beat_id':beat.get('beat_id'),
                        'speaker':beat.get('speaker'),
                        'narrative_function':beat.get('narrative_function'),
                        'spoken_text':beat.get('text',''),
                        'planned_seconds':beat.get('planned_seconds'),
                        'treatment_family':treatment.get('treatment_family') or 'PRESENTER_ONLY',
                        'treatment':treatment,
                        **timing,
                    })

    return {'schema_version':'abraxas.visual-placements.v3.1','items':items}


def filter_microtrim_jobs(jobs,scope):
    scope=str(scope or 'all').lower()
    if scope=='intros':
        return [x for x in jobs if str(x.get('content_id','')).startswith('INTRO_')]
    if scope=='content':
        return [x for x in jobs if not str(x.get('content_id','')).startswith('INTRO_')]
    return list(jobs)
