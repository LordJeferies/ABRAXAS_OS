# Archivos y datos protegidos

No borrar ni sustituir de forma silenciosa:

- masters oficiales vertical y horizontal;
- HTML base y HTML V4.2.24;
- SRT y resoluciones de microtrim preaprobadas;
- `FINAL_AI_MOTION_MAP_V4_2_24.json` y su validation;
- TXT, prompts, decisiones y contratos de assets;
- cache, state, logs y backups del output;
- núcleo editorial del Intro Lab;
- programas completos ya renderizados que pasaron QA.

La automatización escribe manifests de forma atómica y guarda un backup del árbol AI seleccionado antes de regenerarlo. El runtime histórico se instala dentro de `00_CONTROL/RUNTIME_V4_2_24`, no encima de una instalación del usuario.

