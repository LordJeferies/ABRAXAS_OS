#!/bin/bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PY="$(command -v python3 || true)"
CFG="$ROOT/PROJECT/project_config.json"
if [ -z "$PY" ]; then
  echo "ERROR · python3 no está instalado."
  exit 2
fi
run_cli() {
  "$PY" "$ROOT/TOOLS/abraxas_cli.py" --config "$CFG" "$@"
}
pause() {
  echo
  read -r -p "Presione Enter para cerrar..." _ || true
}
