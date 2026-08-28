#!/usr/bin/env python3
from __future__ import annotations
import json, re, sys, html as htmlmod
from pathlib import Path
from collections import Counter

ROOT=Path(__file__).resolve().parents[1]
EX=ROOT/"07_EXAMPLE_JOC55"

def fail(msg, failures):
    failures.append(msg); print("FAIL",msg)
def ok(msg): print("OK  ",msg)

def extract_html(path):
    raw=path.read_text(encoding="utf-8",errors="replace")
    m=re.search(r'<script[^>]+id=["\']editorialData["\'][^>]*>(.*?)</script>',raw,re.I|re.S)
    if not m: raise RuntimeError(f"editorialData missing: {path}")
    return json.loads(htmlmod.unescape(m.group(1).strip())), raw

def complete_pack(pack):
    if pack.get("treatment_family")=="PRESENTER_ONLY":
        return bool(pack.get("logic")) and not pack.get("states")
    states=pack.get("states",{})
    if set(states)!={"START","MIDDLE","END"}: return False
    for st in states.values():
        if not st.get("prompt_no_text") or not st.get("prompt_with_text"): return False
    return bool(pack.get("animation_prompt_no_text")) and bool(pack.get("animation_prompt_with_text"))

def main():
    failures=[]
    cjson=json.loads((EX/"JOC55_CONTENT_DATA_V3_1.json").read_text(encoding="utf-8"))
    ijson=json.loads((EX/"JOC55_INTRO_DATA_V3_1.json").read_text(encoding="utf-8"))
    chtml,craw=extract_html(EX/"JOC55_AMANDA_CONTENT_ENGINE_V3_1.html")
    ihtml,iraw=extract_html(EX/"JOC55_AMANDA_INTRO_LAB_V3_1.html")

    if cjson==chtml: ok("Content HTML editorialData == JSON")
    else: fail("Content HTML editorialData differs from JSON",failures)
    if ijson==ihtml: ok("Intro HTML editorialData == JSON")
    else: fail("Intro HTML editorialData differs from JSON",failures)

    if cjson.get("document_type")=="CONTENT_ENGINE_V3_1" and "intros" not in cjson: ok("Content/Intro separation")
    else: fail("Content Engine contains Intro Lab data",failures)
    if ijson.get("document_type")=="INTRO_LAB_V3_1" and "verticals" not in ijson: ok("Intro/Content separation")
    else: fail("Intro Lab contains Content Engine data",failures)

    roles=Counter(v["speaker_role"] for v in cjson["verticals"])
    if len(cjson["verticals"])==29 and roles==Counter({"GUEST_LED":18,"HOST_LED":7,"MIXED":4}): ok(f"Vertical counts {dict(roles)}")
    else: fail(f"Vertical counts wrong {len(cjson['verticals'])} {roles}",failures)

    hroles=Counter(v["speaker_role"] for v in cjson["horizontals"])
    if len(cjson["horizontals"])==12 and hroles==Counter({"GUEST_LED":4,"HOST_LED":4,"MIXED":4}): ok(f"Horizontal counts {dict(hroles)}")
    else: fail(f"Horizontal counts wrong {len(cjson['horizontals'])} {hroles}",failures)

    for v in cjson["verticals"]:
        if not (50<=v["duration_seconds"]<=90): fail(f"{v['id']} duration",failures)
        if any(b["planned_seconds"]>9 for b in v["beats"]): fail(f"{v['id']} beat >9",failures)
        actionable=sum(o["treatment"]["treatment_family"]!="PRESENTER_ONLY" for o in v["visual_opportunities"])
        if not (3<=actionable<=4): fail(f"{v['id']} actionable visuals {actionable}",failures)
        for o in v["visual_opportunities"]:
            if not complete_pack(o["treatment"]): fail(f"{v['id']} incomplete visual pack {o['beat_id']}",failures)
    if not [x for x in failures if x.startswith(("V","JV","MV"))]: ok("All vertical runtime/beat/VFX gates")

    intentional=[]
    for h in cjson["horizontals"]:
        if h["id"]=="H03":
            if h["qa_v3"]["duration_gate"]=="TRIM_REQUIRED_1S": intentional.append("H03_TRIM_REQUIRED_1S")
            else: fail("H03 blocker missing",failures)
        elif not 480<=h["duration_seconds"]<=720: fail(f"{h['id']} duration",failures)
        if any(b["planned_seconds"]>9 for b in h["beats"]): fail(f"{h['id']} beat >9",failures)
        target=h["qa_v3"]["target_visual_opportunities"]
        actionable=sum(o["treatment"]["treatment_family"]!="PRESENTER_ONLY" for o in h["visual_opportunities"])
        if actionable!=target: fail(f"{h['id']} horizontal visuals {actionable}!={target}",failures)
        for o in h["visual_opportunities"]:
            if not complete_pack(o["treatment"]): fail(f"{h['id']} incomplete visual pack",failures)
    if not [x for x in failures if x.startswith(("H","JH","MH"))]: ok("Horizontal beat/VFX gates; H03 explicit blocker retained")

    if len(cjson["principal_carousels"])==6: ok("6 principal carousels")
    else: fail("principal carousel count",failures)
    hc=cjson["highlight_carousels"]; dist=Counter(x["speaker_mode"] for x in hc)
    if len(hc)==6 and dist==Counter({"HOST":2,"GUEST":2,"MIXED":2}): ok(f"Highlight distribution {dict(dist)}")
    else: fail(f"highlight distribution {dist}",failures)
    for deck in cjson["principal_carousels"]+hc:
        if deck["slides"][0]["function"] not in ("PAIN_HOOK","HOOK"): fail(f"{deck['id']} bad hook slide",failures)
        if deck["slides"][-1]["function"] not in ("PUNCH","CLOSE","PAYOFF"): fail(f"{deck['id']} bad final slide",failures)
        for sl in deck["slides"]:
            if not sl.get("prompt_no_text") or not sl.get("prompt_with_text"): fail(f"{deck['id']} slide prompt missing",failures)

    if len(cjson["phrases"])==15 and len(cjson["claims"])==8 and len(cjson["potentials"])==6: ok("phrases/claims/potentials counts")
    else: fail("phrases/claims/potentials counts",failures)
    if all(c["status"]=="VERIFY_SOURCE" for c in cjson["claims"]): ok("All claims remain VERIFY_SOURCE")
    else: fail("claim verification state",failures)

    intros=ijson["intros"]; rdist=Counter(x["route_class"] for x in intros)
    if len(intros)==6 and rdist==Counter({"GUEST_ONLY":3,"MIXED_HOST_GUEST":3}): ok(f"Intro distribution {dict(rdist)}")
    else: fail(f"intro distribution {rdist}",failures)
    for i in intros:
        if not 50<=i["runtime_recommended_seconds"]<=80: fail(f"{i['id']} runtime",failures)
        if not 50<=i["runtime_source_replacement_seconds"]<=80: fail(f"{i['id']} SR runtime",failures)
        all_beats=i["source_beats"]+i["source_replacement"]+[b for v in i["voiceover_options"] for b in v["beats"]]
        if any(b["planned_seconds"]>9 for b in all_beats): fail(f"{i['id']} beat >9",failures)
        if len(i["voiceover_options"])!=3 or any(len(v["beats"])!=2 for v in i["voiceover_options"]): fail(f"{i['id']} VO contract",failures)
        for b in all_beats:
            vt=b.get("visual_treatment",{})
            if "vertical" in vt:
                if not complete_pack(vt["vertical"]) or not complete_pack(vt["horizontal"]): fail(f"{i['id']} visual pack {b['beat_id']}",failures)
        for b in i["source_beats"]+i["source_replacement"]:
            if b.get("requires_microtrim"):
                if "source_start" in b or "source_end" in b: fail(f"{i['id']} false exact microtrim {b['beat_id']}",failures)
                if not b.get("parent_start") or not b.get("parent_end") or not b.get("anchor_start") or not b.get("anchor_end"): fail(f"{i['id']} incomplete microtrim {b['beat_id']}",failures)
    if not [x for x in failures if x.startswith("INTRO_")]: ok("All Intro Lab hard gates")

    if "exportSelection()" in craw and "exportSelection()" in iraw and "localStorage" in craw and "localStorage" in iraw: ok("Portable selection/export controls present")
    else: fail("selection export missing",failures)
    if 'data-state-key="JOC55_CONTENT_ENGINE_V3_1_STATES"' in craw and 'data-state-key="JOC55_INTRO_LAB_V3_1_STATES"' in iraw: ok("Separated localStorage keys")
    else: fail("state keys not separated",failures)

    # Context-zero prompt anti-dependency scan
    forbidden=["como hablamos antes","same style as before","los colores que hablamos","como ya sabes"]
    for p in [ROOT/"02_INTRO_LAB/PROMPT_NEW_CHAT_INTRO_LAB.txt",ROOT/"03_CONTENT_ENGINE/PROMPT_NEW_CHAT_CONTENT_ENGINE.txt"]:
        low=p.read_text(encoding="utf-8").lower()
        for f in forbidden:
            if f in low: fail(f"context dependency {p.name}: {f}",failures)
    if not [x for x in failures if "context dependency" in x]: ok("Context-zero prompts contain no conversational dependency phrases")

    print("\nINTENTIONAL BLOCKERS:", intentional)
    print("CLAIMS_PENDING:", sum(c["status"]=="VERIFY_SOURCE" for c in cjson["claims"]))
    micro=sum(b.get("requires_microtrim",False) for i in intros for b in i["source_beats"]+i["source_replacement"])
    print("INTRO_MICROTRIMS_PENDING_AUDIO:",micro)
    if failures:
        print("\nSELFTEST FAIL",len(failures))
        for x in failures: print(" -",x)
        raise SystemExit(2)
    print("\nSELFTEST PASS · structural failures=0")

if __name__=="__main__":
    main()
