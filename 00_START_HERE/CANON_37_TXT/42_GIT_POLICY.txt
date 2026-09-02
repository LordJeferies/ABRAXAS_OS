# ABRAXAS OS — Git Policy

## Canonical rule

ABRAXAS OS uses ONE Git repository rooted at:

`~/Desktop/abraxasos`

Do not initialize separate `.git` repositories inside VAV, YOD, Shim, Cuts,
Motions, Captions or future ABRAXAS OS tools unless a deliberate architecture
decision explicitly changes this policy.

## Goes to GitHub

- application/source code
- scripts and automation
- tests
- schemas and contracts
- configuration needed to reproduce the software
- READMEs and architecture docs
- manifests and selectors that are part of the system
- versionable knowledge/rules
- new tools created inside `abraxasos`, including YOD, when not ignored

## Stays local-only

- runtime models/provider caches
- dependency folders such as node_modules / venv
- build/dist/cache output
- videos/audio and working media
- ZIP/7z/archive packages
- evidence/render exports
- chat handoffs
- backups
- quarantine / forensic dump surfaces
- secrets and credentials
- individual files too large for normal GitHub source history

The `.gitignore` is the enforcement boundary.
