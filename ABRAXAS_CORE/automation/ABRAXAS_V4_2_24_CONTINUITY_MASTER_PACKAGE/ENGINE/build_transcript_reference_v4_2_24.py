#!/usr/bin/env python3
"""Create a complete, lossless, <=9 s transcript Motion reference.

This file is deliberately independent from the semantic render queue.  It is a
catalogue for review and future searches, not an instruction to render a Motion
at every interval.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from ai_motion_engine_v4_2_24 import format_timecode, parse_transcript_reference, utc_now, write_json, write_text


VERSION = "V4.2.24"


@dataclass
class Window:
    start: float
    end: float
    text: str
    source_ids: list[str]


def normalized_tokens(text: str) -> list[str]:
    return re.findall(r"\w+", text.casefold(), flags=re.UNICODE)


def split_long(start: float, end: float, text: str, source_id: str) -> list[Window]:
    duration = end - start
    count = max(1, math.ceil(duration / 9.0))
    if count == 1:
        return [Window(start, end, text, [source_id])]
    words = text.split()
    if not words:
        return [Window(start + duration * index / count, start + duration * (index + 1) / count, "", [source_id]) for index in range(count)]
    result: list[Window] = []
    for index in range(count):
        word_start = round(len(words) * index / count)
        word_end = round(len(words) * (index + 1) / count)
        if word_end <= word_start:
            word_end = min(len(words), word_start + 1)
        slice_start = start + duration * index / count
        slice_end = start + duration * (index + 1) / count
        result.append(Window(slice_start, slice_end, " ".join(words[word_start:word_end]), [source_id]))
    return [window for window in result if window.text]


def build_windows(source_path: Path) -> tuple[list[Window], dict[str, object]]:
    refs = parse_transcript_reference(source_path)
    pieces: list[Window] = []
    for ref in refs:
        pieces.extend(split_long(ref.start, ref.end, ref.text, ref.ref_id))
    windows: list[Window] = []
    for piece in pieces:
        if windows:
            prior = windows[-1]
            gap = piece.start - prior.end
            combined_span = piece.end - prior.start
            if -0.05 <= gap <= 0.80 and combined_span <= 9.0001:
                prior.end = piece.end
                prior.text = (prior.text + " " + piece.text).strip()
                prior.source_ids.extend(piece.source_ids)
                continue
        windows.append(piece)
    source_tokens = [token for ref in refs for token in normalized_tokens(ref.text)]
    output_tokens = [token for window in windows for token in normalized_tokens(window.text)]
    qa = {
        "schema_version": "abraxas.transcript-motion-reference-qa.v4.2.24",
        "generated_at": utc_now(),
        "source": source_path.name,
        "source_cues": len(refs),
        "reference_windows": len(windows),
        "maximum_window_seconds": round(max((window.end - window.start for window in windows), default=0.0), 3),
        "all_windows_at_most_9_seconds": all(window.end - window.start <= 9.001 for window in windows),
        "source_token_count": len(source_tokens),
        "output_token_count": len(output_tokens),
        "lossless_normalized_token_sequence": source_tokens == output_tokens,
    }
    qa["status"] = "PASS" if qa["all_windows_at_most_9_seconds"] and qa["lossless_normalized_token_sequence"] else "FAIL"
    return windows, qa


def possible_motion(text: str) -> tuple[str, str]:
    low = text.casefold()
    if any(term in low for term in ("aplicación", "software", "datos", "sistema", "plataforma", "algoritmo")):
        return "M6", "posible flujo verificable de input, proceso y output"
    if any(term in low for term in ("paso", "proceso", "depende", "relación", "parte", "primero", "segundo")):
        return "M4", "posible proceso o relación para una infografía maestra"
    if any(term in low for term in ("hacer", "trabajar", "practicar", "construir", "viajar", "caminar")):
        return "M5", "posible acción física en plano general, detalle y resultado"
    if any(term in low for term in ("nunca", "siempre", "pero", "nadie", "verdad", "problema")) or "?" in text:
        return "M3", "posible tesis, contradicción o payoff tipográfico"
    if len(text.split()) >= 12:
        return "M2", "posible evolución progresiva con palabras exactas contiguas"
    return "M1", "posible apoyo documental con placa flexible y close-ups"


def write_reference(destination: Path, windows: list[Window], qa: dict[str, object]) -> None:
    lines = [
        f"ABRAXAS {VERSION} · TRANSCRIPCIÓN MAESTRA DIVIDIDA EN VENTANAS DE HASTA 9 SEGUNDOS",
        "",
        "ESTADO GLOBAL: REFERENCIA ÚNICAMENTE",
        "PROHIBIDO interpretar este documento como cola de render o como orden de crear un Motion cada 9 segundos.",
        "El mapa creativo ejecutable es FINAL_AI_MOTION_MAP_V4_2_24.json.",
        "",
        f"VENTANAS: {len(windows)}",
        f"QA: {qa['status']} · pérdida de palabras: {'NO' if qa['lossless_normalized_token_sequence'] else 'SÍ'} · máximo: {qa['maximum_window_seconds']:.3f}s",
        "",
    ]
    for index, window in enumerate(windows, 1):
        motion, reason = possible_motion(window.text)
        lines.extend([
            f"MREF_{index:04d}",
            f"TIMECODE_FUENTE: {format_timecode(window.start)} --> {format_timecode(window.end)}",
            f"DURACION: {window.end - window.start:.3f}s",
            "ESTADO: REFERENCE_ONLY__NOT_RENDER_INSTRUCTION",
            f"CUES_FUENTE: {', '.join(window.source_ids)}",
            f"TRANSCRIPCION: {window.text}",
            f"MOTION_POSIBLE: {motion}",
            f"MOTIVO_REFERENCIAL: {reason}; requiere decisión semántica en contexto antes de producirse",
            "",
        ])
    write_text(destination, "\n".join(lines))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Crear referencia completa de transcripción en ventanas <=9 s")
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--qa-output", required=True)
    args = parser.parse_args(argv)
    source = Path(args.source).expanduser().resolve()
    windows, qa = build_windows(source)
    write_reference(Path(args.output).expanduser().resolve(), windows, qa)
    write_json(Path(args.qa_output).expanduser().resolve(), qa)
    print(json.dumps(qa, ensure_ascii=False, indent=2))
    return 0 if qa["status"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
