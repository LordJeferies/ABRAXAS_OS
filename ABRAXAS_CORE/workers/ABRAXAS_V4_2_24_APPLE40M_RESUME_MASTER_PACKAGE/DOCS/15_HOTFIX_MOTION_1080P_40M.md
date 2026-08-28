# Hotfix Motion 1080p / Apple VideoToolbox 40M

Perfil: `APPLE_VT_H264_1080P_40M_V1`.

- Verticales Motion y `SOURCE_REFERENCE`: 1080×1920.
- Horizontales Motion y `SOURCE_REFERENCE`: 1920×1080.
- Encoder: `h264_videotoolbox`, perfil High.
- Video: target 40M, maxrate 48M, bufsize 80M, yuv420p.
- Audio: AAC 192k, 48 kHz, estéreo.
- Programas completos e intros: conservan resolución fuente y caché válida.

La resolución forma parte del contrato de caché. Una referencia anterior 4K no
se mezcla ni se etiqueta como 1080p: se archiva de forma recuperable cuando le
toca su turno y se reemplaza mediante `.partial` → `ffprobe` → publicación
atómica. Los timecodes, roles narrativos y selección M1–M6 no cambian.

El monitor cuenta únicamente referencias con sidecar 1080p/40M válido.

