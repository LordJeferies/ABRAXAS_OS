#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="${1:-$HERE/../SHIM_CONFIRMED_MANIFEST.json}"
python3 "$HERE/verify_environment.py" "$MANIFEST"
python3 "$HERE/abraxas_shim_export.py" "$MANIFEST" "${@:2}"
