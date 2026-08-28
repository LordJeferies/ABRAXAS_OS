#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
read -r -p "Beat ID (ej. INTRO_G01_SRC_06): " beat
read -r -p "Inicio absoluto HH:MM:SS.mmm: " start
read -r -p "Fin absoluto HH:MM:SS.mmm: " end
run_cli set-microtrim "$beat" "$start" "$end"
pause
