#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
source "$HOME/.zshrc" 2>/dev/null || true
source "$HOME/.cargo/env" 2>/dev/null || true
exec pnpm tauri:dev
