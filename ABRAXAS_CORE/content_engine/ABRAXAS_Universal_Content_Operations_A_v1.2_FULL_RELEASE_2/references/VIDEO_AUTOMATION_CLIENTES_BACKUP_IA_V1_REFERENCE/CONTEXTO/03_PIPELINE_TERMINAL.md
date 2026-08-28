# PIPELINE TERMINAL / FFMPEG

## Flujo

archivo timestamps
→ parser
→ manifest.json
→ preflight master
→ extracción de cada segmento
→ concat en orden editorial
→ framing
→ audio
→ validación
→ MP4 limpio
→ opcional subtítulos/render adicional.

## Requisitos

- FFmpeg local.
- Seek independiente por segmento.
- Concat sin gaps.
- Salidas atómicas.
- Stop on first real error.
- Reanudable.
- Fingerprints del manifiesto/config.
- Verificar resolución, FPS, duración y audio.
- No quemar subtítulos si se solicita versión limpia.
- No degradar el master con renders intermedios innecesarios.

## Estructura sugerida

`00_PREPARAR.command`
`01_PARSEAR_TIMESTAMPS.command`
`02_RENDER_LIMPIO.command`
`03_VERIFICAR.command`
`04_RENDER_VARIANTES.command`

`tools/parser.py`
`tools/render.py`
`tools/verify.py`
`config/client.json`
`manifest/timelines.json`
