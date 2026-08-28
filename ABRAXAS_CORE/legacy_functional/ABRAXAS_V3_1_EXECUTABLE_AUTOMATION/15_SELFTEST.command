#!/bin/bash
set -u
ROOT="$(cd "$(dirname "$0")" && pwd)"
PY="$(command -v python3)"
echo "=== ABRAXAS V3.1 · SELFTEST ==="
PYTHONPATH="$ROOT/TOOLS" "$PY" -m unittest discover -s "$ROOT/TESTS" -v
rc=$?
if [ $rc -eq 0 ]; then
  "$PY" -m py_compile "$ROOT/TOOLS/abraxas_cli.py" "$ROOT/TOOLS/mlx_transcribe_helper.py" "$ROOT/TOOLS/davinci_workspace_import.py" "$ROOT"/TOOLS/abraxas/*.py
  rc=$?
fi
echo "SELFTEST EXIT: $rc"
read -r -p "Presione Enter para cerrar..." _
exit $rc
