# Auditoría de coherencia Apple40M

Resultado: **PASS después del hotfix APPLE40M_RESUME_R1**.

## Fuente normativa

Se auditó recursivamente `VIDEO_CONTENT_AUTOMATION_PLAYBOOK_V5_HTML_DRIVEN_APPLE40M_COOL.zip`.
Contiene nueve archivos: el manifest y ocho payloads. Los ocho SHA-256 declarados
coinciden con sus bytes. SHA-256 del ZIP recibido:
`e54f8dbf4622abcc51f38bef35b2805bda52fd6564fee399d88d8f841d477cc5`.

## Hallazgo

El renderer completo heredado V4.2.5 ya implementaba `h264_videotoolbox`, High,
40M/48M/80M, yuv420p, AAC 192k, outputs parciales, validación, caché PART y
ensamblaje `-c copy`.

El camino nuevo que generaba `SOURCE_REFERENCE.mp4` no era coherente: usaba
`libx264 -crf 20`, AAC 160k y escribía directamente sobre el destino. Los tres
clips que alcanzaron a generarse con ese camino no poseen el sidecar Apple40M y
por lo tanto se invalidan de forma controlada.

## Corrección aplicada

- VideoToolbox High con target 40M, maxrate 48M y bufsize 80M.
- yuv420p y AAC 192k/48 kHz/estéreo.
- Preflight estricto: sin VideoToolbox el render se detiene.
- Decode VideoToolbox primero; decode nativo como único fallback permitido.
- Un encoder de hardware a la vez.
- `.partial.mp4` → `ffprobe` → `os.replace`.
- Watchdog de 45 s sin telemetría y timeout por clip.
- Sidecar con perfil, timecodes y fingerprint del master.
- Resume: reutiliza solo resultados que coinciden con sidecar, fingerprint y probe.
- Telemetría `-progress` consumida por el monitor en vivo.

Los archivos incompatibles se mueven a `30_EXPORTS`; no se eliminan. El hotfix
continúa desde el OUTPUT existente y produce únicamente lo faltante o inválido.
