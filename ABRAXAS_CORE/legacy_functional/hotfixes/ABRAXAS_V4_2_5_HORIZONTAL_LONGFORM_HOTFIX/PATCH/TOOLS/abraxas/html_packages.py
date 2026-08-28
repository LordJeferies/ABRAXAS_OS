from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

from .core import ensure_dir, format_timecode, parse_timecode, stable_hash, write_json_atomic
from .motions import MOTION_META, build_asset_specs, choose_motion, _animation_prompt
from .runtime import encode_part, materialize_named_part


HUMAN_MOTION_NAMES = {
    "M0": "SIN_MOTION__MANTENER_ROSTRO",
    "M1": "PLATE_EDITORIAL_FLEXIBLE",
    "M2": "ESCENA_PROGRESIVA_CON_TEXTO_EXACTO",
    "M3": "TIPOGRAFIA_EDITORIAL",
    "M4": "PROCESO_RELACION_EN_TRES_IMAGENES",
    "M5": "MICROSECUENCIA_CINEMATOGRAFICA",
    "M6": "PROCESO_DIGITAL_INPUT_PROCESS_OUTPUT",
}

IMAGE_ROLE_NAMES = {
    1: "01_INICIO",
    2: "02_DESARROLLO",
    3: "03_RESULTADO",
    4: "04_CIERRE",
}


def _safe(value, maximum=72):
    value = str(value or "").strip().upper()
    value = re.sub(r"[^A-Z0-9ÁÉÍÓÚÜÑ]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")
    return (value or "SIN_NOMBRE")[:maximum].rstrip("_")


def _write_text(path, text):
    path = Path(path)
    ensure_dir(path.parent)
    path.write_text(str(text or "").rstrip() + "\n", encoding="utf-8")


def _write_placeholder(folder, filename, text):
    target = ensure_dir(folder) / filename
    if not target.exists():
        _write_text(target, text)
    return target


def _resolved_range(beat, resolutions):
    if beat.get("source_type") == "VOICEOVER" or beat.get("kind") == "VOICEOVER":
        return None, "VOICEOVER_NO_SOURCE_TIMECODE"
    if beat.get("source_type") == "ASSEMBLY" or beat.get("kind") == "ASSEMBLY_COMPOSITE":
        return None, "ASSEMBLY_COMPOSITE_REQUIRES_TIMELINE_CONFORM"
    if beat.get("requires_microtrim"):
        resolution = (resolutions or {}).get(beat.get("beat_id")) or {}
        if resolution.get("valid") and resolution.get("start") is not None and resolution.get("end") is not None:
            return (resolution["start"], resolution["end"]), "RESOLVED_MICROTRIM"
        return None, "PENDING_MICROTRIM"
    start = beat.get("source_start") or beat.get("start")
    end = beat.get("source_end") or beat.get("end")
    if start in (None, "") or end in (None, ""):
        return None, "MISSING_SOURCE_RANGE"
    return (parse_timecode(start), parse_timecode(end)), "EXACT_HTML_RANGE"


def _beat_parent_range(beat, resolutions):
    resolved, status = _resolved_range(beat, resolutions)
    if resolved:
        return resolved
    start = beat.get("parent_start") or beat.get("source_start") or beat.get("start")
    end = beat.get("parent_end") or beat.get("source_end") or beat.get("end")
    if start not in (None, "") and end not in (None, ""):
        return parse_timecode(start), parse_timecode(end)
    return None


def _assign_beats_to_segments(item, resolutions):
    segments = item.get("segments", [])
    result = {index: [] for index in range(len(segments))}
    for beat in item.get("beats", []):
        beat_range = _beat_parent_range(beat, resolutions)
        best = None
        if beat_range:
            for index, segment in enumerate(segments):
                s = parse_timecode(segment["start"])
                e = parse_timecode(segment["end"])
                overlap = max(0.0, min(e, beat_range[1]) - max(s, beat_range[0]))
                if best is None or overlap > best[0]:
                    best = (overlap, index)
        if not best or best[0] <= 0:
            same_role = [index for index, segment in enumerate(segments) if segment.get("role") == beat.get("role")]
            index = same_role[0] if same_role else 0
        else:
            index = best[1]
        result[index].append(beat)
    return result


def _content_treatment(item, beat, orientation):
    opportunities = {x.get("beat_id"): x for x in item.get("visual_opportunities", [])}
    opportunity = opportunities.get(beat.get("beat_id")) or {}
    if not opportunity:
        for child_id in beat.get("child_beat_ids") or []:
            if child_id in opportunities:
                opportunity = opportunities[child_id]
                break
    treatment = opportunity.get("treatment") or {}
    if treatment:
        return treatment
    return {
        "treatment_family": "PRESENTER_ONLY",
        "logic": "El HTML no seleccionó un recurso visual para este beat; preservar source y documentar una alternativa opcional.",
        "spoken_context": beat.get("text", ""),
        "duration_seconds": beat.get("planned_seconds") or beat.get("duration_seconds"),
        "scene": "Mantener speaker/source. Si se aprueba una alternativa, usar un plate editorial flexible que no invente información.",
        "states": {},
        "animation_prompt_no_text": "",
        "animation_prompt_with_text": "",
        "subtitle_policy": "No recrear ni modificar captions.",
        "why": "No motion by default; source first.",
    }


def _intro_treatment(beat, orientation):
    return (beat.get("visual_treatment") or {}).get(orientation) or {
        "treatment_family": "PRESENTER_ONLY",
        "logic": "Preservar source.",
        "spoken_context": beat.get("text", ""),
        "duration_seconds": beat.get("planned_seconds"),
        "scene": "Speaker/source limpio.",
        "states": {},
    }


def _apply_override(selection, overrides, beat_id):
    override = (overrides or {}).get(beat_id) or {}
    motion = str(override.get("motion_primary") or override.get("motion") or "").upper()
    if motion in MOTION_META:
        selection = dict(selection)
        selection.update(MOTION_META[motion])
        selection["motion_primary"] = motion
        selection["why_motion"] = override.get("why_motion") or "Override humano aprobado."
        selection["selection_source"] = "HUMAN_OVERRIDE"
    return selection


def _motion_decision(beat, treatment, context, *, position="MIDDLE", overrides=None):
    selection = choose_motion(treatment, beat, context)
    policy = beat.get("motion_policy") or {}
    policy_primary = str(policy.get("primary") or "").upper()
    if policy_primary in MOTION_META:
        selection.update(MOTION_META[policy_primary])
        selection["motion_primary"] = policy_primary
        possible = str(policy.get("possible_motion_reference") or "").upper()
        if possible in MOTION_META:
            selection["motion_alternative"] = possible
        selection["why_motion"] = policy.get("reason") or selection["why_motion"]
        selection["selection_source"] = "HTML_MOTION_POLICY"
    if context.get("format") == "intro" and position in {"FIRST", "LAST"}:
        original = selection["motion_primary"]
        selection.update(MOTION_META["M0"])
        selection["motion_primary"] = "M0"
        selection["motion_alternative"] = original if original != "M0" else selection.get("motion_alternative", "M1")
        selection["why_motion"] = f"{position}: NO MOTION preferido; la alternativa queda solo como referencia para revisión humana."
        selection["selection_source"] = "INTRO_EDGE_POLICY"
    selection = _apply_override(selection, overrides, beat.get("beat_id"))
    if selection.get("selection_source") != "HUMAN_OVERRIDE":
        for child_id in beat.get("child_beat_ids") or []:
            candidate = _apply_override(selection, overrides, child_id)
            if candidate.get("selection_source") == "HUMAN_OVERRIDE":
                selection = candidate
                break
    selection["decision"] = "NO_MOTION_RECOMENDADO" if selection["motion_primary"] == "M0" else "MOTION_RECOMENDADO"
    return selection


def _prompt_placement(content_id, orientation, variant, beat, treatment, selection, duration):
    motion_for_assets = selection["motion_primary"]
    optional = False
    if motion_for_assets == "M0":
        motion_for_assets = selection.get("motion_alternative") or "M1"
        if motion_for_assets == "M0":
            motion_for_assets = "M1"
        optional = True
    placement = {
        "content_id": content_id,
        "content_family": "html_packages",
        "orientation": orientation,
        "assembly_variant": variant,
        "beat_id": beat.get("beat_id"),
        "speaker": beat.get("speaker"),
        "narrative_function": beat.get("narrative_function") or beat.get("role"),
        "transcript_exact": re.sub(r"\s+", " ", str(beat.get("text") or "")).strip(),
        "planned_seconds": duration,
        "duration": duration,
        "treatment_family": treatment.get("treatment_family") or "PRESENTER_ONLY",
        "motion_primary": motion_for_assets,
        "motion_alternative": selection.get("motion_alternative") or "M1",
        "why_motion": selection.get("why_motion"),
        "selection_source": selection.get("selection_source", "HTML_CANONICAL_V4_2"),
        "optional_reference_only": optional,
        **MOTION_META[motion_for_assets],
    }
    assets, preferred, literal = build_asset_specs(placement, treatment)
    placement["expected_assets"] = assets
    placement["preferred_frame_sequence"] = preferred
    placement["motion2_literal_split"] = literal
    placement["animation_prompt"] = _animation_prompt(placement, treatment)
    return placement


def _davinci_guide(content_id, beat, placement, source_status, source_range, orientation, variant):
    motion = placement["motion_primary"]
    actual_decision = "NO MOTION preferido" if placement.get("optional_reference_only") else f"usar {motion} · {HUMAN_MOTION_NAMES[motion]}"
    track = MOTION_META[motion]["track"]
    in_label = format_timecode(source_range[0]) if source_range else "VO / SIN TIMECODE DE MASTER"
    out_label = format_timecode(source_range[1]) if source_range else "VO / SIN TIMECODE DE MASTER"
    return f"""ABRAXAS V4.2.1 · GUÍA DAVINCI PARA ESTA PARTE

VIDEO: {content_id}
PARTE: {beat.get('beat_id')}
ORIENTACIÓN: {orientation.upper()}
VARIANTE: {variant}
RANGO DEL MASTER: {in_label} → {out_label}
ESTADO DEL CORTE: {source_status}
CONTRATO FÍSICO: esta parte debe durar entre 4.000 y 9.000 segundos.
DECISIÓN EDITORIAL: {actual_decision}
PISTA SUGERIDA PARA EL RECURSO VISUAL: {track}

A. SI SOLO GENERASTE IMÁGENES
1. Importa el MP4 de esta carpeta y las imágenes guardadas dentro de 10_IMAGENES_GENERADAS.
2. Coloca el MP4 en V1 y conserva su audio original en A1. No alargues ni acortes el beat.
3. Coloca las imágenes en {track} o en una pista superior equivalente. Cada imagen debe respetar los tiempos indicados en 02_PROMPT_CREAR_IMAGENES.txt.
4. Si el Motion es M1, puedes usar el plate detrás del speaker y reencuadrarlo sin tapar rostro ni captions. Para M2/M3/M4/M5/M6, reemplaza solo la imagen durante este intervalo y conserva el audio fuente.
5. Aplica movimientos discretos: push-in, paneo, mask reveal o rack focus según el prompt. No añadas palabras, datos o interfaces nuevas en Resolve.
6. Revisa que el tercio inferior quede libre para subtítulos y que no haya flash frames, huecos ni solapamientos.

B. SI YA ANIMASTE EL MOTION
1. Guarda el resultado limpio dentro de 20_MOTION_ANIMADO como MOTION_FINAL.mp4 o MOTION_FINAL.mov.
2. Importa ese archivo y colócalo exactamente desde el inicio hasta el final de esta parte en {track}. No cambies la duración.
3. Desactiva o elimina el audio del Motion animado. Debe escucharse únicamente el audio original/VO de la línea principal.
4. Si el archivo tiene alpha, usa composición normal. Si no tiene alpha y reemplaza la imagen, déjalo full-frame; si es plate, usa crop/mask/composite según M1.
5. Comprueba escala, color, frame rate y resolución antes de renderizar. No estires de forma desigual.
6. Añade un marker con el ID {beat.get('beat_id')} y deja cualquier prueba/export dentro de 30_EXPORTS_DAVINCI.

C. SI LA DECISIÓN ES NO MOTION
Mantén el source en V1. La referencia y los prompts existen solo para una posible revisión; no obligan a cubrir el rostro.

D. SI ES UNA PARTE COMPUESTA DE TIMELINE
Si el estado indica ASSEMBLY_COMPOSITE, arma primero sus beats hijos en el orden de 00_ORIGEN_Y_TRANSCRIPCION.txt. Luego aplica la imagen o el Motion sobre la parte final ya conformada; no intentes extraerla como un único rango del master.
"""


def _origin_text(source_html, source_master, content_id, item_title, beat, source_status, source_range, orientation, variant, section_role):
    start = format_timecode(source_range[0]) if source_range else beat.get("parent_start") or beat.get("source_start") or beat.get("start") or "SIN TIMECODE"
    end = format_timecode(source_range[1]) if source_range else beat.get("parent_end") or beat.get("source_end") or beat.get("end") or "SIN TIMECODE"
    children = ", ".join(beat.get("child_beat_ids") or []) or "NO APLICA"
    return f"""ABRAXAS V4.2.1 · ORIGEN Y TRANSCRIPCIÓN

ARCHIVO HTML FUENTE: {source_html}
MASTER DE VIDEO: {source_master}
CONTENT_ID: {content_id}
TÍTULO: {item_title}
ORIENTACIÓN: {orientation.upper()}
VARIANTE: {variant}
SECCIÓN: {section_role}
BEAT / PARTE: {beat.get('beat_id')}
BEATS EDITORIALES AGRUPADOS: {children}
SPEAKER: {beat.get('speaker') or 'NO ESPECIFICADO'}
FUNCIÓN NARRATIVA: {beat.get('narrative_function') or beat.get('role') or 'NO ESPECIFICADA'}
RANGO: {start} → {end}
ESTADO DEL TIMECODE: {source_status}
ANCHOR INICIO: {beat.get('anchor_start') or 'NO APLICA'}
ANCHOR FINAL: {beat.get('anchor_end') or 'NO APLICA'}

TRANSCRIPCIÓN EXACTA:
{beat.get('text') or ''}

REGLA:
El HTML define palabras, orden y rangos. Esta agrupación debe ser semánticamente coherente y durar 4–9 s. El Motion puede explicar la parte, pero no puede reescribirla ni alterar su certeza, causalidad, sujeto o alcance.
"""


def _motion_text(beat, treatment, selection, placement):
    actual = selection["motion_primary"]
    alternative = selection.get("motion_alternative") or "M1"
    possible = placement["motion_primary"]
    return f"""ABRAXAS V4.2.1 · DECISIÓN DE MOTION

PARTE: {beat.get('beat_id')}
DECISIÓN: {selection['decision']}
MOTION PRINCIPAL: {actual} · {HUMAN_MOTION_NAMES[actual]}
REFERENCIA POSIBLE: {possible} · {HUMAN_MOTION_NAMES[possible]}
ALTERNATIVO: {alternative} · {HUMAN_MOTION_NAMES.get(alternative, alternative)}
TRATAMIENTO DEL HTML: {treatment.get('treatment_family') or 'PRESENTER_ONLY'}
PISTA / MODO: {placement.get('track')} · {placement.get('placement_mode')}

POR QUÉ:
{selection.get('why_motion')}

LÓGICA DEL HTML:
{treatment.get('logic') or 'No especificada.'}

ESCENA APROBADA / POSIBLE:
{treatment.get('scene') or 'Mantener speaker/source.'}

RELACIÓN CON LO DICHO:
La imagen debe hacer visible el mecanismo, tensión, estado o consecuencia de la transcripción exacta. No debe elegir un objeto por palabra clave ni inventar una tesis nueva.

CUÁNDO ES MEJOR NO USARLO:
Si el rostro, la reacción, el gesto o la pausa comunican más que el recurso visual; si el Motion repite captions; si añade complejidad sin comprensión; o si obliga a inventar datos, objetos, UI o evidencia.

IDENTIDAD Y QA:
JOC: off-white #F7F3EC, charcoal #111111, rojo #A91616 y vino #65171C. Una idea dominante, continuidad de luz/objeto/escena, materiales reales, captions protegidos. Sin gurú, lujo vacío, stock corporativo, HUD, hologramas, logos inventados, texto basura ni anatomía deformada.
"""


def _asset_prompt_text(beat_folder, placement):
    lines = [
        "ABRAXAS V4.2.1 · CREAR LAS IMÁGENES DE ESTA PARTE",
        f"PARTE: {placement['beat_id']}",
        f"MOTION A ILUSTRAR: {placement['motion_primary']} · {HUMAN_MOTION_NAMES[placement['motion_primary']]}",
        f"USO: {'REFERENCIA OPCIONAL; NO MOTION ES LA DECISIÓN PREFERIDA' if placement.get('optional_reference_only') else 'MOTION RECOMENDADO'}",
        "",
        "Genera cada imagen por separado. No hagas collage, mosaico ni contact sheet.",
        "Guarda cada resultado en la subcarpeta indicada dentro de 10_IMAGENES_GENERADAS.",
        "Conserva continuidad de sujeto/objeto, escena, cámara, luz, materiales, paleta y geometría.",
        "",
    ]
    for index, asset in enumerate(placement.get("expected_assets") or [], 1):
        folder_name = IMAGE_ROLE_NAMES.get(index, f"{index:02d}_IMAGEN")
        friendly = f"IMAGEN_{index:02d}_{folder_name.split('_', 1)[-1]}.png"
        asset["friendly_filename"] = friendly
        asset["destination_folder"] = str(Path(beat_folder) / "10_IMAGENES_GENERADAS" / folder_name)
        lines.extend([
            "=" * 96,
            f"IMAGEN {index}/{len(placement['expected_assets'])} · {friendly}",
            f"GUARDAR EN: 10_IMAGENES_GENERADAS/{folder_name}/",
            f"TIEMPO EN ESTA PARTE: {float(asset.get('time_in') or 0):.3f}s → {float(asset.get('time_out') or placement['duration']):.3f}s",
            f"ROL: {asset.get('role')}",
            f"TEXTO EXACTO PERMITIDO: {asset.get('exact_text') or 'NONE'}",
            "",
            asset.get("prompt") or "",
            "",
        ])
    return "\n".join(lines)


def _animation_text(placement):
    note = "Esta animación es opcional: la decisión preferida es mantener source." if placement.get("optional_reference_only") else "Esta animación corresponde al Motion recomendado."
    return f"""ABRAXAS V4.2.1 · ANIMAR EL MOTION DE ESTA PARTE

{note}
Usa las imágenes de 10_IMAGENES_GENERADAS como referencias en su orden numérico.
Guarda el resultado dentro de 20_MOTION_ANIMADO como MOTION_FINAL.mp4 o MOTION_FINAL.mov.

{placement.get('animation_prompt') or ''}
"""


def _render_or_reference_cut(cfg, source_master, source_range, target, metadata, render_cuts, dry_run):
    if not source_range:
        return {"status": "NO_SOURCE_RANGE", "path": str(target)}
    if not render_cuts:
        return {"status": "STRUCTURE_ONLY", "path": str(target)}
    metadata = dict(metadata)
    metadata["cache_key"] = stable_hash({
        "source": str(source_master),
        "source_in": round(float(source_range[0]), 3),
        "source_out": round(float(source_range[1]), 3),
        "target": str(target),
        "output_version": cfg.get("output_version", "V4_2"),
        "context": metadata,
    })
    return encode_part(cfg, source_master, source_range[0], source_range[1], target, metadata, dry_run=dry_run)


def _materialize_existing(source, target):
    source = Path(source)
    target = Path(target)
    if not source.is_file() or source.stat().st_size == 0:
        return False
    ensure_dir(target.parent)
    materialize_named_part(source, target)
    return True


def _create_beat_package(cfg, root, source_html, source_master, content_id, item_title, beat, orientation,
                         variant, section_role, treatment, selection, source_range, source_status,
                         sequence_index, render_cuts=False, dry_run=False, enforce_delivery_gate=True):
    speaker = _safe(beat.get("speaker") or "SIN_SPEAKER", 24)
    duration = float(beat.get("planned_seconds") or beat.get("duration_seconds") or 0)
    if source_range:
        duration = round(source_range[1] - source_range[0], 3)
    if enforce_delivery_gate and not (4.0 <= duration <= 9.0):
        raise ValueError(f"DELIVERY_PART_OUTSIDE_4_9:{content_id}:{beat.get('beat_id')}:{duration:.3f}s")
    folder = ensure_dir(root / f"{sequence_index:02d}_{_safe(beat.get('beat_id'), 42)}__{speaker}")
    cut_name = f"{_safe(beat.get('beat_id'), 48)}_CORTE.mp4"
    cut_path = folder / cut_name
    cut_result = _render_or_reference_cut(
        cfg, source_master, source_range, cut_path,
        {"content_id": content_id, "beat_id": beat.get("beat_id"), "orientation": orientation, "variant": variant, "source_status": source_status},
        render_cuts, dry_run,
    )
    if source_status == "VOICEOVER_NO_SOURCE_TIMECODE":
        _write_text(folder / "VO_AUDIO_Y_CORTE_PENDIENTES.txt", "Esta parte es Voice Over. Graba/crea el audio con el texto exacto de 00_ORIGEN_Y_TRANSCRIPCION.txt; no se inventa un corte del master.")
    elif source_status == "ASSEMBLY_COMPOSITE_REQUIRES_TIMELINE_CONFORM":
        _write_text(folder / "CONFORMAR_PARTE_EN_TIMELINE.txt", "Esta parte agrupa beats editoriales contiguos de la ruta final. Confórmala en DaVinci según child_beat_ids y 00_ORIGEN_Y_TRANSCRIPCION.txt; no existe como rango único del master.")
    elif not source_range:
        _write_text(folder / "CORTE_PENDIENTE_DE_MICROTRIM.txt", "No existe un rango exacto aprobado. Resuelve el microtrim por anchors antes de generar este MP4; planned_seconds no es un timecode.")

    placement = _prompt_placement(content_id, orientation, variant, beat, treatment, selection, max(duration, 0.1))
    _write_text(folder / "00_ORIGEN_Y_TRANSCRIPCION.txt", _origin_text(source_html, source_master, content_id, item_title, beat, source_status, source_range, orientation, variant, section_role))
    _write_text(folder / "01_MOTION_RECOMENDADO.txt", _motion_text(beat, treatment, selection, placement))
    _write_text(folder / "02_PROMPT_CREAR_IMAGENES.txt", _asset_prompt_text(folder, placement))
    _write_text(folder / "03_PROMPT_ANIMAR_MOTION.txt", _animation_text(placement))
    _write_text(folder / "04_GUIA_DAVINCI.txt", _davinci_guide(content_id, beat, placement, source_status, source_range, orientation, variant))

    for index, asset in enumerate(placement.get("expected_assets") or [], 1):
        state_folder = ensure_dir(folder / "10_IMAGENES_GENERADAS" / IMAGE_ROLE_NAMES.get(index, f"{index:02d}_IMAGEN"))
        _write_placeholder(state_folder, "GUARDA_AQUI_LA_IMAGEN.txt", f"Filename recomendado: {asset.get('friendly_filename')}\nGenera esta imagen con 02_PROMPT_CREAR_IMAGENES.txt.")
    if not placement.get("expected_assets"):
        _write_placeholder(folder / "10_IMAGENES_GENERADAS", "NO_SE_REQUIEREN_IMAGENES.txt", "No Motion es la decisión activa. La carpeta queda disponible si se aprueba después una referencia opcional.")
    _write_placeholder(folder / "20_MOTION_ANIMADO", "GUARDA_AQUI_MOTION_FINAL.txt", "Guardar como MOTION_FINAL.mp4 o MOTION_FINAL.mov, limpio y sin audio.")
    _write_placeholder(folder / "30_EXPORTS_DAVINCI", "GUARDA_AQUI_EXPORTS_Y_PRUEBAS.txt", "Guardar renders de prueba, stills de comparación y exports de esta parte.")

    handoff = {
        "schema_version": "abraxas.html-part-package.v4.2.1",
        "content_id": content_id,
        "title": item_title,
        "orientation": orientation,
        "variant": variant,
        "section_role": section_role,
        "sequence_index": sequence_index,
        "beat_id": beat.get("beat_id"),
        "delivery_part_id": beat.get("delivery_part_id") or beat.get("beat_id"),
        "child_beat_ids": beat.get("child_beat_ids") or [],
        "speaker": beat.get("speaker"),
        "transcript_exact": beat.get("text") or "",
        "source_html": str(source_html),
        "source_master": str(source_master),
        "source_status": source_status,
        "source_in": source_range[0] if source_range else None,
        "source_out": source_range[1] if source_range else None,
        "duration": duration,
        "duration_gate_4_9": "PASS" if 4.0 <= duration <= 9.0 else "NOT_APPLICABLE_REVIEW_RANGE",
        "motion_decision": selection,
        "motion_prompt_reference": {k: v for k, v in placement.items() if k not in {"animation_prompt"}},
        "paths": {
            "folder": str(folder),
            "cut_mp4": str(cut_path),
            "generated_images": str(folder / "10_IMAGENES_GENERADAS"),
            "animated_motion": str(folder / "20_MOTION_ANIMADO"),
            "davinci_exports": str(folder / "30_EXPORTS_DAVINCI"),
        },
        "cut_result": cut_result,
    }
    write_json_atomic(folder / "05_HANDOFF_DAVINCI.json", handoff)
    return handoff


def _video_guide(content_id, orientation, variant):
    if orientation == "horizontal":
        return f"""ABRAXAS V4.2.5 · GUÍA DEL VIDEO HORIZONTAL COMPLETO

VIDEO: {content_id}
ORIENTACIÓN: HORIZONTAL
VARIANTE: {variant}

1. El archivo de 00_VIDEO_COMPLETO es el video canónico. No lo reconstruyas con cortes de 4–9 segundos.
2. 01_SECCIONES conserva bloques narrativos completos según los rangos del HTML; una sección puede durar varios minutos.
3. Dentro de cada sección, 01_MOTIONS_DENTRO_DE_LA_SECCION contiene únicamente oportunidades Motion de 4–9 s.
4. Densidad obligatoria: máximo dos inicios de Motion dentro de cualquier ventana móvil de 60 segundos.
5. Entre motions, conserva cámara/source sin crear clips físicos adicionales.
6. Si usas imágenes, colócalas sobre el rango del Motion y conserva el audio original en A1.
7. Si usas MOTION_FINAL, elimina su audio, reemplaza los frames temporales y alinéalo exactamente con el rango indicado.
8. No cambies palabras, orden, duración del video completo o certeza para acomodar un Motion.
9. Guarda renders y revisiones en 30_EXPORTS_DAVINCI.
"""
    return f"""ABRAXAS V4.2.1 · GUÍA DEL VIDEO COMPLETO

VIDEO: {content_id}
ORIENTACIÓN: {orientation.upper()}
VARIANTE: {variant}

1. Usa 00_ORDEN_Y_TRANSCRIPCION.txt como orden canónico. No ordenes por filename ni por timestamp original cuando la secuencia editorial sea reensamblada.
2. Cada parte física dentro de 01_SECCIONES dura 4–9 s, agrupa beats vecinos con coherencia y tiene MP4/contexto, decisión de Motion, prompts y guía DaVinci.
3. Si usas imágenes, colócalas en la pista indicada por cada 04_GUIA_DAVINCI.txt y conserva el audio del corte.
4. Si usas Motion animado, toma MOTION_FINAL de 20_MOTION_ANIMADO, quita su audio y alinéalo exactamente con la parte.
5. Si una parte dice NO MOTION, conserva rostro/source; la referencia visual es opcional.
6. No cambies palabras, orden, duración o certeza para acomodar un Motion.
7. Al terminar, guarda el render maestro y la revisión dentro de 30_EXPORTS_DAVINCI del video o de la parte correspondiente.
"""


def _write_video_level_files(video_root, manifest, handoffs):
    lines = [
        "ABRAXAS V4.2.1 · ORDEN CANÓNICO DEL VIDEO",
        f"CONTENT_ID: {manifest['content_id']}",
        f"TÍTULO: {manifest['title']}",
        f"ORIENTACIÓN: {manifest['orientation'].upper()}",
        f"VARIANTE: {manifest['variant']}",
        f"HTML FUENTE: {manifest['source_html']}",
        "",
    ]
    entry_label = "MOTION" if manifest.get("orientation") == "horizontal" else "PARTE"
    for item in sorted(handoffs, key=lambda x: x["sequence_index"]):
        start = format_timecode(item["source_in"]) if item.get("source_in") is not None else item["source_status"]
        end = format_timecode(item["source_out"]) if item.get("source_out") is not None else item["source_status"]
        lines.extend([
            f"{entry_label} {item['sequence_index']:02d}. {item['beat_id']} · {item.get('speaker') or 'SIN SPEAKER'} · {start} → {end}",
            f"    {item['transcript_exact']}",
            f"    MOTION: {item['motion_decision']['decision']} · {item['motion_decision']['motion_primary']} · alternativa {item['motion_decision'].get('motion_alternative')}",
            "",
        ])
    _write_text(video_root / "00_ORDEN_Y_TRANSCRIPCION.txt", "\n".join(lines))

    image_lines = [
        "ABRAXAS V4.2.1 · PROMPT MAESTRO PARA TODAS LAS IMÁGENES DEL VIDEO",
        "Genera cada imagen individualmente y guárdala en la ruta indicada. No hagas contact sheet.",
        "",
    ]
    animation_lines = [
        "ABRAXAS V4.2.1 · PROMPTS DE ANIMACIÓN DEL VIDEO",
        "Cada Motion se anima por separado, sin audio, con la duración exacta de su parte.",
        "",
    ]
    for item in sorted(handoffs, key=lambda x: x["sequence_index"]):
        folder = Path(item["paths"]["folder"])
        image_lines.extend(["#" * 96, f"PARTE {item['sequence_index']:02d} · {item['beat_id']}", f"CARPETA: {folder}", (folder / "02_PROMPT_CREAR_IMAGENES.txt").read_text(encoding="utf-8"), ""])
        animation_lines.extend(["#" * 96, f"PARTE {item['sequence_index']:02d} · {item['beat_id']}", f"CARPETA: {folder}", (folder / "03_PROMPT_ANIMAR_MOTION.txt").read_text(encoding="utf-8"), ""])
    _write_text(video_root / "01_PROMPT_TODAS_LAS_IMAGENES.txt", "\n".join(image_lines))
    _write_text(video_root / "02_PROMPT_TODAS_LAS_ANIMACIONES.txt", "\n".join(animation_lines))
    _write_text(video_root / "03_GUIA_DAVINCI_VIDEO_COMPLETO.txt", _video_guide(manifest["content_id"], manifest["orientation"], manifest["variant"]))
    write_json_atomic(video_root / "04_MANIFEST_VIDEO.json", {**manifest, "parts": handoffs})
    _write_placeholder(video_root / "30_EXPORTS_DAVINCI", "GUARDA_AQUI_VIDEO_FINAL.txt", "Guardar render final, revisión y master de esta variante.")


def _content_complete_path(cfg, content_id, orientation):
    base = Path(cfg["_paths"]["vertical" if orientation == "vertical" else "horizontal"]) / content_id / "MEDIA"
    return base, base / f"{content_id}_{orientation.upper()}_SOURCE.mp4"


def _build_content_item(cfg, item, family, orientation, bundle, resolutions, render_cuts, dry_run, motion_plan=None):
    media_root, existing_complete = _content_complete_path(cfg, item["id"], orientation)
    ensure_dir(media_root)
    video_root = ensure_dir(media_root / "00_VIDEO_COMPLETO")
    friendly_complete = video_root / f"{item['id']}_VIDEO_COMPLETO_{orientation.upper()}.mp4"
    _materialize_existing(existing_complete, friendly_complete)
    if not friendly_complete.exists():
        _write_text(video_root / "VIDEO_COMPLETO_PENDIENTE.txt", f"Ejecuta los workers de render. Origen esperado: {existing_complete}")
    sections_root = ensure_dir(media_root / "01_SECCIONES")
    source_master = cfg["inputs"][f"{orientation}_master"]
    source_html = cfg["inputs"]["content_html"]
    delivery_parts = item.get("delivery_parts_4_9") or []
    horizontal_motions = []
    if orientation == "horizontal":
        horizontal_motions = [
            placement for placement in (motion_plan or {}).get("placements", [])
            if placement.get("content_family") == "horizontals"
            and placement.get("content_id") == item.get("id")
            and placement.get("orientation") == "horizontal"
            and placement.get("assembly_variant") == "SOURCE"
            and placement.get("readiness") == "READY_FOR_IMAGE_GENERATION"
        ]
        beats_by_segment = {index: [] for index in range(len(item.get("segments", [])))}
        for placement in horizontal_motions:
            source_in = placement.get("source_in")
            source_out = placement.get("source_out")
            best = None
            if source_in is not None and source_out is not None:
                for index, segment in enumerate(item.get("segments", [])):
                    start = parse_timecode(segment["start"])
                    end = parse_timecode(segment["end"])
                    overlap = max(0.0, min(end, float(source_out)) - max(start, float(source_in)))
                    if best is None or overlap > best[0]:
                        best = (overlap, index)
            if best and best[0] > 0:
                beats_by_segment[best[1]].append(placement)
    elif delivery_parts:
        beats_by_segment = {
            index: [part for part in delivery_parts if int(part.get("section_order") or 0) == index + 1]
            for index in range(len(item.get("segments", [])))
        }
    else:
        beats_by_segment = _assign_beats_to_segments(item, resolutions)
    all_handoffs = []
    global_index = 1
    for segment_index, segment in enumerate(item.get("segments", []), 1):
        role = segment.get("role") or f"SECCION_{segment_index:02d}"
        section_folder = ensure_dir(sections_root / f"{segment_index:02d}_{_safe(role, 36)}")
        source_named = media_root / "PARTS" / f"{item['id']}_SEG_{segment_index:02d}.mp4"
        friendly_section = section_folder / f"{item['id']}_SECCION_{segment_index:02d}_{_safe(role, 24)}.mp4"
        if not _materialize_existing(source_named, friendly_section) and render_cuts:
            metadata = {"content_id": item["id"], "section": segment_index, "role": role, "orientation": orientation}
            metadata["cache_key"] = stable_hash({
                "source": str(source_master), "start": segment["start"], "end": segment["end"],
                "target": str(friendly_section), "output_version": cfg.get("output_version", "V4_2"),
            })
            encode_part(cfg, source_master, segment["start"], segment["end"], friendly_section,
                        metadata, dry_run=dry_run)
        _write_text(section_folder / "00_CONTEXTO_DE_LA_SECCION.txt", f"""VIDEO: {item['id']} · {item.get('title')}
HTML FUENTE: {source_html}
MASTER: {source_master}
SECCIÓN: {segment_index:02d} · {role}
RANGO EXACTO: {segment['start']} → {segment['end']}
SPEAKER: {segment.get('speaker') or 'NO ESPECIFICADO'}

TRANSCRIPCIÓN LITERAL:
{segment.get('source_literal') or ''}
""")
        section_duration = parse_timecode(segment["end"]) - parse_timecode(segment["start"])
        _write_text(section_folder / "01_POLITICA_DE_DURACION.txt", (
            f"DURACIÓN DE LA SECCIÓN: {section_duration:.3f} s\n"
            + ("SECCIÓN LONG-FORM: conservar completa; no dividir en clips de 4–9 s.\nLos únicos rangos de 4–9 s son las oportunidades Motion listadas en la subcarpeta.\n" if orientation == "horizontal" else "Las partes físicas internas siguen el contrato 4–9 s.\n")
        ))
        parts_root = ensure_dir(section_folder / ("01_MOTIONS_DENTRO_DE_LA_SECCION" if orientation == "horizontal" else "01_PARTES_Y_MOTIONS"))
        section_entries = beats_by_segment.get(segment_index - 1, [])
        if orientation == "horizontal" and not section_entries:
            _write_placeholder(parts_root, "SIN_MOTION_RECOMENDADO_EN_ESTA_SECCION.txt", "Conservar cámara/source en toda esta sección. No crear fragmentos físicos de 4–9 s.")
        for source_entry in section_entries:
            if orientation == "horizontal":
                beat = {
                    "beat_id": source_entry.get("beat_id"),
                    "speaker": source_entry.get("speaker"),
                    "text": source_entry.get("transcript_exact") or "",
                    "planned_seconds": source_entry.get("duration"),
                    "duration_seconds": source_entry.get("duration"),
                    "narrative_function": source_entry.get("narrative_function"),
                    "source_start": source_entry.get("source_in"),
                    "source_end": source_entry.get("source_out"),
                    "requires_microtrim": False,
                    "delivery_role": "MOTION_INSERT_ONLY",
                }
                source_range = (float(source_entry["source_in"]), float(source_entry["source_out"]))
                source_status = "HORIZONTAL_MOTION_WINDOW_FROM_HTML"
                treatment = source_entry.get("treatment") or {"treatment_family": source_entry.get("treatment_family") or "PRESENTER_ONLY"}
                selection = {key: source_entry.get(key) for key in (
                    "motion_primary", "motion_alternative", "why_motion", "name",
                    "placement_mode", "track", "description", "selection_source",
                )}
                selection["decision"] = "MOTION_RECOMENDADO"
            else:
                beat = source_entry
                source_range, source_status = _resolved_range(beat, resolutions)
                treatment = _content_treatment(item, beat, orientation)
                selection = _motion_decision(beat, treatment, {"format": orientation}, overrides=cfg.get("motion", {}).get("selection_overrides", {}))
            handoff = _create_beat_package(cfg, parts_root, source_html, source_master, item["id"], item.get("title"), beat,
                                           orientation, "SOURCE", role, treatment, selection, source_range, source_status,
                                           global_index, render_cuts, dry_run)
            all_handoffs.append(handoff)
            global_index += 1
    manifest = {
        "schema_version": "abraxas.html-video-package.v4.2.1",
        "content_id": item["id"], "title": item.get("title"), "family": family,
        "orientation": orientation, "variant": "SOURCE", "source_html": str(source_html),
        "source_master": str(source_master), "complete_video": str(friendly_complete),
        "canonical_contract": "HORIZONTAL_COMPLETE_PLUS_COHERENT_SECTIONS_AND_SPARSE_MOTIONS" if orientation == "horizontal" else "HTML_SEGMENTS_PLUS_SEMANTIC_DELIVERY_PARTS_4_9",
        "horizontal_motion_policy": ({
            "physical_fragments_4_9": False,
            "motion_windows_only": True,
            "maximum_motions_per_rolling_minute": 2,
            "motion_window_seconds": [4, 9],
            "selected_motion_count": len(horizontal_motions),
        } if orientation == "horizontal" else None),
    }
    _write_video_level_files(video_root, manifest, all_handoffs)
    return manifest, all_handoffs


def _intro_lookup(intro):
    lookup = {}
    for beat in intro.get("source_beats", []) + intro.get("source_replacement", []):
        lookup[beat["beat_id"]] = beat
    for vo in intro.get("voiceover_options", []):
        for beat in vo.get("beats", []):
            lookup[beat["beat_id"]] = beat
    return lookup


def _intro_variants(intro):
    base = intro.get("assembly_recommended", [])
    variants = {}
    for vo_id in ("VO_A", "VO_B", "VO_C"):
        variants[vo_id] = [beat_id.replace("_VO_A_", f"_{vo_id}_") if "_VO_A_" in beat_id else beat_id for beat_id in base]
    variants["SOURCE_REPLACEMENT"] = intro.get("assembly_source_replacement", [])
    return variants


def _potential_range(potential):
    raw = str(potential.get("range") or "").strip()
    pieces = re.split(r"\s*[–—-]\s*", raw, maxsplit=1)
    if len(pieces) != 2:
        return None
    return parse_timecode(pieces[0]), parse_timecode(pieces[1])


def _build_potential_item(cfg, potential, render_cuts, dry_run):
    """Build a review package without promoting a POTENTIAL into an approved clip.

    The HTML only defines a candidate range and transcript for these entries, so
    V4.2 preserves that exact level of certainty: one review section, one
    no-Motion-first part and an optional process Motion reference.
    """
    source_range = _potential_range(potential)
    source_master = cfg["inputs"]["vertical_master"]
    source_html = cfg["inputs"]["content_html"]
    media_root = ensure_dir(Path(cfg["_paths"]["potentials"]) / potential["id"] / "MEDIA")
    video_root = ensure_dir(media_root / "00_VIDEO_COMPLETO")
    sections_root = ensure_dir(media_root / "01_SECCIONES" / "01_RANGO_CANDIDATO_POR_REVISAR")
    review_root = ensure_dir(sections_root / "01_PARTES_Y_MOTIONS")
    complete_path = video_root / f"{potential['id']}_RANGO_CANDIDATO_VERTICAL.mp4"
    status = "EXACT_HTML_RANGE" if source_range else "MISSING_SOURCE_RANGE"
    cut_result = _render_or_reference_cut(
        cfg, source_master, source_range, complete_path,
        {"content_id": potential["id"], "family": "potentials", "status": potential.get("status")},
        render_cuts, dry_run,
    )
    if not complete_path.exists():
        _write_text(video_root / "VIDEO_CANDIDATO_PENDIENTE.txt", (
            "Este rango está marcado POTENTIAL en el HTML. El comando puede cortarlo para revisión, "
            "pero no lo promueve a clip aprobado ni inventa beats internos."
        ))
    if source_range:
        _write_text(sections_root / "00_CONTEXTO_DE_LA_SECCION.txt", f"""VIDEO CANDIDATO: {potential['id']} · {potential.get('title')}
HTML FUENTE: {source_html}
MASTER: {source_master}
RANGO EXACTO PARA REVISIÓN: {format_timecode(source_range[0])} → {format_timecode(source_range[1])}
ESTADO: {potential.get('status')}
NOTA: {potential.get('note')}
SIGUIENTE ACCIÓN: {potential.get('next_action')}

TRANSCRIPCIÓN LITERAL:
{potential.get('source_text') or ''}
""")
    beat = {
        "beat_id": f"{potential['id']}_RANGO_COMPLETO_POR_REVISAR",
        "source_type": "SOURCE",
        "speaker": "JOC / Amanda Vicari",
        "narrative_function": "POTENTIAL_REVIEW_RANGE",
        "text": potential.get("source_text") or "",
        "planned_seconds": round(source_range[1] - source_range[0], 3) if source_range else 0,
        "kind": "EXACT_CANDIDATE_RANGE",
        "requires_microtrim": False,
        "source_start": source_range[0] if source_range else "",
        "source_end": source_range[1] if source_range else "",
        "motion_policy": {
            "primary": "M0",
            "possible_motion_reference": "M4",
            "reason": "El HTML marca este bloque como POTENTIAL y todavía no define beats internos. Mantener source hasta aprobar el clip y su subdivisión; M4 queda solo como referencia posible.",
        },
    }
    treatment = {
        "treatment_family": "PRESENTER_ONLY",
        "logic": "Rango candidato pendiente de promoción; no inventar una estructura visual que el HTML aún no aprobó.",
        "spoken_context": beat["text"],
        "duration_seconds": beat["planned_seconds"],
        "scene": "Mantener source para revisión. Si se aprueba y subdivide, representar el proceso central sin añadir datos.",
        "states": {},
    }
    selection = _motion_decision(beat, treatment, {"format": "potential"}, overrides=cfg.get("motion", {}).get("selection_overrides", {}))
    handoff = _create_beat_package(
        cfg, review_root, source_html, source_master, potential["id"], potential.get("title"), beat,
        "vertical", "RANGO_CANDIDATO", "POTENTIAL_REVIEW_RANGE", treatment, selection,
        source_range, status, 1, render_cuts=False, dry_run=dry_run, enforce_delivery_gate=False,
    )
    handoff["cut_result"] = cut_result
    handoff["paths"]["cut_mp4"] = str(complete_path)
    write_json_atomic(Path(handoff["paths"]["folder"]) / "05_HANDOFF_DAVINCI.json", handoff)
    manifest = {
        "schema_version": "abraxas.html-video-package.v4.2.1",
        "content_id": potential["id"], "title": potential.get("title"), "family": "potentials",
        "status": potential.get("status"), "orientation": "vertical", "variant": "RANGO_CANDIDATO",
        "source_html": str(source_html), "source_master": str(source_master),
        "complete_video": str(complete_path), "canonical_contract": "HTML_POTENTIAL_RANGE_FOR_REVIEW_ONLY",
    }
    _write_video_level_files(video_root, manifest, [handoff])
    return manifest, [handoff]


def _build_intro_item(cfg, intro, orientation, resolutions, render_cuts, dry_run):
    media_root = ensure_dir(Path(cfg["_paths"]["intro"]) / intro["id"] / "MEDIA" / orientation.upper())
    package_root = ensure_dir(media_root / "PAQUETES_POR_VARIANTE")
    source_master = cfg["inputs"][f"{orientation}_master"]
    source_html = cfg["inputs"]["intro_html"]
    lookup = _intro_lookup(intro)
    results = []
    strict_variants = intro.get("delivery_variants_4_9") or {}
    variant_sequences = strict_variants or {
        variant: [lookup[beat_id] for beat_id in sequence]
        for variant, sequence in _intro_variants(intro).items()
    }
    for variant, sequence in variant_sequences.items():
        variant_root = ensure_dir(package_root / variant)
        video_root = ensure_dir(variant_root / "00_VIDEO_COMPLETO")
        friendly_complete = video_root / f"{intro['id']}_{variant}_{orientation.upper()}_VIDEO_COMPLETO.mp4"
        if variant == "SOURCE_REPLACEMENT":
            existing = media_root / f"{intro['id']}_{orientation.upper()}_SOURCE_REPLACEMENT.mp4"
            _materialize_existing(existing, friendly_complete)
            if not friendly_complete.exists():
                _write_text(video_root / "VIDEO_COMPLETO_PENDIENTE.txt", f"Ejecuta los workers. Origen esperado: {existing}")
        else:
            _write_text(video_root / "VIDEO_COMPLETO_PENDIENTE_DE_VO.txt", f"Graba/crea {variant}; después reemplaza el slot VO siguiendo 00_ORDEN_Y_TRANSCRIPCION.txt. No se genera voz sintética automáticamente.")
        sections_root = ensure_dir(variant_root / "01_SECCIONES")
        handoffs = []
        for index, sequence_item in enumerate(sequence, 1):
            beat = sequence_item if isinstance(sequence_item, dict) else lookup[sequence_item]
            source_range, source_status = _resolved_range(beat, resolutions)
            treatment = _intro_treatment(beat, orientation)
            position = "FIRST" if index == 1 else "LAST" if index == len(sequence) else "MIDDLE"
            selection = _motion_decision(beat, treatment, {"format": "intro"}, position=position,
                                         overrides=cfg.get("motion", {}).get("selection_overrides", {}))
            handoff = _create_beat_package(cfg, sections_root, source_html, source_master, intro["id"], intro.get("title"), beat,
                                           orientation, variant, beat.get("narrative_function") or "INTRO_BEAT", treatment,
                                           selection, source_range, source_status, index, render_cuts, dry_run)
            handoffs.append(handoff)
        manifest = {
            "schema_version": "abraxas.html-video-package.v4.2.1",
            "content_id": intro["id"], "title": intro.get("title"), "family": "intros",
            "route_class": intro.get("route_class"), "speaker_mix": intro.get("speaker_mix"),
            "orientation": orientation, "variant": variant, "source_html": str(source_html),
            "source_master": str(source_master), "complete_video": str(friendly_complete),
            "canonical_contract": "INTRO_ASSEMBLY_PLUS_SEMANTIC_DELIVERY_PARTS_4_9_FROM_HTML",
        }
        _write_video_level_files(video_root, manifest, handoffs)
        results.append((manifest, handoffs))
    return results


def build_html_video_packages(cfg, bundle, resolutions=None, render_cuts=False, dry_run=False, motion_plan=None):
    resolutions = resolutions or {}
    report = {
        "schema_version": "abraxas.html-packages-report.v4.2.1",
        "render_cuts": render_cuts,
        "dry_run": dry_run,
        "videos": [],
        "counts": defaultdict(int),
        "pending_microtrims": [],
    }
    content = bundle.get("content", {})
    for family, orientation in (("verticals", "vertical"), ("horizontals", "horizontal")):
        for item in content.get(family, []):
            manifest, handoffs = _build_content_item(cfg, item, family, orientation, bundle, resolutions, render_cuts, dry_run, motion_plan=motion_plan)
            report["videos"].append(manifest)
            report["counts"]["content_videos"] += 1
            report["counts"]["parts"] += len(handoffs)
            for part in handoffs:
                if part.get("duration_gate_4_9") == "PASS":
                    report["counts"]["strict_parts_4_9"] += 1
                else:
                    report["counts"]["strict_part_violations"] += 1
                if part["source_status"] == "PENDING_MICROTRIM":
                    report["pending_microtrims"].append(part["beat_id"])
                if part["motion_decision"]["motion_primary"] == "M0":
                    report["counts"]["no_motion_recommended"] += 1
                else:
                    report["counts"]["motion_recommended"] += 1
    for potential in content.get("potentials", []):
        manifest, handoffs = _build_potential_item(cfg, potential, render_cuts, dry_run)
        report["videos"].append(manifest)
        report["counts"]["potential_review_ranges"] += 1
        report["counts"]["parts"] += len(handoffs)
        report["counts"]["no_motion_recommended"] += len(handoffs)
    for intro in bundle.get("intro", {}).get("intros", []):
        for orientation in ("vertical", "horizontal"):
            for manifest, handoffs in _build_intro_item(cfg, intro, orientation, resolutions, render_cuts, dry_run):
                report["videos"].append(manifest)
                report["counts"]["intro_variants"] += 1
                report["counts"]["parts"] += len(handoffs)
                for part in handoffs:
                    if part.get("duration_gate_4_9") == "PASS":
                        report["counts"]["strict_parts_4_9"] += 1
                    else:
                        report["counts"]["strict_part_violations"] += 1
                    if part["source_status"] == "PENDING_MICROTRIM":
                        report["pending_microtrims"].append(part["beat_id"])
                    if part["source_status"] == "VOICEOVER_NO_SOURCE_TIMECODE":
                        report["counts"]["voiceover_parts"] += 1
                    if part["motion_decision"]["motion_primary"] == "M0":
                        report["counts"]["no_motion_recommended"] += 1
                    else:
                        report["counts"]["motion_recommended"] += 1
    report["counts"] = dict(report["counts"])
    report["pending_microtrims"] = sorted(set(report["pending_microtrims"]))
    target = Path(cfg["_paths"]["manifest"]) / "HTML_VIDEO_PACKAGES_REPORT_V4_2.json"
    write_json_atomic(target, report)
    return report
