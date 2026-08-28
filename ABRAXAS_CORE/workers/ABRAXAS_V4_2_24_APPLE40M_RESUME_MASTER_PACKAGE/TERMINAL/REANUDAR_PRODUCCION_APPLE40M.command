#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON_BIN="${ABRAXAS_PYTHON:-python3}"

echo "ABRAXAS V4.2.24 · REANUDACIÓN APPLE VIDEOTOOLBOX 40M"
echo "Perfil: H.264 High · 40M · maxrate 48M · bufsize 80M · AAC 192k"
echo
"$PYTHON_BIN" "$ROOT/ENGINE/stop_legacy_reference_renderer.py"
exec "$ROOT/TERMINAL/GENERAR_PRODUCCION_COMPLETA.command"

