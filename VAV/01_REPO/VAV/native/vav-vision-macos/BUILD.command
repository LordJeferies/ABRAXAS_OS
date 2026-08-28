#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$HERE/bin/vav-vision-macos}"
mkdir -p "$(dirname "$OUT")"
xcrun swiftc -O \
  -framework Vision \
  -framework AppKit \
  -framework CoreImage \
  "$HERE/Sources/main.swift" \
  -o "$OUT"
"$OUT" capabilities
