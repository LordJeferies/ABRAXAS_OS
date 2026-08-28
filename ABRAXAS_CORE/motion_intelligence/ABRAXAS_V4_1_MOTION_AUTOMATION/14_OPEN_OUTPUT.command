#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
if [ ! -f "$CFG" ]; then echo "ERROR · setup no ejecutado"; pause; exit 2; fi
OUT="$($PY - <<PY
import json,pathlib
print(pathlib.Path(json.loads(pathlib.Path(r'$CFG').read_text())['output_root']).expanduser())
PY
)"
open "$OUT" || true
