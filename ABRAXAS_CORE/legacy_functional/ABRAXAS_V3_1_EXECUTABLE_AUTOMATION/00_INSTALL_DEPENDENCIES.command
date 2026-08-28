#!/bin/bash
set -u
ROOT="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$ROOT/CONFIG"
echo "=== ABRAXAS V3.1 · DEPENDENCIAS ==="
if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR · falta python3. Instale Python/Homebrew y vuelva a ejecutar."
  read -r -p "Enter para cerrar..." _; exit 2
fi
if ! command -v ffmpeg >/dev/null 2>&1 || ! command -v ffprobe >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "FFmpeg no encontrado · instalando con Homebrew..."
    brew install ffmpeg || { echo "ERROR instalando FFmpeg"; read -r -p "Enter..." _; exit 2; }
  else
    echo "ERROR · falta FFmpeg y Homebrew no está disponible."
    echo "Instale Homebrew desde su sitio oficial y luego ejecute: brew install ffmpeg"
    read -r -p "Enter para cerrar..." _; exit 2
  fi
fi
PY_MAIN="$(command -v python3)"
if "$PY_MAIN" -c 'import mlx_whisper' >/dev/null 2>&1; then
  echo "$PY_MAIN" > "$ROOT/CONFIG/mlx_python_auto.txt"
  echo "OK · mlx-whisper ya disponible en $PY_MAIN"
else
  echo "mlx-whisper no está disponible en python3."
  read -r -p "¿Crear entorno aislado .venv-mlx e instalar mlx-whisper? [s/N]: " ans
  if [[ "$ans" =~ ^[sS]$ ]]; then
    "$PY_MAIN" -m venv "$ROOT/.venv-mlx" || exit 2
    "$ROOT/.venv-mlx/bin/python3" -m pip install --upgrade pip
    "$ROOT/.venv-mlx/bin/python3" -m pip install mlx-whisper || { echo "ERROR instalando mlx-whisper"; read -r -p "Enter..." _; exit 2; }
    echo "$ROOT/.venv-mlx/bin/python3" > "$ROOT/CONFIG/mlx_python_auto.txt"
    echo "OK · mlx-whisper instalado en entorno aislado."
  else
    echo "$PY_MAIN" > "$ROOT/CONFIG/mlx_python_auto.txt"
    echo "ATENCIÓN · podrá producir clips con timestamps exactos, pero MICROTRIM quedará bloqueado hasta instalar MLX."
  fi
fi
echo "OK · FFmpeg: $(command -v ffmpeg)"
ffmpeg -hide_banner -encoders 2>/dev/null | grep videotoolbox || true
echo "DEPENDENCIAS REVISADAS"
read -r -p "Presione Enter para cerrar..." _
