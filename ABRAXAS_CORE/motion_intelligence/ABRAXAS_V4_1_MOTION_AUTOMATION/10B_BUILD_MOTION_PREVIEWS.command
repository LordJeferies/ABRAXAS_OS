#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
run_cli motion-previews
rc=$?
if [ $rc -eq 0 ]; then
  echo "Previews construidos con las imágenes encontradas. Los faltantes permanecen marcados."
fi
pause
exit $rc
