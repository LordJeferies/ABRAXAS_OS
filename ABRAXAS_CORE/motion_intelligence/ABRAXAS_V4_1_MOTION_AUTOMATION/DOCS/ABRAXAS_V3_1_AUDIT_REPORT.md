# AUDIT REPORT · ABRAXAS CONTENT LAB V3.1

## Executive result

The previous V3 architecture was directionally strong but was not yet sufficient as a context-zero production package.

V3.1 fixes the gaps instead of hiding them.

## Problems found in V3

1. The system described a target of six intros but the actual JOC55 example still contained only three legacy intros.
2. The old review HTML combined Intro Lab with clips/carousels and created too much cognitive load.
3. The attached legacy Intro Lab was built under an older 50–90 s target and contains source/VO blocks longer than the new <=9 s production rule.
4. Later speaker-balanced JOC/MIXED selections were not merged into the old 18-vertical / 4-horizontal review HTML.
5. There was no executable context-zero test demonstrating that a new AI could reconstruct the contracts.
6. Static browser localStorage state was useful for UI but not portable approval state.
7. The earlier visual system allowed a generic visual fallback too easily. V3.1 changes the safe fallback to PRESENTER_ONLY and only counts actionable visual treatments toward clip VFX density.
8. A legacy horizontal lasts 721 s. Under the new 8–12 min gate it cannot be silently called PASS.

## V3.1 corrections

### Intro Lab
- actual intros: 6.
- distribution: 3 GUEST_ONLY + 3 MIXED_HOST_GUEST.
- recommended runtimes: INTRO_G01=57.06s, INTRO_G02=64.46s, INTRO_G03=68.25s, INTRO_M01=66.82s, INTRO_M02=71.91s, INTRO_M03=55.55s.
- source-replacement runtimes: INTRO_G01=54.2s, INTRO_G02=71.41s, INTRO_G03=69.06s, INTRO_M01=67.0s, INTRO_M02=68.0s, INTRO_M03=52.46s.
- every planned beat <=9 s.
- each intro contains 3 VO alternatives × exactly 2 beats.
- source replacement remains mutually exclusive with VO.
- pending audio microtrims: 23. They remain explicit blockers, not fake exact timecodes.

### Content Engine
- verticals: 29 = {'GUEST_LED': 18, 'HOST_LED': 7, 'MIXED': 4}.
- horizontals: 12 = {'GUEST_LED': 4, 'HOST_LED': 4, 'MIXED': 4}.
- principal carousels: 6.
- highlight carousels: 6 = 2 HOST + 2 GUEST + 2 MIXED.
- phrases: 15.
- claims: 8; all remain VERIFY_SOURCE.
- potentials: 6.
- H03: TRIM_REQUIRED_1S.

### Visual treatments
Vertical actionable treatment family distribution:
{'DOCUMENTARY_LITERAL': 30, 'SYMBOLIC_OBJECT': 19, 'VOX_EDITORIAL': 36, 'SAAS_PRODUCT_MOTION': 10, 'WORD_ENVIRONMENT': 3}

Horizontal actionable treatment family distribution:
{'DOCUMENTARY_LITERAL': 50, 'VOX_EDITORIAL': 50, 'SYMBOLIC_OBJECT': 15, 'SAAS_PRODUCT_MOTION': 10, 'WORD_ENVIRONMENT': 3, 'SCIENTIFIC_MACRO': 1}

Intro source-beat decision distribution, including PRESENTER_ONLY:
{'PRESENTER_ONLY': 26, 'DOCUMENTARY_LITERAL': 14, 'SAAS_PRODUCT_MOTION': 4, 'VOX_EDITORIAL': 15}

The absence of SCIENTIFIC_RENDER in Amanda-heavy content is intentional: the source does not justify forcing scientific renders simply because the visual reference PDFs contain them.

## Context-zero test

A new-chat fixture was constructed for:
- Intro Lab.
- Vertical VFX.
- Horizontal visual planning.
- Principal carousel.
- Highlight carousel.

The prompt files were scanned for hidden conversational dependencies such as:
“como hablamos antes”, “same style as before” and “los colores que hablamos”.

Result: no context dependency phrases detected.

## Executable self-test

Fresh run result:
- structural failures: 0.
- intentional blocker: H03_TRIM_REQUIRED_1S.
- claims pending: 8.
- intro microtrims pending audio: 23.

## JavaScript / HTML verification

Both HTML script bundles pass `node --check`.

The self-contained HTML editorialData exactly matches its source JSON.

Full headless Chromium screenshot testing could not be used in this execution container because Chromium itself times out even on a trivial one-line HTML due to the container's DBus/zygote environment. This is an environment limitation, not treated as an HTML PASS.

To reduce real-world load risk anyway, both review HTMLs were rewritten to lazy-hydrate heavy beat/prompt/transcript details only when a section is opened.

## Quality conclusion

V3.1 is a better baseline than V3 because it now has:
- actual deliverable structures, not only target schemas;
- explicit speaker ownership;
- separate cognitive surfaces;
- portable selection state;
- context-zero fixtures;
- stricter MICROTRIM provenance;
- actionable visual density;
- lazy review rendering;
- one explicit blocker rather than a false PASS.

Remaining user/editor actions:
- resolve 23 intro microtrims against master audio;
- choose exact 1 s trim for H03;
- verify the 8 claims before publication.
