#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
run_cli microtrim-next --scope content
rc=$?
pause
exit $rc
