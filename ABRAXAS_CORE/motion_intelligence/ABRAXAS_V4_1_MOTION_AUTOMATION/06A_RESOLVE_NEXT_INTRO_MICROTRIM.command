#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
run_cli microtrim-next --scope intros
rc=$?
if [ $rc -eq 3 ]; then
  echo "REVISIÓN MANUAL · abra el WAV/JSON generado dentro de 13_CACHE/MICROTRIMS."
fi
pause
exit $rc
