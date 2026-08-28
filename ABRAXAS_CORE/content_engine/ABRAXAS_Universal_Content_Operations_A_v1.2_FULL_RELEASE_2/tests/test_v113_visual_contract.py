import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REG=ROOT/'json/TECHNIQUE_REGISTRY_v1.1.3.json'
GATE=ROOT/'docs/VISUAL_FIDELITY_GATE_v1.1.3.md'
CSS=ROOT/'src/v113/styles.css'

def test_registry_exists_and_covers_core_modules():
    assert REG.exists()
    data=json.loads(REG.read_text())
    required={'dashboard','product_story','library','assets','studio','shim','production','calendar','architect'}
    assert required <= set(data['modules'])
    for mid in required:
        m=data['modules'][mid]
        assert m['primaryVideo']
        assert m['techniques']
        for t in m['techniques']:
            assert 1 <= int(t['id']) <= 41
            for k in ['name','purpose','location','fallback','reducedMotion','performanceBudget']:
                assert t.get(k), (mid,t,k)

def test_visual_gate_exists_and_has_required_states():
    assert GATE.exists()
    text=GATE.read_text()
    for token in ['Anatomía visual','Jerarquía','Densidad','Spacing','Motion','Empty','Loading','Success','Error','Responsive','Keyboard','Reduced Motion','Performance']:
        assert token in text

def test_css_has_new_interface_tokens_and_states():
    css=CSS.read_text()
    for token in ['--v113-space-1','--v113-radius-window','--v113-material-functional','.state-empty','.state-loading','.state-success','.state-error','.v113-motion-source']:
        assert token in css
