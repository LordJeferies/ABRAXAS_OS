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

[ -f "$VERTICAL_MASTER" ] || { echo "ERROR: no existe $VERTICAL_MASTER"; exit 2; }
[ -f "$HORIZONTAL_MASTER" ] || { echo "ERROR: no existe $HORIZONTAL_MASTER"; exit 2; }
command -v ffmpeg >/dev/null 2>&1 || { echo "ERROR: falta ffmpeg. Ejecute brew install ffmpeg"; exit 2; }
command -v ffprobe >/dev/null 2>&1 || { echo "ERROR: falta ffprobe. Ejecute brew install ffmpeg"; exit 2; }
FFMPEG_ENCODERS="$(ffmpeg -hide_banner -encoders 2>&1)"
[[ "$FFMPEG_ENCODERS" == *h264_videotoolbox* ]] || {
  echo "ERROR: este ffmpeg no incluye h264_videotoolbox; no se permite fallback a libx264."
  exit 2
}

echo "PERFIL BLOQUEADO: APPLE_VT_H264_40M_V1 · un encoder de hardware a la vez"
echo "REANUDACIÓN: conserva entregables válidos y regenera únicamente faltantes o incompatibles"

ABRAXAS_RENDER_REFERENCES="${ABRAXAS_RENDER_REFERENCES:-1}" "$ROOT/TERMINAL/CREAR_HOTFIX.command"

CONTROL="$OUTPUT_ROOT/00_CONTROL"
RUNTIME_PARENT="$CONTROL/RUNTIME_V4_2_24"
RUNTIME="$RUNTIME_PARENT/v42/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION"
mkdir -p "$RUNTIME_PARENT"
if [ ! -f "$RUNTIME/TOOLS/abraxas_cli.py" ]; then
  unzip -q "$ROOT/AUTOMATION/ABRAXAS_V4_2_5_EXECUTABLE_BASELINE_VERIFIED.zip" -d "$RUNTIME_PARENT"
fi

"$PYTHON_BIN" "$ROOT/ENGINE/prepare_full_runtime_v4_2_24.py" \
  --runtime "$RUNTIME" \
  --output-root "$OUTPUT_ROOT" \
  --vertical-master "$VERTICAL_MASTER" \
  --horizontal-master "$HORIZONTAL_MASTER" \
  --content-html "$OUTPUT_ROOT/00_MANIFEST/JOC55_AMANDA_CONTENT_ENGINE_V4_2_24.html" \
  --intro-html "$OUTPUT_ROOT/00_MANIFEST/JOC55_AMANDA_INTRO_LAB_V4_2_24.html" \
  --transcript "$ROOT/INPUT/TRANSCRIPCION_SRT_ORIGINAL.txt"

CFG="$RUNTIME/PROJECT/project_config.json"
CLI="$RUNTIME/TOOLS/abraxas_cli.py"
export PYTHONPATH="$RUNTIME/TOOLS${PYTHONPATH:+:$PYTHONPATH}"

"$PYTHON_BIN" "$CLI" --config "$CFG" validate
"$PYTHON_BIN" "$CLI" --config "$CFG" compile
"$PYTHON_BIN" "$CLI" --config "$CFG" fingerprint
"$PYTHON_BIN" "$CLI" --config "$CFG" assets
"$PYTHON_BIN" "$CLI" --config "$CFG" plan
"$PYTHON_BIN" "$CLI" --config "$CFG" render-worker --worker A
"$PYTHON_BIN" "$CLI" --config "$CFG" render-worker --worker B
"$PYTHON_BIN" "$ROOT/ENGINE/ai_motion_engine_v4_2_24.py" validate --map "$OUTPUT_ROOT/00_MANIFEST/FINAL_AI_MOTION_MAP_V4_2_24.json"

echo
echo "PRODUCCIÓN COMPLETA FINALIZADA"
echo "73 entregables históricos: 24 intros/variantes + 37 verticales + 12 horizontales."
echo "Los verticales y horizontales permanecen completos; no se crearon fragmentos físicos periódicos."
echo "Solo las ventanas seleccionadas aparecen en AI_SELECTED_V4_2_24."
open "$OUTPUT_ROOT" 2>/dev/null || true
