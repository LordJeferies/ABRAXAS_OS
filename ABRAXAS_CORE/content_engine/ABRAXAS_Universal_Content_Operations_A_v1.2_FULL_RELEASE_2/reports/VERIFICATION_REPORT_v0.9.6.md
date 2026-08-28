# ABRAXAS A v0.9.6 · Verification Report

## Functional gates
- JavaScript syntax: core/app/data PASS.
- Core Node tests: PASS.
- Runtime Node tests: PASS.
- Release/regression suite: 139/139 PASS.
- Home visual contract: procedural canvas + open-chevron particle glyph + clickable hotspots + semantic scroll morph states.
- Navigation contract: Home naming + global upper-right menu + route closes menus.
- Architect contract: fixed right utility window + in-place answers + active story/module/content context.
- Shim contract: five-step wizard with source, outputs, structures, review and export.
- Story contract: smaller typography + rails + selectors + disclosures + Visual/Text mode.
- Workspace contract: native focused center-stage classes and single-primary-action pattern.

## Prompt gates
- 548 runtime prompts audited.
- Minimum structural score: 100/100.
- Average structural score: 100/100.
- Minimum prompt length: 324 words.
- Short prompts: 0.
- Placeholder hits: 0.

## Visual reference audit
See `reports/VISUAL_REFERENCE_AUDIT_v0.9.6.md` and `json/APPLE_PRODUCT_STORY_MOTION_v0.9.6.json`.

## Browser-render limitation
A Playwright/Chromium perceptual screenshot was attempted using both `file://` and a localhost HTTP server. This environment blocks both navigations with `ERR_BLOCKED_BY_ADMINISTRATOR`, so browser screenshots are not claimed as a passed release gate. Visual behavior is instead covered by code/runtime regressions and the user-provided reference audit. Final perceptual review should be performed on the delivered HTML in macOS.
