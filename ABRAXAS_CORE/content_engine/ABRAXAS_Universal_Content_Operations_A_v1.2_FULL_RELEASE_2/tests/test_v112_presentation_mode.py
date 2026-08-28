from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
APP=(ROOT/'src/app.js').read_text(encoding='utf-8')
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')

class TestV112PresentationMode(unittest.TestCase):
    def test_global_switch_exists_and_persists(self):
        for token in ["presentationMode", "setPresentationModeV112", "Dashboard", "Product Story", "renderPresentationSwitcherV112"]:
            self.assertIn(token, APP)

    def test_story_capable_sections_are_explicit(self):
        self.assertIn("V112_STORY_SECTIONS", APP)
        for section in ["dashboard","clients","branding","roadmap"]:
            self.assertIn(section, APP)

    def test_dashboard_home_and_product_story_home_are_separate_renderers(self):
        self.assertIn("renderDashboardWorkspaceV112", APP)
        self.assertIn("renderDashboardProductStoryV112", APP)
        self.assertIn("homeBrainField", APP)
        self.assertIn("Get the highlights", APP)
        self.assertIn("Take a closer look", APP)

    def test_story_mode_hides_sidebar_but_dashboard_mode_keeps_it(self):
        self.assertIn("presentation-story-mode", APP)
        self.assertIn("presentation-dashboard-mode", APP)
        self.assertIn("v112-presentation-switch", CSS)


    def test_v112_has_single_final_bootstrap_and_current_state_migration(self):
        s=APP
        self.assertEqual(s.count("bootApplicationV112();"),1)
        self.assertNotIn("\nbootApplication0961();",s)
        self.assertNotIn("presentation rerender failed",s)
        self.assertNotIn("rerender fallback failed",s)
        self.assertIn("ABRAXAS_A_v1.0_STATE",s)
        self.assertIn("['1.1.2','1.0','0.9.6.1','0.9.6','0.9.5']",s)
        boot=s.rfind("bootApplicationV112();")
        studio=s.rfind("renderStudioContent=function")
        self.assertGreater(boot,studio)
if __name__=='__main__':
    unittest.main(verbosity=2)
