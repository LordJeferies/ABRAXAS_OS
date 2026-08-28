#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
echo "WORKER B · INTRO_G02 → INTRO_M01 → INTRO_M03 → VERTICALES"
caffeinate -dimsu "$PY" "$ROOT/TOOLS/abraxas_cli.py" --config "$CFG" render-worker --worker B
rc=$?
pause
exit $rc
