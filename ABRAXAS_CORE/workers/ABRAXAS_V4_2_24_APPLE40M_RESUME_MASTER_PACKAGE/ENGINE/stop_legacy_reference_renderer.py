#!/usr/bin/env python3
"""Stop only the obsolete direct-to-target libx264 reference renderer."""

from __future__ import annotations

import os
import signal
import subprocess
import sys
import time


def process_table() -> dict[int, tuple[int, str]]:
    raw = subprocess.check_output(["ps", "-axo", "pid=,ppid=,command="], text=True)
    result: dict[int, tuple[int, str]] = {}
    for line in raw.splitlines():
        fields = line.strip().split(None, 2)
        if len(fields) == 3:
            try:
                result[int(fields[0])] = (int(fields[1]), fields[2])
            except ValueError:
                pass
    return result


def main() -> int:
    table = process_table()
    legacy: list[tuple[int, int, str]] = []
    for pid, (ppid, command) in table.items():
        if (
            "ffmpeg" in command
            and "libx264" in command
            and "SOURCE_REFERENCE.mp4" in command
            and "SOURCE_REFERENCE.partial.mp4" not in command
            and "JOC55_ABRAXAS_V4_2_OUTPUT" in command
        ):
            legacy.append((pid, ppid, command))
    if not legacy:
        print("No hay un renderer legado libx264 bloqueado.")
        return 0
    targets: set[int] = set()
    for pid, ppid, _ in legacy:
        parent_command = table.get(ppid, (0, ""))[1]
        if "ai_motion_engine_v4_2_24.py" in parent_command:
            targets.add(ppid)
        targets.add(pid)
    for pid in sorted(targets):
        try:
            os.kill(pid, signal.SIGTERM)
            print(f"Detenido de forma segura el proceso legado PID {pid}.")
        except ProcessLookupError:
            pass
    deadline = time.time() + 8
    while time.time() < deadline:
        alive = []
        for pid in targets:
            try:
                os.kill(pid, 0)
                alive.append(pid)
            except ProcessLookupError:
                pass
        if not alive:
            break
        time.sleep(0.25)
    if alive:
        print(f"ERROR: los procesos legados {alive} no terminaron. Cierre la Terminal antigua con Control+C y repita.")
        return 3
    print("Los MP4 terminados no fueron borrados; ABRAXAS validará y reanudará la cola.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
