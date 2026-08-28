#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON_BIN="${ABRAXAS_PYTHON:-python3}"
PROJECT_DESKTOP="$HOME/Desktop/Joc podcast next ep 55"
MASTERS_DIR="$PROJECT_DESKTOP/00_MASTERS_OFICIALES"
VERTICAL_MASTER="${ABRAXAS_VERTICAL_MASTER:-$MASTERS_DIR/JOC55_MASTER_VERTICAL_OFICIAL.mp4}"
HORIZONTAL_MASTER="${ABRAXAS_HORIZONTAL_MASTER:-$MASTERS_DIR/JOC55_MASTER_HORIZONTAL_OFICIAL.mp4}"

if [ -n "${ABRAXAS_OUTPUT_ROOT:-}" ]; then
  OUTPUT_ROOT="$ABRAXAS_OUTPUT_ROOT"
elif [ -d "$MASTERS_DIR/JOC55_ABRAXAS_V4_2_OUTPUT" ]; then
  OUTPUT_ROOT="$MASTERS_DIR/JOC55_ABRAXAS_V4_2_OUTPUT"
else
  OUTPUT_ROOT="$PROJECT_DESKTOP/JOC55_ABRAXAS_V4_2_OUTPUT"
fi

command -v "$PYTHON_BIN" >/dev/null 2>&1 || { echo "ERROR: python3 no está disponible."; exit 2; }
mkdir -p "$OUTPUT_ROOT/00_MANIFEST" "$OUTPUT_ROOT/00_CONTROL"

ARGS=(
  build
  --content-html "$ROOT/INPUT/JOC55_AMANDA_CONTENT_ENGINE_V4_2_5_BASE.html"
  --intro-html "$ROOT/INPUT/JOC55_AMANDA_INTRO_LAB_V4_2_5_BASE.html"
  --transcript "$ROOT/INPUT/TRANSCRIPCION_SRT_ORIGINAL.txt"
  --resolutions "$ROOT/INPUT/PREAPPROVED_MICROTRIM_RESOLUTIONS_V4_2_3.json"
  --output-root "$OUTPUT_ROOT"
)

if [ "${ABRAXAS_RENDER_REFERENCES:-1}" = "1" ] && command -v ffmpeg >/dev/null 2>&1 && command -v ffprobe >/dev/null 2>&1 && [ -f "$VERTICAL_MASTER" ] && [ -f "$HORIZONTAL_MASTER" ]; then
  FFMPEG_ENCODERS="$(ffmpeg -hide_banner -encoders 2>&1)"
  if [[ "$FFMPEG_ENCODERS" != *h264_videotoolbox* ]]; then
    echo "ERROR: ffmpeg no ofrece h264_videotoolbox; se prohíbe fallback a libx264 porque el contrato es 40M Apple VT."
    exit 2
  fi
  ARGS+=(
    --render-references
    --vertical-master "$VERTICAL_MASTER"
    --horizontal-master "$HORIZONTAL_MASTER"
    --ffmpeg "$(command -v ffmpeg)"
    --ffprobe "$(command -v ffprobe)"
    --reference-timeout-seconds "${ABRAXAS_REFERENCE_TIMEOUT_SECONDS:-180}"
  )
else
  echo "AVISO: no se crearán SOURCE_REFERENCE.mp4 (falta ffmpeg/ffprobe/master o ABRAXAS_RENDER_REFERENCES=0)."
fi

"$PYTHON_BIN" "$ROOT/ENGINE/ai_motion_engine_v4_2_24.py" "${ARGS[@]}"
"$PYTHON_BIN" "$ROOT/ENGINE/update_intro_lab_v4_2_24.py" \
  --source "$ROOT/INPUT/JOC55_AMANDA_INTRO_LAB_V4_2_5_BASE.html" \
  --output "$OUTPUT_ROOT/00_MANIFEST/JOC55_AMANDA_INTRO_LAB_V4_2_24.html" \
  --report "$OUTPUT_ROOT/00_MANIFEST/INTRO_LAB_PROTECTION_REPORT_V4_2_24.json"
"$PYTHON_BIN" "$ROOT/ENGINE/build_transcript_reference_v4_2_24.py" \
  --source "$ROOT/INPUT/TRANSCRIPCION_SRT_ORIGINAL.txt" \
  --output "$OUTPUT_ROOT/00_MANIFEST/TRANSCRIPCION_COMPLETA_DIVIDIDA_HASTA_9S_V4_2_24.txt" \
  --qa-output "$OUTPUT_ROOT/00_MANIFEST/TRANSCRIPCION_COMPLETA_DIVIDIDA_HASTA_9S_QA_V4_2_24.json"
cp "$ROOT/INPUT/PREAPPROVED_MICROTRIM_RESOLUTIONS_V4_2_3.json" "$OUTPUT_ROOT/00_MANIFEST/MICROTRIM_RESOLUTIONS.json"

echo
echo "ABRAXAS V4.2.24 CREADO Y VALIDADO"
echo "OUTPUT: $OUTPUT_ROOT"
echo "MAPA: $OUTPUT_ROOT/00_MANIFEST/FINAL_AI_MOTION_MAP_V4_2_24.json"
echo "HTMLS: $OUTPUT_ROOT/00_MANIFEST"
echo "MOTIONS: $OUTPUT_ROOT/09_MOTIONS_V4_2/AI_SELECTED_V4_2_24"
echo "PERFIL DE ENCODE: APPLE_VT_H264_40M_V1 · AAC 192k · atomic partial/validate/replace"
open "$OUTPUT_ROOT" 2>/dev/null || true
