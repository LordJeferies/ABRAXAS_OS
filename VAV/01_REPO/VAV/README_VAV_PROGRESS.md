# VAV Captions — Development Progress V12

## Verified incoming baseline

Full Alpha + Hotfix V7.1/V7.2 was verified green on the target Mac before this update: 14 test files / 34 tests, typecheck, Vite build, bridge/foundation/engine health and Cargo check.

## V12 source update

### ABRAXAS
- [x] safe structured TXT/JSON/HTML classifier
- [x] Candidate -> Preview -> Approve foundation
- [x] trusted approved import option
- [x] persistent approved style/motion registry
- [x] canonical aliases for existing VAV style families
- [x] V2/V3/V3.1 evidence treated as reference-only unless mapped to an executable typed preset
- [x] semantic caption hierarchy foundation
- [x] built-in caption-style registry replaces placeholder package
- [x] built-in caption-motion registry replaces placeholder package
- [x] visual-priors foundation replaces placeholder package

### Remotion parity
- [x] deterministic serializable `CaptionPlanV1`
- [x] shared Remotion caption composition
- [x] editor Player consumes the same plan
- [x] Node quality renderer path using `@remotion/renderer`
- [x] Quality MP4 UI separate from Fast ASS
- [x] progress + error state
- [x] cancel request plumbing
- [ ] TARGET MAC VERIFY required
- [ ] real vertical frame/parity evidence required before declaring PASS

### Vision / spatial
- [x] shared VAV Vision contracts
- [x] VAV top-left normalized coordinate convention
- [x] spatial placement/depth policy foundation
- [x] native macOS Vision sidecar source for still-image person mask, face landmarks, OCR and saliency
- [x] provider detection/report foundation
- [x] resumable SAM2/Cutie/OpenCV installer
- [ ] compile/verify native sidecar on target Mac
- [ ] SAM2/Cutie optional provider verification on target Mac
- [ ] temporal video masks/tracking/depth integration
- [ ] depth-aware Remotion subject layering in production CaptionPlan

## Current gate

Run the V12 package `04_VERIFY.command` on the target Mac. Do not call V12 fully PASS until tests/typecheck/build/health/Cargo and real Quality Render evidence are green.
