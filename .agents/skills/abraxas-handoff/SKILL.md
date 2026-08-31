---
name: abraxas-handoff
description: Coordinates ABRAXAS work between ChatGPT Pro as architect/reviewer and Antigravity as repository executor.
---

ChatGPT sends an EXECUTION PACKET.
Antigravity runs baseline -> audit -> implementation -> verification and returns
an EXECUTION REPORT.
ChatGPT returns APPROVE / REPAIR / REJECT / NEEDS_EVIDENCE.
Commit/push only after explicit user authorization.
