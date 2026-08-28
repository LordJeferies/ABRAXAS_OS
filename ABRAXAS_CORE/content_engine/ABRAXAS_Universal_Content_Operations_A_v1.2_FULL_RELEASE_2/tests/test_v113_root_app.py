from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
APP=(ROOT/'src/app.js').read_text()
BUILD=(ROOT/'scripts/build.py').read_text()

def test_root_app_is_v113_orchestrator_not_legacy_renderer():
    assert "const VERSION='1.1.3'" in APP
    assert 'V113_SHELL.renderShellFrame' in APP
    assert 'V113_STORY.renderProductStory' in APP
    assert 'V113_DASHBOARD.renderDashboard' in APP
    assert 'function renderDashboardStoryV096' not in APP
    assert 'function renderShellV096' not in APP
    assert APP.count('bootV113();') == 1

def test_build_uses_new_frontend_modules_and_new_css_only():
    assert "VERSION='1.1.3'" in BUILD
    assert "src/v113/styles.css" in BUILD
    for name in ['domain-adapter','store','router','components','shell','dashboard','production','studio','brain','product-story','architect','factory','shim','library','assets','calendar','clients','branding','airesults','guide','roadmap']:
        assert name+'.js' in BUILD
    assert "src/styles.css" not in BUILD
