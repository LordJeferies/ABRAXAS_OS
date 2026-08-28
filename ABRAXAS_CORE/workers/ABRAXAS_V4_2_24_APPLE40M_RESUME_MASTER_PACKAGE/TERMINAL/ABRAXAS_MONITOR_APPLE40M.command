#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec "${ABRAXAS_PYTHON:-python3}" "$ROOT/ENGINE/monitor_apple40m_v4_2_24.py"

