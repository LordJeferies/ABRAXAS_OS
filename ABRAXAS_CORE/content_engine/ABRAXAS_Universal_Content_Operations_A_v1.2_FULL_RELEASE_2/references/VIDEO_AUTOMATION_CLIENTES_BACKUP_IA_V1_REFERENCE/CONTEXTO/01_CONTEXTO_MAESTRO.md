# CONTEXTO MAESTRO · SISTEMA GENÉRICO DE AUTOMATIZACIÓN DE VIDEO

## 1. Qué recibe la IA

El usuario entrega un archivo que contiene una selección editorial de clips. Cada clip puede estar formado por uno o varios rangos de tiempo tomados de un video master más largo.

Ejemplo conceptual:

CLIP 01
Título: Una idea concreta
[00:10:21:15 - 00:10:32:04]
Texto hablado...

[00:17:03:10 - 00:17:18:21]
Texto hablado...

Eso significa:

- existe un master largo;
- CLIP 01 no es todavía un archivo MP4;
- CLIP 01 debe construirse extrayendo ambos rangos;
- los rangos deben concatenarse en el orden en que aparecen en el archivo editorial;
- no se deben inventar nuevos cortes;
- el texto sirve para QA, subtítulos o identificación, pero los timestamps controlan el corte.

## 2. Autoridad de timestamps

Clasificar cada timestamp:

- EXACTO: se puede automatizar.
- APROXIMADO (`≈`): no tratar como exacto sin validación.
- FALTANTE: bloquear o pedir dato.
- FRAME-BASED: necesita FPS correcto.
- TIME-BASED: convertir a segundos de forma determinista.

Nunca desplazar un timestamp “para que quede mejor” salvo instrucción explícita.

## 3. Manifiesto intermedio obligatorio

Antes de cortar, convertir el archivo editorial a un manifiesto JSON normalizado.

Cada timeline debe contener:

- id;
- nombre;
- título;
- categoría;
- orientación;
- FPS;
- resolución objetivo;
- segmentos en orden editorial;
- source_start;
- source_end;
- duración calculada;
- texto de referencia;
- estado exacto/aproximado;
- metadatos opcionales.

Ese manifiesto es la fuente de verdad para Terminal y DaVinci.

## 4. Backends

### Terminal / FFmpeg
Ideal para:
- cortes exactos;
- lotes;
- render reproducible;
- salida limpia sin subtítulos;
- concatenación de varios fragmentos;
- framing determinista;
- validación automática.

### DaVinci Resolve Studio
Ideal para:
- edición visual;
- Voice Isolation / Dialogue Leveler;
- subtítulos IA;
- Text+;
- punch-ins;
- color;
- presets de render;
- edición posterior dentro del proyecto.

### Híbrido
Terminal genera clips limpios exactos y DaVinci realiza la edición creativa. Es el modo recomendado cuando la prioridad es precisión + capacidad de edición.

## 5. Regla de continuidad

Un clip compuesto por varios segmentos debe quedar continuo:

segmento 1 → segmento 2 → segmento 3

Sin:
- frames negros;
- huecos de audio;
- solapamientos;
- frames congelados accidentales.

Los rangos de DaVinci pueden tener semántica inclusiva/exclusiva diferente según API. Calibrar localmente antes del lote y verificar 0 gaps / 0 overlaps.

## 6. Salidas recomendadas

Por cliente:

`~/Desktop/<CLIENTE>_Video_Automation/`

- `01_MANIFEST/`
- `02_CLEAN/`
- `03_SUBTITLES/`
- `04_DAVINCI_FINAL/`
- `05_LOGS/`
- `06_BACKUPS/`

## 7. Edición opcional

La misma IA que crea los cortes debe poder extender el sistema sin rehacerlo.

Módulos activables:
- framing vertical/horizontal;
- zoom/punch-ins;
- reencuadre;
- subtítulos;
- corrección de glosario;
- Voice Isolation;
- Dialogue Leveler;
- normalización;
- B-roll;
- logo;
- lower thirds;
- intro/outro;
- Text+;
- títulos;
- render múltiple;
- versiones con y sin subtítulos.

Cada módulo debe consumir el manifiesto original, no volver a interpretar el TXT desde cero.

## 8. Hotfixes

Todo hotfix debe ser acumulativo.

Debe:
1. identificar root cause;
2. crear backup;
3. conservar configs y estado;
4. actualizar dependencias relacionadas;
5. limpiar caché si corresponde;
6. probar un clip/timeline;
7. luego reanudar el lote.

Nunca entregar un parche que sustituya un módulo por una versión incompleta.

## 9. DaVinci Workspace Console

Para automatización interna:
`Workspace → Console → Py3`

Compatibilidad necesaria:
- scripts UTF-8 / UTF-8-SIG;
- no depender de `print(..., flush=True)`;
- la consola puede usar `fu_stdout`/`fu_stderr` sin `flush()`;
- limpiar/reload de módulos cuando se instalan hotfixes;
- consultar la API local antes de asumir métodos.

Métodos de Resolve pueden cambiar entre versiones. Diagnosticar primero.

## 10. Subtítulos DaVinci

Objetivo genérico:

audio del clip/timeline
→ DaVinci crea subtítulos IA
→ guardar texto/tiempos originales
→ aplicar glosario controlado
→ mantener respaldo original
→ producir capa final editable
→ render.

Si la API local permite editar captions nativos, usarlos.
Si no, usar una estrategia compatible, por ejemplo:
- SRT corregido + flujo de importación compatible;
- o Text+ plantilla del Media Pool duplicada por timestamp.

No destruir la pista IA hasta validar el reemplazo.

## 11. Movimiento simple

Perfil recomendado “equilibrado” para talking heads:

Vertical:
100% → 106% → 100% → 105% → 107%

Horizontal:
100% → 104% → 100% → 103% → 105%

Cada 8–12 s, con pan mínimo. Evitar zoom constante o movimientos agresivos.

## 12. Mejora de voz

Cuando se use DaVinci Studio:
- plantilla vertical;
- plantilla horizontal;
- Track A1 con mejora de voz configurada una sola vez;
- duplicar plantilla para conservar Track FX.

Ejemplo conservador:
- Voice Isolation 35%;
- Dialogue Leveler;
- salida natural;
- no sobreprocesar.

## 13. Reanudación

El sistema debe registrar por timeline:
- parsed;
- clean_rendered;
- imported;
- timeline_created;
- movement_applied;
- voice_ready;
- subtitles_generated;
- glossary_applied;
- final_layer_created;
- render_queued;
- rendered;
- verified.

Al reanudar, procesar solo etapas faltantes o stale.
