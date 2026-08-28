#!/usr/bin/env python3
"""Restore the latest recoverable backup created by the Motion 1080p hotfix."""

from __future__ import annotations

import argparse
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path


def copy_atomic(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".restore-partial")
    shutil.copy2(source, temporary)
    os.replace(temporary, destination)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", required=True)
    args = parser.parse_args()
    target = Path(args.target).expanduser().resolve()
    backups = sorted((target / "BACKUPS").glob("HOTFIX_MOTION_1080P_40M_*"), reverse=True)
    if not backups:
        print("ERROR: no existe un backup recuperable del hotfix.")
        return 2
    backup = backups[0]
    restored = []
    for source in sorted(path for path in backup.rglob("*") if path.is_file()):
        relative = source.relative_to(backup)
        destination = target / relative
        copy_atomic(source, destination)
        restored.append(str(relative))
    report = {
        "schema_version": "abraxas.hotfix-restore.v4.2.24.motion1080p40m-r1",
        "restored_at": datetime.now(timezone.utc).isoformat(),
        "backup": str(backup),
        "target": str(target),
        "restored_files": restored,
        "output_media_deleted": False,
    }
    report_path = target / "HOTFIX_MOTION_1080P_40M_RESTORE_REPORT.json"
    temporary = report_path.with_name(report_path.name + ".partial")
    temporary.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, report_path)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

