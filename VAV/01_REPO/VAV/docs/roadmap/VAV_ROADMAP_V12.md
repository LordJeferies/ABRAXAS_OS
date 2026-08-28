# VAV Captions Roadmap V12

## Verified baseline before V12

Full Alpha + Hotfix V7.1/V7.2:
- real media import/playback
- Whisper.cpp Large V3 Turbo FULL + optional detected MLX
- caption document/edit/split/merge/approve
- styles/structures/motions/placements
- scene cuts + SceneMap
- Content/Motion context
- project save/load
- SRT
- Fast/Alpha FFmpeg+ASS MP4
- provider diagnostics
- previously verified 14 test files / 34 tests + typecheck/build/health/Cargo

## V12 implementation track

### A. ABRAXAS Preset/Grammar Import Foundation
- typed TXT/JSON parser
- Candidate -> Preview -> Approve
- trusted approved import
- canonical aliases
- provenance + registry
- reference-only V2/V3/V3.1 evidence boundary
- semantic caption hierarchy foundation

### B. Remotion Preview <-> Quality Export Parity
- serializable deterministic CaptionPlan
- shared Remotion composition
- Player uses CaptionPlan
- Node local-engine uses `@remotion/bundler` + `@remotion/renderer`
- Quality MP4 in UI
- Fast ASS retained separately
- progress/error/cancel plumbing

Acceptance still requires the Mac verification script and observable real-video comparison before calling parity fully PASS.

### C. Shared Vision/Spatial Foundation
- Vision contracts
- spatial scene scoring/depth policy
- native Apple Vision sidecar still-image baseline
- provider installer/discovery
- SAM2/Cutie optional provider preparation

## Next after V12 verification

1. real video Vision sampling + temporal cache
2. stable subject masks and first `TEXT_BEHIND_SUBJECT` / `TEXT_SANDWICH`
3. depth provider benchmark (Core ML first candidate)
4. Scene Smart Pro using actual Vision evidence
5. ABRAXAS motion primitive implementation shared with VAV Motions
6. Scene Review Pro with masks/depth/candidate placements/why-this-placement
7. precise editor workspace/control hardening
8. word AlignmentProvider
9. real local speaker diarization + SpeakerResolver
10. autosave/crash recovery/job/cache/performance
11. packaged VAV.app + security + golden QA

## Non-negotiable rules

- Current repo is source truth.
- Never rebuild VAV from old bootstrap packages.
- Integer microseconds remain project timing truth.
- Style, structure, semantics, scene and motion remain distinct domains.
- Imported reference code is never executed blindly.
- Manual override wins until reset.
- One visual truth for preview + quality export.
- No production/PASS claim without observable evidence.
