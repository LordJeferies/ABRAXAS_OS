#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
run_cli motion-verify --strict-assets
rc=$?
if [ $rc -eq 0 ]; then
  echo "PASS · todos los Motions tienen video final o preview listo para DaVinci."
else
  echo "BLOCKED · faltan assets/Motions o existe un fragmento fuera de 4–9 segundos."
fi
pause
exit $rc
