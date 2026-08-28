#!/bin/bash
set -euo pipefail

HOTFIX_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${ABRAXAS_PACKAGE_ROOT:-$HOME/Downloads/ABRAXAS_V4_2_24_APPLE40M_RESUME_MASTER_PACKAGE}"
PYTHON_BIN="${ABRAXAS_PYTHON:-python3}"

echo "ABRAXAS V4.2.24 · HOTFIX MOTION 1080P/40M"
echo "Objetivo: $TARGET"
echo

"$PYTHON_BIN" -m py_compile "$HOTFIX_ROOT/PAYLOAD/ENGINE/"*.py "$HOTFIX_ROOT/ENGINE/"*.py
"$PYTHON_BIN" "$HOTFIX_ROOT/ENGINE/apply_motion_1080p_40m_hotfix.py" \
  --target "$TARGET" \
  --hotfix-root "$HOTFIX_ROOT"

"$PYTHON_BIN" -m py_compile "$TARGET/ENGINE/"*.py
bash -n "$TARGET/TERMINAL/"*.command "$TARGET/TESTS/"*.command
(
  cd "$TARGET"
  "$PYTHON_BIN" -m unittest discover -s TESTS -p 'test_*.py' -v
)

echo
echo "HOTFIX APLICADO Y VALIDADO"
echo "Motions verticales: 1080x1920 · VideoToolbox 40M"
echo "Motions horizontales: 1920x1080 · VideoToolbox 40M"
echo "Programas completos e intros: resolución y caché preservadas"

