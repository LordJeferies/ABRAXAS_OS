# CHANGELOG / MIGRATION · CONTENT LAB V3

## Classification

This release is a **BREAKING EDITORIAL / PRODUCTION CHANGE**.

It does NOT delete previous data.

## Baseline preserved

Preserved concepts:
- Source Truth.
- Content Review HTML.
- FULL/CLEAN source audit.
- 3 VO alternatives.
- Source Replacement.
- VFX/B-roll/SFX/music/camera/transition notes.
- START/MIDDLE/END references.
- prompt with/without text.
- VideoToolbox 40M.
- PART cache.
- `-c copy`.
- M1 Pro workers.
- DaVinci handoff.
- human approval.
- source fingerprints.
- claims status.

## Replaced / upgraded

### Intro count
OLD:
3.

V3:
6.

### Intro duration
OLD baseline:
50–90 s in previous JOC Intro Lab.

V3 hard gate:
50–80 s.

### Beat structure
OLD:
some source/VO blocks could exceed 9 s.

V3:
all production beats <=9 s.

### Voice Over
OLD:
3 VO options; internal VO could contain 3–4 microbeats.

V3:
3 VO options, each exactly 2 coherent beats <=9 s.

### Visual treatment
OLD:
production notes existed per block.

V3:
formal Visual Motion Pack with:
- treatment family;
- human logic;
- START/MIDDLE/END;
- with/no-text prompts for every state;
- with/no-text animation prompts;
- physics/material/subtitle QA.

### Clips
OLD:
VFX notes varied.

V3:
- verticals 3–4 prioritized opportunities;
- horizontals ~1 useful opportunity/minute.

### Carousels
OLD:
main carousels.

V3:
- pain/context cover requirement;
- explain/news/tips improvements;
- 6 additional highlight carousels.

## Legacy policy

Old renders:
`LEGACY_OUTPUT`.

Old manifests:
`LEGACY_EDITORIAL`.

Do not delete.

New:
`OUTPUT_V3`.

## Migration of old HTML

`08_HTML_BRIDGE_V3.py` does not pretend that a 3-intro HTML already satisfies V3.

It outputs:
`migration.intro_status = REBUILD_REQUIRED`.

Existing clips/carrusels can preserve:
- source;
- title;
- timestamps;
- copy;
- approved editorial text.

But V3 must regenerate:
- beat segmentation when needed;
- visual opportunity plan;
- visual prompts;
- 6-intro set;
- 6 highlight carousels.

## Migration order

1. Compile old HTML.
2. Save migration report.
3. Preserve old output.
4. Resolve source/microtrim.
5. Re-run Intro Lab V3.
6. Re-run Content Engine visual layer.
7. Generate new V3 assets.
8. Produce V3 cuts/renders in separate root.
9. Compare.
10. Human approve.

## Why

V3 is not a visual skin.
It changes:
- narrative unit size;
- treatment density;
- intro coverage;
- VO architecture;
- carousel product mix;
- downstream generation workflow.

Silent in-place migration would make provenance ambiguous.


# V3.1 changes

ADDED
- Actual six-intro JOC55 set.
- 3 guest-only + 3 mixed.
- 7 JOC verticals + 4 mixed verticals.
- 4 JOC-led horizontals + 4 mixed horizontals.
- 6 highlight carousels.
- Separate Intro Lab / Content Engine review HTMLs.
- Context-zero golden fixtures and executable self-test.
- Portable selection export.

CHANGED
- PRESENTER_ONLY is the safe default when motion has no narrative function.
- MICROTRIM stores parent ranges, never false exact word-level timecodes.
- H03 stays explicitly blocked by 1 second duration excess instead of silently trimming.

LEGACY
- Original review HTML and prior renders are preserved.
