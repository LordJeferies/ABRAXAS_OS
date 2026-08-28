#!/bin/bash
set -euo pipefail

TARGET="${ABRAXAS_TARGET:-$HOME/Downloads/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION}"
CFG="$TARGET/PROJECT/project_config.json"
PY="$TARGET/.venv-mlx/bin/python"
[ -x "$PY" ] || PY=python3
CLI="$TARGET/TOOLS/abraxas_cli.py"
OUT=$("$PY" - "$CFG" <<'PY'
import json,sys
print(json.load(open(sys.argv[1]))['output_root'])
PY
)
mkdir -p "$OUT/12_LOGS"
exec > >(tee -a "$OUT/12_LOGS/V4_2_5_CONTINUACION.log") 2>&1

run() { echo; echo "===== $* ====="; "$PY" "$CLI" --config "$CFG" "$@"; }
keep_awake() { if command -v caffeinate >/dev/null; then caffeinate -dimsu "$@"; else "$@"; fi; }

cd "$TARGET"
run validate
run compile
run fingerprint
run assets
run plan

echo; echo "===== WORKER A: intros y verticales ====="
keep_awake "$PY" "$CLI" --config "$CFG" render-worker --worker A
echo; echo "===== WORKER B: horizontales completos ====="
keep_awake "$PY" "$CLI" --config "$CFG" render-worker --worker B

run html-packages
run davinci
run verify
run status

echo
echo "TODO COMPLETADO. No se hicieron cortes físicos de 4–9 s en horizontales."
echo "Log: $OUT/12_LOGS/V4_2_5_CONTINUACION.log"
