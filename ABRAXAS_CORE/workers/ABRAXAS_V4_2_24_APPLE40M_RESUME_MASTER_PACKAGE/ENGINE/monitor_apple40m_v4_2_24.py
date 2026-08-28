#!/usr/bin/env python3
"""Live ABRAXAS monitor backed by FFmpeg -progress telemetry."""

from __future__ import annotations

import json
import os
import shlex
import shutil
import subprocess
import time
from pathlib import Path


HOME = Path.home()
CANDIDATES = [
    HOME / "Desktop/Joc podcast next ep 55/00_MASTERS_OFICIALES/JOC55_ABRAXAS_V4_2_OUTPUT",
    HOME / "Desktop/Joc podcast next ep 55/JOC55_ABRAXAS_V4_2_OUTPUT",
]
TOTAL_REFS = 477
TOTAL_VIDEOS = 73
TOTAL = TOTAL_REFS + TOTAL_VIDEOS
SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
FFPROBE = shutil.which("ffprobe")
CONCAT_DURATION_CACHE: dict[Path, tuple[int, float]] = {}
MOTION_PROFILE = "APPLE_VT_H264_1080P_40M_V1"


def check_output(args: list[str]) -> str:
    try:
        return subprocess.check_output(args, stderr=subprocess.DEVNULL, text=True).strip()
    except Exception:
        return ""


def output_root() -> Path:
    configured = os.environ.get("ABRAXAS_OUTPUT_ROOT")
    candidates = [Path(configured).expanduser()] if configured else []
    candidates.extend(CANDIDATES)
    print("Buscando OUTPUT de ABRAXAS…", flush=True)
    while True:
        for candidate in candidates:
            if candidate.is_dir():
                return candidate.resolve()
        time.sleep(2)


def parse_seconds(value: str) -> float | None:
    try:
        if ":" not in value:
            return float(value)
        fields = [float(field) for field in value.replace(",", ".").split(":")]
        if len(fields) == 3:
            return fields[0] * 3600 + fields[1] * 60 + fields[2]
        if len(fields) == 2:
            return fields[0] * 60 + fields[1]
    except Exception:
        pass
    return None


def human_time(seconds: float | None) -> str:
    if seconds is None or seconds < 0 or seconds > 172800:
        return "calculando"
    seconds = int(round(seconds))
    minutes, sec = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    if hours:
        return f"{hours}h{minutes:02d}m"
    if minutes:
        return f"{minutes}m{sec:02d}s"
    return f"{sec}s"


def progress_seconds(path: Path | None) -> tuple[float | None, bool]:
    if not path or not path.is_file():
        return None, False
    try:
        values: dict[str, str] = {}
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            if "=" in line:
                key, value = line.split("=", 1)
                values[key] = value
        out_time = parse_seconds(values.get("out_time", ""))
        if out_time is None:
            raw = values.get("out_time_us") or values.get("out_time_ms")
            out_time = float(raw) / 1_000_000 if raw else None
        return out_time, values.get("progress") == "end"
    except Exception:
        return None, False


def final_from_partial(path: Path) -> Path:
    name = path.name
    if ".partial." in name:
        return path.with_name(name.replace(".partial.", ".", 1))
    return path


def ffmpeg_jobs(root: Path) -> list[dict]:
    jobs: list[dict] = []
    for pid in check_output(["pgrep", "-x", "ffmpeg"]).splitlines():
        command = check_output(["ps", "-ww", "-p", pid, "-o", "command="])
        if not command or str(root) not in command:
            continue
        try:
            tokens = shlex.split(command)
        except Exception:
            tokens = command.split()
        if not tokens:
            continue
        output = Path(tokens[-1]).expanduser()
        if not output.is_absolute():
            cwd_lines = check_output(["lsof", "-a", "-p", pid, "-d", "cwd", "-Fn"]).splitlines()
            cwd = next((Path(line[1:]) for line in reversed(cwd_lines) if line.startswith("n")), None)
            if cwd:
                output = cwd / output
        progress = None
        if "-progress" in tokens:
            try:
                progress = Path(tokens[tokens.index("-progress") + 1]).expanduser()
            except Exception:
                progress = None
        duration = None
        if "-t" in tokens:
            try:
                duration = parse_seconds(tokens[tokens.index("-t") + 1])
            except Exception:
                duration = None
        list_file = None
        if "-f" in tokens and "concat" in tokens and "-i" in tokens:
            try:
                list_file = Path(tokens[tokens.index("-i") + 1]).expanduser().resolve()
            except Exception:
                list_file = None
        jobs.append({
            "pid": pid,
            "path": output.resolve(),
            "final": final_from_partial(output.resolve()),
            "progress": progress.resolve() if progress else None,
            "duration": duration,
            "list_file": list_file,
            "command": command,
        })
    return jobs


def valid_reference(path: Path) -> bool:
    if not path.is_file() or path.stat().st_size < 1024:
        return False
    sidecar = path.with_name("SOURCE_REFERENCE.APPLE40M.json")
    try:
        value = json.loads(sidecar.read_text(encoding="utf-8"))
        vertical = "03_VERTICALS" in path.parts
        expected = (1080, 1920) if vertical else (1920, 1080)
        return (
            value.get("profile") == MOTION_PROFILE
            and value.get("encoder") == "h264_videotoolbox"
            and value.get("video_bitrate") == "40M"
            and value.get("maxrate") == "48M"
            and value.get("bufsize") == "80M"
            and value.get("audio_bitrate") == "192k"
            and (int(value.get("width") or 0), int(value.get("height") or 0)) == expected
        )
    except Exception:
        return False


def target_sets(root: Path) -> tuple[set[Path], set[Path]]:
    refs = {
        path.resolve()
        for path in root.glob("09_MOTIONS_V4_2/AI_SELECTED_V4_2_24/**/SOURCE_REFERENCE.mp4")
        if valid_reference(path)
    }
    videos: set[Path] = set()
    videos.update(path.resolve() for path in root.glob("03_VERTICALS/*/MEDIA/*_VERTICAL_SOURCE.mp4") if path.is_file())
    videos.update(path.resolve() for path in root.glob("04_HORIZONTALS/*/MEDIA/*_HORIZONTAL_SOURCE.mp4") if path.is_file())
    videos.update(path.resolve() for path in root.glob("02_INTRO_LAB/*/MEDIA/VERTICAL/INTRO_*_VERTICAL_*.mp4") if path.is_file())
    videos.update(path.resolve() for path in root.glob("02_INTRO_LAB/*/MEDIA/HORIZONTAL/INTRO_*_HORIZONTAL_*.mp4") if path.is_file())
    return refs, videos


def map_duration(root: Path, path: Path) -> float | None:
    try:
        relative = final_from_partial(path).relative_to(root).parts
        mapping = json.loads((root / "00_MANIFEST/FINAL_AI_MOTION_MAP_V4_2_24.json").read_text(encoding="utf-8"))
        if relative[0] == "03_VERTICALS":
            return float(mapping["verticals"][relative[1]]["duration_seconds"])
        if relative[0] == "04_HORIZONTALS":
            return float(mapping["horizontals"][relative[1]]["effective_duration_seconds"])
    except Exception:
        pass
    return None


def decision_duration(path: Path) -> float | None:
    try:
        return float(json.loads((path.parent / "MOTION_DECISION.json").read_text(encoding="utf-8"))["duration_seconds"])
    except Exception:
        return None


def concat_duration(list_file: Path | None) -> float | None:
    if not list_file or not list_file.is_file() or not FFPROBE:
        return None
    try:
        stamp = list_file.stat().st_mtime_ns
        cached = CONCAT_DURATION_CACHE.get(list_file)
        if cached and cached[0] == stamp:
            return cached[1]
        total = 0.0
        for line in list_file.read_text(encoding="utf-8", errors="replace").splitlines():
            if not line.startswith("file "):
                continue
            raw = line[5:].strip()
            try:
                fields = shlex.split(raw)
                part = Path(fields[0])
            except Exception:
                continue
            if not part.is_absolute():
                part = list_file.parent / part
            value = check_output([
                FFPROBE, "-v", "error", "-show_entries", "format=duration",
                "-of", "default=nw=1:nk=1", str(part),
            ])
            if value:
                total += float(value)
        if total > 0:
            CONCAT_DURATION_CACHE[list_file] = (stamp, total)
            return total
    except Exception:
        pass
    return None


def cpu_percent(pid: str) -> float:
    try:
        return float(check_output(["ps", "-p", pid, "-o", "%cpu="]).replace(",", "."))
    except Exception:
        return 0.0


def short_name(root: Path, path: Path, maximum: int = 43) -> str:
    try:
        value = "/".join(final_from_partial(path).relative_to(root).parts[-4:])
    except Exception:
        value = final_from_partial(path).name
    return "…" + value[-maximum + 1 :] if len(value) > maximum else value


root = output_root()
refs_initial, videos_initial = target_sets(root)
completed_initial = sorted(refs_initial | videos_initial, key=lambda path: (path.stat().st_mtime, str(path)))
printed = set(completed_initial)
sequence = 0
states: dict[str, dict[str, float]] = {}

print("\nABRAXAS V4.2.24 · MOTIONS 1080P · APPLE VIDEOTOOLBOX 40M")
print(f"OUTPUT: {root}")
print("El porcentaje del archivo activo viene de FFmpeg, no de una estimación por tamaño.")
print("Control+C cierra solo este monitor; no detiene la producción.\n")
print("ARCHIVOS TERMINADOS EN ORDEN")
if not completed_initial:
    print("  — ninguno todavía —")
for path in completed_initial:
    sequence += 1
    kind = "REF1080" if path in refs_initial else "VIDEO"
    print(f"{sequence:03d} ✅ {kind:<6} {path.relative_to(root)}")
print("\nPROGRESO EN VIVO")

tick = 0
while True:
    now = time.time()
    jobs = ffmpeg_jobs(root)
    refs, videos = target_sets(root)
    completed = refs | videos
    newly_finished = sorted(completed - printed, key=lambda path: (path.stat().st_mtime, str(path)))
    if newly_finished:
        print("\r\033[2K", end="")
        for path in newly_finished:
            sequence += 1
            kind = "REF1080" if path in refs else "VIDEO"
            print(f"{sequence:03d} ✅ {kind:<6} {path.relative_to(root)}")
            printed.add(path)

    done = len(refs) + len(videos)
    remaining = max(0, TOTAL - done)
    global_percent = min(100.0, done * 100.0 / TOTAL)
    symbol = SPINNER[tick % len(SPINNER)]
    tick += 1

    if jobs:
        job = jobs[0]
        current, ended = progress_seconds(job["progress"])
        telemetry_exact = current is not None
        duration = job["duration"]
        if duration is None and "SOURCE_REFERENCE" in job["path"].name:
            duration = decision_duration(job["final"])
        duration = duration or map_duration(root, job["final"]) or concat_duration(job["list_file"])
        try:
            size_bytes = job["path"].stat().st_size
        except Exception:
            size_bytes = 0
        # Fallback para piezas internas sin telemetría: tamaño real con perfil 40M + AAC 192k.
        if current is None and duration and size_bytes > 0:
            current = min(duration * 0.99, size_bytes * 8.0 / 40_192_000.0)
        percent = min(99.9, max(0.0, current * 100.0 / duration)) if current is not None and duration else 0.0
        key = str(job["path"])
        state = states.setdefault(key, {"progress": current or 0.0, "time": now, "last_change": now, "speed": 0.0})
        elapsed = max(0.1, now - state["time"])
        delta = (current or 0.0) - state["progress"]
        if delta > 0:
            measured = delta / elapsed
            state["speed"] = measured if state["speed"] <= 0 else state["speed"] * 0.65 + measured * 0.35
            state["last_change"] = now
        state["progress"] = current or state["progress"]
        state["time"] = now
        idle = int(now - state["last_change"])
        eta = (duration - (current or 0.0)) / state["speed"] if duration and current is not None and state["speed"] > 0 else None
        cpu = cpu_percent(job["pid"])
        if idle >= 45:
            activity = f"WATCHDOG {idle}s · CPU {cpu:.0f}%"
        elif idle >= 5:
            activity = f"esperando datos {idle}s · CPU {cpu:.0f}%"
        else:
            activity = f"activo · CPU {cpu:.0f}%"
        source = "FFMPEG" if telemetry_exact else ("APROX-TAMAÑO" if current is not None else "INICIANDO")
        name = short_name(root, job["final"])
        status = (
            f"{symbol} {name} | {percent:5.1f}% {source} | {size_bytes / 1_000_000:.1f} MB | ETA {human_time(eta)} | {activity} | "
            f"TOTAL {done}/{TOTAL} {global_percent:.1f}% · faltan {remaining}"
        )
        if ended:
            status = status.replace("activo", "validando")
    else:
        status = (
            f"{symbol} preparando o validando siguiente archivo | TOTAL {done}/{TOTAL} "
            f"{global_percent:.1f}% · faltan {remaining} | REF1080 {len(refs)}/{TOTAL_REFS} · VIDEO {len(videos)}/{TOTAL_VIDEOS}"
        )

    columns = shutil.get_terminal_size((180, 30)).columns
    print("\r\033[2K" + status[: max(40, columns - 1)], end="", flush=True)
    if done >= TOTAL:
        print("\n\n✅ PRODUCCIÓN ABRAXAS MOTION 1080P/40M COMPLETA")
        break
    time.sleep(1)
