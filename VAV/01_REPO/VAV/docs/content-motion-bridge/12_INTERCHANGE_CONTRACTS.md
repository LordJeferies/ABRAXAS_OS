# Interchange Contracts Between VAV Tools

## .vavcontent.json
Ficha/content bridge:
content_id, modules, candidates, provenance, versions.

## .vavedit.json
Edit Decision / SourceMap:
source ranges → output timeline ranges.

## .vavmotion.json
Visual Motion Manifest:
motion family, ranges, occupancy, text ownership, caption policy.

## .vavcaption.json
Caption semantic/visual plan.

## .vavmanifest.json
Final production manifest:
source, edits, captions, motions, scenes, providers, versions.

Rule:
A future Vav-motions tool does NOT directly rewrite VAV-Captions internal
caption data. It exports `.vavmotion.json` and optional caption constraints.

Rule:
Vav-cuts exports `.vavedit.json`.
VAV-Captions projects existing transcript/caption semantics through it.
