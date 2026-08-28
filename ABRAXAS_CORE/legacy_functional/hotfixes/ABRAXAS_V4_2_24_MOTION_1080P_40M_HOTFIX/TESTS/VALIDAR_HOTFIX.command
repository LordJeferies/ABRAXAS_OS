#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
python3 -m py_compile ENGINE/*.py PAYLOAD/ENGINE/*.py TESTS/*.py
bash -n TERMINAL/*.command TESTS/*.command
python3 -m json.tool HOTFIX_MANIFEST.json >/dev/null
python3 -m unittest discover -s TESTS -p 'test_*.py' -v
echo "HOTFIX MOTION 1080P/40M: PASS"

