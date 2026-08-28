#!/bin/bash
set -uo pipefail

if [ "$(uname -s)" != "Darwin" ]; then
  echo "ERROR: este instalador es para macOS."
  exit 2
fi

ROOT="$HOME/Library/Application Support/VAV/providers"
STATE="$HOME/Library/Application Support/VAV/provider-install-state"
LOGROOT="$HOME/Library/Logs/VAV/provider-install"
STAMP="$(date +%Y%m%d_%H%M%S)"
LOG="$LOGROOT/install_$STAMP.log"
mkdir -p "$ROOT" "$STATE" "$LOGROOT"
exec > >(tee -a "$LOG") 2>&1

export PIP_DISABLE_PIP_VERSION_CHECK=1
export PIP_DEFAULT_TIMEOUT=120
export PYTORCH_ENABLE_MPS_FALLBACK=1

FAILURES=()

ok() { echo "✓ $*"; }
warn() { echo "⚠ $*"; }
fail_optional() { echo "⚠ OPTIONAL FAILED: $*"; FAILURES+=("$*"); }
marker() { touch "$STATE/$1.ok"; }

python_works() {
  [ -n "${1:-}" ] && [ -x "$1" ] && "$1" -c 'import sys; assert sys.version_info >= (3,10)' >/dev/null 2>&1
}

find_python312() {
  local p=""
  for p in \
    /opt/homebrew/bin/python3.12 \
    /usr/local/bin/python3.12 \
    "$(brew --prefix python@3.12 2>/dev/null)/bin/python3.12"; do
    if python_works "$p"; then echo "$p"; return 0; fi
  done
  return 1
}

find_python_fallback() {
  local p=""
  for p in /opt/homebrew/bin/python3.13 /usr/local/bin/python3.13 "$(command -v python3 2>/dev/null || true)"; do
    if python_works "$p"; then echo "$p"; return 0; fi
  done
  return 1
}

pip_install() {
  local python="$1"; shift
  "$python" -m pip install --timeout 120 --retries 10 "$@"
}

venv_import_test() {
  local python="$1" module="$2"
  "$python" - "$module" <<'PY'
import importlib, sys
name=sys.argv[1]
mod=importlib.import_module(name)
print(name, "import=OK", getattr(mod, "__version__", ""))
try:
    import torch
    print("torch", torch.__version__)
    print("mps_built", torch.backends.mps.is_built())
    print("mps_available", torch.backends.mps.is_available())
except Exception as e:
    print("torch_probe", repr(e))
PY
}

echo "============================================================"
echo "VAV — VISION PROVIDERS INSTALL / REPAIR"
echo "============================================================"
echo "Log: $LOG"
echo "Providers: $ROOT"
echo

echo "[1/6] PRECHECK MEDIA / HOMEBREW"
if command -v ffmpeg >/dev/null 2>&1; then
  ok "FFmpeg existente preservado: $(command -v ffmpeg)"
  ffmpeg -version | head -n 1 || true
else
  warn "FFmpeg no encontrado. Intentando instalarlo sin mezclarlo con otros paquetes."
  if command -v brew >/dev/null 2>&1 && brew install ffmpeg; then ok "FFmpeg instalado"; else fail_optional "ffmpeg"; fi
fi

# Do not install Homebrew OpenCV here: on this machine it attempts to replace the
# already-working homebrew-ffmpeg/ffmpeg formula. VAV uses an isolated Python OpenCV
# provider instead, after Python has been resolved.
if command -v brew >/dev/null 2>&1 && brew list --versions opencv >/dev/null 2>&1; then
  ok "OpenCV Homebrew ya existe (se conserva)"
else
  warn "OpenCV Homebrew omitido para preservar FFmpeg existente; se usará provider Python aislado."
fi

echo
echo "[2/6] PYTHON"
PYTHON="$(find_python312 2>/dev/null || true)"
if [ -z "$PYTHON" ] && command -v brew >/dev/null 2>&1; then
  echo "Python 3.12 no está ejecutable. Instalando/reparando python@3.12 de forma independiente..."
  if brew list --versions python@3.12 >/dev/null 2>&1; then
    brew reinstall python@3.12 || true
  else
    brew install python@3.12 || true
  fi
  PYTHON="$(find_python312 2>/dev/null || true)"
fi
if [ -z "$PYTHON" ]; then
  PYTHON="$(find_python_fallback 2>/dev/null || true)"
  [ -n "$PYTHON" ] && warn "Usando fallback Python: $PYTHON"
fi
if [ -z "$PYTHON" ]; then
  fail_optional "python-runtime"
else
  ok "Python: $PYTHON ($("$PYTHON" --version 2>&1))"
  marker python
fi

echo
echo "[2b/6] OPENCV — ISOLATED PYTHON PROVIDER"
OPENCV="$ROOT/opencv"
OPENCV_PY="$OPENCV/.venv/bin/python"
if [ -n "$PYTHON" ]; then
  if [ ! -x "$OPENCV_PY" ]; then
    mkdir -p "$OPENCV"
    "$PYTHON" -m venv "$OPENCV/.venv" || fail_optional "opencv-venv"
  fi
  if [ -x "$OPENCV_PY" ]; then
    if "$OPENCV_PY" -c 'import cv2; print(cv2.__version__)' >/dev/null 2>&1; then
      ok "OpenCV Python ya importable"
      marker opencv
    else
      echo "Instalando opencv-python-headless en venv aislado..."
      if pip_install "$OPENCV_PY" --upgrade pip setuptools wheel         && pip_install "$OPENCV_PY" opencv-python-headless         && "$OPENCV_PY" -c 'import cv2; print("opencv", cv2.__version__)'; then
          ok "OpenCV Python instalado/verificado"
          marker opencv
      else
          fail_optional "opencv-python"
      fi
    fi
  fi
fi

echo
echo "[3/6] VAV VISION MACOS SIDECAR"
VISION_SRC="$HOME/Developer/VAV/native/vav-vision-macos"
VISION_ROOT="$ROOT/vav-vision-macos"
VISION_BIN="$VISION_ROOT/bin/vav-vision-macos"
if [ -x "$VISION_BIN" ] && "$VISION_BIN" capabilities >/dev/null 2>&1; then
  ok "vav-vision-macos ya verificado"
  marker vav-vision-macos
elif [ -f "$VISION_SRC/Sources/main.swift" ]; then
  mkdir -p "$VISION_ROOT/bin"
  if xcrun swiftc -O -framework Vision -framework AppKit -framework CoreImage \
      "$VISION_SRC/Sources/main.swift" -o "$VISION_BIN" && "$VISION_BIN" capabilities; then
    ok "vav-vision-macos compilado y verificado"
    marker vav-vision-macos
  else
    rm -f "$VISION_BIN"
    fail_optional "vav-vision-macos-build"
  fi
else
  fail_optional "vav-vision-macos-source-missing"
fi

echo
echo "[4/6] SAM2 — REUSE REPO + CHECKPOINTS"
SAM="$ROOT/sam2"
SAM_REPO="$SAM/repo"
SAM_PY="$SAM/.venv/bin/python"
if [ ! -d "$SAM_REPO/.git" ]; then
  echo "SAM2 repo ausente. Clonando con low-speed timeout..."
  mkdir -p "$SAM"
  if git -c http.lowSpeedLimit=1024 -c http.lowSpeedTime=60 clone --depth 1 https://github.com/facebookresearch/sam2.git "$SAM_REPO"; then
    ok "SAM2 repo clonado"
  else
    fail_optional "sam2-clone"
  fi
else
  ok "SAM2 repo reutilizado: $SAM_REPO"
fi

if [ -d "$SAM_REPO/checkpoints" ]; then
  CKPT_COUNT="$(find "$SAM_REPO/checkpoints" -maxdepth 1 -type f -name '*.pt' | wc -l | tr -d ' ')"
else
  CKPT_COUNT=0
fi
ok "SAM2 checkpoints detectados: $CKPT_COUNT (no se redescargan si ya existen)"

if [ -n "$PYTHON" ] && [ -d "$SAM_REPO" ]; then
  if [ ! -x "$SAM_PY" ]; then
    echo "Creando venv SAM2..."
    "$PYTHON" -m venv "$SAM/.venv" || fail_optional "sam2-venv"
  fi
  if [ -x "$SAM_PY" ]; then
    if venv_import_test "$SAM_PY" sam2 >/dev/null 2>&1; then
      ok "SAM2 ya importable"
      marker sam2
    else
      echo "Instalando dependencias SAM2. Esta fase puede tardar; es reanudable."
      if pip_install "$SAM_PY" --upgrade pip setuptools wheel \
        && pip_install "$SAM_PY" torch torchvision \
        && (cd "$SAM_REPO" && env SAM2_BUILD_CUDA=0 "$SAM_PY" -m pip install --timeout 120 --retries 10 -e .) \
        && venv_import_test "$SAM_PY" sam2; then
          ok "SAM2 instalado/verificado"
          marker sam2
      else
          fail_optional "sam2-install"
      fi
    fi
  fi
fi

echo
echo "[5/6] CUTIE — TEMPORAL MASK TRACKING"
CUTIE="$ROOT/cutie"
CUTIE_LEGACY_REPO="$CUTIE/repo"
CUTIE_REPO="$CUTIE/rf-repo"
CUTIE_PY="$CUTIE/.venv/bin/python"

# Preserve the old upstream clone for provenance, but use the maintained rf-Cutie
# packaging because it separates inference dependencies and avoids the legacy
# cchardet/GUI dependency that fails on Python 3.12.
if [ ! -d "$CUTIE_REPO/.git" ]; then
  mkdir -p "$CUTIE"
  echo "Clonando rf-Cutie (maintained packaging)..."
  if git -c http.lowSpeedLimit=1024 -c http.lowSpeedTime=60 clone --depth 1 https://github.com/roboflow/rf-Cutie.git "$CUTIE_REPO"; then
    ok "rf-Cutie repo clonado"
  else
    fail_optional "cutie-rf-clone"
  fi
else
  ok "rf-Cutie repo reutilizado"
fi

if [ -n "$PYTHON" ] && [ -d "$CUTIE_REPO" ]; then
  if [ ! -x "$CUTIE_PY" ]; then
    "$PYTHON" -m venv "$CUTIE/.venv" || fail_optional "cutie-venv"
  fi
  if [ -x "$CUTIE_PY" ]; then
    if venv_import_test "$CUTIE_PY" cutie >/dev/null 2>&1; then
      ok "Cutie ya importable"
      marker cutie
    else
      echo "Instalando rf-Cutie perfil inference (sin GUI/cchardet legacy)..."
      if pip_install "$CUTIE_PY" --upgrade pip setuptools wheel         && pip_install "$CUTIE_PY" torch torchvision         && (cd "$CUTIE_REPO" && "$CUTIE_PY" -m pip install --timeout 120 --retries 10 -e '.[inference]')         && venv_import_test "$CUTIE_PY" cutie; then
          ok "Cutie instalado/verificado"
          marker cutie
      else
          fail_optional "cutie-install"
      fi
    fi
  fi
fi

if [ -x "$CUTIE_PY" ] && venv_import_test "$CUTIE_PY" cutie >/dev/null 2>&1; then
  if [ -f "$STATE/cutie-model.ok" ]; then
    ok "Cutie model stage already completed"
  elif [ -f "$CUTIE_REPO/cutie/utils/download_models.py" ]; then
    echo "Descargando/verificando modelo Cutie..."
    if (cd "$CUTIE_REPO" && "$CUTIE_PY" cutie/utils/download_models.py); then
      marker cutie-model
    else
      fail_optional "cutie-model-download"
    fi
  else
    warn "Helper de modelo Cutie no encontrado; se resolverá al primer uso."
  fi
fi

echo
echo "[6/6] DISCOVERY / SUMMARY"
if [ -d "$HOME/Developer/VAV" ]; then
  (cd "$HOME/Developer/VAV" && node scripts/discover-providers.mjs) || fail_optional "provider-discovery"
fi

echo
if [ "${#FAILURES[@]}" -eq 0 ]; then
  echo "VISION PROVIDERS: ALL REQUESTED STAGES GREEN"
else
  echo "VISION PROVIDERS: CORE UPDATE CAN CONTINUE; OPTIONAL FAILURES:"
  printf ' - %s\n' "${FAILURES[@]}"
  echo "Reejecuta este mismo comando después; las fases correctas se reutilizan."
fi

echo "Log: $LOG"
# Optional provider failures do not invalidate the VAV source update.
exit 0
