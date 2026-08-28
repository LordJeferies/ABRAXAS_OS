#!/bin/bash
set -euo pipefail

HOTFIX_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${ABRAXAS_PACKAGE_ROOT:-$HOME/Downloads/ABRAXAS_V4_2_24_APPLE40M_RESUME_MASTER_PACKAGE}"
PYTHON_BIN="${ABRAXAS_PYTHON:-python3}"

"$PYTHON_BIN" "$HOTFIX_ROOT/ENGINE/restore_motion_1080p_40m_hotfix.py" --target "$TARGET"
"$PYTHON_BIN" -m py_compile "$TARGET/ENGINE/"*.py
echo "Último backup restaurado. El OUTPUT de video no fue eliminado."

