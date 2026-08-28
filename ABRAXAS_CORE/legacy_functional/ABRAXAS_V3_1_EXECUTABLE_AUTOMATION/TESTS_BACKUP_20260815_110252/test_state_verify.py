import tempfile,unittest
from pathlib import Path
from abraxas.state import StateStore
from abraxas.verify import verify_content_contract

class StateVerifyTests(unittest.TestCase):
    def test_state_checkpoint_survives_reload(self):
        with tempfile.TemporaryDirectory() as d:
            s=StateStore(Path(d))
            s.pass_stage('V01','ASSET_TREE',artifacts=['a'])
            s2=StateStore(Path(d))
            self.assertEqual(s2.get('V01','ASSET_TREE')['status'],'PASS')

    def test_h03_721_seconds_is_blocked(self):
        r=verify_content_contract({'id':'H03','duration_seconds':721.0},'horizontal')
        self.assertEqual(r['status'],'BLOCKED')
        self.assertIn('720',r['reason'])

if __name__=='__main__': unittest.main()

class RenderArtifactVerifyTests(unittest.TestCase):
    def test_pass_state_requires_real_output_file(self):
        from abraxas.verify import verify_render_artifact
        with tempfile.TemporaryDirectory() as d:
            missing=Path(d)/'missing.mp4'
            r=verify_render_artifact('PASS',missing)
            self.assertEqual(r['status'],'BLOCKED')
            self.assertIn('missing',r['reason'].lower())

    def test_existing_nonempty_output_passes(self):
        from abraxas.verify import verify_render_artifact
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'ok.mp4'; p.write_bytes(b'not-empty')
            r=verify_render_artifact('PASS',p)
            self.assertEqual(r['status'],'PASS')

    def test_dry_run_is_not_final_pass(self):
        from abraxas.verify import verify_render_artifact
        with tempfile.TemporaryDirectory() as d:
            r=verify_render_artifact('DRY_RUN',Path(d)/'none.mp4')
            self.assertEqual(r['status'],'BLOCKED')
            self.assertIn('dry',r['reason'].lower())
