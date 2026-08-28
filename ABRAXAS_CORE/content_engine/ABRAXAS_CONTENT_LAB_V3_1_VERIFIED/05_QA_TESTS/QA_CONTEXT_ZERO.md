# QA + CONTEXT ZERO TESTS V3.1

## Qué se probó

V3.1 no se considera autosuficiente solo porque tenga muchas reglas.
Debe demostrar que una IA nueva puede determinar:
- qué archivo leer;
- qué engine ejecutar;
- qué hard gates aplicar;
- qué no puede inventar;
- qué outputs debe producir.

## Context-zero scenarios

Los fixtures ejecutables viven en `GOLDEN_FIXTURES.json`.

Se cubren:
1. Intro Lab nuevo chat.
2. Vertical VFX nuevo chat.
3. Horizontal B-roll nuevo chat.
4. Carruseles nuevo chat.

Cada escenario lista exactamente qué archivos se adjuntan y qué invariantes debe recuperar la IA sin memoria de conversación.

## QA del ejemplo JOC55

Expected:
- 29 verticales.
- 18 GUEST_LED + 7 HOST_LED + 4 MIXED.
- 12 horizontales.
- 4 GUEST_LED + 4 HOST_LED + 4 MIXED.
- 6 principal carousels.
- 6 highlight carousels.
- highlight distribution 2 HOST + 2 GUEST + 2 MIXED.
- 15 frases.
- 8 claims = VERIFY_SOURCE.
- 6 potentials.
- 6 intros.
- 3 GUEST_ONLY + 3 MIXED_HOST_GUEST.
- todos los intros recomendados 50–80.
- todos los production beats planificados <=9.
- cada intro = 3 VO × 2 beats.
- source replacement separado del VO.
- START/MIDDLE/END × no-text/with-text para tratamientos no-PRESENTER_ONLY.
- prompts de animation no-text/with-text.
- selección portable vía export JSON.
- Content HTML no contiene Intro Lab.
- Intro HTML no contiene Content Engine videos/carruseles.

## Bloqueos deliberados

### H03
Rango legacy = 12:01.
Hard gate V3.1 = máximo 12:00.

Status:
`TRIM_REQUIRED_1S`.

Correct behavior:
NO inventar dónde cortar.
Resolver contra master/editorial.

### Claims
Los 8 claims permanecen `VERIFY_SOURCE`.
No usar el hecho de que aparezcan en el HTML como verificación.

### MICROTRIMS
`planned_seconds` sirve para diseño.
Parent range + anchors sirven para resolver.
No convertir planned_seconds en word-level timestamp.

## Zero-context anti-tests

FAIL si un prompt:
- dice “como hablamos antes”;
- depende de un color que no aparece en archivos;
- dice “same style as before”;
- asume quién es host/invitado sin metadata;
- convierte localStorage de un navegador anterior en estado confirmado;
- pide copiar Vox o DOAC exactamente;
- confunde VFX text con subtítulos.

## Visual QA

Un treatment no pasa solo porque tenga un prompt.

Debe tener:
- trigger/meaning;
- family;
- logic;
- scene/action;
- START/MIDDLE/END continuity;
- with/no-text variants;
- animation prompt;
- subtitle policy;
- negative constraints.

`PRESENTER_ONLY` es un resultado válido y NO cuenta como una de las 3–4 intervenciones VFX/B-roll mínimas de un vertical.

## Resultado esperado del self-test

`SELFTEST PASS` con:
- 0 structural failures;
- 1 intentional content blocker: H03 TRIM_REQUIRED_1S;
- 8 claims pending verification;
- N microtrims pending audio resolution (not structural failures).
