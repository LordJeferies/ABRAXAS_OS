# Render, carpetas y DaVinci

`CREAR_HOTFIX.command` genera manifests, HTML, TXT, carpetas y, si encuentra masters y ffmpeg, clips `SOURCE_REFERENCE.mp4` de las 477 ventanas seleccionadas.

`GENERAR_PRODUCCION_COMPLETA.command` además ejecuta la base renderer V4.2.5 dentro de un runtime aislado. Antes de renderizar le aplica el contrato V4.2.24: verticales y horizontales se ensamblan completos y no crean fragmentos periódicos. El cache hace que las reejecuciones sean reanudables.

DaVinci:

- mantener source en V1 y audio original en A1;
- colocar Motion sin audio en la pista indicada por el mapa;
- respetar exactamente timeline in/out;
- captions aprobados permanecen arriba;
- entre Motions se conserva source, sin crear clips adicionales;
- si falta un asset, registrar `AWAITING_ASSET`; no inventarlo.

La automatización crea videos fuente y handoff. No puede fabricar por sí sola el arte final M1–M6 sin los assets aprobados que indican sus prompts.

