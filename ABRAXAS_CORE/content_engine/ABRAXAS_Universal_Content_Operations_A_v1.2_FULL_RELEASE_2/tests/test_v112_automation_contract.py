import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
APP=(ROOT/'src/app.js').read_text(encoding='utf-8')
CORE=(ROOT/'src/core.js').read_text(encoding='utf-8')
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')

class V112AutomationContract(unittest.TestCase):
    def test_shim_requires_confirmed_manifest_and_separate_packages(self):
        for token in [
            'SHIM_CONFIRMED_MANIFEST', 'CUT_AUTOMATION_PACKAGE', 'CAROUSEL_PRODUCTION_PACKAGE',
            "selectionStatuses:['CANDIDATO','REVISADO','CONFIRMADO','DESCARTADO','NEEDS_FIX']",
            'sourceReadOnly:true', 'confirmedManifestTemplate', 'cutAutomationPackageTemplate', 'carouselProductionPackageTemplate'
        ]:
            self.assertIn(token, APP)
        self.assertIn('Solo CONFIRMADO', CORE)
        self.assertIn('SHIM_CONFIRMED_MANIFEST.json', CORE)

    def test_terminal_and_davinci_bridge_files_exist(self):
        required=[
            'automation_bridge/terminal/ABRAXAS_SHIM.command',
            'automation_bridge/terminal/abraxas_shim_export.py',
            'automation_bridge/terminal/verify_environment.py',
            'automation_bridge/terminal/ffmpeg_commands.txt',
            'automation_bridge/davinci/ABRAXAS_IMPORT_TO_RESOLVE.py',
            'automation_bridge/davinci/timeline_manifest.json',
            'automation_bridge/davinci/marker_manifest.json',
            'automation_bridge/davinci/subtitle_manifest.json',
            'automation_bridge/davinci/edit_notes.json',
            'automation_bridge/davinci/DAVINCI_README.md'
        ]
        for rel in required:
            self.assertTrue((ROOT/rel).exists(), rel)

    def test_release_packaging_includes_automation_bridge_and_web_build(self):
        pkg=(ROOT/'scripts/package_release.py').read_text(encoding='utf-8')
        self.assertIn('automation_bridge',pkg)
        self.assertIn('web_build_v1.1.2',pkg)
        self.assertIn('WEB_v1.1.2.zip',pkg)

    def test_visual_reference_and_technique_audit_files_exist(self):
        required=['json/TECHNIQUE_APPLICATION_MATRIX_v1.1.2.json','json/SHIM_CONFIRMED_MANIFEST_SCHEMA_v1.1.2.json','json/CUT_AUTOMATION_PACKAGE_SCHEMA_v1.1.2.json','json/CAROUSEL_PRODUCTION_PACKAGE_SCHEMA_v1.1.2.json','docs/VISUAL_REFERENCE_MAP_v1.1.2.md','docs/SHIM_CONFIRMED_AUTOMATION_v1.1.2.md','references/v112_source_truth/HTML_REFERENCES_ABRAXAS_FUNCIONAL_IA.md','references/shim_result_reference/Moka_Bio_clips_transcripcion_2026-07-23_v3.html']
        for rel in required:
            self.assertTrue((ROOT/rel).exists(), rel)

    def test_visual_quality_has_dedicated_music_cover_and_copy_prompts(self):
        for token in ['compileUnitMusicPrompt','compileUnitCoverPrompt','compileUnitCopiesPrompt']:
            self.assertIn(token, CORE)

    def test_content_studio_exposes_production_layers_not_only_long_prompts(self):
        for token in ['v112-production-layer-grid','Recording / source','B-roll','VFX / Omni','SFX','Music','START / MIDDLE / END','Prompt CON texto','Prompt SIN texto']:
            self.assertIn(token, APP+CSS)

    def test_content_studio_exposes_reference_and_quality_context(self):
        for token in ['Referencia / criterio','Source Truth','Formato / ADN','Asset esperado','visualRules']:
            self.assertIn(token, APP)

    def test_dual_presentation_and_apple_visual_contract(self):
        for token in ['Dashboard','Product Story','v112-presentation-switch','presentation-dashboard-mode','presentation-story-mode']:
            self.assertIn(token, APP+CSS)
        for token in ['--v112-sidebar-width','--v112-toolbar-height','v112-workspace-focus','v112-loading-state','v112-empty-state','v112-success-state']:
            self.assertIn(token, CSS+APP)
        self.assertIn('T02-HOM-01', APP)
        self.assertIn('T30-SHI-01', APP)
        self.assertIn('T30-PRO-01', APP)

if __name__=='__main__': unittest.main(verbosity=2)
