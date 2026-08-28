import json,tempfile,unittest
from pathlib import Path
from abraxas.project import make_project_config, load_project
from abraxas.davinci import build_handoff_manifest
from abraxas.htmlio import compile_html_pair

CONTENT=Path('/mnt/data/JOC55_AMANDA_CONTENT_ENGINE_V3_1.html')
INTRO=Path('/mnt/data/JOC55_AMANDA_INTRO_LAB_V3_1.html')

class ProjectDavinciTests(unittest.TestCase):
    def test_project_config_preserves_legacy_and_uses_v31_output(self):
        cfg=make_project_config('P1',CONTENT,INTRO,'/v.mp4','/h.mp4','/out')
        self.assertTrue(cfg['preserve_legacy'])
        self.assertEqual(cfg['output_version'],'V3_1')
        self.assertEqual(cfg['render']['bitrate'],'40M')

    def test_davinci_handoff_contains_intro_sr_timelines_and_content(self):
        b=compile_html_pair(CONTENT,INTRO)
        part_plan={'intros':[{'content_id':'INTRO_G01','status':'READY','parts':{'A':{}},'assemblies':{'NO_VO':['A'],'SOURCE_REPLACEMENT':['A']}}], 'verticals':[{'content_id':'V01','status':'PASS'}], 'horizontals':[]}
        m=build_handoff_manifest(b,part_plan,'/output')
        names=[x['timeline_name'] for x in m['timelines']]
        self.assertIn('INTRO_G01_SOURCE_REPLACEMENT',names)
        self.assertIn('V01_VERTICAL',names)

if __name__=='__main__': unittest.main()

class PackageRootTests(unittest.TestCase):
    def test_infer_package_root_supports_tools_abraxas_layout(self):
        from abraxas.cli import infer_package_root
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)/'PACKAGE'; f=root/'TOOLS/abraxas/cli.py'
            f.parent.mkdir(parents=True); f.write_text('#x')
            (root/'TOOLS/abraxas_cli.py').write_text('#launcher')
            self.assertEqual(infer_package_root(f),root)
