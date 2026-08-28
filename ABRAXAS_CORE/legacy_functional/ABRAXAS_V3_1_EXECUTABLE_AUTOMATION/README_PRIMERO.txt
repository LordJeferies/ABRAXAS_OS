ABRAXAS V3.1 · JOC55 · PRIMERA EJECUCIÓN

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
08A_DRY_RUN_WORKERS.command

DESPUÉS ABRA DOS TERMINALES:
Terminal A → 09_WORKER_A_RENDER.command
Terminal B → 10_WORKER_B_RENDER.command

LUEGO:
11_BUILD_DAVINCI_HANDOFF.command
12_VERIFY.command
13_STATUS.command

IMPORTANTE:
- Si MLX detiene un beat, use 06C para aprobarlo manualmente y reanude.
- 12_VERIFY verifica la automatización/media base; Flow/Omni y el acabado creativo final siguen su propia cola.
- Las imágenes/B-roll/VFX se preparan desde 09_VISUAL_QUEUE y las carpetas VISUAL_MOTION.
- Los claims continúan VERIFY_SOURCE.
