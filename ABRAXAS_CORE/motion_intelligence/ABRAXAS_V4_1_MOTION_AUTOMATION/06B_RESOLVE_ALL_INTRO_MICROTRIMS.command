#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
echo "=== ABRAXAS · MICROTRIMS INTRO · REANUDABLE ==="
for i in $(seq 1 200); do
  tmp="$(mktemp)"
  run_cli microtrim-list --scope intros --limit 1 | tee "$tmp"
  if grep -q "UNRESOLVED: 0" "$tmp"; then rm -f "$tmp"; echo "OK · no quedan microtrims de Intro Lab"; break; fi
  rm -f "$tmp"
  echo "JOB $i"
  run_cli microtrim-next --scope intros
  rc=$?
  if [ $rc -eq 3 ]; then
    echo "DETENIDO · un beat necesita revisión manual. El progreso anterior está guardado."
    break
  elif [ $rc -ne 0 ]; then
    echo "ERROR REAL · se detiene sin perder checkpoints."
    break
  fi
done
pause
