#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
echo "=== ABRAXAS · MICROTRIMS VFX/B-ROLL RELEVANTES · REANUDABLE ==="
for i in $(seq 1 300); do
  tmp="$(mktemp)"
  run_cli microtrim-list --scope content --limit 1 | tee "$tmp"
  # Intro jobs should already be resolved before reaching this stage.
  if grep -q "UNRESOLVED: 0" "$tmp"; then rm -f "$tmp"; echo "OK · no quedan microtrims relevantes"; break; fi
  rm -f "$tmp"
  echo "JOB $i"
  run_cli microtrim-next --scope content
  rc=$?
  if [ $rc -eq 3 ]; then
    echo "DETENIDO · un beat necesita revisión manual. Progreso guardado."
    break
  elif [ $rc -ne 0 ]; then
    echo "ERROR REAL · se detiene sin perder checkpoints."
    break
  fi
done
pause
