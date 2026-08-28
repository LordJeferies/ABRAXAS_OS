# ABRAXAS A v0.9.6.1 · Verification Report

## Root cause
v0.9.6 executed browser bootstrap before late `const`/`let` declarations in the Product Story/Home runtime were initialized. The reproduced first exception was:

`ReferenceError: Cannot access 'HOME_INTENTS_V096' before initialization`

This stopped JavaScript during the first Home render, producing a black/non-interactive application.

## Fix
- Removed the mid-file bootstrap.
- Added one bootstrap at the very end of `app.js` after every declaration.
- Added `bootApplication0961()` with a visible Recovery Mode error boundary.
- Added migration from v0.9.6/v0.9.5 localStorage state into v0.9.6.1.
- Preserved Product Story/Home brain, workspaces, Production Graph and prompts.

## Fresh verification
- JavaScript syntax: PASS (`core.js`, `data.js`, `app.js`).
- Core Node tests: PASS.
- Runtime Node tests: PASS.
- Source browser-like bootstrap: PASS.
- Browser-like navigation through all 12 primary routes: PASS.
- Shim step transition smoke: PASS.
- El Arquitecto open/intent/close smoke: PASS.
- Built standalone browser-like bootstrap + all-route navigation: PASS.
- Python release/regression suite: 139/139 PASS.
- Prompt Quality Gate: 548 prompts, minimum/average 100/100, minimum 324 words, 0 failures.
- Prompt Strict Scan: 548 prompts, 0 short prompts, 0 placeholders.

## Release rule added
A future release is invalid if only source tests pass. The built standalone HTML itself must execute with `document` present and navigate every primary route before packaging.
