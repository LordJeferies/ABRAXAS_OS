#!/usr/bin/env python3
from pathlib import Path
import subprocess, shutil, datetime, hashlib

HOME=Path.home()
ROOT=HOME/"Desktop/abraxasos"
OUT=HOME/"Desktop/ABRAXAS_CHATGPT_PRO_CONTEXT"
UPLOAD=OUT/"UPLOAD_THESE"

def run(cmd):
    try:
        return subprocess.check_output(cmd,cwd=ROOT,text=True,stderr=subprocess.DEVNULL).strip()
    except Exception:
        return "UNKNOWN"

if OUT.exists():
    shutil.rmtree(OUT)
UPLOAD.mkdir(parents=True)

branch=run(["git","branch","--show-current"])
head=run(["git","rev-parse","HEAD"])
remote=run(["git","rev-parse","origin/main"])
status=run(["git","status","--porcelain"]) or "CLEAN"
now=datetime.datetime.now().astimezone().isoformat(timespec="seconds")

instructions = (
"# ABRAXAS OS - ChatGPT Project Instructions\n\n"
"You are the principal architect, product reviewer and continuity guardian for ABRAXAS OS. "
"Antigravity is the primary local repository executor.\n\n"
"SOURCE AUTHORITY:\nrecent approved decision > live code + fresh verification > current contract/canon > "
"GREEN evidence > reference > historical implementation > backup/handoff.\n\n"
"Maintain ownership: YOD=intelligence/criteria; Lienzo=persistent content identity; "
"Shim=real-source observation/resolution; VAV=audiovisual production; He=operations; "
"Arquitecto=contextual guide consuming YOD; Pipeline Engine=modular orchestration; "
"AI Runtime=provider-agnostic execution; Publishing=distribution; Metrics=performance evidence.\n\n"
"For development requests produce an EXECUTION PACKET. For Antigravity reports review architecture, "
"ownership, contracts, scope and evidence, then return APPROVE / REPAIR / REJECT / NEEDS_EVIDENCE. "
"Never call DESIGN_READY implemented.\n"
)

start = (
"# START HERE - ABRAXAS OS / ChatGPT Pro\n\n"
"Create a ChatGPT Project named: ABRAXAS OS - MASTER DEVELOPMENT\n\n"
"Use Project-only memory when available.\n"
"Paste 01_PROJECT_INSTRUCTIONS_TO_PASTE.md into Project Instructions.\n"
"Upload every file inside UPLOAD_THESE/.\n\n"
"Suggested chats: 00 MASTER; 01 ARCHITECTURE; 02 YOD; 03 LIENZO + CONTRACTS; "
"04 SHIM; 05 VAV; 06 HE; 07 ARQUITECTO; 08 AI RUNTIME; 09 PIPELINE ENGINE; "
"10 ANTIGRAVITY REVIEWS.\n\n"
"This folder is an export. Git remains canonical.\n"
)

baseline=(
f"# ABRAXAS LIVE BASELINE EXPORT\n\nGenerated: {now}\nBranch: {branch}\nHEAD: {head}\n"
f"origin/main: {remote}\n\nWorking tree:\n{status}\n\nCanonical repo:\n{ROOT}\n\n"
f"Canonical VAV:\n{ROOT/'VAV/01_REPO/VAV'}\n\nVAV runtime:\n~/Library/Application Support/VAV\n"
)

protocol=(
"# ChatGPT Pro <-> Antigravity Protocol\n\n"
"1. ChatGPT produces an EXECUTION PACKET.\n"
"2. Antigravity verifies baseline and audits existing code.\n"
"3. Antigravity implements only approved scope.\n"
"4. Antigravity verifier independently checks evidence.\n"
"5. Antigravity returns EXECUTION REPORT.\n"
"6. ChatGPT returns APPROVE / REPAIR / REJECT / NEEDS_EVIDENCE.\n"
"7. Commit/push only after explicit user authorization.\n"
"8. Verify local SHA == origin/main after push.\n"
)

for name,content in {
"00_CHATGPT_START_HERE.md":start,
"01_PROJECT_INSTRUCTIONS_TO_PASTE.md":instructions,
"02_LIVE_BASELINE.md":baseline,
"03_COLLABORATION_PROTOCOL.md":protocol,
}.items():
    (OUT/name).write_text(content,encoding="utf-8")

for name in ["00_CHATGPT_START_HERE.md","02_LIVE_BASELINE.md","03_COLLABORATION_PROTOCOL.md"]:
    shutil.copy2(OUT/name,UPLOAD/name)

counter=10
def add(src,prefix):
    global counter
    src=Path(src)
    if src.is_file():
        shutil.copy2(src,UPLOAD/f"{counter:02d}_{prefix}_{src.name}")
        counter+=1

start_here=ROOT/"00_START_HERE"
if start_here.is_dir():
    for src in sorted(start_here.iterdir()):
        if src.is_file() and src.suffix.lower() in {".md",".txt"}:
            add(src,"CANON")

for rel in [
    "AGENTS.md","README.md","docs/ARCHITECTURE.md","docs/CURRENT_STATE.md",
    "docs/ROADMAP.md","docs/WORKLOG.md","docs/agent-handoff/README.md",
    "docs/agent-handoff/FIRST_ANTIGRAVITY_PROMPT.md",
    "docs/agent-handoff/templates/EXECUTION_PACKET_TEMPLATE.md",
    "docs/agent-handoff/templates/EXECUTION_REPORT_TEMPLATE.md",
    "docs/agent-handoff/templates/REVIEW_TEMPLATE.md",
]:
    add(ROOT/rel,"CURRENT")

add(ROOT/"VAV/01_REPO/VAV/package.json","VAV")

lines=["# UPLOAD MANIFEST",""]
for f in sorted(UPLOAD.iterdir()):
    if f.is_file():
        lines.append(f"- `{f.name}` - `{hashlib.sha256(f.read_bytes()).hexdigest()}`")
(OUT/"04_UPLOAD_MANIFEST.md").write_text("\n".join(lines)+"\n",encoding="utf-8")

zip_path=Path(str(OUT)+".zip")
if zip_path.exists():
    zip_path.unlink()
shutil.make_archive(str(OUT),"zip",OUT)

print("CHATGPT CONTEXT REFRESHED")
print("Folder:",OUT)
print("Upload files:",len([p for p in UPLOAD.iterdir() if p.is_file()]))
print("ZIP:",zip_path)
