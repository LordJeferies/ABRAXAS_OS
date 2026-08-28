#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
echo "WORKER A · INTRO_G01 → INTRO_G03 → INTRO_M02 → HORIZONTALES"
caffeinate -dimsu "$PY" "$ROOT/TOOLS/abraxas_cli.py" --config "$CFG" render-worker --worker A
rc=$?
pause
exit $rc
