#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re, html as htmlmod, hashlib
from pathlib import Path

def extract_data(path: Path):
    raw=path.read_text(encoding="utf-8",errors="replace")
    m=re.search(r'<script[^>]+id=["\']editorialData["\'][^>]*>(.*?)</script>',raw,re.I|re.S)
    if not m:
        raise SystemExit("ERROR: editorialData not found")
    return json.loads(htmlmod.unescape(m.group(1).strip())), raw

def sha256(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser(description="ABRAXAS V3.1 HTML Bridge")
    ap.add_argument("html")
    ap.add_argument("--inspect",action="store_true")
    ap.add_argument("--export")
    args=ap.parse_args()
    p=Path(args.html).expanduser()
    data,raw=extract_data(p)
    doc=data.get("document_type","LEGACY_CONTENT_REVIEW")
    out={
      "source":str(p.resolve()),
      "sha256":sha256(p),
      "document_type":doc,
      "episode":data.get("episode",{}),
      "counts":data.get("counts",{}),
      "legacy":doc=="LEGACY_CONTENT_REVIEW",
      "requires_migration":doc not in ("CONTENT_ENGINE_V3_1","INTRO_LAB_V3_1")
    }
    if doc=="CONTENT_ENGINE_V3_1":
        out["production_families"]=["verticals","horizontals","principal_carousels","highlight_carousels","phrases","claims","potentials"]
        out["intro_lab_allowed"]=False
    elif doc=="INTRO_LAB_V3_1":
        out["production_families"]=["intros"]
        out["content_engine_allowed"]=False
    else:
        # legacy compatibility: do not pretend to be V3.1
        out["migration_note"]="Legacy HTML must be recompiled/audited against V3.1 gates; preserve legacy outputs."
    print(json.dumps(out,ensure_ascii=False,indent=2))
    if args.export:
        Path(args.export).write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__":
    main()
