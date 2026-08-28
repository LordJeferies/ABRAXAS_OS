# ABRAXAS V3.1 EXECUTABLE AUTOMATION · VERIFICATION REPORT

## Scope verified

The executable package was tested against the actual JOC55 Amanda V3.1 HTML pair.

### Editorial counts
- Intro Lab: 6
- Verticals: 29
- Horizontals: 12
- Principal carousels: 6
- Highlight carousels: 6
- Phrases: 15
- Claims: 8
- Potentials: 6

### Relevant MLX jobs
The anti-timeout optimization was verified:
- Intro microtrims: 23
- Content visual-placement microtrims: 63
- Total relevant microtrims: 86

Content Engine does NOT resolve every internal beat with MLX. It resolves only visual/VFX/B-roll opportunities that require word-level placement.

### Dry-run production plan
After deterministic TEST-ONLY microtrim resolutions and a TEST-ONLY H03 720s override:
- Intro part plans READY: 6/6
- Vertical plans PASS: 29/29
- Horizontal plans PASS: 12/12
- Visual placements compiled: 455
- Unresolved placements in that test: 0

### Visual generation queue
- Motion/B-roll items: 361
- Principal carousel slides: 36
- Highlight carousel slides: 30
- Phrase assets: 15

### Intro assets
Verified generation of:
- VO_A readthrough
- VO_B readthrough
- VO_C readthrough
- Source Replacement readthrough
- beat-level Visual Motion Packs
- START/MIDDLE/END prompts
- text/no-text variants

### DaVinci
Verified:
- handoff JSON generation
- visual placements embedded in handoff
- Workspace Console script compiles as Python
- dry-run correctly does not pretend media exists

### Final verification behavior
A dry-run project deliberately fails final media verification:
- DRY_RUN is not accepted as final render
- a PASS state whose expected MP4 is missing is blocked
- missing/empty rendered artifacts are blocked

This prevents false READY states.

## Automated test evidence

Final development suite:
- 28 tests
- 0 failures

Tests cover:
- timecode parsing/formatting
- deterministic hashes
- master fingerprint invalidation
- PART materialization
- V3.1 HTML counts
- asset tree
- VFX prompt packs
- carousel packs
- VO readthroughs
- MLX fuzzy alignment
- MLX dual-model consensus
- absolute microtrim conversion
- intro unresolved blocking
- selected-content microtrim optimization
- intro/content microtrim scope
- VideoToolbox 40M command construction
- stream-copy assembly
- worker routing
- visual placement manifest
- package-root inference in distributable layout
- project config
- DaVinci handoff
- visual queue
- checkpoint persistence
- H03 duration gate
- final artifact verification

## Environment boundary

The verification sandbox is not the user's Apple Silicon Mac.

Therefore the following were verified structurally/dry-run, not by real hardware execution in this sandbox:
- `h264_videotoolbox` encode itself
- MLX inference on Apple Silicon
- DaVinci Resolve Workspace Console execution

The package includes preflight and dry-run stages specifically so these three environment-dependent capabilities are tested on the user's M1 Pro before the real batch.

## External creative generation boundary

The package creates:
- complete prompt folders
- START/MIDDLE/END prompt sets
- text/no-text animation prompts
- visual generation queue

It does not automatically call Flow/Omni because no authorized Flow/Omni API/connector is part of this package.

Generated visual assets remain a separate creative-generation stage before final DaVinci finishing.

## Known human gates

Real JOC55 production still requires:
1. resolve 23 Intro Lab microtrims against audio/MLX;
2. resolve the 63 relevant Content visual-placement microtrims if those treatments will be used;
3. listen to H03 and choose the exact one-second trim;
4. keep the 8 claims as VERIFY_SOURCE until independently verified;
5. generate/approve creative VFX/B-roll/carousel images externally;
6. choose VO A/B/C or Source Replacement for final intro versions.

These are intentional human/source-truth gates, not missing automation.
