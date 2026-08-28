import unittest,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Visual(unittest.TestCase):
 def test_scale_and_glass(self):
  css=(ROOT/'src/v120/styles.css').read_text()
  self.assertIn('--font-body:16px',css)
  self.assertIn('--font-meta:12px',css)
  self.assertNotRegex(css,r'font-size:\s*(?:[1-9]|10)px')
  self.assertIn('.v120-sidebar',css);self.assertIn('backdrop-filter',css)
  self.assertIn('.v120-topbar',css)
  self.assertIn('.v120-panel',css)
  # Content panels must not use backdrop-filter.
  panel=css[css.index('.v120-panel'):css.index('.v120-panel')+400]
  self.assertNotIn('backdrop-filter',panel)
 def test_reduced_motion(self):
  css=(ROOT/'src/v120/styles.css').read_text();self.assertIn('prefers-reduced-motion:reduce',css)
if __name__=='__main__':unittest.main()
