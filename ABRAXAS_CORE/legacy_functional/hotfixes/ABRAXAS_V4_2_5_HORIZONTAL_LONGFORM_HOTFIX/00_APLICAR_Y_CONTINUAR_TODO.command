#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
bash "$HERE/00_APLICAR_HOTFIX_HORIZONTAL_LONGFORM.command"
bash "$HERE/01_CONTINUAR_TODO_DESDE_CACHE.command"
