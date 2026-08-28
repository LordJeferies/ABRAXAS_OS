#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
python3 -m py_compile ENGINE/*.py
bash -n TERMINAL/*.command TESTS/VALIDAR_PAQUETE.command
python3 -m unittest discover -s TESTS -p 'test_*.py' -v
python3 ENGINE/ai_motion_engine_v4_2_24.py validate --map DELIVERABLES/JOC55_ABRAXAS_V4_2_24_PREBUILT/00_MANIFEST/FINAL_AI_MOTION_MAP_V4_2_24.json
unzip -tq AUTOMATION/ABRAXAS_V4_2_5_EXECUTABLE_BASELINE_VERIFIED.zip >/dev/null

echo
echo "VALIDACIÓN ABRAXAS V4.2.24: PASS"

