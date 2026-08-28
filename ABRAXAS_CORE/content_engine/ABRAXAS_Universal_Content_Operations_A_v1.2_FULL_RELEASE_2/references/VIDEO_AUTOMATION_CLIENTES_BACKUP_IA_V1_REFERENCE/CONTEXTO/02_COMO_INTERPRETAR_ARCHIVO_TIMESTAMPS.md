# CÓMO INTERPRETAR EL ARCHIVO DE CLIPS/TIMESTAMPS

## Formatos aceptables

### Formato A
CLIP 01
Título: ...
[00:04:48:17 - 00:05:36:31]
Texto...

### Formato B
[≈02:15:58:47 - ≈02:16:40:41]
Texto...

### Formato C
00:19:21–00:21:21 | Tema | observación

### Formato D
JSON/CSV/HTML con start/end.

## Normalización

Convertir siempre a:

```json
{
  "timeline_id": "V01",
  "name": "titulo_slug",
  "segments": [
    {
      "order": 1,
      "source_start": "00:04:48:17",
      "source_end": "00:05:36:31",
      "exact": true,
      "reference_text": "..."
    }
  ]
}
```

## Reglas

- Mantener el orden del documento, aunque los timestamps retrocedan.
- No ordenar cronológicamente los segmentos dentro de una timeline.
- Separar FPS de timestamp.
- Si existe `≈`, marcar `exact=false`.
- No usar OCR si el texto ya es extraíble.
- No sustituir texto de referencia por una nueva transcripción sin guardar ambas versiones.
