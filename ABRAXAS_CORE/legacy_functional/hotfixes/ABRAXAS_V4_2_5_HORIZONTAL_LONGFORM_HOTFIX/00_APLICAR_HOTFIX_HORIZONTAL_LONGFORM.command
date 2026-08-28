#!/bin/bash
set -euo pipefail

TARGET="${ABRAXAS_TARGET:-$HOME/Downloads/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION}"
HERE="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d_%H%M%S)"

if [ ! -f "$TARGET/TOOLS/abraxas_cli.py" ]; then
  echo "ERROR: no encuentro ABRAXAS en: $TARGET"
  echo "Si está en otro lugar: ABRAXAS_TARGET='/ruta/correcta' bash '$0'"
  exit 2
fi

echo "Deteniendo únicamente workers ABRAXAS anteriores..."
for pid in $(pgrep -f "$TARGET/TOOLS/abraxas_cli.py.*render-worker --worker" 2>/dev/null || true); do
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do kill -TERM "$child" 2>/dev/null || true; done
  kill -TERM "$pid" 2>/dev/null || true
done
sleep 2

BACKUP="$TARGET/HOTFIX_BACKUPS/V4_2_5_$STAMP"
mkdir -p "$BACKUP/TOOLS/abraxas" "$BACKUP/INPUT"
for rel in TOOLS/abraxas/cli.py TOOLS/abraxas/motions.py TOOLS/abraxas/plan.py TOOLS/abraxas/html_packages.py INPUT/JOC55_AMANDA_CONTENT_ENGINE_V3_1.html INPUT/JOC55_AMANDA_INTRO_LAB_V3_1.html; do
  [ -f "$TARGET/$rel" ] && cp -p "$TARGET/$rel" "$BACKUP/$rel"
  cp -p "$HERE/PATCH/$rel" "$TARGET/$rel"
done

PY="$TARGET/.venv-mlx/bin/python"
[ -x "$PY" ] || PY=python3
"$PY" -m py_compile "$TARGET/TOOLS/abraxas/cli.py" "$TARGET/TOOLS/abraxas/motions.py" "$TARGET/TOOLS/abraxas/plan.py" "$TARGET/TOOLS/abraxas/html_packages.py"

OUT=$("$PY" - "$TARGET/PROJECT/project_config.json" <<'PY'
import json,sys
print(json.load(open(sys.argv[1]))['output_root'])
PY
)
ARCHIVE="$OUT/14_BACKUPS/HORIZONTAL_POLICY_BEFORE_V4_2_5_$STAMP"
mkdir -p "$ARCHIVE"

archive_path() {
  src="$1"
  [ -e "$src" ] || return 0
  rel="${src#$OUT/}"
  dst="$ARCHIVE/$rel"
  mkdir -p "$(dirname "$dst")"
  mv "$src" "$dst"
}

for src in "$OUT"/04_HORIZONTALS/*/MEDIA/FRAGMENTS "$OUT"/04_HORIZONTALS/*/MEDIA/01_SECCIONES "$OUT"/04_HORIZONTALS/*/MEDIA/00_VIDEO_COMPLETO "$OUT"/09_MOTIONS_V4_2/04_HORIZONTALS; do
  archive_path "$src"
done
while IFS= read -r partial; do archive_path "$partial"; done < <(find "$OUT" -type f \( -name '*.partial.mp4' -o -name '*.partial.wav' \) -print 2>/dev/null)

mkdir -p "$OUT/00_MANIFEST"
cp -p "$HERE/REFERENCIA/TRANSCRIPCION_MAESTRA_MOTIONS_REFERENCIA.txt" "$OUT/00_MANIFEST/"

echo
echo "HOTFIX V4.2.5 APLICADO"
echo "- Horizontales completos; sin fragmentos físicos de 4–9 s."
echo "- Secciones coherentes largas; pueden durar varios minutos."
echo "- Solo motions de 4–9 s; máximo 2 inicios por minuto móvil."
echo "- Material obsoleto archivado en: $ARCHIVE"
echo "- Código anterior respaldado en: $BACKUP"
