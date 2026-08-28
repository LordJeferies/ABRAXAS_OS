import json,tempfile,unittest
from pathlib import Path
from abraxas.htmlio import compile_html_pair
from abraxas.queue import build_visual_queue
PACKAGE_ROOT=Path(__file__).resolve().parents[1]
CONTENT=PACKAGE_ROOT/'INPUT'/'JOC55_AMANDA_CONTENT_ENGINE_V3_1.html'; INTRO=PACKAGE_ROOT/'INPUT'/'JOC55_AMANDA_INTRO_LAB_V3_1.html'
class QueueTests(unittest.TestCase):
    def test_queue_includes_motion_carousels_and_phrases(self):
        b=compile_html_pair(CONTENT,INTRO)
        with tempfile.TemporaryDirectory() as d:
            p=build_visual_queue(b,d)
            q=json.loads(Path(p).read_text())
            self.assertGreater(q['counts']['motion'],0)
            self.assertEqual(q['counts']['principal_carousel_slides'],sum(len(x['slides']) for x in b['content']['principal_carousels']))
            self.assertEqual(q['counts']['highlight_carousel_slides'],sum(len(x['slides']) for x in b['content']['highlight_carousels']))
            self.assertEqual(q['counts']['phrases'],15)
