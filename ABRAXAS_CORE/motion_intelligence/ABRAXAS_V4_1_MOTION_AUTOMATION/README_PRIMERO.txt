ABRAXAS V4.1 MOTIONS · JOC55 · PRIMERA EJECUCIÓN

NO BORRA LOS VIDEOS ANTERIORES.

ORDEN:
00_INSTALL_DEPENDENCIES.command
01_SETUP_JOC55.command
02_VALIDATE_INPUTS.command
03_COMPILE_HTML.command
04_FINGERPRINT_SOURCES.command
05_BUILD_ASSETS_AND_VISUAL_QUEUE.command
06_LIST_INTRO_MICROTRIMS.command
06B_RESOLVE_ALL_INTRO_MICROTRIMS.command
06E_RESOLVE_ALL_RELEVANT_CONTENT_MICROTRIMS.command
07_PREVIEW_H03_LAST_SECONDS.command
07A_SET_H03_OVERRIDE.command
08_BUILD_PART_PLAN.command
08B_BUILD_MOTIONS_AND_PROMPTS.command
08A_DRY_RUN_WORKERS.command

DESPUÉS ABRA DOS TERMINALES:
Terminal A → 09_WORKER_A_RENDER.command
Terminal B → 10_WORKER_B_RENDER.command

LUEGO:
COLOCAR LAS IMÁGENES EN CADA ASSETS_GENERADOS
10B_BUILD_MOTION_PREVIEWS.command
11_BUILD_DAVINCI_HANDOFF.command
12_VERIFY.command
12B_VERIFY_MOTIONS_STRICT.command
13_STATUS.command

IMPORTANTE:
- Si MLX detiene un beat, use 06C para aprobarlo manualmente y reanude.
- 12_VERIFY verifica la automatización/media base; Flow/Omni y el acabado creativo final siguen su propia cola.
- Todos los fragmentos físicos/timelines quedan entre 4 y 9 segundos; objetivo promedio: 8 segundos.
- Cada video tiene 00_PROMPT_GENERAR_TODAS_LAS_IMAGENES_DEL_VIDEO.txt.
- Cada fragmento tiene MOTION_BRIEF.json, prompts por imagen y PROMPT_ANIMAR_MOTION.txt.
- DaVinci coloca el Motion si existe; si falta, deja marker exacto y continúa.
- Los claims continúan VERIFY_SOURCE.
