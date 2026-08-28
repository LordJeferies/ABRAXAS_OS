# CONTEXT-ZERO DRY RUN REPORT

## Test A · Intro Lab with no conversation history

Inputs available:
- SHARED_CORE.md
- INTRO_LAB_CRITERION.md
- PROMPT_NEW_CHAT_INTRO_LAB.txt
- episode source

Expected model recovery:
- 50–80 s.
- six routes.
- 3 guest-only + 3 mixed.
- beat <=9 s.
- 3 VO × 2 beats.
- VO XOR Source Replacement.
- dual-orientation visual prompts.

Golden result sampled from generated package:
- `INTRO_M03` · `El capital no es el trofeo`.
- recommended runtime: 55.55 s.
- route: MIXED_HOST_GUEST.
- close: DECLARATIVE_PUNCH · “El dinero es para un propósito.”.
- VO A contains 2 beats.

Result: CONTRACT RECOVERABLE FROM FILES.

## Test B · Vertical VFX with no history

Fixture:
`MV03 · Dar información gratis puede aumentar autoridad y confianza`.

Expected:
- runtime 50–90.
- semantic beats <=9 s.
- 3–4 actionable treatment opportunities.
- source caption integrity.

Generated:
- actionable visuals: 4.
- treatments: SAAS_PRODUCT_MOTION, SAAS_PRODUCT_MOTION, DOCUMENTARY_LITERAL, SAAS_PRODUCT_MOTION.

Result: CONTRACT RECOVERABLE FROM FILES.

## Test C · Horizontal visual plan

Fixture:
`JH04 · De producto a empresa`.

Duration: 9.82 min.
Expected visual density: ~1 useful intervention/minute.
Generated: 10 actionable treatment windows.

Result: PASS.

## Test D · Carousel

Principal fixture:
`C04 · Muchos buscan una idea de negocio antes de entender un problema de verdad.`.

First slide:
- function: PAIN_HOOK.
- headline: Buscar “la idea” primero puede hacerte ignorar la señal real.

Highlight fixture:
`HCL_MIXED_01 · Dar conocimiento puede crear más confianza, no menos`.
- speaker mode: MIXED.
- first = HOOK.
- last = PUNCH.

Both contain per-slide WITH_TEXT and NO_TEXT prompts.

Result: PASS.

## Test E · Separation

Content Engine editorialData contains no `intros` key.
Intro Lab editorialData contains no `verticals`, `horizontals` or `carousels` keys.

LocalStorage state keys are different and both UIs export portable selection JSON.

Result: PASS.
