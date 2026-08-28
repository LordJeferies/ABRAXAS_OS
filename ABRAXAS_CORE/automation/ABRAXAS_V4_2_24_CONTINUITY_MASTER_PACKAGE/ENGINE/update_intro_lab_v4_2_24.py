#!/usr/bin/env python3
"""Create the additive V4.2.24 Intro Lab dashboard without changing its core."""

from __future__ import annotations

import argparse
import hashlib
import html as htmlmod
import json
import re
from pathlib import Path


VERSION = "V4.2.24"


def canonical_hash(value: object) -> str:
    payload = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def parse(path: Path) -> tuple[str, dict, re.Match[str]]:
    raw = path.read_text(encoding="utf-8", errors="replace")
    match = re.search(r"<script[^>]+id=[\"']editorialData[\"'][^>]*>(.*?)</script>", raw, re.I | re.S)
    if not match:
        raise ValueError("editorialData no encontrado")
    data = json.loads(htmlmod.unescape(match.group(1).strip()))
    if data.get("document_type") != "INTRO_LAB_V3_1":
        raise ValueError("document_type no es INTRO_LAB_V3_1")
    return raw, data, match


def panel() -> str:
    return r'''<!-- ABRAXAS_V4_2_24_INTRO_PANEL_BEGIN -->
<script id="abraxasIntroV424Panel">
(()=>{function boot(){let d;try{d=JSON.parse(document.getElementById('editorialData').textContent)}catch(e){return}const p=d.intro_lab_policy_v4_2_24;if(!p)return;const b=document.createElement('button');b.textContent='Intro Lab V4.2.24';Object.assign(b.style,{position:'fixed',right:'18px',bottom:'74px',zIndex:'99998',padding:'10px 14px',border:'1px solid #a91616',borderRadius:'10px',background:'#111',color:'#fff',fontWeight:'800'});const x=document.createElement('div');Object.assign(x.style,{display:'none',position:'fixed',right:'18px',bottom:'126px',zIndex:'99999',width:'min(520px,calc(100vw - 36px))',padding:'18px',border:'1px solid #65171c',borderRadius:'14px',background:'#111',color:'#f7f3ec',boxShadow:'0 18px 60px #000b'});x.innerHTML='<button id="introV424Close" style="float:right">Cerrar</button><h2>Intro Lab protegido</h2><p>6 rutas canónicas intactas. Motion System V7 disponible como referencia, no como partición obligatoria.</p><ul><li>50–90 s por intro</li><li>VO question-first</li><li>Source replacement XOR voice-over</li><li>No alterar beats, assets ni timecodes aprobados</li></ul><code>CORE: '+p.editorial_core_sha256+'</code>';b.onclick=()=>x.style.display='block';x.querySelector('#introV424Close').onclick=()=>x.style.display='none';document.body.append(b,x)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
</script>
<!-- ABRAXAS_V4_2_24_INTRO_PANEL_END -->'''


def update(source: Path, destination: Path, report_path: Path) -> dict:
    raw, data, match = parse(source)
    core_before = canonical_hash({"hard_gates": data.get("hard_gates"), "intros": data.get("intros")})
    if len(data.get("intros") or []) != 6:
        raise ValueError("El Intro Lab no contiene las seis rutas canónicas")
    data["hotfix_version"] = VERSION
    data["motion_system_version"] = "V7"
    data["intro_lab_policy_v4_2_24"] = {
        "mode": "ADDITIVE_DASHBOARD_ONLY__EDITORIAL_CORE_PROTECTED",
        "editorial_core_sha256": core_before,
        "routes": [intro.get("id") for intro in data["intros"]],
        "intro_duration_seconds": [50, 90],
        "motion_reference": "M1-M6 may support an approved beat; no mandatory fixed-time Motions",
        "source_replacement_xor_voiceover": True,
        "voiceover_opening": "QUESTION_FIRST",
        "protected_fields": ["hard_gates", "intros", "segments", "source_beats", "timecodes", "assets", "assemblies"],
    }
    data.setdefault("automation_config", {})["intro_lab_v4_2_24_mode"] = "PROTECTED_CORE__ADDITIVE_UI"
    core_after = canonical_hash({"hard_gates": data.get("hard_gates"), "intros": data.get("intros")})
    if core_before != core_after:
        raise RuntimeError("INTRO_EDITORIAL_CORE_CHANGED")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</script>", "<\\/script>")
    updated = raw[: match.start(1)] + payload + raw[match.end(1) :]
    updated = re.sub(r"<!-- ABRAXAS_V4_2_24_INTRO_PANEL_BEGIN -->.*?<!-- ABRAXAS_V4_2_24_INTRO_PANEL_END -->", "", updated, flags=re.S)
    updated = updated.replace("</body>", panel() + "\n</body>") if "</body>" in updated else updated + panel()
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".partial")
    temporary.write_text(updated, encoding="utf-8")
    temporary.replace(destination)
    report = {
        "schema_version": "abraxas.intro-lab-protection-report.v4.2.24",
        "status": "PASS",
        "source": source.name,
        "destination": destination.name,
        "route_count": 6,
        "route_ids": [intro.get("id") for intro in data["intros"]],
        "editorial_core_sha256_before": core_before,
        "editorial_core_sha256_after": core_after,
        "editorial_core_unchanged": core_before == core_after,
        "changes": ["additive metadata", "Motion System V7 reference", "non-destructive dashboard panel"],
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Actualizar Intro Lab sin modificar su núcleo editorial")
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--report", required=True)
    args = parser.parse_args()
    report = update(Path(args.source).expanduser().resolve(), Path(args.output).expanduser().resolve(), Path(args.report).expanduser().resolve())
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
