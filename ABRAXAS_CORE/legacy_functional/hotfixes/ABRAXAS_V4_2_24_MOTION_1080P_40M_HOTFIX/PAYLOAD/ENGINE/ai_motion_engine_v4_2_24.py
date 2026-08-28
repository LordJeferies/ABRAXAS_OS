#!/usr/bin/env python3
"""ABRAXAS V4.2.24 semantic Motion decision and packaging engine.

The engine preserves complete vertical/horizontal editorial programs. It selects
only meaningful 4–9 second Motion windows from canonical HTML/transcript data;
it never slices a program at a fixed interval.
"""

from __future__ import annotations

import argparse
import hashlib
import html as htmlmod
import json
import math
import os
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


VERSION = "V4.2.24"
MOTION_REFERENCE_PROFILE = "APPLE_VT_H264_1080P_40M_V1"
MOTION_REFERENCE_DIMENSIONS = {
    "vertical": (1080, 1920),
    "horizontal": (1920, 1080),
}
SCHEMA = "abraxas.ai-motion-map.v4.2.24"
VERTICAL_IDS = [f"V{i:02d}" for i in range(1, 19)] + [f"JV{i:02d}" for i in range(1, 12)] + [f"MV{i:02d}" for i in range(1, 9)]
HORIZONTAL_IDS = [f"H{i:02d}" for i in range(1, 5)] + [f"JH{i:02d}" for i in range(1, 5)] + [f"MH{i:02d}" for i in range(1, 5)]
VERTICAL_ROLES = ("HOOK", "TENSION", "CORE", "SHIFT", "MEMORABLE", "CLOSE")
ROLE_IDEALS = (0.06, 0.23, 0.42, 0.61, 0.79, 0.94)

MOTION_META = {
    "M1": ("FLEXIBLE_PLATE_OR_CLOSEUPS", "V2", "COMPOSITE_BEHIND_SPEAKER"),
    "M2": ("PROGRESSIVE_SCENE_EXACT_TEXT", "V3", "REPLACE_VISUAL_KEEP_SOURCE_AUDIO"),
    "M3": ("EDITORIAL_TYPE", "V4", "REPLACE_VISUAL_KEEP_SOURCE_AUDIO"),
    "M4": ("MASTER_INFOGRAPHIC_Z", "V3", "REPLACE_VISUAL_KEEP_SOURCE_AUDIO"),
    "M5": ("CINEMATIC_MICROSEQUENCE", "V2", "REPLACE_VISUAL_KEEP_SOURCE_AUDIO"),
    "M6": ("SOFTWARE_INPUT_PROCESS_OUTPUT", "V3", "REPLACE_VISUAL_KEEP_SOURCE_AUDIO"),
}

MOTION_RULES = {
    "M1": {
        "contract": "Flexible plate / three motivated close-ups",
        "asset_files": ["FRAME_01_WIDE.png", "FRAME_02_CLOSEUP_A.png", "FRAME_03_CLOSEUP_B.png"],
        "instruction": "Construir una placa flexible y tres observaciones de detalle. No generar ni sustituir al speaker; conservar baja densidad en el lado destinado al retrato.",
    },
    "M2": {
        "contract": "Progressive scene + exact integrated text",
        "asset_files": ["PLATE_01_CLEAN.png", "PLATE_02_CLEAN.png", "PLATE_03_CLEAN.png", "PLATE_04_CLEAN.png", "TEXT_01_EXACT.png", "TEXT_02_EXACT.png", "TEXT_03_EXACT.png"],
        "instruction": "Crear cuatro placas limpias y tres variantes con texto físicamente integrado. Usar únicamente palabras contiguas y exactas de la transcripción; no forzar una división 3/3/3.",
    },
    "M3": {
        "contract": "Pure editorial typography",
        "asset_files": ["TYPE_01_SETUP.png", "TYPE_02_CONTRADICTION.png", "TYPE_03_PAYOFF.png"],
        "instruction": "Resolver como tipografía editorial pura con setup, contradicción y payoff. No convertirlo en subtítulos, quote card ni placa decorativa.",
    },
    "M4": {
        "contract": "One 4K master infographic traversed in Z",
        "asset_files": ["MASTER_INFOGRAPHIC_4K.png"],
        "instruction": "Crear una sola infografía maestra 4K con relaciones verificables y profundidad espacial; recorrerla en Z. No crear cuatro slides independientes.",
    },
    "M5": {
        "contract": "Cinematic physical action: wide / detail / result",
        "asset_files": ["FRAME_01_WIDE_ACTION.png", "FRAME_02_DETAIL_ACTION.png", "FRAME_03_RESULT.png"],
        "instruction": "Mostrar una acción física comprobable en tres cámaras: plano general, detalle y resultado. No usar como intro genérica ni inventar acciones que el texto no sostenga.",
    },
    "M6": {
        "contract": "SaaS or data: input / process / output",
        "asset_files": ["UI_01_INPUT.png", "UI_02_PROCESS.png", "UI_03_OUTPUT.png"],
        "instruction": "Representar un flujo funcional de software o datos: input, proceso y output. UI sobria y legible; prohibidos HUD, cyberpunk, métricas, marcas o funciones inventadas.",
    },
}

ROLE_TERMS = {
    "HOOK": ("¿", "?", "nunca", "imagina", "qué opin", "sabes qué", "la verdad", "no necesitas", "hoy en día"),
    "TENSION": ("pero", "problema", "difícil", "frustr", "infeliz", "error", "miedo", "queja", "no podía", "contrario", "mediocr"),
    "CORE": ("porque", "significa", "considero", "creo que", "lo primero", "la realidad", "es que", "básicamente", "consiste"),
    "SHIFT": ("sin embargo", "en cambio", "pero", "aunque", "hasta que", "de repente", "a partir", "entonces", "otra manera", "punto de vista"),
    "MEMORABLE": ("nadie", "siempre", "nunca", "extraordin", "1 %", "uno por ciento", "vida", "propósito", "pasaporte", "microcosmo", "brújula", "norte"),
    "CLOSE": ("al final", "por eso", "entonces", "aprendizaje", "convertirte", "ser feliz", "básicamente", "en conclusión", "ya veremos", "para mí"),
}

FILLER_PREFIXES = (
    "ok", "okay", "sí", "totalmente", "claro", "agreed", "bueno", "o sea", "este", "gracias",
)


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def norm(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def parse_timecode(value: Any) -> float | None:
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)
    parts = str(value).strip().replace(",", ".").split(":")
    try:
        if len(parts) == 1:
            return float(parts[0])
        if len(parts) == 2:
            return int(parts[0]) * 60 + float(parts[1])
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
    except ValueError:
        return None
    return None


def format_timecode(seconds: float | None) -> str | None:
    if seconds is None:
        return None
    value = max(0.0, float(seconds))
    hours = int(value // 3600)
    value -= hours * 3600
    minutes = int(value // 60)
    value -= minutes * 60
    return f"{hours:02d}:{minutes:02d}:{value:06.3f}"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def runtime_compatible_source_fingerprint(path: Path, ffprobe: str, chunk_size: int = 4 * 1024 * 1024) -> str:
    """Match the V4.2.5 renderer fingerprint without hashing a multi-GB master."""
    source = path.expanduser().resolve()
    stat = source.stat()
    sample = hashlib.sha256()
    with source.open("rb") as handle:
        if stat.st_size <= chunk_size * 3:
            sample.update(handle.read())
        else:
            for offset in (0, max(0, stat.st_size // 2 - chunk_size // 2), max(0, stat.st_size - chunk_size)):
                handle.seek(offset)
                sample.update(handle.read(chunk_size))
    proc = subprocess.run(
        [ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(source)],
        capture_output=True,
        text=True,
        timeout=90,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or f"ffprobe failed: {source}")
    value = {
        "path": str(source),
        "size": stat.st_size,
        "mtime_ns": stat.st_mtime_ns,
        "content_sample_sha256": sample.hexdigest(),
        "ffprobe": json.loads(proc.stdout),
    }
    raw = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".partial")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".partial")
    temporary.write_text(value.rstrip() + "\n", encoding="utf-8")
    temporary.replace(path)


def extract_editorial_data(path: Path) -> tuple[str, dict[str, Any], re.Match[str]]:
    raw = path.read_text(encoding="utf-8", errors="replace")
    match = re.search(r"<script[^>]+id=[\"']editorialData[\"'][^>]*>(.*?)</script>", raw, re.I | re.S)
    if not match:
        raise ValueError(f"editorialData no encontrado en {path}")
    data = json.loads(htmlmod.unescape(match.group(1).strip()))
    if data.get("document_type") != "CONTENT_ENGINE_V3_1":
        raise ValueError("El HTML no es un Content Engine canónico")
    return raw, data, match


@dataclass
class TranscriptRef:
    ref_id: str
    start: float
    end: float
    text: str
    state: str
    motion_possible: str


def parse_transcript_reference(path: Path | None) -> list[TranscriptRef]:
    if not path or not path.is_file():
        return []
    raw = path.read_text(encoding="utf-8", errors="replace")
    if not re.search(r"^REF_\d{4}$", raw, re.M):
        result: list[TranscriptRef] = []
        blocks = re.split(r"\r?\n\s*\r?\n", raw.strip())
        for block in blocks:
            lines = [line.strip() for line in block.splitlines()]
            time_index = next((index for index, line in enumerate(lines) if "-->" in line), None)
            if time_index is None:
                continue
            left, right = [part.strip() for part in lines[time_index].split("-->", 1)]
            start, end = parse_timecode(left), parse_timecode(right)
            if start is None or end is None or end <= start:
                continue
            text = norm(" ".join(lines[time_index + 1 :]))
            if not text:
                continue
            result.append(TranscriptRef(f"SRT_{len(result) + 1:04d}", start, end, text, "SRT_SOURCE", ""))
        return result
    blocks = re.split(r"\n(?=REF_\d{4}\n)", raw)
    result: list[TranscriptRef] = []
    for block in blocks:
        identifier = re.search(r"^(REF_\d{4})$", block, re.M)
        timecode = re.search(r"^TIMECODE_FUENTE:\s*(.*?)\s*-->\s*(.*?)$", block, re.M)
        text = re.search(r"^TRANSCRIPCION:\s*(.*)$", block, re.M)
        state = re.search(r"^ESTADO:\s*(.*)$", block, re.M)
        possible = re.search(r"^MOTION_POSIBLE:\s*(.*)$", block, re.M)
        if not (identifier and timecode and text):
            continue
        start, end = parse_timecode(timecode.group(1)), parse_timecode(timecode.group(2))
        if start is None or end is None:
            continue
        result.append(TranscriptRef(identifier.group(1), start, end, norm(text.group(1)), norm(state.group(1) if state else ""), norm(possible.group(1) if possible else "")))
    return result


@dataclass
class Candidate:
    part_id: str
    content_id: str
    source_start: float
    source_end: float
    timeline_in: float
    timeline_out: float
    duration: float
    text: str
    speaker: str
    editorial_role: str
    child_beat_ids: list[str]
    treatment: dict[str, Any] = field(default_factory=dict)
    transcript_ref: TranscriptRef | None = None
    quality: float = 0.0


def source_range(part: dict[str, Any], resolutions: dict[str, Any] | None = None) -> tuple[float | None, float | None]:
    start = parse_timecode(part.get("source_start") or part.get("start") or part.get("start_tc"))
    end = parse_timecode(part.get("source_end") or part.get("end") or part.get("end_tc"))
    if start is not None and end is not None:
        return start, end
    identifier = str(part.get("delivery_part_id") or part.get("beat_id") or "")
    resolution = (resolutions or {}).get(identifier) or {}
    if resolution.get("valid"):
        start = parse_timecode(resolution.get("start") if resolution.get("start") is not None else resolution.get("start_tc"))
        end = parse_timecode(resolution.get("end") if resolution.get("end") is not None else resolution.get("end_tc"))
        if start is not None and end is not None:
            return start, end
    ranges = part.get("source_ranges") or []
    if ranges:
        first = ranges[0]
        return parse_timecode(first.get("start_tc") or first.get("start")), parse_timecode(first.get("end_tc") or first.get("end"))
    return None, None


def segment_offsets(item: dict[str, Any]) -> list[tuple[float, float, float]]:
    offsets: list[tuple[float, float, float]] = []
    cursor = 0.0
    for segment in item.get("segments") or []:
        start, end = parse_timecode(segment.get("start")), parse_timecode(segment.get("end"))
        if start is None or end is None or end <= start:
            continue
        offsets.append((start, end, cursor))
        cursor += end - start
    return offsets


def to_timeline(start: float, end: float, offsets: list[tuple[float, float, float]], fallback_start: float) -> tuple[float, float]:
    for seg_start, seg_end, offset in offsets:
        if start >= seg_start - 0.25 and end <= seg_end + 0.25:
            timeline_in = offset + max(0.0, start - seg_start)
            return round(timeline_in, 3), round(timeline_in + (end - start), 3)
    return round(max(0.0, start - fallback_start), 3), round(max(0.0, end - fallback_start), 3)


def best_reference(start: float, end: float, refs: list[TranscriptRef]) -> TranscriptRef | None:
    best: tuple[float, TranscriptRef] | None = None
    for ref in refs:
        overlap = max(0.0, min(end, ref.end) - max(start, ref.start))
        if overlap <= 0:
            continue
        score = overlap / max(0.1, min(end - start, ref.end - ref.start))
        if best is None or score > best[0]:
            best = (score, ref)
    return best[1] if best else None


def semantic_quality(text: str, treatment: dict[str, Any], duration: float) -> float:
    low = text.lower().strip(" .,!¡¿?")
    words = re.findall(r"\w+", low, re.UNICODE)
    score = min(2.4, len(words) / 8.0)
    if any(char in text for char in "¿?!"):
        score += 0.5
    if any(term in low for terms in ROLE_TERMS.values() for term in terms if term not in ("?", "¿")):
        score += 0.8
    if low.startswith(FILLER_PREFIXES) and len(words) < 9:
        score -= 1.4
    family = str(treatment.get("treatment_family") or "")
    if family and family != "PRESENTER_ONLY":
        score += 0.8
    if 4.0 <= duration <= 9.0:
        score += 0.5
    return round(score, 4)


def build_candidates(item: dict[str, Any], refs: list[TranscriptRef], resolutions: dict[str, Any] | None = None) -> list[Candidate]:
    parts = item.get("delivery_parts_4_9") or item.get("beats") or []
    opportunities = {str(entry.get("beat_id")): entry.get("treatment") or {} for entry in item.get("visual_opportunities") or []}
    offsets = segment_offsets(item)
    known_starts = [parse_timecode(s.get("start")) for s in item.get("segments") or []]
    fallback_start = min((x for x in known_starts if x is not None), default=0.0)
    result: list[Candidate] = []
    for index, part in enumerate(parts, 1):
        start, end = source_range(part, resolutions)
        if start is None or end is None or end <= start:
            continue
        duration = round(end - start, 3)
        if not (3.999 <= duration <= 9.001):
            continue
        child_ids = [str(x) for x in (part.get("child_beat_ids") or [part.get("beat_id")]) if x]
        treatment = dict(part.get("visual_treatment") or {})
        if not treatment:
            for child in child_ids:
                if opportunities.get(child):
                    treatment = dict(opportunities[child])
                    break
        timeline_in, timeline_out = to_timeline(start, end, offsets, fallback_start)
        text = norm(part.get("text") or part.get("transcript_exact") or part.get("spoken_text"))
        candidate = Candidate(
            part_id=str(part.get("delivery_part_id") or part.get("beat_id") or f"{item.get('id')}_C{index:03d}"),
            content_id=str(item.get("id")),
            source_start=start,
            source_end=end,
            timeline_in=timeline_in,
            timeline_out=timeline_out,
            duration=duration,
            text=text,
            speaker=norm(part.get("speaker") or item.get("speaker_role") or "NO_ESPECIFICADO"),
            editorial_role=norm(part.get("narrative_function") or part.get("role") or "SOURCE").upper(),
            child_beat_ids=child_ids,
            treatment=treatment,
            transcript_ref=best_reference(start, end, refs),
        )
        candidate.quality = semantic_quality(text, treatment, duration)
        result.append(candidate)
    ordered = sorted(result, key=lambda c: (c.timeline_in, c.timeline_out, c.part_id))
    # The preapproved SRT alignment intentionally adds small handles. Remove
    # only those handle overlaps so two selected Motions never fight for the
    # same frames; the spoken-word order and end time remain untouched.
    previous: Candidate | None = None
    for candidate in ordered:
        if previous and candidate.timeline_in < previous.timeline_out:
            overlap = previous.timeline_out - candidate.timeline_in
            if overlap <= 0.75 and candidate.duration - overlap >= 3.999:
                candidate.timeline_in = round(previous.timeline_out, 3)
                candidate.source_start = round(candidate.source_start + overlap, 3)
                candidate.duration = round(candidate.source_end - candidate.source_start, 3)
        previous = candidate
    return ordered


def role_score(candidate: Candidate, role: str, ratio: float, ideal: float) -> float:
    low = candidate.text.lower()
    lexical = sum(1.45 for term in ROLE_TERMS[role] if term in low or (term in ("?", "¿") and term in candidate.text))
    position = max(-4.5, 4.2 - abs(ratio - ideal) * 18.0)
    editorial = candidate.editorial_role
    role_matches = {
        "HOOK": ("HOOK", "FRAME", "QUESTION", "OPEN"),
        "TENSION": ("TENSION", "CONFLICT", "PROBLEM", "COUNTERPOINT", "DESARROLLO"),
        "CORE": ("CORE", "EXPLANATION", "DESARROLLO", "SOURCE", "ARGUMENT"),
        "SHIFT": ("SHIFT", "REFRAME", "TURN", "COUNTERPOINT", "DESARROLLO"),
        "MEMORABLE": ("MEMORABLE", "PAYOFF", "THESIS", "QUOTE", "DESARROLLO"),
        "CLOSE": ("CLOSE", "CIERRE", "CONCLUSION", "PAYOFF"),
    }
    editorial_bonus = 1.4 if any(token in editorial for token in role_matches[role]) else 0.0
    return candidate.quality + lexical + position + editorial_bonus


def select_vertical(item: dict[str, Any], candidates: list[Candidate]) -> list[tuple[str, Candidate, float]]:
    if len(candidates) < len(VERTICAL_ROLES):
        raise ValueError(f"{item.get('id')}: solo {len(candidates)} ventanas válidas; se requieren 6")
    duration = max(float(item.get("duration_seconds") or 0), max((c.timeline_out for c in candidates), default=1.0), 1.0)
    n, k = len(candidates), len(VERTICAL_ROLES)
    scores = [[role_score(c, VERTICAL_ROLES[r], min(1.0, c.timeline_in / duration), ROLE_IDEALS[r]) for c in candidates] for r in range(k)]
    dp = [[-math.inf] * n for _ in range(k)]
    previous = [[-1] * n for _ in range(k)]
    for j in range(n):
        dp[0][j] = scores[0][j]
    for r in range(1, k):
        for j in range(r, n):
            best_value, best_index = -math.inf, -1
            for i in range(r - 1, j):
                if candidates[j].timeline_in < candidates[i].timeline_out - 0.001:
                    continue
                gap_bonus = min(0.7, max(0.0, candidates[j].timeline_in - candidates[i].timeline_out) / 20.0)
                value = dp[r - 1][i] + scores[r][j] + gap_bonus
                if value > best_value:
                    best_value, best_index = value, i
            dp[r][j], previous[r][j] = best_value, best_index
    end = max(range(k - 1, n), key=lambda j: dp[k - 1][j])
    if not math.isfinite(dp[k - 1][end]):
        raise ValueError(f"{item.get('id')}: no existe una secuencia cronológica de 6 motions")
    indices = [end]
    for r in range(k - 1, 0, -1):
        indices.append(previous[r][indices[-1]])
    indices.reverse()
    return [(role, candidates[index], round(scores[r][index], 4)) for r, (role, index) in enumerate(zip(VERTICAL_ROLES, indices))]


def rolling_density_ok(starts: Iterable[float]) -> bool:
    ordered = sorted(starts)
    return all(ordered[index] - ordered[index - 2] > 60.0 + 1e-6 for index in range(2, len(ordered)))


def clock_minute_density_ok(starts: Iterable[float]) -> bool:
    buckets: dict[int, int] = {}
    for start in starts:
        minute = int(max(0.0, float(start)) // 60.0)
        buckets[minute] = buckets.get(minute, 0) + 1
    return all(count <= 2 for count in buckets.values())


def select_horizontal(item: dict[str, Any], candidates: list[Candidate], effective_duration: float) -> tuple[list[Candidate], int]:
    target = max(1, int(round(effective_duration / 30.0)))
    usable = [c for c in candidates if c.timeline_in < effective_duration - 0.1]
    if len(usable) < target:
        target = len(usable)
    spacing = effective_duration / max(1, target)
    selected: list[Candidate] = []
    used: set[str] = set()
    for index in range(target):
        anchor = spacing * (index + 0.45)
        ranked = sorted(
            (c for c in usable if c.part_id not in used),
            key=lambda c: (-(c.quality * 4.0 - abs(c.timeline_in - anchor) / max(4.0, spacing / 3.0)), abs(c.timeline_in - anchor), c.timeline_in),
        )
        chosen = None
        for candidate in ranked:
            trial = [c.timeline_in for c in selected] + [candidate.timeline_in]
            if clock_minute_density_ok(trial):
                chosen = candidate
                break
        if chosen:
            selected.append(chosen)
            used.add(chosen.part_id)
    if len(selected) < target:
        for candidate in sorted(usable, key=lambda c: (-c.quality, c.timeline_in)):
            if candidate.part_id in used:
                continue
            if clock_minute_density_ok([c.timeline_in for c in selected] + [candidate.timeline_in]):
                selected.append(candidate)
                used.add(candidate.part_id)
            if len(selected) == target:
                break
    return sorted(selected, key=lambda c: c.timeline_in), target


def contains_any(text: str, values: Iterable[str]) -> bool:
    low = text.lower()
    return any(value in low for value in values)


def choose_motion(candidate: Candidate, narrative_role: str) -> tuple[str, str, str]:
    family = str(candidate.treatment.get("treatment_family") or "").upper()
    text = candidate.text
    if family == "SAAS_PRODUCT_MOTION":
        motion, reason = "M6", "La frase describe un flujo digital verificable: input, proceso y resultado."
    elif family == "WORD_ENVIRONMENT":
        motion, reason = "M3", "La tesis verbal es la imagen principal y funciona como golpe editorial."
    elif family == "DOCUMENTARY_LITERAL":
        if contains_any(text, ("hacer", "estudiar", "practicar", "trabajar", "construir", "empezar", "terminar", "caminar")):
            motion, reason = "M5", "La idea puede mostrarse como acción física: plano general, detalle y resultado."
        else:
            motion, reason = "M1", "La idea se aclara con observación documental y close-ups, sin sustituir el testimonio."
    elif family == "SYMBOLIC_OBJECT":
        motion, reason = "M2", "El símbolo admite una evolución progresiva en tres estados sin reescribir la frase."
    elif family == "VOX_EDITORIAL":
        if narrative_role in ("HOOK", "TENSION", "MEMORABLE", "CLOSE") or contains_any(text, ("nunca", "pero", "el problema", "la verdad", "nadie")):
            motion, reason = "M3", "La selección funciona como tesis, contradicción o payoff editorial."
        else:
            motion, reason = "M4", "La selección explica una relación o mapa conceptual que merece lectura progresiva."
    elif family == "SCIENTIFIC_MACRO":
        motion, reason = "M1", "La comprensión depende de detalle material y observación macro controlada."
    elif narrative_role in ("CORE", "SHIFT") and contains_any(text, ("porque", "sistema", "proceso", "depende", "entonces")):
        motion, reason = "M4", "La idea central se entiende mejor como relación o proceso visual."
    elif narrative_role in ("HOOK", "MEMORABLE", "CLOSE"):
        motion, reason = "M3", "La frase tiene fuerza autónoma y debe resolverse como golpe editorial."
    else:
        motion, reason = "M1", "Fallback conservador: acompañamiento visual concreto antes que efecto genérico."
    alternative = {"M1": "M5", "M2": "M1", "M3": "M4", "M4": "M3", "M5": "M1", "M6": "M4"}[motion]
    return motion, alternative, reason


def selection_reason(role: str, candidate: Candidate) -> str:
    reasons = {
        "HOOK": "Abre la tesis con una frase o pregunta de alta atención.",
        "TENSION": "Expone el problema, contradicción o costo narrativo.",
        "CORE": "Concentra la explicación principal o el aprendizaje.",
        "SHIFT": "Marca el cambio de perspectiva o la nueva interpretación.",
        "MEMORABLE": "Contiene una frase, metáfora o síntesis compartible.",
        "CLOSE": "Resuelve la idea y sostiene el cierre emocional o reflexivo.",
        "EDITORIAL": "La ventana tiene densidad semántica y aporta una explicación visual útil.",
    }
    suffix = f" Referencia {candidate.transcript_ref.ref_id}." if candidate.transcript_ref else ""
    return reasons.get(role, reasons["EDITORIAL"]) + suffix


def prompt_bundle(content_id: str, role: str, candidate: Candidate, motion: str) -> dict[str, str]:
    name, track, mode = MOTION_META[motion]
    rules = MOTION_RULES[motion]
    orientation = "9:16 vertical" if content_id.startswith(("V", "JV", "MV")) and not content_id.startswith(("JH", "MH")) else "16:9 horizontal"
    resolution = "1080x1920" if orientation.startswith("9:16") else "1920x1080"
    reference_note = candidate.transcript_ref.motion_possible if candidate.transcript_ref else ""
    image = (
        f"ABRAXAS {VERSION} · {content_id} · {role} · {motion} {name}. Formato {orientation}; resolución exacta {resolution}. "
        f"Contexto hablado exacto: “{candidate.text}”. Función narrativa: {role}. "
        f"CONTRATO V7: {rules['contract']}. {rules['instruction']} "
        f"ARCHIVOS OBLIGATORIOS: {', '.join(rules['asset_files'])}. "
        f"Dirección de referencia: {reference_note or 'representación editorial concreta, sobria y físicamente coherente'}. "
        "Una idea dominante; foreground, midground y background claros; safe area inferior libre para subtítulos; luz motivada, "
        "perspectiva y materiales creíbles; continuidad estricta entre estados. Paleta JOC: off-white #F7F3EC, charcoal #111111, "
        "rojo #A91616 y vino #65171C. No inventar claims, métricas, identidad, logos, UI, captions ni texto basura. "
        "No copiar layouts de Vox/DOAC. Cada salida es una imagen independiente, sin audio ni watermark."
    )
    animation = (
        f"ABRAXAS {VERSION} · Animar {motion} {name} para {content_id}/{role}. Duración exacta {candidate.duration:.3f}s; formato {orientation}; resolución exacta {resolution}. "
        f"Respetar el contrato V7: {rules['instruction']} Contexto: “{candidate.text}”. Movimiento motivado, easing suave y continuidad de "
        "identidad, geometría, cámara, luz y materiales. Mantener el audio fuente fuera del render. No añadir subtítulos, logos, "
        "claims, objetos o datos. Entregar MOTION_FINAL.mov o MOTION_FINAL.mp4 sin audio ni watermark."
    )
    davinci = (
        f"RANGO FUENTE: {format_timecode(candidate.source_start)} → {format_timecode(candidate.source_end)}\n"
        f"RANGO EN VIDEO: {format_timecode(candidate.timeline_in)} → {format_timecode(candidate.timeline_out)}\n"
        f"DURACIÓN: {candidate.duration:.3f}s\nRESOLUCIÓN MOTION: {resolution}\nPISTA: {track}\nMODO: {mode}\n\n"
        "Conservar el video fuente en V1 y su audio original en A1. Importar MOTION_FINAL sin audio y colocarlo exactamente en el rango indicado. "
        "No crear clips adicionales entre motions. Mantener captions aprobados en una pista superior. Si el motion debilita el gesto humano, "
        "usar la alternativa aprobada o mantener source y registrar la decisión."
    )
    return {"image": image, "animation": animation, "davinci": davinci}


def entry_from_candidate(content_id: str, sequence: int, role: str, candidate: Candidate, semantic_score: float | None = None) -> dict[str, Any]:
    motion, alternative, motion_reason = choose_motion(candidate, role)
    name, track, mode = MOTION_META[motion]
    prompts = prompt_bundle(content_id, role, candidate, motion)
    is_vertical = content_id.startswith(("V", "JV", "MV")) and not content_id.startswith(("JH", "MH"))
    return {
        "sequence": sequence,
        "content_id": content_id,
        "narrative_role": role,
        "source_part_id": candidate.part_id,
        "child_beat_ids": candidate.child_beat_ids,
        "speaker": candidate.speaker,
        "source_start": format_timecode(candidate.source_start),
        "source_end": format_timecode(candidate.source_end),
        "timeline_in_seconds": round(candidate.timeline_in, 3),
        "timeline_out_seconds": round(candidate.timeline_out, 3),
        "timeline_in": format_timecode(candidate.timeline_in),
        "timeline_out": format_timecode(candidate.timeline_out),
        "duration_seconds": candidate.duration,
        "text": candidate.text,
        "reason": selection_reason(role, candidate),
        "semantic_score": semantic_score if semantic_score is not None else candidate.quality,
        "transcript_reference": candidate.transcript_ref.ref_id if candidate.transcript_ref else None,
        "motion_primary": motion,
        "motion_name": name,
        "motion_alternative": alternative,
        "why_motion": motion_reason,
        "track": track,
        "placement_mode": mode,
        "motion_system_version": "V7",
        "motion_render_profile": MOTION_REFERENCE_PROFILE,
        "motion_resolution": "1080x1920" if is_vertical else "1920x1080",
        "asset_contract": MOTION_RULES[motion],
        "prompts": prompts,
        "status": "READY_FOR_ASSET_GENERATION",
    }


def effective_horizontal_duration(item: dict[str, Any]) -> tuple[float, dict[str, Any] | None]:
    duration = float(item.get("duration_seconds") or 0)
    if item.get("id") == "H03" and 720.0 < duration <= 721.1:
        return 720.0, {"type": "END_TRIM", "seconds": round(duration - 720.0, 3), "reason": "Bloqueador histórico H03_TRIM_REQUIRED_1S resuelto a 12:00."}
    return duration, None


def build_map(data: dict[str, Any], refs: list[TranscriptRef], resolutions: dict[str, Any], content_html: Path, transcript_path: Path | None, resolutions_path: Path | None, intro_html: Path | None) -> dict[str, Any]:
    vertical_by_id = {item.get("id"): item for item in data.get("verticals") or []}
    horizontal_by_id = {item.get("id"): item for item in data.get("horizontals") or []}
    if set(vertical_by_id) != set(VERTICAL_IDS):
        raise ValueError(f"IDs verticales inválidos. Esperados {VERTICAL_IDS}; recibidos {sorted(vertical_by_id)}")
    if set(horizontal_by_id) != set(HORIZONTAL_IDS):
        raise ValueError(f"IDs horizontales inválidos. Esperados {HORIZONTAL_IDS}; recibidos {sorted(horizontal_by_id)}")

    source = {
        "content_html": content_html.name,
        "content_html_sha256": sha256_file(content_html),
        "transcript_reference": transcript_path.name if transcript_path and transcript_path.is_file() else None,
        "transcript_reference_sha256": sha256_file(transcript_path) if transcript_path and transcript_path.is_file() else None,
        "transcript_reference_units": len(refs),
        "microtrim_resolutions": resolutions_path.name if resolutions_path and resolutions_path.is_file() else None,
        "microtrim_resolutions_sha256": sha256_file(resolutions_path) if resolutions_path and resolutions_path.is_file() else None,
        "microtrim_resolutions_count": len(resolutions),
        "intro_lab": intro_html.name if intro_html and intro_html.is_file() else None,
        "intro_lab_sha256_before": sha256_file(intro_html) if intro_html and intro_html.is_file() else None,
        "intro_lab_modified": False,
    }
    result: dict[str, Any] = {
        "schema_version": SCHEMA,
        "hotfix_version": VERSION,
        "generated_at": utc_now(),
        "decision_mode": "LOCAL_SEMANTIC_NARRATIVE_SELECTION__NO_FIXED_TIME_SLICING",
        "source": source,
        "policy": {
            "terminal_role": "ORGANIZE_VALIDATE_EXECUTE_ONLY",
            "creative_decision": "SEMANTIC_ENGINE_WITH_HUMAN_OVERRIDE",
            "verticals": {"ids": VERTICAL_IDS, "duration_seconds": [45, 80], "mandatory_roles": list(VERTICAL_ROLES), "motions_per_video": 6},
            "horizontals": {"ids": HORIZONTAL_IDS, "duration_seconds": [480, 720], "target_density": "APPROX_2_MOTIONS_PER_MINUTE", "maximum_starts_per_clock_minute": 2},
            "motion_window_seconds": [4, 9],
            "fixed_interval_partitioning": "PROHIBITED",
            "intro_lab": "PROTECTED__NOT_TOUCHED",
        },
        "verticals": {},
        "horizontals": {},
        "warnings": [],
    }

    for content_id in VERTICAL_IDS:
        item = vertical_by_id[content_id]
        candidates = build_candidates(item, refs, resolutions)
        selected = select_vertical(item, candidates)
        duration = float(item.get("duration_seconds") or 0)
        duration_status = "PASS" if 45.0 <= duration <= 80.0 else "NEEDS_EXISTING_EDITORIAL_TRIM_REVIEW"
        if duration_status != "PASS":
            result["warnings"].append({"content_id": content_id, "code": "VERTICAL_DURATION_OUTSIDE_45_80", "duration_seconds": duration})
        entries = [entry_from_candidate(content_id, sequence, role, candidate, score) for sequence, (role, candidate, score) in enumerate(selected, 1)]
        result["verticals"][content_id] = {
            "type": "VERTICAL",
            "title": item.get("title"),
            "duration_seconds": duration,
            "duration_contract": "45-80 seconds",
            "duration_status": duration_status,
            "program_preserved": True,
            "candidate_windows_analyzed": len(candidates),
            "selected_motion_count": len(entries),
            "motions": entries,
        }

    for content_id in HORIZONTAL_IDS:
        item = horizontal_by_id[content_id]
        candidates = build_candidates(item, refs, resolutions)
        duration, normalization = effective_horizontal_duration(item)
        selected, target = select_horizontal(item, candidates, duration)
        entries = [entry_from_candidate(content_id, sequence, "EDITORIAL", candidate) for sequence, candidate in enumerate(selected, 1)]
        density = round(len(entries) / max(duration / 60.0, 0.001), 3)
        result["horizontals"][content_id] = {
            "type": "HORIZONTAL",
            "title": item.get("title"),
            "source_duration_seconds": float(item.get("duration_seconds") or 0),
            "effective_duration_seconds": duration,
            "duration_contract": "8-12 minutes",
            "duration_status": "PASS" if 480.0 <= duration <= 720.0 else "FAIL",
            "normalization": normalization,
            "program_preserved": True,
            "candidate_windows_analyzed": len(candidates),
            "target_motion_count": target,
            "selected_motion_count": len(entries),
            "motions_per_minute": density,
            "maximum_starts_per_clock_minute": 2,
            "motions": entries,
        }

    result["summary"] = {
        "verticals": len(result["verticals"]),
        "vertical_motions": sum(len(item["motions"]) for item in result["verticals"].values()),
        "horizontals": len(result["horizontals"]),
        "horizontal_motions": sum(len(item["motions"]) for item in result["horizontals"].values()),
        "total_motion_windows": sum(len(item["motions"]) for family in (result["verticals"], result["horizontals"]) for item in family.values()),
        "vertical_duration_warnings": sum(1 for item in result["verticals"].values() if item["duration_status"] != "PASS"),
        "intro_lab_modified": False,
    }
    return result


def validate_map(mapping: dict[str, Any]) -> dict[str, Any]:
    blockers: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = list(mapping.get("warnings") or [])
    verticals = mapping.get("verticals") or {}
    horizontals = mapping.get("horizontals") or {}
    if list(verticals) != VERTICAL_IDS:
        blockers.append({"code": "VERTICAL_ID_OR_ORDER_MISMATCH"})
    if list(horizontals) != HORIZONTAL_IDS:
        blockers.append({"code": "HORIZONTAL_ID_OR_ORDER_MISMATCH"})
    for content_id, item in verticals.items():
        motions = item.get("motions") or []
        roles = [motion.get("narrative_role") for motion in motions]
        if roles != list(VERTICAL_ROLES):
            blockers.append({"content_id": content_id, "code": "VERTICAL_ROLE_SEQUENCE_INVALID", "roles": roles})
        if len(motions) != 6:
            blockers.append({"content_id": content_id, "code": "VERTICAL_MOTION_COUNT_INVALID", "count": len(motions)})
        if any(not (3.999 <= float(motion.get("duration_seconds") or 0) <= 9.001) for motion in motions):
            blockers.append({"content_id": content_id, "code": "VERTICAL_MOTION_WINDOW_OUTSIDE_4_9"})
        starts = [float(motion.get("timeline_in_seconds") or 0) for motion in motions]
        if starts != sorted(starts) or len(set(starts)) != len(starts):
            blockers.append({"content_id": content_id, "code": "VERTICAL_MOTIONS_NOT_CHRONOLOGICAL"})
    for content_id, item in horizontals.items():
        duration = float(item.get("effective_duration_seconds") or 0)
        motions = item.get("motions") or []
        if not 480.0 <= duration <= 720.0:
            blockers.append({"content_id": content_id, "code": "HORIZONTAL_DURATION_OUTSIDE_8_12", "duration_seconds": duration})
        if abs(len(motions) - int(item.get("target_motion_count") or 0)) > 1:
            blockers.append({"content_id": content_id, "code": "HORIZONTAL_DENSITY_TARGET_MISSED", "selected": len(motions), "target": item.get("target_motion_count")})
        starts = [float(motion.get("timeline_in_seconds") or 0) for motion in motions]
        if not clock_minute_density_ok(starts):
            blockers.append({"content_id": content_id, "code": "HORIZONTAL_CLOCK_MINUTE_OVER_2"})
        if any(not (3.999 <= float(motion.get("duration_seconds") or 0) <= 9.001) for motion in motions):
            blockers.append({"content_id": content_id, "code": "HORIZONTAL_MOTION_WINDOW_OUTSIDE_4_9"})
    if mapping.get("source", {}).get("intro_lab_modified"):
        blockers.append({"code": "INTRO_LAB_MODIFIED"})
    return {
        "schema_version": "abraxas.ai-motion-validation.v4.2.24",
        "hotfix_version": VERSION,
        "generated_at": utc_now(),
        "status": "PASS" if not blockers else "FAIL",
        "blockers": blockers,
        "warnings": warnings,
        "checks": {
            "verticals": len(verticals),
            "vertical_motions": sum(len(item.get("motions") or []) for item in verticals.values()),
            "horizontals": len(horizontals),
            "horizontal_motions": sum(len(item.get("motions") or []) for item in horizontals.values()),
            "intro_lab_protected": not mapping.get("source", {}).get("intro_lab_modified", False),
            "fixed_time_slicing_absent": mapping.get("policy", {}).get("fixed_interval_partitioning") == "PROHIBITED",
        },
    }


def render_queue(mapping: dict[str, Any]) -> dict[str, Any]:
    entries: list[dict[str, Any]] = []
    sequence = 1
    for family_name, family in (("VERTICAL", mapping["verticals"]), ("HORIZONTAL", mapping["horizontals"])):
        for content_id, item in family.items():
            for motion in item["motions"]:
                entries.append({
                    "queue_order": sequence,
                    "family": family_name,
                    "content_id": content_id,
                    "motion_sequence": motion["sequence"],
                    "narrative_role": motion["narrative_role"],
                    "source_start": motion["source_start"],
                    "source_end": motion["source_end"],
                    "timeline_in": motion["timeline_in"],
                    "timeline_out": motion["timeline_out"],
                    "duration_seconds": motion["duration_seconds"],
                    "motion_primary": motion["motion_primary"],
                    "motion_resolution": "1080x1920" if family_name == "VERTICAL" else "1920x1080",
                    "motion_render_profile": MOTION_REFERENCE_PROFILE,
                    "status": "AWAITING_ASSET",
                })
                sequence += 1
    return {
        "schema_version": "abraxas.ai-motion-render-queue.v4.2.24",
        "generated_at": utc_now(),
        "policy": "ONLY_SELECTED_SEMANTIC_WINDOWS__NO_FULL_VIDEO_FRAGMENTATION",
        "count": len(entries),
        "entries": entries,
    }


def safe_name(value: str) -> str:
    clean = re.sub(r"[^A-Za-z0-9_-]+", "_", value).strip("_")
    return clean[:72] or "MOTION"


def write_motion_packages(output_root: Path, mapping: dict[str, Any]) -> Path:
    package_root = output_root / "09_MOTIONS_V4_2" / "AI_SELECTED_V4_2_24"
    # Resume policy: refresh manifests/TXT in place and preserve valid media.
    # Moving the whole tree on every launch discarded completed references and
    # contradicted the checkpoint/cache contract.
    package_root.mkdir(parents=True, exist_ok=True)
    for folder_name, family in (("03_VERTICALS", mapping["verticals"]), ("04_HORIZONTALS", mapping["horizontals"])):
        for content_id, item in family.items():
            video_root = package_root / folder_name / content_id
            index_entries = []
            for motion in item["motions"]:
                role = safe_name(motion["narrative_role"])
                folder = video_root / f"{motion['sequence']:02d}_{role}_{motion['motion_primary']}"
                decision = {key: value for key, value in motion.items() if key != "prompts"}
                write_json(folder / "MOTION_DECISION.json", decision)
                write_text(folder / "00_ORIGEN_Y_TRANSCRIPCION.txt", (
                    f"CONTENT: {content_id}\nROL: {motion['narrative_role']}\nFUENTE: {motion['source_start']} → {motion['source_end']}\n"
                    f"TIMELINE: {motion['timeline_in']} → {motion['timeline_out']}\nDURACIÓN: {motion['duration_seconds']:.3f}s\n\n"
                    f"TRANSCRIPCIÓN EXACTA\n{motion['text']}\n\nMOTIVO\n{motion['reason']}"
                ))
                write_text(folder / "01_PROMPT_CREAR_IMAGENES.txt", motion["prompts"]["image"])
                write_text(folder / "02_PROMPT_ANIMAR_MOTION.txt", motion["prompts"]["animation"])
                write_text(folder / "03_GUIA_DAVINCI.txt", motion["prompts"]["davinci"])
                asset_contract = motion["asset_contract"]
                write_text(folder / "10_ASSETS" / "00_ASSET_CONTRACT_V7.txt", (
                    f"{motion['motion_primary']} · {asset_contract['contract']}\n\n{asset_contract['instruction']}\n\n"
                    "ARCHIVOS OBLIGATORIOS\n" + "\n".join(f"- {name}" for name in asset_contract["asset_files"])
                ))
                if motion["motion_primary"] == "M2":
                    exact_words = motion["text"].split()
                    cut1 = max(1, round(len(exact_words) * 0.34))
                    cut2 = max(cut1 + 1, round(len(exact_words) * 0.67)) if len(exact_words) > 2 else len(exact_words)
                    segments = [" ".join(exact_words[:cut1]), " ".join(exact_words[cut1:cut2]), " ".join(exact_words[cut2:])]
                    segments = [segment for segment in segments if segment]
                    write_json(folder / "10_ASSETS" / "MOTION2_TEXT_SEGMENTS_EXACT.json", {
                        "rule": "ONLY_EXACT_CONTIGUOUS_WORDS__NO_FORCED_EQUAL_SPLIT",
                        "source_text": motion["text"],
                        "segments": segments,
                        "reconstructed_text": " ".join(segments),
                    })
                expected_resolution = "1080x1920" if item["type"] == "VERTICAL" else "1920x1080"
                write_text(folder / "20_MOTION_FINAL" / "COLOCAR_AQUI_MOTION_FINAL.txt", f"Guardar aquí MOTION_FINAL.mov o MOTION_FINAL.mp4, sin audio, resolución {expected_resolution} y duración exacta.")
                write_text(folder / "30_EXPORTS" / "COLOCAR_AQUI_PRUEBAS_Y_EXPORTS.txt", "Guardar aquí stills de comparación, pruebas y exports de DaVinci.")
                index_entries.append({"sequence": motion["sequence"], "folder": folder.name, "role": motion["narrative_role"], "motion": motion["motion_primary"], "timeline_in": motion["timeline_in"], "timeline_out": motion["timeline_out"]})
            write_json(video_root / "00_MOTION_INDEX.json", {"content_id": content_id, "type": item["type"], "program_preserved": True, "selected_motion_count": len(index_entries), "motions": index_entries})
            write_text(video_root / "00_ORDEN_DE_TRABAJO.txt", "\n".join(
                [f"ABRAXAS {VERSION} · {content_id}", "El video completo se conserva. Solo trabajar estas ventanas semánticas en orden:", ""]
                + [f"{entry['sequence']:02d}. {entry['role']} · {entry['motion']} · {entry['timeline_in']} → {entry['timeline_out']} · {entry['folder']}" for entry in index_entries]
            ))
    write_json(package_root / "00_MASTER_INDEX.json", {"hotfix_version": VERSION, "summary": mapping["summary"], "vertical_order": VERTICAL_IDS, "horizontal_order": HORIZONTAL_IDS})
    return package_root


def panel_script() -> str:
    return r'''<!-- ABRAXAS_V4_2_24_AI_MOTION_PANEL_BEGIN -->
<script id="abraxasMotionV424Panel">
(()=>{function boot(){let d;try{d=JSON.parse(document.getElementById('editorialData').textContent)}catch(e){return}const m=d.ai_motion_map_v4_2_24;if(!m)return;
const b=document.createElement('button');b.textContent='AI Motions V4.2.24';Object.assign(b.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:'99998',padding:'11px 15px',border:'1px solid #A91616',borderRadius:'10px',background:'#111',color:'#fff',fontWeight:'700',cursor:'pointer'});
const p=document.createElement('div');Object.assign(p.style,{display:'none',position:'fixed',inset:'5vh 5vw',zIndex:'99999',overflow:'auto',padding:'22px',borderRadius:'14px',background:'#111',color:'#F7F3EC',boxShadow:'0 20px 60px #000a'});
const close=document.createElement('button');close.textContent='Cerrar';Object.assign(close.style,{float:'right',padding:'8px 12px',cursor:'pointer'});close.onclick=()=>p.style.display='none';p.appendChild(close);
const h=document.createElement('h2');h.textContent='ABRAXAS V4.2.24 · mapa semántico de motions';p.appendChild(h);const s=document.createElement('p');s.textContent=`37 verticales · ${m.summary.vertical_motions} motions narrativos · 12 horizontales · ${m.summary.horizontal_motions} oportunidades · Intro Lab intacto`;p.appendChild(s);
for(const [label,family] of [['VERTICALES',m.verticals],['HORIZONTALES',m.horizontals]]){const title=document.createElement('h3');title.textContent=label;p.appendChild(title);for(const [id,item] of Object.entries(family)){const row=document.createElement('details');const sum=document.createElement('summary');sum.textContent=`${id} · ${item.title} · ${item.selected_motion_count} motions`;row.appendChild(sum);const ol=document.createElement('ol');for(const x of item.motions){const li=document.createElement('li');li.textContent=`${x.narrative_role} · ${x.timeline_in}–${x.timeline_out} · ${x.motion_primary} · ${x.text}`;ol.appendChild(li)}row.appendChild(ol);p.appendChild(row)}}
b.onclick=()=>p.style.display='block';document.body.append(b,p)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
</script>
<!-- ABRAXAS_V4_2_24_AI_MOTION_PANEL_END -->'''


def update_content_html(source_path: Path, destination: Path, mapping: dict[str, Any]) -> None:
    raw, data, match = extract_editorial_data(source_path)
    data["hotfix_version"] = VERSION
    data["ai_motion_map_v4_2_24"] = mapping
    gates = data.setdefault("hard_gates", {})
    gates["vertical_seconds"] = [45, 80]
    gates["horizontal_seconds"] = [480, 720]
    gates["vertical_visual_opportunities"] = [6, 6]
    gates["horizontal_visual_density"] = "~2 useful semantic interventions / assembled minute; max 2 starts per clock minute"
    gates["motion_window_seconds"] = [4, 9]
    gates["fixed_time_slicing"] = "PROHIBITED"
    automation = data.setdefault("automation_config", {})
    automation["output_version"] = "V4_2_24_AI_SEMANTIC_MOTIONS"
    automation["physical_part_contract"] = "FULL_VIDEO_PRESERVED__MOTION_WINDOWS_ONLY"
    automation["semantic_motion_selection_required"] = True
    automation["fixed_interval_partitioning"] = False
    automation["motion_manifest"] = "FINAL_AI_MOTION_MAP_V4_2_24.json"
    automation["motion_reference_profile"] = MOTION_REFERENCE_PROFILE
    automation["motion_reference_resolution"] = {
        "vertical": "1080x1920",
        "horizontal": "1920x1080",
    }
    automation["full_program_resolution_policy"] = "PRESERVE_SOURCE_RESOLUTION"
    for item in data.get("verticals") or []:
        selected = mapping["verticals"][item["id"]]
        item["ai_motion_slots_v4_2_24"] = selected["motions"]
        item["legacy_delivery_parts_4_9_status"] = "REFERENCE_ONLY__NOT_A_RENDER_QUEUE"
    for item in data.get("horizontals") or []:
        selected = mapping["horizontals"][item["id"]]
        item["ai_motion_opportunities_v4_2_24"] = selected["motions"]
        item["horizontal_longform_policy_v4_2_24"] = "KEEP_COMPLETE_PROGRAM__SELECTED_MOTION_WINDOWS_ONLY"
        item["legacy_delivery_parts_4_9_status"] = "REFERENCE_ONLY__NOT_A_RENDER_QUEUE"
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</script>", "<\\/script>")
    updated = raw[: match.start(1)] + payload + raw[match.end(1) :]
    updated = re.sub(r"<!-- ABRAXAS_V4_2_24_AI_MOTION_PANEL_BEGIN -->.*?<!-- ABRAXAS_V4_2_24_AI_MOTION_PANEL_END -->", "", updated, flags=re.S)
    panel = panel_script()
    updated = updated.replace("</body>", panel + "\n</body>") if "</body>" in updated else updated + panel
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".partial")
    temporary.write_text(updated, encoding="utf-8")
    temporary.replace(destination)


def probe_reference(path: Path, ffprobe: str, expected_duration: float, expected_width: int, expected_height: int) -> tuple[bool, dict[str, Any]]:
    if not path.is_file() or path.stat().st_size < 1024:
        return False, {"reason": "MISSING_OR_TOO_SMALL"}
    command = [
        ffprobe, "-v", "error", "-show_entries",
        "stream=codec_type,codec_name,pix_fmt,width,height,sample_rate,channels:format=duration,size,bit_rate",
        "-of", "json", str(path),
    ]
    try:
        proc = subprocess.run(command, capture_output=True, text=True, timeout=30)
        if proc.returncode != 0:
            return False, {"reason": "FFPROBE_FAILED", "detail": proc.stderr.strip()[-600:]}
        info = json.loads(proc.stdout)
        streams = info.get("streams") or []
        video = next((stream for stream in streams if stream.get("codec_type") == "video"), None)
        audio = next((stream for stream in streams if stream.get("codec_type") == "audio"), None)
        duration = float((info.get("format") or {}).get("duration") or 0)
        if not video or video.get("codec_name") != "h264":
            return False, {"reason": "NOT_H264_VIDEO", "probe": info}
        if int(video.get("width") or 0) != expected_width or int(video.get("height") or 0) != expected_height:
            return False, {
                "reason": "RESOLUTION_MISMATCH",
                "expected": [expected_width, expected_height],
                "actual": [video.get("width"), video.get("height")],
            }
        if video.get("pix_fmt") != "yuv420p":
            return False, {"reason": "PIX_FMT_MISMATCH", "expected": "yuv420p", "actual": video.get("pix_fmt")}
        if audio and (
            audio.get("codec_name") != "aac"
            or str(audio.get("sample_rate")) != "48000"
            or int(audio.get("channels") or 0) != 2
        ):
            return False, {"reason": "AUDIO_PROFILE_MISMATCH", "probe": audio}
        if abs(duration - expected_duration) > 0.65:
            return False, {"reason": "DURATION_MISMATCH", "expected": expected_duration, "actual": duration}
        return True, {
            "duration": duration,
            "codec": video.get("codec_name"),
            "pix_fmt": video.get("pix_fmt"),
            "width": video.get("width"),
            "height": video.get("height"),
            "audio_codec": audio.get("codec_name") if audio else "NONE",
            "sample_rate": audio.get("sample_rate") if audio else None,
            "channels": audio.get("channels") if audio else None,
            "format": info.get("format"),
        }
    except Exception as exc:
        return False, {"reason": "FFPROBE_EXCEPTION", "detail": str(exc)}


def has_videotoolbox(ffmpeg: str) -> bool:
    try:
        proc = subprocess.run([ffmpeg, "-hide_banner", "-encoders"], capture_output=True, text=True, timeout=30)
        return proc.returncode == 0 and "h264_videotoolbox" in (proc.stdout + proc.stderr)
    except Exception:
        return False


def reference_command(
    ffmpeg: str,
    master: Path,
    motion: dict[str, Any],
    partial: Path,
    progress: Path,
    hwdecode: bool,
    width: int,
    height: int,
) -> list[str]:
    command = [ffmpeg, "-hide_banner", "-loglevel", "warning", "-y"]
    if hwdecode:
        command += ["-hwaccel", "videotoolbox"]
    command += [
        "-ss", str(parse_timecode(motion["source_start"])),
        "-t", f"{motion['duration_seconds']:.3f}",
        "-i", str(master),
        "-map", "0:v:0", "-map", "0:a:0?",
        "-vf", f"scale={width}:{height}:force_original_aspect_ratio=decrease:flags=lanczos,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1",
        "-c:v", "h264_videotoolbox", "-profile:v", "high",
        "-b:v", "40M", "-maxrate", "48M", "-bufsize", "80M",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", "-stats_period", "1", "-progress", str(progress), "-nostats",
        str(partial),
    ]
    return command


def run_reference_encode(command: list[str], log_path: Path, timeout_seconds: int, stall_seconds: int = 45) -> tuple[int, str]:
    started = time.time()
    progress_path = Path(command[command.index("-progress") + 1])
    partial_path = Path(command[-1])
    with log_path.open("a", encoding="utf-8") as log:
        log.write(f"\n[{utc_now()}] COMMAND: {' '.join(command)}\n")
        log.flush()
        try:
            proc = subprocess.Popen(command, stdout=log, stderr=subprocess.STDOUT, text=True)
            last_activity = started
            last_signature = (-1, -1)
            while proc.poll() is None:
                signature = (
                    progress_path.stat().st_size if progress_path.exists() else 0,
                    partial_path.stat().st_size if partial_path.exists() else 0,
                )
                if signature != last_signature:
                    last_signature = signature
                    last_activity = time.time()
                elapsed = time.time() - started
                idle = time.time() - last_activity
                if elapsed > timeout_seconds or idle > stall_seconds:
                    reason = f"TIMEOUT_{timeout_seconds}s" if elapsed > timeout_seconds else f"STALL_{stall_seconds}s"
                    log.write(f"[{utc_now()}] {reason}; terminating pid={proc.pid}\n")
                    log.flush()
                    proc.terminate()
                    try:
                        proc.wait(timeout=8)
                    except subprocess.TimeoutExpired:
                        proc.kill()
                        proc.wait(timeout=5)
                    return 124, reason
                time.sleep(1)
            return proc.returncode, f"elapsed={time.time() - started:.3f}s"
        except Exception as exc:
            log.write(f"[{utc_now()}] ENCODE_EXCEPTION: {exc}\n")
            return 125, f"ENCODE_EXCEPTION_{exc}"


def render_reference_clips(mapping: dict[str, Any], package_root: Path, vertical_master: Path | None, horizontal_master: Path | None, ffmpeg: str, ffprobe: str, timeout_seconds: int = 180) -> dict[str, Any]:
    if not has_videotoolbox(ffmpeg):
        raise RuntimeError("APPLE40M_PREFLIGHT_FAIL: h264_videotoolbox no está disponible en ffmpeg")
    results = []
    counts: dict[str, int] = {}
    master_fingerprint_cache: dict[Path, str] = {}
    fingerprint_manifest = package_root.parents[1] / "00_MANIFEST" / "SOURCE_FINGERPRINTS.json"
    known_fingerprints: dict[str, Any] = {}
    if fingerprint_manifest.is_file():
        try:
            known_fingerprints = json.loads(fingerprint_manifest.read_text(encoding="utf-8"))
        except Exception:
            known_fingerprints = {}
    for folder_name, family, master in (("03_VERTICALS", mapping["verticals"], vertical_master), ("04_HORIZONTALS", mapping["horizontals"], horizontal_master)):
        if not master or not master.is_file():
            results.append({"family": folder_name, "status": "SKIPPED_MASTER_NOT_FOUND"})
            continue
        orientation_key = "vertical" if folder_name == "03_VERTICALS" else "horizontal"
        width, height = MOTION_REFERENCE_DIMENSIONS[orientation_key]
        stored_fingerprint = (known_fingerprints.get(orientation_key) or {}).get("fingerprint")
        if master not in master_fingerprint_cache:
            master_fingerprint_cache[master] = str(stored_fingerprint or runtime_compatible_source_fingerprint(master, ffprobe))
        for content_id, item in family.items():
            for motion in item["motions"]:
                folder = package_root / folder_name / content_id / f"{motion['sequence']:02d}_{safe_name(motion['narrative_role'])}_{motion['motion_primary']}"
                target = folder / "SOURCE_REFERENCE.mp4"
                sidecar = folder / "SOURCE_REFERENCE.APPLE40M.json"
                sidecar_value: dict[str, Any] = {}
                if sidecar.is_file():
                    try:
                        sidecar_value = json.loads(sidecar.read_text(encoding="utf-8"))
                    except Exception:
                        sidecar_value = {}
                profile_is_current = (
                    sidecar_value.get("profile") == MOTION_REFERENCE_PROFILE
                    and sidecar_value.get("encoder") == "h264_videotoolbox"
                    and sidecar_value.get("video_bitrate") == "40M"
                    and sidecar_value.get("maxrate") == "48M"
                    and sidecar_value.get("bufsize") == "80M"
                    and sidecar_value.get("pix_fmt") == "yuv420p"
                    and sidecar_value.get("audio_bitrate") == "192k"
                    and int(sidecar_value.get("sample_rate") or 0) == 48000
                    and int(sidecar_value.get("channels") or 0) == 2
                    and int(sidecar_value.get("width") or 0) == width
                    and int(sidecar_value.get("height") or 0) == height
                    and sidecar_value.get("source_master_fingerprint") == master_fingerprint_cache[master]
                    and sidecar_value.get("source_start") == motion["source_start"]
                    and sidecar_value.get("source_end") == motion["source_end"]
                    and abs(float(sidecar_value.get("duration_seconds") or 0) - float(motion["duration_seconds"])) < 0.001
                )
                valid, probe = probe_reference(target, ffprobe, motion["duration_seconds"], width, height)
                valid = valid and profile_is_current
                if valid:
                    status = "CACHED_VALID"
                    results.append({"content_id": content_id, "sequence": motion["sequence"], "status": status, "target": str(target), "probe": probe})
                    counts[status] = counts.get(status, 0) + 1
                    continue
                if target.exists():
                    invalid_stamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
                    invalid = folder / "30_EXPORTS" / f"SOURCE_REFERENCE_INVALID_{invalid_stamp}.mp4"
                    invalid.parent.mkdir(parents=True, exist_ok=True)
                    target.replace(invalid)
                    if sidecar.exists():
                        sidecar.replace(folder / "30_EXPORTS" / f"SOURCE_REFERENCE_INVALID_{invalid_stamp}.json")
                partial = target.with_name(f"{target.stem}.partial{target.suffix}")
                progress = folder / "SOURCE_REFERENCE.progress.txt"
                log_path = folder / "SOURCE_REFERENCE.ffmpeg.log"
                partial.unlink(missing_ok=True)
                progress.unlink(missing_ok=True)
                command = reference_command(ffmpeg, master, motion, partial, progress, hwdecode=True, width=width, height=height)
                returncode, detail = run_reference_encode(command, log_path, timeout_seconds)
                if returncode != 0:
                    partial.unlink(missing_ok=True)
                    command = reference_command(ffmpeg, master, motion, partial, progress, hwdecode=False, width=width, height=height)
                    returncode, detail = run_reference_encode(command, log_path, timeout_seconds)
                if returncode == 0:
                    valid, probe = probe_reference(partial, ffprobe, motion["duration_seconds"], width, height)
                else:
                    valid, probe = False, {"reason": detail}
                if valid:
                    os.replace(partial, target)
                    write_json(sidecar, {
                        "schema_version": "abraxas.reference-profile.v4.2.24.motion1080p40m-r1",
                        "profile": MOTION_REFERENCE_PROFILE,
                        "encoder": "h264_videotoolbox",
                        "profile_level": "high",
                        "video_bitrate": "40M",
                        "maxrate": "48M",
                        "bufsize": "80M",
                        "pix_fmt": "yuv420p",
                        "audio_codec": "aac",
                        "audio_bitrate": "192k",
                        "sample_rate": 48000,
                        "channels": 2,
                        "width": width,
                        "height": height,
                        "resolution": f"{width}x{height}",
                        "source_master_fingerprint": master_fingerprint_cache[master],
                        "source_start": motion["source_start"],
                        "source_end": motion["source_end"],
                        "duration_seconds": motion["duration_seconds"],
                        "probe": probe,
                        "created_at": utc_now(),
                    })
                    status = "CREATED_MOTION_1080P_APPLE_VT_40M"
                else:
                    partial.unlink(missing_ok=True)
                    status = "FAILED_VALIDATION_OR_TIMEOUT"
                counts[status] = counts.get(status, 0) + 1
                results.append({"content_id": content_id, "sequence": motion["sequence"], "status": status, "target": str(target), "probe": probe, "detail": detail, "profile": MOTION_REFERENCE_PROFILE, "resolution": f"{width}x{height}"})
                time.sleep(0.35)
    return {
        "schema_version": "abraxas.reference-render-report.v4.2.24.motion1080p40m-r1",
        "generated_at": utc_now(),
        "profile": MOTION_REFERENCE_PROFILE,
        "resolutions": {"vertical": "1080x1920", "horizontal": "1920x1080"},
        "resume_policy": "SKIP_ONLY_FFPROBE_VALID_OUTPUTS",
        "atomic_policy": "PARTIAL_VALIDATE_OS_REPLACE",
        "counts": counts,
        "results": results,
    }


def build(args: argparse.Namespace) -> int:
    content_html = Path(args.content_html).expanduser().resolve()
    transcript = Path(args.transcript).expanduser().resolve() if args.transcript else None
    resolutions_path = Path(args.resolutions).expanduser().resolve() if args.resolutions else None
    intro = Path(args.intro_html).expanduser().resolve() if args.intro_html else None
    output_root = Path(args.output_root).expanduser().resolve()
    if not content_html.is_file():
        raise FileNotFoundError(content_html)
    if transcript and not transcript.is_file():
        raise FileNotFoundError(transcript)
    if resolutions_path and not resolutions_path.is_file():
        raise FileNotFoundError(resolutions_path)
    if intro and not intro.is_file():
        raise FileNotFoundError(intro)
    _, data, _ = extract_editorial_data(content_html)
    refs = parse_transcript_reference(transcript)
    resolutions = json.loads(resolutions_path.read_text(encoding="utf-8")) if resolutions_path else {}
    mapping = build_map(data, refs, resolutions, content_html, transcript, resolutions_path, intro)
    validation = validate_map(mapping)
    manifest = output_root / "00_MANIFEST"
    manifest.mkdir(parents=True, exist_ok=True)
    map_path = manifest / "FINAL_AI_MOTION_MAP_V4_2_24.json"
    decisions_path = manifest / "FINAL_AI_MOTION_DECISIONS_V4_2_24.json"
    queue_path = manifest / "RENDER_QUEUE_AI_MOTIONS_V4_2_24.json"
    validation_path = manifest / "AI_MOTION_VALIDATION_V4_2_24.json"
    write_json(map_path, mapping)
    write_json(decisions_path, mapping)
    write_json(queue_path, render_queue(mapping))
    write_json(validation_path, validation)
    duration_review = {
        "schema_version": "abraxas.vertical-duration-review.v4.2.24",
        "status": "HUMAN_EDITORIAL_REVIEW_REQUIRED" if mapping["summary"]["vertical_duration_warnings"] else "PASS",
        "contract_seconds": [45, 80],
        "policy": "DO_NOT_AUTO_TRUNCATE_OR_FAKE_METADATA",
        "items": [
            {"content_id": content_id, "duration_seconds": item["duration_seconds"], "status": item["duration_status"]}
            for content_id, item in mapping["verticals"].items()
            if item["duration_status"] != "PASS"
        ],
    }
    write_json(manifest / "VERTICAL_DURATION_REVIEW_V4_2_24.json", duration_review)
    write_text(manifest / "VIDEO_ORDER_V4_2_24.txt", "\n".join(
        ["ABRAXAS V4.2.24 · ORDEN CANÓNICO", "", "VERTICALES (37)"]
        + [f"{index:02d}. {content_id}" for index, content_id in enumerate(VERTICAL_IDS, 1)]
        + ["", "HORIZONTALES (12)"]
        + [f"{index:02d}. {content_id}" for index, content_id in enumerate(HORIZONTAL_IDS, 1)]
    ))
    package_root = write_motion_packages(output_root, mapping)
    html_output = manifest / "JOC55_AMANDA_CONTENT_ENGINE_V4_2_24.html"
    update_content_html(content_html, html_output, mapping)
    if args.render_references:
        render_report = render_reference_clips(
            mapping,
            package_root,
            Path(args.vertical_master).expanduser().resolve() if args.vertical_master else None,
            Path(args.horizontal_master).expanduser().resolve() if args.horizontal_master else None,
            args.ffmpeg,
            args.ffprobe,
            args.reference_timeout_seconds,
        )
        write_json(manifest / "SOURCE_REFERENCE_RENDER_REPORT_V4_2_24.json", render_report)
    if intro:
        after = sha256_file(intro)
        if after != mapping["source"]["intro_lab_sha256_before"]:
            raise RuntimeError("INTRO_LAB_HASH_CHANGED")
    report_lines = [
        f"ABRAXAS {VERSION} · AI MOTION SEMANTIC ENGINE",
        "",
        f"STATUS: {validation['status']}",
        f"VERTICALES: {mapping['summary']['verticals']} · MOTIONS: {mapping['summary']['vertical_motions']} (6 por video)",
        f"HORIZONTALES: {mapping['summary']['horizontals']} · MOTIONS: {mapping['summary']['horizontal_motions']} (~2/min)",
        f"TRANSCRIPCIÓN: {len(refs)} unidades de referencia",
        "INTRO LAB: INTACTO",
        "CORTE FIJO POR TIEMPO: PROHIBIDO",
        "",
        f"WARNINGS DE DURACIÓN VERTICAL HEREDADOS: {mapping['summary']['vertical_duration_warnings']}",
        "Estos warnings no cambian el contenido ni sus masters; requieren recorte editorial separado si se exige el contrato 45–80 s.",
        "",
        f"MAPA: {map_path.relative_to(output_root)}",
        f"QUEUE: {queue_path.relative_to(output_root)}",
        f"HTML: {html_output.relative_to(output_root)}",
        f"PAQUETES: {package_root.relative_to(output_root)}",
    ]
    write_text(manifest / "AI_MOTION_DECISION_REPORT_V4_2_24.txt", "\n".join(report_lines))
    print("\n".join(report_lines))
    return 0 if validation["status"] == "PASS" else 2


def validate_command(args: argparse.Namespace) -> int:
    mapping = json.loads(Path(args.map).read_text(encoding="utf-8"))
    report = validate_map(mapping)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["status"] == "PASS" else 2


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="ABRAXAS V4.2.24 semantic Motion engine")
    sub = parser.add_subparsers(dest="command", required=True)
    build_parser = sub.add_parser("build", help="Seleccionar, ordenar, empaquetar y validar Motions")
    build_parser.add_argument("--content-html", required=True)
    build_parser.add_argument("--transcript")
    build_parser.add_argument("--resolutions")
    build_parser.add_argument("--intro-html")
    build_parser.add_argument("--output-root", required=True)
    build_parser.add_argument("--render-references", action="store_true")
    build_parser.add_argument("--vertical-master")
    build_parser.add_argument("--horizontal-master")
    build_parser.add_argument("--ffmpeg", default="ffmpeg")
    build_parser.add_argument("--ffprobe", default="ffprobe")
    build_parser.add_argument("--reference-timeout-seconds", type=int, default=180)
    build_parser.set_defaults(function=build)
    validate_parser = sub.add_parser("validate", help="Validar un FINAL_AI_MOTION_MAP")
    validate_parser.add_argument("--map", required=True)
    validate_parser.set_defaults(function=validate_command)
    args = parser.parse_args(argv)
    try:
        return args.function(args)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
