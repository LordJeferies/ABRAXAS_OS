#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
run_cli davinci
if [ $? -eq 0 ]; then
  echo "Abra DaVinci Resolve Studio, cree/abra un proyecto vacío y pegue el comando de:"
  echo "10_DAVINCI_HANDOFF/WORKSPACE_CONSOLE_COMMAND.txt"
fi
pause
