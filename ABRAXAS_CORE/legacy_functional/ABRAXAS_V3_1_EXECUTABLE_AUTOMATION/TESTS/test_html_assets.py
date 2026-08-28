import json, tempfile, unittest
from pathlib import Path

from abraxas.htmlio import extract_editorial_data, compile_html_pair
from abraxas.assets import build_asset_tree

PACKAGE_ROOT=Path(__file__).resolve().parents[1]
CONTENT=PACKAGE_ROOT/'INPUT'/'JOC55_AMANDA_CONTENT_ENGINE_V3_1.html'
INTRO=PACKAGE_ROOT/'INPUT'/'JOC55_AMANDA_INTRO_LAB_V3_1.html'

class HtmlAssetTests(unittest.TestCase):
    def test_compile_pair_counts(self):
        bundle=compile_html_pair(CONTENT, INTRO)
        self.assertEqual(len(bundle['content']['verticals']),29)
        self.assertEqual(len(bundle['content']['horizontals']),12)
        self.assertEqual(len(bundle['content']['principal_carousels']),6)
        self.assertEqual(len(bundle['content']['highlight_carousels']),6)
        self.assertEqual(len(bundle['intro']['intros']),6)

    def test_asset_tree_writes_visual_prompts_and_carousels(self):
        bundle=compile_html_pair(CONTENT, INTRO)
        with tempfile.TemporaryDirectory() as d:
            report=build_asset_tree(bundle, Path(d))
            self.assertEqual(report['intro_count'],6)
            self.assertTrue((Path(d)/'02_INTRO_LAB/INTRO_G01/VISUAL_MOTION').exists())
            # one VFX pack must expose 8 prompt files when treatment is not presenter-only
            prompt_files=list((Path(d)/'02_INTRO_LAB').rglob('ANIMATION_NO_TEXT.txt'))
            self.assertGreater(len(prompt_files),0)
            self.assertTrue((Path(d)/'05_CAROUSELS/PRINCIPAL/C01').exists())
            self.assertTrue((Path(d)/'05_CAROUSELS/HIGHLIGHTS/HCL_HOST_01').exists())
            self.assertEqual(len(list((Path(d)/'05_CAROUSELS/PRINCIPAL').glob('*'))),6)
            self.assertEqual(len(list((Path(d)/'05_CAROUSELS/HIGHLIGHTS').glob('*'))),6)
            self.assertTrue((Path(d)/'02_INTRO_LAB/INTRO_G01/VOICEOVERS/VO_A_READTHROUGH.txt').is_file())
            self.assertTrue((Path(d)/'02_INTRO_LAB/INTRO_G01/VOICEOVERS/VO_B_READTHROUGH.txt').is_file())
            self.assertTrue((Path(d)/'02_INTRO_LAB/INTRO_G01/VOICEOVERS/VO_C_READTHROUGH.txt').is_file())
            self.assertTrue((Path(d)/'02_INTRO_LAB/INTRO_G01/SOURCE_REPLACEMENT_READTHROUGH.txt').is_file())

if __name__=='__main__': unittest.main()
