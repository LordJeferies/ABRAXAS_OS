#!/bin/bash
set -u

REPORT="$HOME/Desktop/ABRAXAS_DIAGNOSTICO_V4_2_24.txt"
PROJECT="$HOME/Desktop/Joc podcast next ep 55"
{
  echo "ABRAXAS V4.2.24 · DIAGNÓSTICO NO DESTRUCTIVO"
  date
  echo
  sw_vers 2>/dev/null || uname -a
  echo
  echo "BINARIOS"
  command -v python3 || true
  command -v ffmpeg || true
  command -v ffprobe || true
  command -v caffeinate || true
  echo
  echo "ESPACIO"
  df -h "$HOME" 2>/dev/null || true
  echo
  echo "ARCHIVOS ABRAXAS Y MASTERS (ruta, bytes, fecha)"
  find "$PROJECT" -maxdepth 6 -type f \( -iname '*.html' -o -iname '*.json' -o -iname '*.txt' -o -iname '*.command' -o -name 'JOC55_MASTER_*_OFICIAL.mp4' \) -exec stat -f '%N | %z bytes | %Sm' -t '%Y-%m-%d %H:%M:%S' {} \; 2>/dev/null | sort
} > "$REPORT"
echo "Diagnóstico creado: $REPORT"
open -R "$REPORT" 2>/dev/null || true

