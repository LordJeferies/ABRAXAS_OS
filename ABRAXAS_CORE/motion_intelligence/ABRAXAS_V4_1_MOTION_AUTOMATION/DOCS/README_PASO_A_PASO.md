# ABRAXAS V4.1 · AUTOMATIZACIÓN EJECUTABLE CON MOTIONS

La secuencia actual, el contrato obligatorio de fragmentos de 4–9 segundos, los prompts y el conform automático de DaVinci están documentados en `README_AUTOMATIZACION_TERMINAL_V4_1.md`. Este documento conserva el detalle operativo heredado de V3.1.

Este paquete implementa el runbook V3.1 para producir **todo** lo definido en:

- `JOC55_AMANDA_CONTENT_ENGINE_V3_1.html`
- `JOC55_AMANDA_INTRO_LAB_V3_1.html`

sin borrar los outputs legacy.

## Qué automatiza realmente

### Sí automatiza
- validación del entorno;
- compilación de los dos HTML;
- fingerprints de los masters;
- creación de toda la estructura de carpetas/TXT/JSON;
- export de prompts de VFX/B-roll START/MIDDLE/END con/sin texto;
- cola de generación visual;
- resolución MLX reanudable de microtrims;
- PART plan;
- render H.264 VideoToolbox 40M;
- cache de PARTS;
- ensamblaje `-c copy`;
- dos workers seguros;
- handoff a DaVinci Workspace Console;
- QA/checkpoints/status.

### No inventa ni automatiza a ciegas
- claim verification externa;
- microtrim sin consenso MLX;
- generación de imágenes/videos en Flow/Omni sin una conexión/API autorizada;
- selección semántica del segundo a quitar en H03;
- creación de un VO grabado que todavía no existe;
- reescritura de subtítulos originales.

## Orden exacto JOC55

1. `00_INSTALL_DEPENDENCIES.command`
2. `01_SETUP_JOC55.command`
3. `02_VALIDATE_INPUTS.command`
4. `03_COMPILE_HTML.command`
5. `04_FINGERPRINT_SOURCES.command`
6. `05_BUILD_ASSETS_AND_VISUAL_QUEUE.command`
7. `06_LIST_INTRO_MICROTRIMS.command`
8. `06B_RESOLVE_ALL_INTRO_MICROTRIMS.command`
   - si se detiene en revisión manual, escuchar WAV/leer JSON;
   - aprobar con `06C_APPROVE_MICROTRIM_MANUALLY.command`;
   - reanudar `06B`.
9. Opcional pero recomendado antes de VFX final: `06E_RESOLVE_ALL_RELEVANT_CONTENT_MICROTRIMS.command`
   - V3.1 solo resuelve microtrims de las oportunidades visuales seleccionadas, no todos los beats.
10. `07_PREVIEW_H03_LAST_SECONDS.command`
11. `07A_SET_H03_OVERRIDE.command`
12. `08_BUILD_PART_PLAN.command`
13. `08A_DRY_RUN_WORKERS.command`
14. Abrir **dos Terminales**:
    - Terminal A → `09_WORKER_A_RENDER.command`
    - Terminal B → `10_WORKER_B_RENDER.command`
15. `11_BUILD_DAVINCI_HANDOFF.command`
16. DaVinci Resolve Studio:
    - crear/abrir proyecto;
    - Workspace → Console → Py3;
    - pegar el contenido de `WORKSPACE_CONSOLE_COMMAND.txt`.
17. Generar/añadir B-roll/VFX usando `09_VISUAL_QUEUE` y los prompts de cada beat.
18. Reemplazar Source Replacement por el VO elegido cuando corresponda.
19. `12_VERIFY.command`
20. `13_STATUS.command`

## Workers M1 Pro

Worker A:
- INTRO_G01
- INTRO_G03
- INTRO_M02
- horizontales

Worker B:
- INTRO_G02
- INTRO_M01
- INTRO_M03
- verticales

Hay un lock global de hardware encode para evitar dos escrituras/encodes peligrosos a la vez. Ambos workers pueden seguir preparando/ensamblando otros pasos.

## VideoToolbox

Perfil:
- `h264_videotoolbox`
- 40M target
- 48M maxrate
- 80M bufsize
- yuv420p
- AAC 192k / 48kHz / stereo

Cada PART se codifica una sola vez. Los videos derivados usan stream copy.

## Microtrims

MLX usa:
- turbo;
- large-v3;
- word timestamps;
- comparación fuzzy;
- consenso de tiempos.

Si no hay consenso, el beat queda BLOCKED. El sistema no inventa el timecode.

## H03

H03 legacy = 721 s. El hard gate horizontal V3.1 = máximo 720 s.

El paquete crea un preview de los últimos 10 s. Tras escuchar/observar, decide si quitar el segundo al comienzo o al final y guárdalo con el override. El sistema no toma esa decisión editorial por sí solo.

## VFX / B-roll

La carpeta de cada tratamiento contiene:
- LOGIC.txt
- START_NO_TEXT.txt
- START_WITH_TEXT.txt
- MIDDLE_NO_TEXT.txt
- MIDDLE_WITH_TEXT.txt
- END_NO_TEXT.txt
- END_WITH_TEXT.txt
- ANIMATION_NO_TEXT.txt
- ANIMATION_WITH_TEXT.txt
- treatment.json

Los prompts se llevan a Flow/Omni junto con las referencias del cliente/personaje.

## Subtítulos

El sistema protege los subtítulos originales. El prompt visual no debe recrearlos. En DaVinci la capa original de captions se mantiene por encima del B-roll/VFX cuando sea separable.

## Carruseles

`05_CAROUSELS/PRINCIPAL` contiene 6.
`05_CAROUSELS/HIGHLIGHTS` contiene 6.

Cada slide tiene contenido y prompt con/sin texto. La generación de la imagen se hace con la herramienta de imagen elegida, no con FFmpeg.

## Claims

Los 8 claims siguen `VERIFY_SOURCE`. Se crean sus paquetes, pero el sistema no los marca como verificados.

## Anti-timeout

El paquete no ejecuta un “todo_el_episodio.py”. Cada comando escribe estado. Si se interrumpe un worker, vuelve a ejecutar el mismo `.command`: PARTS con cache/fingerprint válido se omiten.

## Mejoras verificadas del ejecutable final

- `08_BUILD_PART_PLAN.command` también crea `00_MANIFEST/VISUAL_PLACEMENTS.json` con timing EXACT / RESOLVED / UNRESOLVED_MICROTRIM / VOICEOVER_SLOT para cada tratamiento VFX/B-roll.
- Los microtrims de Content Engine se limitan a las oportunidades visuales seleccionadas: no se transcriben cientos de beats que no requieren placement VFX.
- Intro Lab crea `VOICEOVERS/VO_A_READTHROUGH.txt`, `VO_B_READTHROUGH.txt`, `VO_C_READTHROUGH.txt` y `SOURCE_REPLACEMENT_READTHROUGH.txt` para evaluar cada trailer corrido.
- `12_VERIFY.command` ya no considera DRY_RUN como render final y bloquea un `PASS` cuyo MP4 no existe.
- El handoff de DaVinci incluye el manifest de placements visuales para ubicar B-roll/VFX por beat después de resolver microtrims.
