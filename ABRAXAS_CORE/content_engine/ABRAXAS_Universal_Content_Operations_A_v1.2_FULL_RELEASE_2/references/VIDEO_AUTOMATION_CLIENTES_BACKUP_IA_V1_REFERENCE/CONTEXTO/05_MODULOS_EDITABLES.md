# MÓDULOS QUE LA MISMA IA PUEDE AGREGAR DESPUÉS

El sistema no termina al cortar videos. Debe estar diseñado para evolucionar.

## Módulos
- subtítulos IA;
- subtítulos desde Whisper;
- glosario;
- Text+;
- caption nativo;
- logos;
- títulos;
- lower thirds;
- zooms;
- pan;
- reframing;
- auto-crop;
- Voice Isolation;
- Dialogue Leveler;
- normalización;
- música;
- B-roll;
- imágenes;
- overlays;
- branded frames;
- color;
- LUT;
- CTA;
- versiones 9:16 / 16:9 / 1:1;
- versión limpia;
- versión subtitulada.

## Contrato

Un módulo nuevo:
- lee `cliente.json`;
- lee `manifest.json`;
- no reinterpreta timestamps;
- no destruye outputs válidos;
- versiona su configuración;
- invalida solo aquello que depende de él.
