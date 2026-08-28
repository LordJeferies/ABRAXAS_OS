#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
echo "H03 legacy mide 721s; V3.1 exige máximo 720s."
echo "Deje en blanco el extremo que no quiera cambiar."
read -r -p "Nuevo START opcional (ej. 00:53:15): " start
read -r -p "Nuevo END opcional (ej. 01:05:14): " end
args=(set-override H03)
[ -n "$start" ] && args+=(--start "$start")
[ -n "$end" ] && args+=(--end "$end")
if [ -z "$start" ] && [ -z "$end" ]; then echo "Sin cambios."; pause; exit 1; fi
run_cli "${args[@]}"
pause
