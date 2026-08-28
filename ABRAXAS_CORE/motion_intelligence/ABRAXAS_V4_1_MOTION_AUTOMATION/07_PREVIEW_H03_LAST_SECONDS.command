#!/bin/bash
source "$(cd "$(dirname "$0")" && pwd)/TOOLS/_common.sh"
cd "$ROOT"
if [ ! -f "$CFG" ]; then echo "ERROR · ejecute setup primero"; pause; exit 2; fi
readarray_out="$($PY - <<PY
import json, pathlib
c=json.loads(pathlib.Path(r'$CFG').read_text())
print(c['render']['ffmpeg'])
print(c['inputs']['horizontal_master'])
print(pathlib.Path(c['output_root']).expanduser()/'14_BACKUPS'/'H03_TRIM_PREVIEW.mp4')
PY
)"
FF="$(printf '%s\n' "$readarray_out" | sed -n '1p')"
SRC="$(printf '%s\n' "$readarray_out" | sed -n '2p')"
OUT="$(printf '%s\n' "$readarray_out" | sed -n '3p')"
mkdir -p "$(dirname "$OUT")"
echo "Creando preview 01:05:05 → 01:05:15..."
"$FF" -hide_banner -y -ss 01:05:05 -t 10 -i "$SRC" -c:v h264_videotoolbox -b:v 10M -c:a aac -b:a 128k "$OUT" || { echo "ERROR preview"; pause; exit 2; }
open "$OUT" || true
echo "Escuche/observe y decida si el segundo se quita del inicio o del final."
pause
