# VIDEO AUTOMATION CLIENTES · BACKUP MAESTRO PARA IA

Este paquete describe un sistema reutilizable para convertir un video master largo y un archivo de texto con clips/timestamps en videos terminados.

No pertenece a una marca específica. Cada cliente se define mediante `CONFIG/cliente.json`.

## Caso de uso

La IA recibe:

1. Un video master largo.
2. Un TXT/MD/HTML/JSON con clips definidos por timestamps.
3. Opcionalmente, el texto hablado de cada fragmento.
4. Requisitos visuales y de edición del cliente.

La IA debe producir:

- un manifiesto estructurado de timelines;
- automatización de cortes por Terminal/FFmpeg, DaVinci Resolve o ambas;
- videos limpios;
- y, si se solicita, automatización adicional para:
  - subtítulos;
  - corrección de glosario;
  - mejora de voz;
  - movimiento/punch-ins;
  - framing;
  - render por lote;
  - verificación;
  - reanudación;
  - hotfixes.

## Cómo iniciar un cliente nuevo

1. Copia `CONFIG/cliente.example.json` como `cliente.json`.
2. Completa rutas, FPS y preferencias.
3. Sube a la IA:
   - este ZIP;
   - el archivo con timestamps;
   - si hace falta, una muestra del master o sus especificaciones.
4. Pega `PROMPTS/00_PROMPT_MAESTRO.txt`.
5. La IA debe crear primero el manifiesto. Los timestamps son autoridad editorial.
6. Después genera la automatización solicitada.
7. Toda modificación futura debe conservar el manifiesto y ser acumulativa.

## Regla principal

El archivo de timestamps NO describe videos independientes. Describe fragmentos que deben extraerse de uno o más videos master. El orden editorial del clip puede ser distinto del orden cronológico del master y debe conservarse.
