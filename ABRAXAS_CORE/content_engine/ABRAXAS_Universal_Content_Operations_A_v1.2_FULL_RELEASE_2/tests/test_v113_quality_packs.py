from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
J=ROOT/'json/CLIENT_QUALITY_PACKS_v1.1.3.json'
JS=ROOT/'src/v113/quality-packs.js'

def test_quality_packs_cover_all_clients_and_are_deep():
    assert J.exists() and JS.exists()
    d=json.loads(J.read_text())
    assert set(d['clients'])=={'abraxas','joc','moka','inenergy'}
    for cid,p in d['clients'].items():
        for key in ['whatIs','whatIsNot','voice','visual','qualityGates','sourceTruth','promptRules']:
            assert p.get(key), (cid,key)
        assert len(p['qualityGates'])>=6

def test_moka_exact_visual_source_truth_is_encoded():
    p=json.loads(J.read_text())['clients']['moka']
    for token in ['#FFFFFF','#4E7060','#0D2D26','#57C378','#111111','#DEDEDE','Codec Pro','Century Expanded','40% texto / 60% imagen']:
        assert token in json.dumps(p,ensure_ascii=False)
