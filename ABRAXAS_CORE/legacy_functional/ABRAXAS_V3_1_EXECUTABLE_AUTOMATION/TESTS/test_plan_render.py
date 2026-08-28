import json,tempfile,unittest
from pathlib import Path

from abraxas.htmlio import compile_html_pair
from abraxas.plan import collect_microtrims, build_part_plan
from abraxas.render import video_toolbox_command, concat_command
from abraxas.workers import worker_assignments

PACKAGE_ROOT=Path(__file__).resolve().parents[1]
CONTENT=PACKAGE_ROOT/'INPUT'/'JOC55_AMANDA_CONTENT_ENGINE_V3_1.html'
INTRO=PACKAGE_ROOT/'INPUT'/'JOC55_AMANDA_INTRO_LAB_V3_1.html'

class PlanRenderTests(unittest.TestCase):
    def setUp(self): self.bundle=compile_html_pair(CONTENT,INTRO)

    def test_collect_microtrims_finds_unresolved(self):
        jobs=collect_microtrims(self.bundle,{})
        self.assertGreater(len(jobs),0)
        self.assertTrue(any(x['content_id']=='INTRO_G01' for x in jobs))

    def test_part_plan_blocks_unresolved_intro_microtrims(self):
        plan=build_part_plan(self.bundle, {'vertical':'V.mp4','horizontal':'H.mp4'}, {})
        g01=next(x for x in plan['intros'] if x['content_id']=='INTRO_G01')
        self.assertEqual(g01['status'],'BLOCKED')
        self.assertGreater(len(g01['unresolved_microtrims']),0)

    def test_videotoolbox_command_uses_40m_and_atomic_partial(self):
        cmd=video_toolbox_command('/in.mp4','00:00:01.000','00:00:05.000','/out.mp4')
        s=' '.join(cmd)
        self.assertIn('h264_videotoolbox',s)
        self.assertIn('40M',s)
        self.assertTrue(cmd[-1].endswith('.partial.mp4'))

    def test_concat_is_stream_copy(self):
        cmd=concat_command('/tmp/list.txt','/tmp/out.mp4')
        s=' '.join(cmd)
        self.assertIn('-c copy',s)

    def test_worker_distribution(self):
        a,b=worker_assignments(self.bundle)
        self.assertIn('INTRO_G01',a['intros'])
        self.assertIn('INTRO_G02',b['intros'])
        self.assertEqual(a['content_engine'],['horizontals','potentials'])
        self.assertEqual(b['content_engine'],['verticals'])

if __name__=='__main__': unittest.main()

class DryRunTests(unittest.TestCase):
    def test_assemble_dry_run_does_not_require_parts_to_exist(self):
        from abraxas.runtime import assemble
        cfg={'render':{'ffmpeg':'ffmpeg','ffprobe':'ffprobe'},'_paths':{'locks':'/tmp'}}
        with tempfile.TemporaryDirectory() as d:
            r=assemble(cfg,['/no/a.mp4','/no/b.mp4'],Path(d)/'out.mp4',{'x':1},dry_run=True)
            self.assertEqual(r['status'],'DRY_RUN')

class SelectedMicrotrimTests(unittest.TestCase):
    def test_content_microtrims_are_limited_to_selected_visual_opportunities(self):
        b=compile_html_pair(CONTENT,INTRO)
        jobs=collect_microtrims(b,{})
        content_jobs=[j for j in jobs if not j['content_id'].startswith('INTRO_')]
        selected=set()
        for fam in ('verticals','horizontals'):
            for item in b['content'][fam]:
                selected.update(op['beat_id'] for op in item.get('visual_opportunities',[]))
        self.assertTrue(all(j['beat_id'] in selected for j in content_jobs))
        self.assertLess(len(content_jobs),300)

class VisualPlacementTests(unittest.TestCase):
    def test_visual_placements_mark_microtrims_unresolved(self):
        from abraxas.plan import build_visual_placements
        b=compile_html_pair(CONTENT,INTRO)
        m=build_visual_placements(b,{})
        self.assertGreater(len(m['items']),0)
        self.assertTrue(any(x['timing_status']=='UNRESOLVED_MICROTRIM' for x in m['items']))
        self.assertTrue(all(x.get('treatment_family') for x in m['items']))

class MicrotrimScopeTests(unittest.TestCase):
    def test_content_scope_excludes_intro_jobs(self):
        from abraxas.plan import filter_microtrim_jobs
        jobs=[{'content_id':'INTRO_G01'},{'content_id':'V01'},{'content_id':'H01'}]
        out=filter_microtrim_jobs(jobs,'content')
        self.assertEqual([x['content_id'] for x in out],['V01','H01'])

    def test_intro_scope_excludes_content_jobs(self):
        from abraxas.plan import filter_microtrim_jobs
        jobs=[{'content_id':'INTRO_G01'},{'content_id':'V01'}]
        out=filter_microtrim_jobs(jobs,'intros')
        self.assertEqual([x['content_id'] for x in out],['INTRO_G01'])
