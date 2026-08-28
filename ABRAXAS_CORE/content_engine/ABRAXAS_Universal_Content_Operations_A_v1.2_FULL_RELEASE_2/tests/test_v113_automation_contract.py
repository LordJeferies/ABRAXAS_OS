from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]

def test_automation_bridge_uses_one_confirmed_manifest():
    man=json.loads((ROOT/'automation_bridge/templates/SHIM_CONFIRMED_MANIFEST.template.json').read_text())
    cut=json.loads((ROOT/'automation_bridge/templates/CUT_AUTOMATION_PACKAGE.template.json').read_text())
    car=json.loads((ROOT/'automation_bridge/templates/CAROUSEL_PRODUCTION_PACKAGE.template.json').read_text())
    assert man['schema_version']=='1.1.3'
    assert man['sourceReadOnly'] is True and man['selectionPolicy']=='CONFIRMADO_ONLY'
    assert cut['sourceManifest']=='SHIM_CONFIRMED_MANIFEST.json' and cut['selectionPolicy']=='CONFIRMADO_ONLY'
    assert car['sourceManifest']=='SHIM_CONFIRMED_MANIFEST.json' and car['selectionPolicy']=='CONFIRMADO_ONLY'
    assert 'FAST_STREAM_COPY_KEYFRAME_DEPENDENT' in cut['precisionModes']
    assert 'DAVINCI' not in car['destinations'] and 'CONTENT_STUDIO' in car['destinations']

def test_terminal_and_davinci_executors_exist_and_validate_confirmed_only():
    term=(ROOT/'automation_bridge/terminal/abraxas_shim_export.py').read_text()
    dav=(ROOT/'automation_bridge/davinci/ABRAXAS_IMPORT_TO_RESOLVE.py').read_text()
    for text in [term,dav]:
        assert 'SHIM_CONFIRMED_MANIFEST' in text
        assert "sourceReadOnly" in text
        assert 'CONFIRMADO' in text
    for rel in ['automation_bridge/terminal/ABRAXAS_SHIM.command','automation_bridge/terminal/verify_environment.py','automation_bridge/davinci/DAVINCI_README.md']:
        assert (ROOT/rel).exists()

def test_shim_frontend_exposes_confirmed_contract():
    shim=(ROOT/'src/v113/shim.js').read_text()
    for token in ['SHIM_CONFIRMED_MANIFEST','CUT_AUTOMATION_PACKAGE','CAROUSEL_PRODUCTION_PACKAGE','terminalPackage','davinciPackage']:
        assert token in shim
