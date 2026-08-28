from pathlib import Path
import json, py_compile, subprocess
ROOT=Path(__file__).resolve().parents[1]
def test_automation_bridge_v120_contract():
    man=json.loads((ROOT/'automation_bridge/templates/SHIM_CONFIRMED_MANIFEST.template.json').read_text())
    cut=json.loads((ROOT/'automation_bridge/templates/CUT_AUTOMATION_PACKAGE.template.json').read_text())
    car=json.loads((ROOT/'automation_bridge/templates/CAROUSEL_PRODUCTION_PACKAGE.template.json').read_text())
    assert man['schema_version']=='1.2' and man['sourceReadOnly'] is True and man['selectionPolicy']=='CONFIRMADO_ONLY'
    assert cut['schema_version']=='1.2' and cut['sourceManifest']=='SHIM_CONFIRMED_MANIFEST.json'
    assert car['schema_version']=='1.2' and car['sourceManifest']=='SHIM_CONFIRMED_MANIFEST.json'
    assert 'SEGMENTS_SEPARATE' in cut['outputModes'] and 'BOTH' in cut['outputModes'] and 'FULL_PACKAGE' in cut['outputModes']
    assert 'DAVINCI' not in car['destinations'] and 'FFMPEG' not in car['destinations']
    term=(ROOT/'automation_bridge/terminal/abraxas_shim_export.py').read_text()
    dav=(ROOT/'automation_bridge/davinci/ABRAXAS_IMPORT_TO_RESOLVE.py').read_text()
    for t in [term,dav]:
        assert 'SHIM_CONFIRMED_MANIFEST' in t and 'CONFIRMADO' in t
    py_compile.compile(str(ROOT/'automation_bridge/terminal/abraxas_shim_export.py'),doraise=True)
    py_compile.compile(str(ROOT/'automation_bridge/terminal/verify_environment.py'),doraise=True)
    py_compile.compile(str(ROOT/'automation_bridge/davinci/ABRAXAS_IMPORT_TO_RESOLVE.py'),doraise=True)
    subprocess.run(['bash','-n',str(ROOT/'automation_bridge/terminal/ABRAXAS_SHIM.command')],check=True)
