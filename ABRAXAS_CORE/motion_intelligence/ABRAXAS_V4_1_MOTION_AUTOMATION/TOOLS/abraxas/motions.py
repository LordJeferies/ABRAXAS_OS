from __future__ import annotations

import csv
import json
import os
import re
import subprocess
from collections import defaultdict
from pathlib import Path

from .core import (
    balanced_fragment_ranges,
    ensure_dir,
    format_timecode,
    output_partial_path,
    parse_timecode,
    read_json,
    stable_hash,
    write_json_atomic,
)


MOTION_META = {
    "M0": {
        "name": "KEEP_SOURCE",
        "placement_mode": "KEEP_SOURCE",
        "track": "V1",
        "description": "Mantener speaker/source porque es la imagen más fuerte.",
    },
    "M1": {
        "name": "FLEXIBLE_PLATE_OR_CLOSEUPS",
        "placement_mode": "COMPOSITE_BEHIND_SPEAKER",
        "track": "V2",
        "description": "Tres plates/close-ups que observan y profundizan la idea.",
    },
    "M2": {
        "name": "PROGRESSIVE_SCENE_EXACT_TEXT",
        "placement_mode": "REPLACE_VISUAL_KEEP_SOURCE_AUDIO",
        "track": "V3",
        "description": "Escena progresiva con texto exacto en tres segmentos.",
    },
    "M3": {
        "name": "EDITORIAL_TYPE",
        "placement_mode": "REPLACE_VISUAL_KEEP_SOURCE_AUDIO",
        "track": "V4",
        "description": "Golpe tipográfico editorial para tesis, contradicción o payoff.",
    },
    "M4": {
        "name": "MASTER_INFOGRAPHIC_Z",
        "placement_mode": "REPLACE_VISUAL_KEEP_SOURCE_AUDIO",
        "track": "V3",
        "description": "Una infografía master recorrida para explicar proceso/relación.",
    },
    "M5": {
        "name": "CINEMATIC_MICROSEQUENCE",
        "placement_mode": "REPLACE_VISUAL_KEEP_SOURCE_AUDIO",
        "track": "V2",
        "description": "Acción física wide → detail → result.",
    },
    "M6": {
        "name": "SOFTWARE_INPUT_PROCESS_OUTPUT",
        "placement_mode": "REPLACE_VISUAL_KEEP_SOURCE_AUDIO",
        "track": "V3",
        "description": "Proceso digital real input → process → output.",
    },
}


STATE_NAMES = ("START", "MIDDLE", "END")


def _norm_text(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def split_exact_three(text):
    """Split normalized source text into three contiguous word spans.

    The function never rewrites a token. Punctuation is used as a preferred
    boundary, but semantic review remains required for Motion 2.
    """
    source = _norm_text(text)
    words = source.split(" ") if source else []
    if len(words) < 6:
        return {
            "valid": False,
            "reason": "TOO_SHORT_FOR_THREE_MEANINGFUL_SEGMENTS",
            "segments": [],
            "reconstructed": source,
        }

    n = len(words)
    best = None
    for i in range(1, n - 1):
        for j in range(i + 1, n):
            sizes = (i, j - i, n - j)
            if min(sizes) < 1:
                continue
            balance = max(sizes) - min(sizes)
            punctuation_bonus = 0.0
            if re.search(r"[.!?;:]$", words[i - 1]):
                punctuation_bonus -= 3.0
            elif re.search(r",$", words[i - 1]):
                punctuation_bonus -= 1.5
            if re.search(r"[.!?;:]$", words[j - 1]):
                punctuation_bonus -= 3.0
            elif re.search(r",$", words[j - 1]):
                punctuation_bonus -= 1.5
            bad_starts = {"y", "o", "pero", "que", "de", "del", "la", "el", "los", "las", "un", "una"}
            start_penalty = 0.0
            if words[i].lower().strip("¿¡") in bad_starts:
                start_penalty += 1.5
            if words[j].lower().strip("¿¡") in bad_starts:
                start_penalty += 1.5
            score = float(balance) + punctuation_bonus + start_penalty
            if best is None or score < best[0]:
                best = (score, i, j)

    _, i, j = best
    segments = [" ".join(words[:i]), " ".join(words[i:j]), " ".join(words[j:])]
    reconstructed = " ".join(segments)
    return {
        "valid": reconstructed == source,
        "reason": "" if reconstructed == source else "LITERAL_RECONSTRUCTION_FAILED",
        "segments": segments,
        "reconstructed": reconstructed,
        "source_normalized": source,
    }


def _contains_any(text, values):
    low = _norm_text(text).lower()
    return any(v in low for v in values)


def choose_motion(treatment, beat, context=None):
    """Choose a V4 Motion from the approved V3.1 treatment and beat structure.

    This is a deterministic first pass. The generated override file allows a
    human to replace any selection without editing the HTML source.
    """
    context = context or {}
    family = str((treatment or {}).get("treatment_family") or "PRESENTER_ONLY")
    text = _norm_text((beat or {}).get("text") or (treatment or {}).get("spoken_context"))
    duration = float((beat or {}).get("planned_seconds") or (beat or {}).get("duration_seconds") or (treatment or {}).get("duration_seconds") or 0)
    narrative = _norm_text((beat or {}).get("narrative_function") or (beat or {}).get("role"))

    if family == "PRESENTER_ONLY":
        motion = "M0"
        reason = "El tratamiento aprobado preserva presenter/source."
    elif family == "SAAS_PRODUCT_MOTION":
        motion = "M6"
        reason = "El beat explica software, datos o un estado digital funcional."
    elif family == "WORD_ENVIRONMENT":
        motion = "M3"
        reason = "La palabra/tesis es la imagen; se mantiene separada de captions."
    elif family == "SCIENTIFIC_MACRO":
        motion = "M1"
        reason = "La comprensión depende de observación macro y materialidad."
    elif family == "DOCUMENTARY_LITERAL":
        if _contains_any(
            text,
            (
                "hacer", "haciendo", "escribir", "estudiar", "practicar", "preparar",
                "construir", "cerrar", "abrir", "tomar", "trabajar", "ejercicio",
                "caminar", "usar", "empezar", "terminar",
            ),
        ) and duration >= 4.0:
            motion = "M5"
            reason = "La idea puede contarse como acción física wide→detail→result."
        else:
            motion = "M1"
            reason = "La imagen literal funciona mejor como observación/close-ups."
    elif family == "SYMBOLIC_OBJECT":
        if duration >= 5.2 and len(text.split()) >= 9:
            motion = "M2"
            reason = "El objeto puede evolucionar en una transformación de tres estados."
        else:
            motion = "M1"
            reason = "El beat es demasiado breve para forzar Motion 2; usar observación simbólica."
    elif family == "VOX_EDITORIAL":
        if _contains_any(
            narrative + " " + text,
            (
                "contradiction", "payoff", "close", "reveal", "reframe", "hook",
                "no es", "nunca", "pero", "sin embargo", "la verdad", "el problema",
            ),
        ):
            motion = "M3"
            reason = "El beat funciona como tesis/contradicción/payoff editorial."
        else:
            motion = "M4"
            reason = "El beat explica una relación, proceso o mapa conceptual."
    else:
        motion = "M1"
        reason = f"Fallback conservador para familia {family}: plate/close-ups antes que efecto genérico."

    if context.get("format") == "podcast_intro" and motion == "M5":
        motion = "M1"
        reason += " En intro, M5 no se usa como estructura principal; se convierte en M1."

    alternative = {
        "M0": "M1",
        "M1": "M5",
        "M2": "M1",
        "M3": "M4",
        "M4": "M3",
        "M5": "M1",
        "M6": "M4",
    }[motion]
    return {
        "motion_primary": motion,
        "motion_alternative": alternative,
        "why_motion": reason,
        **MOTION_META[motion],
    }


def _resolved_source_range(beat, resolutions):
    if beat.get("requires_microtrim"):
        resolved = (resolutions or {}).get(beat.get("beat_id")) or {}
        if not resolved.get("valid"):
            return None, "UNRESOLVED_MICROTRIM"
        return (float(resolved["start"]), float(resolved["end"])), "RESOLVED"
    start = beat.get("source_start") or beat.get("start")
    end = beat.get("source_end") or beat.get("end")
    if start is None or end is None:
        return None, "MISSING_SOURCE_RANGE"
    return (parse_timecode(start), parse_timecode(end)), "EXACT"


def _map_source_to_content_timeline(source_range, segments):
    if not source_range:
        return None, "NO_SOURCE_RANGE"
    source_start, source_end = source_range
    cursor = 0.0
    for segment in segments or []:
        seg_start = parse_timecode(segment["start"])
        seg_end = parse_timecode(segment["end"])
        if source_start >= seg_start - 0.08 and source_end <= seg_end + 0.08:
            timeline_in = cursor + max(0.0, source_start - seg_start)
            duration = max(0.0, source_end - source_start)
            return (round(timeline_in, 3), round(timeline_in + duration, 3)), "MAPPED"
        cursor += max(0.0, seg_end - seg_start)
    return None, "SOURCE_RANGE_OUTSIDE_ASSEMBLY"


def _state_prompt(treatment, state, with_text=False):
    obj = ((treatment or {}).get("states") or {}).get(state) or {}
    key = "prompt_with_text" if with_text else "prompt_no_text"
    return _norm_text(obj.get(key) or obj.get("description") or (treatment or {}).get("scene"))


def _frame_timing_three(duration):
    duration = max(0.3, float(duration or 0))
    a = round(duration / 3.0, 3)
    b = round(duration / 3.0, 3)
    return [(0.0, a), (a, a + b), (a + b, duration)]


def _motion2_timing(duration, split):
    duration = max(0.6, float(duration or 0))
    clean = min(0.5, max(0.35, duration * 0.07))
    remaining = max(0.3, duration - clean)
    counts = [max(1, len(x.split())) for x in split.get("segments", [])] or [1, 1, 1]
    total = sum(counts)
    cursor = clean
    ranges = [(0.0, round(clean, 3))]
    for idx, count in enumerate(counts):
        end = duration if idx == 2 else cursor + remaining * count / total
        ranges.append((round(cursor, 3), round(end, 3)))
        cursor = end
    return ranges


def _common_prompt_header(motion_id, placement, treatment):
    orientation = placement["orientation"]
    ratio = "9:16 vertical 1080x1920" if orientation == "vertical" else "16:9 horizontal 1920x1080"
    return "\n".join(
        [
            "ABRAXAS V4.1 · PROMPT DE IMAGEN PRODUCTION-READY",
            f"CONTENT_ID: {placement['content_id']}",
            f"BEAT_ID: {placement['beat_id']}",
            f"MOTION: {motion_id} · {MOTION_META[motion_id]['name']}",
            f"FORMATO: {ratio}",
            f"TRANSCRIPCIÓN EXACTA: {placement.get('transcript_exact','')}",
            f"FUNCIÓN: {placement.get('narrative_function','')}",
            f"TRATAMIENTO V3.1 DE ORIGEN: {(treatment or {}).get('treatment_family','')}",
            "CLIENTE: JOC. Paleta primaria off-white, charcoal y rojo JOC #A91616 controlado.",
            "REFERENCIAS: usar REF A–E como gramática de jerarquía, profundidad, textura y metáfora; no copiar sujeto, headline, logo o escenario.",
            "SUBTÍTULOS: no recrear captions. Mantener libre la zona inferior y no generar texto no solicitado.",
            "CALIDAD: materiales físicos, luz motivada, perspectiva coherente, una idea dominante, sin hologramas, HUD, stock corporativo ni anatomía deformada.",
        ]
    )


def _prompt_for_frame(motion_id, placement, treatment, role, state, exact_text="NONE", with_text=False):
    base = _state_prompt(treatment, state, with_text=with_text)
    header = _common_prompt_header(motion_id, placement, treatment)
    motion_rule = {
        "M1": "Crear un plate flexible sin generar al speaker. Laterales 20–25% de baja densidad; concepto central desplazable ±10–15%; zoom seguro 100–106%.",
        "M2": "La imagen pertenece al mismo mundo/cámara de los otros estados. El texto indicado debe ser literal, físicamente integrado y conservar material, perspectiva, luz y sombra.",
        "M3": "Tipografía editorial pura; una idea dominante; no parecer subtítulo, quote card ni karaoke.",
        "M4": "Una sola infografía master 4K+ con estaciones conectadas en Z; no dashboard ni cuatro slides independientes.",
        "M5": "Microsecuencia cinematográfica de acción real. Mantener continuidad de sujeto, espacio y luz; sin texto editorial integrado.",
        "M6": "UI limpia y plausible; input→process→output; pocas capas, jerarquía fuerte, sin HUD/cyberpunk.",
    }.get(motion_id, "")
    return "\n\n".join(
        [
            header,
            f"ASSET / ESTADO: {role}",
            f"REGLA DEL MOTION: {motion_rule}",
            f"TEXTO EXACTO DENTRO DE LA IMAGEN: {exact_text}",
            "DIRECCIÓN VISUAL V3.1 APROBADA (adaptar al Motion sin reescribir la idea):\n" + (base or (treatment or {}).get("scene", "")),
            "OUTPUT: una sola imagen independiente, alta resolución, sin watermark, sin contact sheet, sin collage de variantes.",
        ]
    ).strip()


def build_asset_specs(placement, treatment):
    motion_id = placement["motion_primary"]
    duration = float(placement.get("duration") or placement.get("planned_seconds") or 0)
    if motion_id == "M0":
        return [], [], None

    assets = []
    preferred = []
    literal = None
    if motion_id == "M2":
        literal = split_exact_three(placement.get("transcript_exact", ""))
        if not literal.get("valid"):
            # Do not force Motion 2 when literal segmentation is unsafe.
            placement["motion_primary"] = "M1"
            placement["motion_alternative"] = "M2"
            placement.update(MOTION_META["M1"])
            placement["why_motion"] += " Motion 2 quedó bloqueado por segmentación literal; fallback automático a M1."
            return build_asset_specs(placement, treatment)
        timing = _motion2_timing(duration, literal)
        state_map = ("START", "START", "MIDDLE", "END")
        for index, ((start, end), state) in enumerate(zip(timing, state_map), 1):
            filename = f"FRAME_{index:02d}_CLEAN.png"
            role = "CLEAN PLATE" if index == 1 else f"CLEAN PLATE ESTADO {index-1}"
            assets.append(
                {
                    "asset_id": f"CLEAN_{index:02d}",
                    "filename": filename,
                    "role": role,
                    "time_in": start,
                    "time_out": end,
                    "duration": round(end - start, 3),
                    "exact_text": "NONE",
                    "prompt": _prompt_for_frame("M2", placement, treatment, role, state, "NONE", False),
                }
            )
        cumulative = []
        for idx, segment in enumerate(literal["segments"], 2):
            cumulative.append(segment)
            start, end = timing[idx - 1]
            exact = " | ".join(cumulative)
            filename = f"FRAME_{idx:02d}_TEXT.png"
            assets.append(
                {
                    "asset_id": f"TEXT_{idx:02d}",
                    "filename": filename,
                    "role": f"TEXT PLATE ACUMULATIVO {idx-1}",
                    "time_in": start,
                    "time_out": end,
                    "duration": round(end - start, 3),
                    "exact_text": exact,
                    "prompt": _prompt_for_frame("M2", placement, treatment, f"TEXT PLATE {idx-1}", state_map[idx-1], exact, True),
                }
            )
        preferred = ["FRAME_01_CLEAN.png", "FRAME_02_TEXT.png", "FRAME_03_TEXT.png", "FRAME_04_TEXT.png"]
    elif motion_id == "M4":
        filename = "MASTER_INFOGRAPHIC_4K.png"
        assets.append(
            {
                "asset_id": "MASTER_01",
                "filename": filename,
                "role": "MASTER INFOGRAPHIC Z",
                "time_in": 0.0,
                "time_out": duration,
                "duration": duration,
                "exact_text": "NONE",
                "prompt": _prompt_for_frame("M4", placement, treatment, "MASTER INFOGRAPHIC 4K+", "MIDDLE", "NONE", False),
            }
        )
        preferred = [filename]
    else:
        timing = _frame_timing_three(duration)
        split = split_exact_three(placement.get("transcript_exact", "")) if motion_id == "M3" else None
        for index, ((start, end), state) in enumerate(zip(timing, STATE_NAMES), 1):
            exact = "NONE"
            if motion_id == "M3" and split and split.get("valid"):
                exact = split["segments"][index - 1]
            filename = f"FRAME_{index:02d}.png"
            role = {
                "M1": ("ANCLA", "PROFUNDIZACIÓN", "DETALLE REVELADOR"),
                "M3": ("CONCEPTO", "GIRO", "PAYOFF"),
                "M5": ("WIDE", "DETAIL", "RESULT"),
                "M6": ("INPUT", "PROCESS", "OUTPUT"),
            }[motion_id][index - 1]
            assets.append(
                {
                    "asset_id": f"FRAME_{index:02d}",
                    "filename": filename,
                    "role": role,
                    "time_in": start,
                    "time_out": end,
                    "duration": round(end - start, 3),
                    "exact_text": exact,
                    "prompt": _prompt_for_frame(motion_id, placement, treatment, role, state, exact, motion_id == "M3"),
                }
            )
        preferred = [x["filename"] for x in assets]

    return assets, preferred, literal


def _intro_beat_map(intro):
    result = {}
    for beat in intro.get("source_beats", []):
        result[beat.get("beat_id")] = beat
    for beat in intro.get("source_replacement", []):
        result[beat.get("beat_id")] = beat
    for vo in intro.get("voiceover_options", []):
        for beat in vo.get("beats", []):
            result[beat.get("beat_id")] = beat
    return result


def _apply_motion_override(selection, overrides, beat_id=None):
    override = (overrides or {}).get(beat_id or selection.get("beat_id"))
    if not override:
        return selection
    motion_id = str(override.get("motion_primary") or override.get("motion") or "").upper()
    if motion_id not in MOTION_META:
        return selection
    selection.update(MOTION_META[motion_id])
    selection["motion_primary"] = motion_id
    if override.get("motion_alternative") in MOTION_META:
        selection["motion_alternative"] = override["motion_alternative"]
    selection["why_motion"] = override.get("why_motion") or "Override humano aprobado."
    selection["selection_source"] = "HUMAN_OVERRIDE"
    return selection


def _base_placement(content_id, family, orientation, variant, beat, treatment, selection):
    source_range, timing_status = _resolved_source_range(beat, {})
    duration = float(beat.get("planned_seconds") or beat.get("duration_seconds") or (treatment or {}).get("duration_seconds") or 0)
    return {
        "content_id": content_id,
        "content_family": family,
        "orientation": orientation,
        "assembly_variant": variant,
        "beat_id": beat.get("beat_id"),
        "speaker": beat.get("speaker"),
        "narrative_function": beat.get("narrative_function") or beat.get("role"),
        "transcript_exact": _norm_text(beat.get("text") or (treatment or {}).get("spoken_context")),
        "planned_seconds": duration,
        "treatment_family": (treatment or {}).get("treatment_family") or "PRESENTER_ONLY",
        "timing_status": timing_status,
        "source_in": source_range[0] if source_range else None,
        "source_out": source_range[1] if source_range else None,
        "timeline_in": None,
        "timeline_out": None,
        "duration": duration,
        "selection_source": "DETERMINISTIC_V4_1",
        **selection,
    }


def compile_motion_plan(bundle, part_plan, resolutions, overrides=None):
    overrides = overrides or {}
    placements = []
    content = bundle.get("content", {})
    plan_by_family = {
        "verticals": {x["content_id"]: x for x in part_plan.get("verticals", [])},
        "horizontals": {x["content_id"]: x for x in part_plan.get("horizontals", [])},
    }

    for family, orientation in (("verticals", "vertical"), ("horizontals", "horizontal")):
        for item in content.get(family, []):
            plan_item = plan_by_family[family].get(item.get("id")) or {}
            segments = plan_item.get("segments") or item.get("segments", [])
            opportunity_by_beat = {x.get("beat_id"): x for x in item.get("visual_opportunities", [])}
            for beat in item.get("beats", []):
                opportunity = opportunity_by_beat.get(beat.get("beat_id")) or {}
                treatment = opportunity.get("treatment") or {"treatment_family": "PRESENTER_ONLY"}
                selection = choose_motion(treatment, beat, {"format": "vertical" if orientation == "vertical" else "horizontal"})
                selection = _apply_motion_override(selection, overrides, beat.get("beat_id"))
                source_range, source_status = _resolved_source_range(beat, resolutions)
                timeline_range, map_status = _map_source_to_content_timeline(source_range, segments)
                placement = _base_placement(item["id"], family, orientation, "SOURCE", beat, treatment, selection)
                placement.update(
                    {
                        "timing_status": source_status if not timeline_range else map_status,
                        "source_in": source_range[0] if source_range else None,
                        "source_out": source_range[1] if source_range else None,
                        "timeline_in": timeline_range[0] if timeline_range else None,
                        "timeline_out": timeline_range[1] if timeline_range else None,
                        "duration": round(source_range[1] - source_range[0], 3) if source_range else placement["duration"],
                        "treatment": treatment,
                    }
                )
                if selection["motion_primary"] == "M0":
                    placement["readiness"] = "KEEP_SOURCE"
                elif timeline_range:
                    placement["readiness"] = "READY_FOR_IMAGE_GENERATION"
                else:
                    placement["readiness"] = "BLOCKED_TIMING"
                placements.append(placement)

    intro_by_id = {x.get("id"): x for x in bundle.get("intro", {}).get("intros", [])}
    for plan_intro in part_plan.get("intros", []):
        intro = intro_by_id.get(plan_intro.get("content_id"))
        if not intro:
            continue
        beat_map = _intro_beat_map(intro)
        parts = plan_intro.get("parts", {})
        for variant, beat_ids in (plan_intro.get("assemblies") or {}).items():
            cursor = 0.0
            for beat_id in beat_ids:
                beat = beat_map.get(beat_id)
                part = parts.get(beat_id)
                if not beat or not part:
                    continue
                duration = parse_timecode(part["end"]) - parse_timecode(part["start"])
                for orientation in ("vertical", "horizontal"):
                    treatment = (beat.get("visual_treatment") or {}).get(orientation) or {"treatment_family": "PRESENTER_ONLY"}
                    selection = choose_motion(treatment, beat, {"format": "podcast_intro"})
                    selection = _apply_motion_override(selection, overrides, beat.get("beat_id"))
                    placement = _base_placement(intro["id"], "intros", orientation, variant, beat, treatment, selection)
                    placement.update(
                        {
                            "timing_status": "MAPPED",
                            "source_in": parse_timecode(part["start"]),
                            "source_out": parse_timecode(part["end"]),
                            "timeline_in": round(cursor, 3),
                            "timeline_out": round(cursor + duration, 3),
                            "duration": round(duration, 3),
                            "treatment": treatment,
                            "readiness": "KEEP_SOURCE" if selection["motion_primary"] == "M0" else "READY_FOR_IMAGE_GENERATION",
                        }
                    )
                    placements.append(placement)
                cursor += duration

    placements = _compile_balanced_fragments(placements, overrides)
    durations = [float(x.get("duration") or 0) for x in placements]
    return {
        "schema_version": "abraxas.motion-plan.v4.1",
        "project": bundle.get("content", {}).get("episode", {}),
        "counts": {
            "placements": len(placements),
            "actionable": sum(1 for x in placements if x["motion_primary"] != "M0"),
            "keep_source": sum(1 for x in placements if x["motion_primary"] == "M0"),
            "blocked_timing": sum(1 for x in placements if x["readiness"] == "BLOCKED_TIMING"),
            "minimum_fragment_seconds": min(durations) if durations else 0,
            "maximum_fragment_seconds": max(durations) if durations else 0,
            "average_fragment_seconds": round(sum(durations) / len(durations), 3) if durations else 0,
        },
        "fragment_contract": {"minimum_seconds": 4.0, "maximum_seconds": 9.0, "target_average_seconds": 8.0},
        "placements": placements,
    }


def _compile_balanced_fragments(raw_placements, overrides):
    """Convert editorial beats into physical 4–9 second Motion fragments.

    A short remainder is distributed over every fragment. Treatments remain
    grounded in the beat with the greatest overlap, while all overlapping
    beat IDs and transcript context are preserved in the brief.
    """
    grouped = defaultdict(list)
    for placement in raw_placements:
        grouped[(placement["content_family"], placement["content_id"], placement["orientation"], placement["assembly_variant"])].append(placement)
    result = []
    for (family, content_id, orientation, variant), items in grouped.items():
        mapped = [x for x in items if x.get("timeline_in") is not None and x.get("timeline_out") is not None]
        total = max((float(x["timeline_out"]) for x in mapped), default=0.0)
        if total < 4.0:
            # Keep an explicit blocker rather than inventing or stretching time.
            template = (mapped or items)[0]
            blocked = dict(template)
            blocked.update({"beat_id": f"{content_id}_{variant}_FRAG_001", "timeline_in": 0.0, "timeline_out": total or None, "duration": total, "readiness": "BLOCKED_TIMING", "timing_status": "PROGRAM_UNDER_4_SECONDS", "raw_beat_ids": [x.get("beat_id") for x in items]})
            result.append(blocked)
            continue
        ranges = balanced_fragment_ranges(total, minimum=4.0, maximum=9.0, target=8.0)
        for index, (start, end) in enumerate(ranges, 1):
            overlaps = []
            for item in mapped:
                overlap = max(0.0, min(end, float(item["timeline_out"])) - max(start, float(item["timeline_in"])))
                if overlap > 0.001:
                    overlaps.append((overlap, item))
            overlaps.sort(key=lambda pair: (-pair[0], float(pair[1].get("timeline_in") or 0)))
            # Never lose an editorially selected visual opportunity merely
            # because a longer presenter-only beat shares the same fragment.
            actionable_overlaps = [pair for pair in overlaps if pair[1].get("motion_primary") != "M0"]
            representative = (actionable_overlaps or overlaps)[0][1] if overlaps else (mapped or items)[0]
            treatment = representative.get("treatment") or {"treatment_family": representative.get("treatment_family") or "PRESENTER_ONLY"}
            ordered = [item for _, item in sorted(overlaps, key=lambda pair: float(pair[1].get("timeline_in") or 0))]
            texts = []
            for item in ordered:
                text = _norm_text(item.get("transcript_exact"))
                if text and text not in texts:
                    texts.append(text)
            fragment_id = f"{content_id}_{variant}_FRAG_{index:03d}"
            duration = round(end - start, 3)
            beat = {
                "beat_id": fragment_id,
                "text": " ".join(texts) or representative.get("transcript_exact", ""),
                "planned_seconds": duration,
                "narrative_function": representative.get("narrative_function"),
            }
            selection = choose_motion(treatment, beat, {"format": "podcast_intro" if family == "intros" else orientation})
            selection = _apply_motion_override(selection, overrides, fragment_id)
            source_spans = []
            for _, item in overlaps:
                if item.get("source_in") is not None and item.get("source_out") is not None:
                    source_spans.append({"beat_id": item.get("beat_id"), "source_in": item.get("source_in"), "source_out": item.get("source_out")})
            fragment = {
                "content_id": content_id,
                "content_family": family,
                "orientation": orientation,
                "assembly_variant": variant,
                "beat_id": fragment_id,
                "fragment_index": index,
                "raw_beat_ids": [item.get("beat_id") for item in ordered],
                "source_spans": source_spans,
                "speaker": representative.get("speaker"),
                "narrative_function": representative.get("narrative_function"),
                "transcript_exact": beat["text"],
                "planned_seconds": duration,
                "treatment_family": treatment.get("treatment_family") or "PRESENTER_ONLY",
                "timing_status": "BALANCED_4_TO_9",
                "source_in": None,
                "source_out": None,
                "timeline_in": start,
                "timeline_out": end,
                "duration": duration,
                "selection_source": "BALANCED_FRAGMENT_V4_1",
                "readiness": "KEEP_SOURCE" if selection["motion_primary"] == "M0" else "READY_FOR_IMAGE_GENERATION",
                "fragment_contract": "4.000<=duration<=9.000; target_average=8.000",
                "treatment": treatment,
                **selection,
            }
            result.append(fragment)
    return result


def _family_folder(placement):
    return {
        "verticals": "03_VERTICALS",
        "horizontals": "04_HORIZONTALS",
        "intros": "02_INTROS",
    }[placement["content_family"]]


def _asset_key(placement):
    return "__".join(
        [
            placement["content_id"],
            placement["orientation"].upper(),
            placement["beat_id"],
            placement["motion_primary"],
        ]
    )


def _animation_prompt(placement, treatment):
    base = _norm_text((treatment or {}).get("animation_prompt_no_text") or (treatment or {}).get("animation_prompt_with_text"))
    frames = ", ".join(placement.get("preferred_frame_sequence") or [])
    return "\n\n".join(
        [
            "ABRAXAS V4.1 · PROMPT FINAL DE ANIMACIÓN",
            f"CONTENT_ID: {placement['content_id']} · BEAT_ID: {placement['beat_id']}",
            f"MOTION: {placement['motion_primary']} · {placement['name']}",
            f"DURACIÓN EXACTA: {placement['duration']:.3f} segundos",
            f"FORMATO: {placement['orientation']}",
            f"FRAMES DE REFERENCIA EN ORDEN: {frames}",
            f"TRANSCRIPCIÓN/CONTEXTO: {placement['transcript_exact']}",
            "Mantener exactamente identidad, materiales, escena, cámara, paleta y geometría de los frames aprobados. La animación no rediseña la imagen. Usar easing suave y movimiento motivado. No inventar texto, objetos, datos, claims, logos ni captions. El audio original no forma parte del video generado.",
            "DIRECCIÓN DE ANIMACIÓN V3.1 APROBADA:\n" + base,
            "OUTPUT: un video limpio sin audio, sin subtítulos y sin watermark. Guardar como MOTION_FINAL.mp4 o MOTION_FINAL.mov.",
        ]
    ).strip()


def _write_text(path, text):
    path = Path(path)
    ensure_dir(path.parent)
    path.write_text(str(text or "").rstrip() + "\n", encoding="utf-8")


def write_motion_tree(plan, output_root):
    output_root = Path(output_root)
    motions_root = ensure_dir(output_root / "09_MOTIONS_V4_1")
    unique = {}
    grouped = defaultdict(list)

    for placement in plan["placements"]:
        grouped[(placement["content_family"], placement["content_id"], placement["orientation"])].append(placement)
        if placement["motion_primary"] == "M0":
            continue
        key = _asset_key(placement)
        unique.setdefault(key, placement)

    for key, placement in unique.items():
        treatment = placement.pop("treatment", {})
        folder = ensure_dir(
            motions_root
            / _family_folder(placement)
            / placement["content_id"]
            / placement["orientation"].upper()
            / f"{placement['beat_id']}__{placement['motion_primary']}"
        )
        prompt_dir = ensure_dir(folder / "PROMPTS_IMAGEN")
        asset_dir = ensure_dir(folder / "ASSETS_GENERADOS")
        assets, preferred, literal = build_asset_specs(placement, treatment)
        placement["asset_key"] = key
        placement["asset_folder"] = str(folder)
        placement["generated_assets_folder"] = str(asset_dir)
        placement["expected_assets"] = assets
        placement["preferred_frame_sequence"] = preferred
        placement["motion2_literal_split"] = literal
        placement["expected_motion_files"] = [
            str(asset_dir / "MOTION_FINAL.mov"),
            str(asset_dir / "MOTION_FINAL.mp4"),
            str(asset_dir / "MOTION_PREVIEW.mp4"),
        ]
        placement["animation_prompt"] = _animation_prompt(placement, treatment)
        placement["prompt_fingerprint"] = stable_hash(
            {
                "motion": placement["motion_primary"],
                "assets": [{"filename": x["filename"], "prompt": x["prompt"]} for x in assets],
                "animation": placement["animation_prompt"],
            }
        )
        for idx, asset in enumerate(assets, 1):
            _write_text(prompt_dir / f"PROMPT_{idx:02d}__{Path(asset['filename']).stem}.txt", asset["prompt"])
        _write_text(folder / "PROMPT_ANIMAR_MOTION.txt", placement["animation_prompt"])
        complete = [
            "Genera cada imagen como archivo independiente. No hagas contact sheet ni collage.",
            "Conserva continuidad absoluta entre todos los frames del mismo Motion.",
            f"Guarda/descarga cada resultado con el filename indicado dentro de: {asset_dir}",
            "",
        ]
        for idx, asset in enumerate(assets, 1):
            complete.extend(
                [
                    f"===== IMAGEN {idx:02d} · {asset['filename']} =====",
                    asset["prompt"],
                    "",
                ]
            )
        _write_text(folder / "PROMPT_GENERAR_ESTE_MOTION_COMPLETO.txt", "\n".join(complete))
        _write_text(
            asset_dir / "COLOCA_AQUI_LO_GENERADO.txt",
            "\n".join(
                [
                    "Coloca aquí las imágenes con los filenames exactos del MOTION_BRIEF.json.",
                    "Después ejecuta 10B_BUILD_MOTION_PREVIEWS.command para crear un preview automático.",
                    "Si generas el video final con el prompt de animación, guárdalo como MOTION_FINAL.mp4 o MOTION_FINAL.mov.",
                ]
            ),
        )
        brief = {k: v for k, v in placement.items() if k != "animation_prompt"}
        write_json_atomic(folder / "MOTION_BRIEF.json", brief)

    # Push generated asset paths back into every duplicate placement (intro variants).
    for placement in plan["placements"]:
        key = _asset_key(placement) if placement["motion_primary"] != "M0" else None
        if key and key in unique:
            source = unique[key]
            for field in (
                "asset_key",
                "asset_folder",
                "generated_assets_folder",
                "expected_assets",
                "preferred_frame_sequence",
                "motion2_literal_split",
                "expected_motion_files",
                "prompt_fingerprint",
            ):
                placement[field] = source.get(field)
        placement.pop("treatment", None)

    for (family, content_id, orientation), placements in grouped.items():
        video_root = ensure_dir(motions_root / _family_folder({"content_family": family}) / content_id / orientation.upper())
        actionable = []
        seen = set()
        for placement in placements:
            if placement["motion_primary"] == "M0":
                continue
            if placement.get("asset_key") in seen:
                continue
            seen.add(placement.get("asset_key"))
            actionable.append(placement)
        actionable.sort(key=lambda x: (x.get("timeline_in") is None, x.get("timeline_in") or 0, x["beat_id"]))
        lines = [
            "PROMPT MAESTRO ABRAXAS V4.1 · GENERAR TODAS LAS IMÁGENES DE ESTE VIDEO",
            f"CONTENT_ID: {content_id}",
            f"ORIENTACIÓN: {orientation}",
            "",
            "INSTRUCCIONES:",
            "1. Genera una imagen por solicitud/resultado; nunca un contact sheet.",
            "2. Respeta el filename de cada asset para poder conformarlo automáticamente.",
            "3. Dentro de cada Motion conserva identidad, escenario, cámara, luz y materiales.",
            "4. No reescribas diálogo, claims ni captions.",
            "5. Motion 2 usa texto exacto; no resumir ni traducir.",
            "",
        ]
        for placement in actionable:
            lines.extend(
                [
                    f"######## {placement['beat_id']} · {placement['motion_primary']} · timeline {placement.get('timeline_in')}→{placement.get('timeline_out')} ########",
                    f"CARPETA DESTINO: {placement['generated_assets_folder']}",
                    "",
                ]
            )
            for idx, asset in enumerate(placement.get("expected_assets") or [], 1):
                lines.extend(
                    [
                        f"===== ASSET {idx:02d} · {asset['filename']} =====",
                        asset["prompt"],
                        "",
                    ]
                )
        _write_text(video_root / "00_PROMPT_GENERAR_TODAS_LAS_IMAGENES_DEL_VIDEO.txt", "\n".join(lines))
        write_json_atomic(video_root / "00_MOTION_INDEX.json", {"content_id": content_id, "orientation": orientation, "placements": placements})
        with (video_root / "00_ASSET_CHECKLIST.csv").open("w", encoding="utf-8", newline="") as handle:
            writer = csv.writer(handle)
            writer.writerow(["beat_id", "motion", "timeline_in", "timeline_out", "asset_filename", "status"])
            for placement in actionable:
                for asset in placement.get("expected_assets") or []:
                    writer.writerow([placement["beat_id"], placement["motion_primary"], placement.get("timeline_in"), placement.get("timeline_out"), asset["filename"], "MISSING"])

    manifest = output_root / "00_MANIFEST" / "MOTION_PLAN_V4_1.json"
    write_json_atomic(manifest, plan)
    write_json_atomic(motions_root / "MOTION_QUEUE_V4_1.json", plan)
    return manifest


def load_motion_plan(path):
    return read_json(path, {}) or {}


def _selected_motion_path(placement):
    for raw in placement.get("expected_motion_files") or []:
        if Path(raw).is_file() and Path(raw).stat().st_size > 0:
            return str(Path(raw))
    return None


def refresh_asset_status(plan):
    unique = {}
    for placement in plan.get("placements", []):
        if placement.get("motion_primary") == "M0":
            placement["asset_status"] = "KEEP_SOURCE"
            continue
        selected = _selected_motion_path(placement)
        frame_paths = []
        asset_dir = Path(placement.get("generated_assets_folder") or ".")
        for filename in placement.get("preferred_frame_sequence") or []:
            frame_paths.append(asset_dir / filename)
        if selected:
            status = "READY_FOR_DAVINCI"
        elif frame_paths and all(x.is_file() and x.stat().st_size > 0 for x in frame_paths):
            status = "FRAMES_READY_PREVIEW_PENDING"
        else:
            status = "MISSING_ASSETS"
        placement["selected_motion_path"] = selected
        placement["asset_status"] = status
        unique[placement.get("asset_key") or placement["beat_id"]] = status
    plan["asset_counts"] = {
        status: sum(1 for x in unique.values() if x == status)
        for status in sorted(set(unique.values()))
    }
    return plan


def build_still_preview_command(cfg, placement, target):
    asset_dir = Path(placement["generated_assets_folder"])
    filenames = placement.get("preferred_frame_sequence") or []
    frames = [asset_dir / name for name in filenames]
    if not frames or not all(path.is_file() for path in frames):
        return None
    asset_by_filename = {x["filename"]: x for x in placement.get("expected_assets") or []}
    durations = []
    for filename in filenames:
        durations.append(max(0.1, float((asset_by_filename.get(filename) or {}).get("duration") or placement["duration"] / len(filenames))))
    orientation = placement["orientation"]
    width, height = (1080, 1920) if orientation == "vertical" else (1920, 1080)
    ffmpeg = cfg["render"]["ffmpeg"]
    partial = output_partial_path(target)
    cmd = [ffmpeg, "-hide_banner", "-y"]
    for frame, duration in zip(frames, durations):
        cmd += ["-loop", "1", "-t", f"{duration:.3f}", "-i", str(frame)]
    filters = []
    labels = []
    for idx in range(len(frames)):
        label = f"v{idx}"
        labels.append(f"[{label}]")
        filters.append(
            f"[{idx}:v]scale={width}:{height}:force_original_aspect_ratio=decrease,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,fps=30,format=yuv420p[{label}]"
        )
    if len(frames) == 1:
        out_label = "v0"
    else:
        out_label = "vout"
        filters.append("".join(labels) + f"concat=n={len(frames)}:v=1:a=0[{out_label}]")
    cmd += [
        "-filter_complex",
        ";".join(filters),
        "-map",
        f"[{out_label}]",
        "-an",
        "-t",
        f"{sum(durations):.3f}",
        "-c:v",
        cfg["render"].get("encoder", "h264_videotoolbox"),
        "-b:v",
        "20M",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(partial),
    ]
    return cmd


def build_motion_previews(cfg, plan, dry_run=False):
    results = []
    seen = set()
    for placement in plan.get("placements", []):
        key = placement.get("asset_key")
        if not key or key in seen or placement.get("motion_primary") == "M0":
            continue
        seen.add(key)
        asset_dir = Path(placement["generated_assets_folder"])
        final_candidates = [asset_dir / "MOTION_FINAL.mov", asset_dir / "MOTION_FINAL.mp4"]
        if any(x.is_file() and x.stat().st_size > 0 for x in final_candidates):
            results.append({"asset_key": key, "status": "FINAL_EXISTS"})
            continue
        target = asset_dir / "MOTION_PREVIEW.mp4"
        cmd = build_still_preview_command(cfg, placement, target)
        if cmd is None:
            results.append({"asset_key": key, "status": "MISSING_FRAMES"})
            continue
        if dry_run:
            results.append({"asset_key": key, "status": "DRY_RUN", "command": cmd})
            continue
        partial = output_partial_path(target)
        partial.unlink(missing_ok=True)
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            partial.unlink(missing_ok=True)
            results.append({"asset_key": key, "status": "FAIL", "error": (proc.stderr or proc.stdout)[-4000:]})
            continue
        os.replace(partial, target)
        results.append({"asset_key": key, "status": "PREVIEW_CREATED", "path": str(target)})
    refresh_asset_status(plan)
    return {"schema_version": "abraxas.motion-preview-report.v4.1", "results": results, "plan": plan}


def verify_motion_plan(plan, strict_assets=False):
    report = {"passes": [], "blockers": [], "warnings": []}
    unique_assets = {}
    fragment_durations = []
    for placement in plan.get("placements", []):
        motion_id = placement.get("motion_primary")
        if motion_id not in MOTION_META:
            report["blockers"].append({"beat_id": placement.get("beat_id"), "reason": "INVALID_MOTION"})
            continue
        if placement.get("timeline_in") is None or placement.get("timeline_out") is None:
            report["blockers"].append({"beat_id": placement.get("beat_id"), "reason": "UNRESOLVED_TIMELINE"})
        duration = float(placement.get("duration") or 0)
        fragment_durations.append(duration)
        if duration < 3.999:
            report["blockers"].append({"beat_id": placement.get("beat_id"), "reason": "MOTION_UNDER_4_SECONDS", "duration": duration})
        if duration > 9.001:
            report["blockers"].append({"beat_id": placement.get("beat_id"), "reason": "MOTION_OVER_9_SECONDS"})
        if motion_id == "M0":
            continue
        if motion_id == "M2":
            split = placement.get("motion2_literal_split") or {}
            if not split.get("valid") or split.get("reconstructed") != split.get("source_normalized"):
                report["blockers"].append({"beat_id": placement.get("beat_id"), "reason": "MOTION2_NOT_LITERAL"})
        key = placement.get("asset_key")
        if key:
            unique_assets[key] = placement
    for key, placement in unique_assets.items():
        status = placement.get("asset_status") or "MISSING_ASSETS"
        if strict_assets and status != "READY_FOR_DAVINCI":
            report["blockers"].append({"asset_key": key, "reason": status})
        elif status != "READY_FOR_DAVINCI":
            report["warnings"].append({"asset_key": key, "reason": status})
    average = sum(fragment_durations) / len(fragment_durations) if fragment_durations else 0
    report["fragment_metrics"] = {
        "count": len(fragment_durations),
        "minimum_seconds": min(fragment_durations) if fragment_durations else 0,
        "maximum_seconds": max(fragment_durations) if fragment_durations else 0,
        "average_seconds": round(average, 3),
    }
    if fragment_durations and not 7.0 <= average <= 9.0:
        report["blockers"].append({"reason": "PROJECT_FRAGMENT_AVERAGE_OUTSIDE_7_TO_9", "average": round(average, 3)})
    if not report["blockers"]:
        report["passes"].append({"check": "MOTION_PLAN_STRUCTURE", "result": "PASS"})
    report["status"] = "PASS" if not report["blockers"] else "BLOCKED"
    return report
