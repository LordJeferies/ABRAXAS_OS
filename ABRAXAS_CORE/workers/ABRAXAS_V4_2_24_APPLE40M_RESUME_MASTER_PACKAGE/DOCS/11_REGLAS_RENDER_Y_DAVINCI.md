# Render, carpetas y DaVinci

`CREAR_HOTFIX.command` genera manifests, HTML, TXT, carpetas y, si encuentra masters y ffmpeg, clips `SOURCE_REFERENCE.mp4` de las 477 ventanas seleccionadas.

Perfil obligatorio para cada clip y cada PART que requiera codificación:

- `APPLE_VT_H264_40M_V1`;
- `h264_videotoolbox`, perfil High;
- objetivo `40M`, `maxrate 48M`, `bufsize 80M`;
- `yuv420p`;
- AAC `192k`, 48 kHz, estéreo;
- MP4 `+faststart`;
- un solo slot de encoder de hardware en M1 Pro.

No existe fallback a `libx264` ni CRF. Si `-hwaccel videotoolbox` resulta
inestable, se reintenta con decode nativo, conservando el encoder VideoToolbox
40M. Cada salida se escribe como `.partial.mp4`, reporta telemetría FFmpeg,
se valida con `ffprobe` y solo entonces se publica con reemplazo atómico.

Una referencia se reutiliza únicamente cuando su sidecar confirma perfil,
timecodes y fingerprint del master. Un archivo antiguo sin ese contrato se
archiva en `30_EXPORTS` y se regenera; no se borra silenciosamente.

`GENERAR_PRODUCCION_COMPLETA.command` además ejecuta la base renderer V4.2.5 dentro de un runtime aislado. Antes de renderizar le aplica el contrato V4.2.24: verticales y horizontales se ensamblan completos y no crean fragmentos periódicos. El cache hace que las reejecuciones sean reanudables.

DaVinci:

- mantener source en V1 y audio original en A1;
- colocar Motion sin audio en la pista indicada por el mapa;
- respetar exactamente timeline in/out;
- captions aprobados permanecen arriba;
- entre Motions se conserva source, sin crear clips adicionales;
- si falta un asset, registrar `AWAITING_ASSET`; no inventarlo.

La automatización crea videos fuente y handoff. No puede fabricar por sí sola el arte final M1–M6 sin los assets aprobados que indican sus prompts.

El monitor `ABRAXAS_MONITOR_APPLE40M.command` lee `-progress` de FFmpeg para
mostrar el porcentaje temporal real del archivo activo, ETA, CPU, completados
y faltantes. No deduce el avance solo a partir del tamaño del MP4.
