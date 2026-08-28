# ABRAXAS A v1.1.3 · Interface System 3.0

## Qué es esta release

v1.1.3 reemplaza la capa de presentación heredada por una interfaz nueva escrita desde cero. No reescribe el dominio: conserva `content_id`, Contents, Campaigns, Formats, Tasks, Assets, Sources, History, QA, prompts, Client Intelligence y Automation Bridge provenientes de v1/v1.1.2.

## Cambios mayores

### Interface System 3.0
- Nuevo `src/app.js`: solo bootstrap/orquestación; no contiene renderers heredados.
- Nuevo `src/v113/` modular.
- Nuevo stylesheet exclusivo `src/v113/styles.css`.
- Sidebar/macOS workspace + selector global `Dashboard | Product Story`.
- Product Story usa los mismos datos y no crea un dominio paralelo.

### Role Projections
- Yo hago todo.
- Estrategia.
- Guion / Talento.
- Copy.
- Grabación.
- Diseño.
- Edición.
- QA.
- Publicación.

Todas son proyecciones del mismo Production Graph.

### Content Studio 2.0
`Outline | Workspace | Inspector`.

Incluye Overview, Contenido, Guion/Talento, Recording, Design, Editing, Copy, QA, Publishing e History. Guion/Talento permite Modo lectura y Teleprompter. Edición expone Recording/source, B-roll, Omni/VFX, SFX, Music, Cover, Copies y START/MIDDLE/END.

### Brain Navigator 3.0
- hemisferio izquierdo/derecho;
- fisura interhemisférica;
- frontal/parietal/temporal/occipital;
- cerebellar hint;
- gyri/sulci;
- partículas `open-chevron` ABRAXAS;
- zoom 100–200%;
- hotspots + leader lines;
- morph: brain → routes → content graph → production flow → calendar → published network.

### El Arquitecto 3.0
Contexto: módulo + etapa + rol + presentación + content_id + lifecycle + progreso + pending + filtros + next action.

Respuestas incluyen:
- dónde entrar;
- por qué;
- primera acción;
- resultado esperado;
- condición exacta de terminado.

### Shim / Automation
Conserva el contrato confirmado de v1.1.2 y lo integra en la UI nueva:
`Transcript → review HTML → CONFIRMADO → SHIM_CONFIRMED_MANIFEST → Terminal/FFmpeg + DaVinci`.

Los carruseles viajan por `CAROUSEL_PRODUCTION_PACKAGE`; nunca a FFmpeg.

### Client Quality Packs
ABRAXAS, JOC, Moka Bio e INENERGY tienen `whatIs`, `whatIsNot`, voz, visual, Quality Gates, Source Truth y prompt rules. Los packs se inyectan en el runtime y en los compiladores de prompts.

### Technique Registry
Las 41 técnicas quedan registradas y se seleccionan por módulo. Una técnica solo se considera aplicada si tiene propósito, ubicación, fallback, Reduced Motion y Performance budget.
