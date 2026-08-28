#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
echo "=== DRY RUN WORKER A ==="
run_cli render-worker --worker A --dry-run || exit $?
echo "=== DRY RUN WORKER B ==="
run_cli render-worker --worker B --dry-run || exit $?
echo "OK · no se codificó media; comandos y rutas fueron construidos."
pause
