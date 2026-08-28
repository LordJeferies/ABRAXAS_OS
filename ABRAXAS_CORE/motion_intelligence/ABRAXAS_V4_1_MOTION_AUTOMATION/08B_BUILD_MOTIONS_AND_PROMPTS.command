#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
run_cli motions
rc=$?
if [ $rc -eq 0 ]; then
  echo "Motions y prompts creados en 09_MOTIONS_V4_1 dentro del output."
fi
pause
exit $rc
