#!/usr/bin/env python3
"""Apply the ABRAXAS Motion 1080p/40M hotfix atomically and recoverably."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


HOTFIX_ID = "ABRAXAS_V4_2_24_MOTION_1080P_40M_R1"
PROFILE = "APPLE_VT_H264_1080P_40M_V1"


def sha256(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def write_json_atomic(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".partial")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def copy_atomic(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".hotfix-partial")
    shutil.copy2(source, temporary)
    os.replace(temporary, destination)


def running_renderers() -> list[dict[str, object]]:
    try:
        raw = subprocess.check_output(["ps", "-axo", "pid=,command="], text=True, stderr=subprocess.DEVNULL)
    except (OSError, subprocess.CalledProcessError):
        print("AVISO: no se pudo consultar la tabla de procesos; confirme manualmente que canceló el render anterior.")
        return []
    matches = []
    for line in raw.splitlines():
        fields = line.strip().split(None, 1)
        if len(fields) != 2:
            continue
        try:
            pid = int(fields[0])
        except ValueError:
            continue
        command = fields[1]
        if pid == os.getpid():
            continue
        if "ai_motion_engine_v4_2_24.py" in command or (
            "ffmpeg" in command and "SOURCE_REFERENCE" in command
        ):
            matches.append({"pid": pid, "command": command})
    return matches


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", required=True)
    parser.add_argument("--hotfix-root", required=True)
    args = parser.parse_args()
    target = Path(args.target).expanduser().resolve()
    hotfix_root = Path(args.hotfix_root).expanduser().resolve()
    required = [
        target / "ENGINE/ai_motion_engine_v4_2_24.py",
        target / "ENGINE/monitor_apple40m_v4_2_24.py",
        target / "TESTS/test_package_v4_2_24.py",
        target / "TERMINAL/REANUDAR_PRODUCCION_APPLE40M.command",
        target / "PACKAGE_MANIFEST.json",
    ]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        print("ERROR: el paquete ABRAXAS objetivo está incompleto:")
        for path in missing:
            print(f"  - {path}")
        return 2
    active = running_renderers()
    if active:
        print("ERROR: todavía existe un render Motion activo. Cancele la Terminal anterior con Control+C y espere a recuperar el prompt.")
        for item in active:
            print(f"  PID {item['pid']}: {str(item['command'])[:180]}")
        return 3
    files = [
        (hotfix_root / "PAYLOAD/ENGINE/ai_motion_engine_v4_2_24.py", target / "ENGINE/ai_motion_engine_v4_2_24.py"),
        (hotfix_root / "PAYLOAD/ENGINE/monitor_apple40m_v4_2_24.py", target / "ENGINE/monitor_apple40m_v4_2_24.py"),
        (hotfix_root / "PAYLOAD/TESTS/test_package_v4_2_24.py", target / "TESTS/test_package_v4_2_24.py"),
        (hotfix_root / "DOCS/15_HOTFIX_MOTION_1080P_40M.md", target / "DOCS/15_HOTFIX_MOTION_1080P_40M.md"),
    ]
    for source, _ in files:
        if not source.is_file():
            print(f"ERROR: falta payload {source}")
            return 2
    changed = [(source, destination) for source, destination in files if not destination.is_file() or sha256(source) != sha256(destination)]
    backup = None
    if changed:
        backup = target / "BACKUPS" / f"HOTFIX_MOTION_1080P_40M_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        manifest_backup = backup / "PACKAGE_MANIFEST.json"
        manifest_backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(target / "PACKAGE_MANIFEST.json", manifest_backup)
        for _, destination in changed:
            if destination.is_file():
                relative = destination.relative_to(target)
                saved = backup / relative
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(destination, saved)
        for source, destination in changed:
            copy_atomic(source, destination)
    manifest_path = target / "PACKAGE_MANIFEST.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    history = manifest.setdefault("technical_hotfix_history", [])
    if HOTFIX_ID not in history:
        history.append(HOTFIX_ID)
    manifest["motion_reference_profile"] = {
        "profile_id": PROFILE,
        "vertical": "1080x1920",
        "horizontal": "1920x1080",
        "encoder": "h264_videotoolbox",
        "video_bitrate": "40M",
        "maxrate": "48M",
        "bufsize": "80M",
        "audio": "AAC 192k 48000Hz stereo",
        "scope": "SOURCE_REFERENCE_AND_MOTION_VIDEO_ONLY",
        "full_program_resolution": "PRESERVE_SOURCE_RESOLUTION",
    }
    write_json_atomic(manifest_path, manifest)
    applied = {
        "schema_version": "abraxas.hotfix-application.v4.2.24.motion1080p40m-r1",
        "hotfix_id": HOTFIX_ID,
        "applied_at": datetime.now(timezone.utc).isoformat(),
        "target": str(target),
        "status": "APPLIED" if changed else "ALREADY_APPLIED",
        "backup": str(backup) if backup else None,
        "motion_reference_profile": PROFILE,
        "vertical_resolution": "1080x1920",
        "horizontal_resolution": "1920x1080",
        "full_programs_preserved": True,
        "output_media_deleted": False,
        "changed_files": [str(destination.relative_to(target)) for _, destination in changed],
    }
    write_json_atomic(target / "HOTFIX_MOTION_1080P_40M_APPLIED.json", applied)
    print(json.dumps(applied, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
