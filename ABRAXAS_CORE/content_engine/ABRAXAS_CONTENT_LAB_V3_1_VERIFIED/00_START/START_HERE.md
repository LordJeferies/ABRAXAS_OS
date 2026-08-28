# ABRAXAS CONTENT LAB V3.1 · VERIFIED

V3.1 reorganiza el sistema para que un chat nuevo sepa exactamente qué archivo usar.

## Dos motores separados

### Intro Lab
Usar cuando quieres:
- generar/revisar los 6 trailers;
- reconstruir hooks, beats, VO, Source Replacement;
- crear VFX/B-roll por beat;
- producir prompts START/MIDDLE/END.

Adjunta:
1. `01_SHARED_CORE/SHARED_CORE.md`
2. `02_INTRO_LAB/INTRO_LAB_CRITERION.md`
3. `02_INTRO_LAB/PROMPT_NEW_CHAT_INTRO_LAB.txt`
4. HTML/transcript/master/client references.

### Content Engine
Usar cuando quieres:
- verticales;
- horizontales;
- carruseles principales;
- highlight carousels;
- frases;
- claims;
- potentials;
- copies;
- VFX/B-roll de clips.

Adjunta:
1. `01_SHARED_CORE/SHARED_CORE.md`
2. `03_CONTENT_ENGINE/CONTENT_ENGINE_CRITERION.md`
3. `03_CONTENT_ENGINE/PROMPT_NEW_CHAT_CONTENT_ENGINE.txt`
4. HTML/transcript/master/client references.

### Automatización
Añade `04_AUTOMATION/AUTOMATION_HTML_DAVINCI.md` cuando quieres crear:
- terminal/FFmpeg;
- fingerprints;
- PART cache;
- DaVinci;
- resume/checkpoints.

### QA
`05_QA_TESTS/QA_CONTEXT_ZERO.md` es el gate final.
`05_QA_TESTS/RUN_SELFTEST.py` verifica la estructura de un package/HTML sin depender del chat.

## Decisiones vigentes

- Intro: 50–80 s.
- Vertical: 50–90 s.
- Horizontal: 8–12 min.
- Producción beat-based: <=9 s.
- 6 intros: 3 guest-only + 3 mixed para podcast/interview.
- 3 VO por intro, exactamente 2 beats cada uno.
- VFX/B-roll: función antes que estética.
- Prompt visual: START/MIDDLE/END × WITH_TEXT/NO_TEXT + ANIMATION WITH/NO TEXT.
- Subtítulos source: intocables si se preservan.
- JOC: identidad propia; Vox/DOAC/SaaS son gramáticas de referencia, no skins para copiar.
- Legacy: preservar. Todo V3.1 usa versión/fingerprint nuevo.
- Render profile: VideoToolbox H.264 40M + PART cache + stream-copy assemblies.
