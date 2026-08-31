---
name: abraxas-safe-change
description: Implements a scoped ABRAXAS change using audit-first modular boundaries, tests, verification and reviewable diffs.
---

Use:
BASELINE -> OWNERSHIP -> AUDIT -> CLASSIFY -> ACCEPTANCE CRITERIA ->
TEST-FIRST WHEN APPLICABLE -> MINIMAL IMPLEMENTATION -> TEST -> DIFF ->
EXECUTION REPORT.

Do not modify unrelated modules. Do not replace working historical logic
without audit. Do not commit/push automatically.
