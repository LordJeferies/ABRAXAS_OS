#!/bin/bash
set -euo pipefail

HOTFIX_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${ABRAXAS_PACKAGE_ROOT:-$HOME/Downloads/ABRAXAS_V4_2_24_APPLE40M_RESUME_MASTER_PACKAGE}"

"$HOTFIX_ROOT/TERMINAL/APLICAR_HOTFIX_MOTION_1080P_40M.command"

echo
echo "Abriendo el monitor 1080p/40M en otra Terminal…"
chmod +x "$TARGET/TERMINAL/"*.command
open "$TARGET/TERMINAL/ABRAXAS_MONITOR_APPLE40M.command" 2>/dev/null || true

echo "Reanudando producción en esta Terminal…"
exec "$TARGET/TERMINAL/REANUDAR_PRODUCCION_APPLE40M.command"

