# HTML REFERENCES — ABRAXAS v1.1.1 · Especificación funcional para IA

**Objetivo:** decirle a una IA exactamente **qué puede construir con cada técnica, en qué herramienta de ABRAXAS, con qué datos se activa, cómo se comporta y cómo se valida**.

**Producto:** ABRAXAS v1.1.1 · JOC Editorial Proof of System.  
**Alcance:** contexto de diseño e implementación. No modifica todavía el HTML.

---

# 1. Cómo debe usar este documento una IA

Cada aplicación tiene un ID `TNN-MOD-##`:

- `TNN`: técnica.
- `MOD`: módulo.
- `##`: aplicación concreta dentro del módulo.

La IA no debe “aplicar la técnica” de forma genérica. Debe seleccionar uno o varios IDs, implementar el comportamiento descrito y verificar el resultado observable.

## Formato obligatorio de respuesta de la IA antes de programar

```text
MÓDULO:
TAREA DEL USUARIO:
APLICACIONES SELECCIONADAS: [IDs TNN-MOD-##]
QUÉ SE VA A CONSTRUIR:
DATOS/ESTADOS QUE LO ACTIVAN:
TÉCNICAS QUE SE COMBINAN:
CONFLICTOS DESCARTADOS:
FALLBACK / REDUCED MOTION:
PRUEBAS Y RESULTADO OBSERVABLE:
```

## Reglas no negociables

- JOC-only en la instancia v1.1.1.
- Dashboard/Workspace primero; Story es secundario.
- `content_id`, Campaign, Format, Task, Asset, Source Truth, History y QA son datos estables.
- Role Desks son filtros del Production Graph, no bases duplicadas.
- Offline mediante `file://`, sin CDN ni secretos.
- Un solo bootstrap y Recovery Mode intacto.
- Varias técnicas pueden combinarse si no compiten por scroll, foco, drag, puntero o canvas.
- La técnica debe mejorar una tarea; si solo decora, no se implementa.

---

# 2. Códigos de módulos

| Código | Herramienta o módulo |
|---|---|
| `GLO` | Shell, navegación, estado y sistema global |
| `HOM` | Home / Dashboard |
| `BRI` | Brand Intelligence + Branding Method + Format Library |
| `CAM` | Campaigns |
| `HE` | He — Content Factory |
| `SHI` | Shim + JOC Podcast Engines |
| `AI` | AI Handoff + AI Results |
| `STU` | Content Studio |
| `PRO` | Production Queue + Copy/Recording/Visual/Editing/QA/Publishing Desks |
| `ASS` | Assets |
| `QAH` | QA + History + Source Truth |
| `CAL` | Calendar + Backlog |
| `LIB` | Library + Saved Views |
| `ANA` | Analytics |
| `ARQ` | El Arquitecto |
| `STO` | Story / Overviews secundarios |

---

# 3. Matriz inicial por herramienta: qué experiencia debe construir la IA

| Módulo | Trabajo real del usuario | Técnicas que se combinan | Resultado concreto que debe existir |
|---|---|---|---|
| Home | Elegir qué hacer y resolver atención | 2, 3, 5, 26, 27, 30, 35, 39, 40, 41 | Launcher por intención, Today, This Week, Next Decision y Continue, todos con enlaces filtrados. |
| Brand Intelligence | Entender y usar criterio JOC | 2, 3, 12, 15, 24, 28, 30, 31, 32, 33, 34, 35, 36, 39, 41 | Método/Applied to JOC, formatos, reglas, ejemplos, anti-ejemplos y fuentes con explorer + showcase. |
| Campaigns | Ver plan, cobertura y bloqueos | 2, 3, 5, 15, 30, 35, 36, 39, 40, 41 | Overview accionable, mix, timeline, blockers y acceso a Content filtrado. |
| He | Crear pieza/lote sin perder criterio | 2, 3, 5, 15, 29, 30, 35, 39, 41 | Wizard, Coverage Map, blueprint de lote, prompts separados y Save as AI READY. |
| Shim | Convertir podcast en oportunidades trazables | 2, 5, 7, 15, 20, 22, 29, 30, 35, 39, 41 | Wizard de fuente, previews coordinados, timeline/timestamps, selección y export Prompt/TXT/JSON. |
| AI Handoff/Results | Sacar y devolver trabajo sin duplicar Content | 2, 5, 15, 29, 30, 35, 39, 41 | How to Use + selección de destino/tipo + mapping preview + confirmación segura. |
| Content Studio | Revisar una pieza y cada unidad | 2, 5, 7, 12, 15, 20, 22, 30, 32, 35, 36, 39, 41 | Documento 1×1 con unit list, preview, inspector, prompts, assets, QA e History sincronizados. |
| Production/Desks | Resolver una tarea a la vez | 2, 3, 5, 15, 26, 30, 35, 36, 39, 40, 41 | Entrada por responsabilidad, lista priorizada y workspace de tarea con criterio de terminado. |
| Assets | Vincular archivos a pieza/unidad/slot | 2, 4, 5, 7, 15, 22, 30, 35, 36, 39, 41 | Browser visual, expected slots, mapping, versiones, preview y aprobación. |
| QA/History/Source | Verificar y preservar decisiones | 2, 3, 5, 15, 24, 30, 32, 35, 36, 39, 40, 41 | Gates generales + JOC/Format, evidencia, diff de revisión, razón y restauración. |
| Calendar | Programar sin duplicar piezas | 2, 5, 15, 22, 30, 35, 36, 39, 40, 41 | Mes/semana/lista/backlog, drag/drop, risk badges y detalle de Content. |
| Library | Encontrar cualquier Content | 2, 4, 5, 15, 26, 30, 35, 36, 39, 40, 41 | Búsqueda, filtros combinables, saved views, resultados y apertura con retorno al contexto. |
| Analytics | Detectar mezcla, cobertura y bottlenecks | 2, 4, 5, 15, 32, 35, 36, 39, 40, 41 | Gráfico + tabla + insight + acción para corregir el problema detectado. |
| Arquitecto | Explicar pantalla y siguiente acción | 2, 5, 15, 23, 26, 30, 35, 39, 41 | Utility window contextual, respuesta in-place y spotlight sobre un control real. |
| Story/Overviews | Explicar sistema, marca o campaña | 1, 6, 10, 12, 13, 17, 21, 24, 25, 28, 32, 33, 34, 37, 39, 41 | Capítulos navegables, una idea por escena, visual funcional y modo texto equivalente. |

---

# 4. Las 41 técnicas convertidas en recetas de aplicación

## T01. Motion avanzado tipo GSAP — usar motor nativo offline

**Qué aporta:** continuidad entre acción, cambio de estado y resultado. No es animación ambiental constante.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T01-HOM-01` | Home · rutas | Las rutas aparecen desde su posición de origen y la seleccionada se transforma en el heading del módulo destino. | `state.ui.section` + acción elegida. | Se entiende qué acción produjo el cambio y el foco llega al destino. |
| `T01-HE-01` | He · Coverage Map | Al cambiar cantidad/cadencia, las piezas se reordenan con FLIP en vez de desaparecer y reaparecer. | `quantity`, ventana y cadencias L1/L2/L3. | Se reconoce qué pieza se agregó, movió o eliminó. |
| `T01-SHI-01` | Shim · candidatos | Seleccionar un clip expande timeline/notas desde la card seleccionada; deseleccionar revierte. | `candidate_id` seleccionado. | Selección y detalle conservan relación espacial. |
| `T01-STU-01` | Studio · unidades | Abrir slide/beat mueve el preview al centro y materializa inspector desde el borde derecho. | `active_unit_id`. | Lista, preview e inspector permanecen sincronizados. |
| `T01-PRO-01` | Role Desk · completar | Al completar task, la fila confirma, actualiza porcentaje y mueve la siguiente tarea al foco. | `task.status = done`. | Feedback dura <300 ms y la siguiente acción queda clara. |
| `T01-CAL-01` | Calendar · drop | Animar placeholder, confirmación de fecha y retorno si el drop es inválido. | drag start/drop/cancel. | El usuario distingue mover, aceptar y revertir. |
| `T01-STO-01` | Story · capítulos | Revelar heading, visual y anotación en secuencia corta al activar capítulo. | Intersection Observer/sección activa. | Una escena dirige atención sin retrasar lectura. |

### Instrucción directa para IA

Implementa estas transiciones con CSS, Web Animations API y un scheduler `requestAnimationFrame` compartido. Usa animaciones disparadas por cambios de estado; cancélalas al cambiar de ruta. No cargues GSAP desde CDN. Con `prefers-reduced-motion`, conserva solo crossfade breve o cambio instantáneo.

**Combina con:** T05, T15, T31, T35, T39, T41.  
**No aplicar:** loops decorativos en formularios, QA, tablas o editores.

## T02. Arquitectura Data-Driven

**Qué aporta:** una sola fuente de verdad para que toda UI, prompt y visualización responda a objetos reales.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T02-HOM-01` | Home | Derivar Today, This Week, Next Decision y Continue desde Content/Task/Campaign/Calendar/returnContext. | cambios del grafo. | Cada bloque y CTA se actualiza sin conteos hardcoded. |
| `T02-BRI-01` | Brand/Formats | Renderizar Core, Identity, pillars, formats, versiones, examples/anti-examples y QA desde schemas JOC. | `client_id=JOC`, `format_id`, `format_version`. | Cambiar un format actualiza explicación, prompt y QA sin HTML duplicado. |
| `T02-CAM-01` | Campaigns | Calcular planned/published/blocked, mix y fechas desde `campaign.content_ids`. | Campaign + Content lifecycle/tasks. | Ningún contador está escrito manualmente. |
| `T02-HE-01` | He compiler | Combinar Universal → JOC → Campaign → Content → human-fixed decisions y generar prompts/schemas. | Selecciones del Wizard. | El prompt puede rastrear cada regla a su nivel de conocimiento. |
| `T02-SHI-01` | Shim | Modelar source, speaker, timestamp ranges, candidates y selected outputs como datos separados y relacionados. | Import/source analysis. | Reordenar candidatos no cambia sus rangos fuente. |
| `T02-AI-01` | AI Results | Mapear claves del resultado a campos/unidades del Content existente. | `content_id` + result type + parsed schema. | Preview muestra create/update/ignore/conflict antes de confirmar. |
| `T02-PRO-01` | Role Desks | Derivar cada Desk filtrando las mismas tasks por responsibility/status/date. | Production Graph. | Una task completada desaparece del Desk correcto y actualiza Content. |
| `T02-QAH-01` | QA/History | Generar gates según ABRAXAS + JOC + format y registrar checkpoints significativos. | Content, Format, Sources, revisión humana. | QA específico cambia cuando cambia `format_id`. |
| `T02-ANA-01` | Analytics | Agregar Content/Task por campaign, pillar, format, platform, lifecycle y date sin tabla paralela. | filtros y periodo. | Gráfico, tabla e insight usan el mismo resultado agregado. |
| `T02-ARQ-01` | Arquitecto | Construir contexto desde módulo, Content, campaign, lifecycle y pending tasks. | Estado actual. | La respuesta nunca usa datos genéricos si existe contexto real. |

### Instrucción directa para IA

Antes de tocar UI, define o reutiliza schemas para Client, Format, Campaign, Content, Task, Asset, Source y History. Prohíbe métricas hardcoded y objetos paralelos. Toda vista debe ser una proyección del mismo grafo y toda mutación debe pasar por una acción de dominio validada.

**Combina con:** todas; es la base de T05, T27, T29, T30, T35, T36, T39, T40 y T41.  
**No aplicar:** datos demo presentados como estado real o duplicación por módulo.

## T03. CRO, retención y alineación de marca

**Qué aporta:** reduce fricción y hace que cada pantalla conduzca a una decisión útil sin dark patterns.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T03-HOM-01` | Home | Botones por resultado: Crear una pieza, Resolver grabaciones, Revisar resultados, Calendarizar. | Conteo de tareas y última actividad. | Cada botón abre módulo + filtros correctos. |
| `T03-HOM-02` | Atención | Card “Próxima decisión” con causa, fecha, impacto y CTA único. | Prioridad calculada por next_action. | No muestra un número sin explicar qué hacer. |
| `T03-HE-01` | He | Microcopy debajo de Format, Pattern, Evidence y Quantity que explique impacto de la elección. | Paso/campo activo. | El usuario elige sin necesitar abrir documentación externa. |
| `T03-CAM-01` | Campaigns | Convertir “3 bloqueados” en lista causal: pieza, bloqueo y acción resolver. | Tasks/QA/date. | El manager puede actuar desde el insight. |
| `T03-BRI-01` | Brand/Format | Comparador Good/Bad Example con explicación “por qué sí/no es JOC”. | Format seleccionado. | La regla abstracta se vuelve decisión aplicable. |
| `T03-QAH-01` | QA | Gates para hook→payoff, utilidad, CTA, brand fit y format compliance. | Contenido importado/editado. | Un fallo señala unidad, razón y corrección esperada. |

### Instrucción directa para IA

Redacta acciones por resultado, muestra una acción primaria y convierte métricas en resolución. Añade ejemplos/anti-ejemplos donde una regla pueda interpretarse mal. No uses urgencia falsa, confirmaciones ambiguas ni claims sin Source Truth.

**Combina con:** T02, T27, T29, T35, T36, T39.  
**No aplicar:** patrones de conversión que empujen a publicar sin QA.

## T04. Rendimiento, lazy loading y prevención de CLS

**Qué aporta:** mantiene usable el standalone cuando crecen medios, listas y visualizaciones.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T04-GLO-01` | Global | Scheduler único para canvas/RAF, registro de observers y cleanup al cambiar de ruta. | lifecycle de vista. | No quedan loops/listeners de una ruta cerrada. |
| `T04-SHI-01` | Shim media | Precargar metadata del clip activo y siguiente; pausar/liberar los demás. | visibilidad + selección. | Solo un video realiza trabajo significativo. |
| `T04-STU-01` | Studio preview | Cargar video/B-roll/stills al abrir unidad o entrar en viewport, reservando aspect ratio. | `active_unit_id`. | Preview no provoca salto de layout. |
| `T04-ASS-01` | Assets browser | Thumbnails responsivos, `loading=lazy`, decode async y placeholder con tamaño conocido. | viewport/filtro. | Scroll permanece fluido con biblioteca grande. |
| `T04-LIB-01` | Library | Render por páginas/ventanas y debounce de búsqueda. | cantidad de resultados/query. | Filtrar no congela la interfaz. |
| `T04-STO-01` | Brain/Web visuals | Reducir partículas por viewport/DPR, pausar fuera de pantalla y ante reduced motion. | tamaño, visibilidad, energía. | Story no degrada workspaces ni batería. |

### Instrucción directa para IA

Mide primero y asigna presupuesto por ruta. Reserva dimensiones antes de cargar medios, desconecta observers/listeners y limita DPR/canvas. Ninguna función esencial puede depender del lazy load. Incluye fallback sin canvas/video.

**Combina con:** T01, T07, T08, T14, T20, T22, T25, T32, T37, T38, T40.  
**No aplicar:** preload masivo del standalone o virtualización que rompa teclado.

## T05. Gestión de estado reactiva

**Qué aporta:** actualizaciones parciales coherentes sin re-render global ni pérdida de contexto.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T05-HE-01` | He | Store de draft por modo/paso; recalcular preview derivado sin guardar cada render. | inputs del usuario. | Volver de paso conserva selección y errores. |
| `T05-SHI-01` | Shim | Store de source, outputs, structures, candidates y selection. | edición/selección. | Cambiar output no borra transcript. |
| `T05-AI-01` | Results | Estado `idle→parsing→preview→conflict/ready→confirmed/error`. | import/paste/confirm. | Nunca se confirma mientras parsing o conflict. |
| `T05-STU-01` | Studio | `activeTab`, `activeUnit`, inspector, draft, dirty, fixedRevision y returnContext. | navegación/edición. | Cerrar/volver conserva lista y filtro de origen. |
| `T05-PRO-01` | Desks | Actualizar task, progreso y next_action sin reconstruir todo el shell. | task mutation. | Arquitecto y Dashboard reflejan el cambio inmediatamente. |
| `T05-CAL-01` | Calendar | Optimistic move con snapshot y rollback si validación falla. | drag/drop. | Fecha y backlog nunca se contradicen. |
| `T05-QAH-01` | QA/History | Mantener gate activo, unidad señalada, draft de corrección y checkpoint seleccionado. | revisar/corregir/restaurar. | Revalidar actualiza el gate sin perder posición. |
| `T05-LIB-01` | Library | Mantener query, filtros, sort, scroll y returnContext al abrir/cerrar Content. | navegación y filtros. | Volver reproduce la misma vista. |
| `T05-ANA-01` | Analytics | Mantener periodo, filtros, métrica, selección y drill-down sin recalcular vistas no afectadas. | cambio de filtro/selección. | Chart, table e insight permanecen sincronizados. |
| `T05-ARQ-01` | Arquitecto | Actualizar solo panel/respuesta/spotlight. | pregunta o cambio de selección. | No llama `renderShell()` por una respuesta local. |

### Instrucción directa para IA

Separa dominio persistente, UI de ruta y estado efímero. Define acciones explícitas, selectores derivados y migración de versiones. Las animaciones observan estado; no lo mutan. Añade undo/checkpoint solo a cambios significativos.

**Combina con:** T02, T15, T29, T30, T35, T39, T41.  
**No aplicar:** persistir frames, hover o posiciones temporales en el objeto Content.

## T06. Smooth Scroll tipo Lenis — traducción nativa

**Qué aporta:** continuidad en lectura larga sin secuestrar el scroll.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T06-BRI-01` | Brand Story | Navegación por anclas Core, Identity, Pillars, Formats, Examples y Sources. | click en nav local. | Scroll nativo llega al heading y actualiza sección activa. |
| `T06-STO-01` | Product Story | `scrollIntoView`/CSS smooth para capítulos y CTA “ver siguiente”. | acción explícita. | Back, teclado y enlaces profundos siguen funcionando. |
| `T06-CAM-01` | Campaign overview | Saltos entre Objective, Coverage, Production y Blockers. | selector de capítulo. | No afecta tablas/listas internas. |

### Instrucción directa para IA

No instales Lenis. Usa scroll nativo, anclas, `scroll-margin-top` y scroll-spy. Desactiva suavizado con reduced motion. Workspaces, tablas, Calendar y editores deben conservar scroll inmediato.

**Combina con:** T24, T28, T32, T33, T35.  
**No aplicar:** interceptar wheel/touch/teclado o convertir vertical en horizontal.

## T07. Clips con Intersection Observer

**Qué aporta:** activa solo el medio que el usuario está viendo y coordina previews.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T07-SHI-01` | Shim candidates | Autopreview muted del candidato activo; pausar al salir; click fija selección. | intersection + selected id. | Nunca reproducen dos candidatos. |
| `T07-SHI-02` | Timestamp list | Resaltar fragmento cuyo rango coincide con el playhead. | `currentTime`. | Lista y video señalan el mismo fragmento. |
| `T07-STU-01` | Studio units | Cargar preview de unidad visible y detener el anterior al cambiar tab/slide. | active unit/viewport. | Audio no continúa oculto. |
| `T07-ASS-01` | Asset grid | Cargar thumbnail/metadata y generar preview solo en viewport. | intersection. | Grid grande no inicia todos los medios. |
| `T07-STO-01` | Story media | Activar animación/video del capítulo activo y congelar los demás. | story section active. | Cada escena consume recursos solo cuando aporta. |

### Instrucción directa para IA

Crea un MediaCoordinator con una única reproducción activa. Observer sugiere activación, pero click/teclado del usuario prevalece. Desconecta observers al cambiar de ruta y ofrece botón Play cuando autoplay no esté permitido.

**Combina con:** T04, T20, T22, T32, T39.  
**No aplicar:** importar, aprobar o modificar datos solo por visibilidad.

## T08. Objetos 3D tipo Spline — asset local con fallback

**Qué aporta:** explica relaciones espaciales complejas en vistas secundarias.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T08-STO-01` | System Story | Objeto Content central con capas Strategy, Editorial, Visual, Production, QA y Distribution seleccionables. | chapter/object selection. | Seleccionar capa abre explicación y ruta real. |
| `T08-BRI-01` | Format anatomy | Objeto/maqueta local que separa hook, development, payoff, visual y copy de un formato JOC. | format seleccionado. | La versión 2D comunica lo mismo. |
| `T08-HOM-01` | Overview opcional | Miniatura 3D del sistema como acceso a Story, no como Dashboard principal. | usuario abre “Cómo funciona”. | Home operativo carga sin runtime 3D. |

### Instrucción directa para IA

No uses `<spline-viewer>` remoto. Implementa asset/runtime bundled o sustituye por Canvas/SVG. Carga solo al entrar en la vista, ofrece lista 2D accesible y libera recursos al salir.

**Combina con:** T04, T25, T28, T38, T39, T41.  
**No aplicar:** He, AI Results, Production, QA, Calendar o tareas de precisión.

## T09. Preloader cinematográfico funcional

**Qué aporta:** comunica preparación real; no agrega una intro obligatoria.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T09-GLO-01` | Boot | Estado breve “Preparando ABRAXAS” solo si boot/migración supera 250 ms. | boot tasks reales. | Desaparece al estar lista la app, sin tiempo mínimo. |
| `T09-AI-01` | Import grande | Overlay local con etapas Parsing → Validating → Building preview. | importación pesada. | Muestra etapa real y permite error/cancelación. |
| `T09-ASS-01` | Procesamiento local | Progreso/indeterminado al generar thumbnails o leer paquete. | job local. | La interfaz no parece bloqueada y conserva contexto. |

### Instrucción directa para IA

Vincula loader a tareas reales. Si ocurre error, reemplázalo por Recovery/error action. No muestres porcentajes falsos, no bloquees una UI ya lista y no repitas preloader al navegar.

**Combina con:** T04, T15, T31 y Recovery Mode.  
**No aplicar:** intro de marca en cada apertura o espera artificial.

## T10. Parallax multicapa

**Qué aporta:** separa ambiente, objeto y anotación en una explicación visual.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T10-STO-01` | System Story | Fondo ambiental lento, objeto Content medio y anotaciones frontales; rangos pequeños. | scroll del capítulo. | Las capas aclaran jerarquía al moverse y al detenerse. |
| `T10-BRI-01` | Brand/Format Story | Separar asset JOC, regla y ejemplo durante un capítulo. | sección activa. | Texto nunca pierde contraste. |
| `T10-HOM-01` | Brain overview | Desplazamiento mínimo entre Brain y glass controls, solo en Story/overview. | pointer/scroll limitado. | Dashboard y rutas no se mueven. |

### Instrucción directa para IA

Usa máximo tres capas con `transform`, sin cambiar layout. Desactiva en móvil/reduced motion y mide frame budget. No añadas parallax a workspaces.

**Combina con:** T04, T06, T24, T28, T32, T33, T39.  
**No aplicar:** formularios, tablas, Calendar, QA, Production o Assets browser.

## T11. Cursores magnéticos y estados de foco

**Qué aporta:** hace evidente qué se puede activar y dónde está el teclado.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T11-GLO-01` | Design system | Estados hover, pressed, `focus-visible`, selected, loading y disabled para todos los controles. | interacción/estado. | Mouse y teclado reciben feedback equivalente. |
| `T11-HOM-01` | CTA principal | Magnetismo máximo 4–6 px dentro del área del botón, sin mover su hitbox. | pointer fino + no reduced motion. | El control vuelve a origen y touch no lo usa. |
| `T11-STO-01` | Hotspots | Nodo/CTA responde con escala y línea, manteniendo foco visible. | hover/focus. | Label y acción aparecen igual con teclado. |
| `T11-STU-01` | Studio controls | Sin magnetismo; reforzar foco de tabs, unit rows, inspector y actions. | navegación con teclado. | El usuario nunca pierde la posición de foco. |

### Instrucción directa para IA

Primero implementa estados de foco en tokens/componentes. Activa magnetismo solo en CTA grande de Home/Story, detectando touch y reduced motion. No ocultes cursor ni muevas controles de precisión.

**Combina con:** T26, T31, T35, T39.  
**No aplicar:** campos, drag handles, Calendar, QA o tablas.

## T12. Scroll horizontal mixto

**Qué aporta:** permite explorar secuencias sin convertir toda la página en scroll horizontal.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T12-BRI-01` | Format Library | Rail de formatos JOC con card activa, preview y CTA “Abrir definición”. | lista de formats/filtro. | Flechas, teclado y touch alcanzan todos. |
| `T12-BRI-02` | Examples | Rail Good/Bad/Approved con labels visibles y explicación asociada. | format seleccionado. | Cambiar ejemplo actualiza showcase sin perder contexto. |
| `T12-STU-01` | Carrusel | Rail de slides; seleccionado se centra y alimenta preview/inspector. | `active_unit_id`. | Slide activa, preview y URL/estado coinciden. |
| `T12-CAM-01` | Campaign overview | Rail semanal o por lot L1/L2/L3 como resumen; lista vertical sigue disponible. | campaign contents. | No oculta blockers ni fechas. |
| `T12-STO-01` | Highlights | Paneles con una idea, visual y acción. | contenido narrativo. | Scroll principal continúa vertical y el rail tiene controles. |

### Instrucción directa para IA

Usa `overflow-x:auto`, snap y botones anterior/siguiente; no conviertas wheel vertical en horizontal. Conserva selección, anuncia posición y evita rails anidados.

**Combina con:** T22, T28, T32, T35, T36.  
**No aplicar:** Production Queue completa, QA gates o tablas densas.

## T13. Typography Reveal con máscaras

**Qué aporta:** introduce una tesis o cambio de capítulo sin ocultar información operativa.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T13-STO-01` | Story hero | Revelar tesis ABRAXAS en dos bloques: problema → promesa. | entrada de escena. | Texto ya existe semánticamente y aparece una sola vez. |
| `T13-BRI-01` | Brand Core | Revelar Creencia/Tensión y después la aplicación JOC. | capítulo activo. | El usuario entiende relación, no solo ve animación. |
| `T13-CAM-01` | Campaign story | Revelar objetivo y message hierarchy al abrir overview estratégico. | campaign seleccionado. | No retrasa blockers ni acciones. |

### Instrucción directa para IA

Anima contenedor/máscara, no caracteres individuales para lectores de pantalla. Con reduced motion muestra todo. Limita a headings de Story/Brand/Campaign overview.

**Combina con:** T01, T28, T32, T33, T34.  
**No aplicar:** instrucciones, errores, formularios, task rows o copies editables.

## T14. Distorsión WebGL y liquid hover

**Qué aporta:** comunica transformación visual entre dos assets en una vista de inspiración.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T14-STO-01` | Story comparison | Transición shader entre input bruto y visual aprobado JOC. | selector Before/After. | Crossfade CSS ofrece la misma comparación. |
| `T14-BRI-01` | Visual Rules | Hover/focus cambia entre ejemplo válido e inválido sin deformar el asset en reposo. | example id. | El usuario puede inspeccionar ambos originales. |
| `T14-STO-02` | Portal visual | Transición puntual de capítulo Brand→Format o Source→Result. | CTA explícito. | No controla navegación ni persiste fuera de escena. |

### Instrucción directa para IA

Aísla WebGL en un componente lazy, assets locales y fallback crossfade. Pausa fuera de viewport y maneja `webglcontextlost`. Nunca uses distorsión en revisión de Assets/QA.

**Combina con:** T04, T07, T15, T28, T38.  
**No aplicar:** texto, formularios, grids operativos o contenido que deba evaluarse con fidelidad.

## T15. Transiciones entre vistas y rutas

**Qué aporta:** conserva origen, selección y retorno al moverse por ABRAXAS.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T15-LIB-01` | Library→Studio | Card Content se conecta con hero de Studio y guarda filtros/scroll de Library. | open content. | Cerrar vuelve exactamente a la vista previa. |
| `T15-BRI-01` | Brand explorer→detail | Resultado Format/Tool/Source abre detalle y conserva query, tab y posición. | seleccionar resultado. | Volver devuelve al mismo contexto. |
| `T15-CAM-01` | Campaign→blocker | Seleccionar blocker abre Content/task y conserva campaign section/filtros. | blocker selected. | Cerrar regresa al blocker original. |
| `T15-PRO-01` | Desk→Task | Row seleccionada se expande a workspace de tarea; al completar enfoca siguiente row. | task selection/status. | No se pierde categoría/filtro. |
| `T15-AI-01` | Import flow | Destino→Paste→Mapping Preview→Confirm con transición direccional. | estado de import. | Error vuelve al paso exacto sin borrar input. |
| `T15-SHI-01` | Shim steps/detail | Source/Output/Structure/Review cambian direccionalmente; candidate detail nace de la selección. | step/candidate. | Back conserva transcript y selección. |
| `T15-CAL-01` | Calendar→Content | Abrir card mantiene fecha, vista y backlog; cerrar restaura. | selected content/date. | No cambia fecha por abrir detalle. |
| `T15-HE-01` | Wizard | Forward/Back refleja dirección y lleva foco al heading/error. | step change. | La animación no reemplaza validación. |
| `T15-ARQ-01` | Spotlight route | Arquitecto navega, espera destino y resalta control real. | recommended action. | El spotlight nunca apunta a un elemento inexistente. |
| `T15-ANA-01` | Analytics→drill-down | Seleccionar segmento abre tabla/Library/Desk filtrado y conserva visualización origen. | chart selection. | Back recupera periodo, filtros y selección. |

### Instrucción directa para IA

Implementa returnContext por origen, foco y scroll. Usa View Transitions como progressive enhancement con fallback CSS; nunca bloquees navegación o guardado.

**Combina con:** T05, T26, T29, T30, T35, T39.  
**No aplicar:** transiciones largas entre cada click o rerender total del shell.

## T16. Tipografía variable reactiva

**Qué aporta:** expresa función editorial o prioridad con ejes tipográficos discretos.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T16-STU-01` | Unit labels | Hook/Contradiction con peso alto; Evidence/Context medio; Notes regular. | `unit.function`. | Jerarquía también existe con fallback. |
| `T16-BRI-01` | JOC examples | Aplicar voz tipográfica JOC dentro del preview de contenido, no al shell. | content/format preview. | Se distingue contenido de controles. |
| `T16-HOM-01` | Next Decision | Variar peso/anchura entre título, causa y fecha según prioridad. | next_action severity. | Color no es el único indicador. |
| `T16-STO-01` | Story chapters | Cambiar eje discretamente al activar una tesis. | section active. | No hay animación constante ni reflow. |

### Instrucción directa para IA

Bundlear fuente variable optimizada o usar pesos del sistema. Mapea ejes a tokens discretos, no a puntero/scroll continuo. Incluye fallback y respeta marca.

**Combina con:** T31, T33, T34, T39, T41.  
**No aplicar:** body text, inputs, tablas o estados cuyo significado dependa solo de peso.

## T17. Ruido dinámico y grano fílmico

**Qué aporta:** textura de identidad en escenas, sin ensuciar UI operativa.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T17-STO-01` | Podcast Intro Story | Capa de grano local sobre media, detrás de copy/controls. | capítulo audiovisual. | No altera preview original ni contraste. |
| `T17-BRI-01` | Visual Identity | Mostrar textura aprobada dentro del frame de ejemplo JOC. | visual rule seleccionada. | La textura no se extiende al shell. |
| `T17-HOM-01` | Overview | Grain estático muy sutil en ambiente de Story, desactivado en Dashboard operativo. | mode=story. | No consume RAF ni filtros costosos. |

### Instrucción directa para IA

Usa textura pequeña local, pseudo-elemento o filtro estático con opacidad baja. No animes ruido a 60 fps. Desactiva en workspaces y previews de QA.

**Combina con:** T28, T33, T37, T41.  
**No aplicar:** Assets, Calendar, QA visual, tablas o formularios.

## T18. Marquee inteligente reversible

**Qué aporta:** muestra continuidad de una colección secundaria, nunca información crítica.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T18-STO-01` | Story | Banda de physical types o etapas del lifecycle como contexto ambiental. | capítulo activo. | Lista estática equivalente existe. |
| `T18-BRI-01` | Brand Story | Muestras de frases/atributos JOC aprobados, pausables. | dataset aprobado. | Pausa con hover/focus y reduced motion. |
| `T18-CAM-01` | Campaign Story | Banda de formatos/plataformas planificados como resumen. | campaign mix. | No reemplaza gráfico, tabla ni blockers. |

### Instrucción directa para IA

Duplica visualmente solo con `aria-hidden`; conserva una lista accesible única. Pausa fuera de viewport y en reduced motion. No vincules navegación importante al marquee.

**Combina con:** T07, T28, T33, T41.  
**No aplicar:** tareas, errores, fechas, CTAs o datos que el usuario deba capturar.

## T19. Desdoblamiento 3D de tarjetas

**Qué aporta:** revela dos capas de un mismo objeto cuando la relación es el mensaje.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T19-BRI-01` | Format card | Frente: definición/cuándo usar; reverso: ejemplo/anti-ejemplo y QA. | botón “Ver aplicación”. | Ambas caras funcionan con teclado. |
| `T19-STO-01` | Content anatomy | Frente: Content; reverso: tareas/assets/QA alrededor del mismo ID. | acción explícita. | Refuerza identidad persistente. |
| `T19-CAM-01` | Campaign story | Frente: plan/objetivo; reverso: estado/bloqueos. | selector Plan/Reality. | En workspace se usa tabs, no flip. |

### Instrucción directa para IA

Usa botón explícito, `aria-expanded` y control de foco. Ofrece versión sin 3D mediante tabs/disclosure. Limita perspectiva y evita varias tarjetas animando juntas.

**Combina con:** T15, T28, T31, T32, T39.  
**No aplicar:** actions ocultas en hover, task rows o formularios.

## T20. Scrubbing de video por scroll/timeline

**Qué aporta:** conecta tiempo, fuente y plan de edición; la precisión sigue en un scrubber real.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T20-SHI-01` | Candidate detail | Timeline con rangos source; scroll del detalle puede previsualizar, slider permite precisión. | timestamp ranges. | Playhead, labels y source ranges coinciden. |
| `T20-SHI-02` | Podcast intro | Timeline ACT 1/2/3 con quotes, VO, B-roll y unresolved close. | intro structure. | Cada bloque abre fuente/notas correspondientes. |
| `T20-STU-01` | Video unit | START/MIDDLE/END + B-roll/VFX/SFX sincronizados con playhead. | unit plan/currentTime. | Seleccionar una nota mueve el video al tiempo correcto. |
| `T20-STO-01` | Demo Story | Recorrido narrativo de Source→Edit→Final en una vista secundaria. | scroll chapter. | Reduced motion muestra stills y controles. |

### Instrucción directa para IA

Implementa timeline semántica y slider accesible; scroll es solo mejora narrativa. Preserva timestamps exactos, permite saltos y soporta rangos no contiguos sin inventar continuidad.

**Combina con:** T04, T07, T15, T22, T32, T35, T39.  
**No aplicar:** exigir scroll para elegir frame o ocultar rangos fuente.

## T21. Typography Window

**Qué aporta:** usa una palabra como ventana hacia una evidencia visual en Story.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T21-STO-01` | System Story | Palabra `CONTENT` enmascara el flujo de piezas/tareas alrededor del mismo ID. | capítulo Content. | Heading real existe y el fallback es legible. |
| `T21-BRI-01` | Brand Story | Palabra `CRITERIO` muestra ejemplos JOC aprobados dentro de la forma. | capítulo Brand Core. | La imagen apoya la idea y no reduce lectura. |
| `T21-CAM-01` | Campaign Story | Palabra corta del objetivo muestra piezas de campaña. | campaign overview narrativo. | No sustituye objetivo textual ni estado. |

### Instrucción directa para IA

Limita la técnica a una palabra corta y una escena. Mantén heading semántico, fallback sólido y escala responsive. No uses texto gigante como solución por defecto.

**Combina con:** T13, T28, T33, T34, T39.  
**No aplicar:** Home operativo, formularios, Role Desks o QA.

## T22. Carruseles con físicas táctiles

**Qué aporta:** selección/reordenamiento directo con feedback, teclado y undo.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T22-STU-01` | Carousel Studio | Drag para reordenar slides, botones Mover izq./der. y snapshot para undo. | pointer/keyboard action. | `slide_id` y assets permanecen vinculados. |
| `T22-SHI-01` | Candidate selector | Swipe/drag cambia candidato; checkbox fija selección; score/timestamps no cambian. | gesture/selection. | Scroll vertical no se bloquea. |
| `T22-ASS-01` | Asset slots | Arrastrar asset a expected slot con preview y confirmación. | drag asset→slot. | Drop inválido regresa y explica incompatibilidad. |
| `T22-CAL-01` | Calendar | Mover Content fecha↔fecha o backlog↔fecha con placeholder y rollback. | drag/drop. | Se modifica `scheduled_at` del mismo Content. |
| `T22-BRI-01` | Format examples | Swipe entre ejemplos con snap, sin permitir edición. | gesture/buttons. | Teclado accede a todos los ejemplos. |

### Instrucción directa para IA

Implementa Pointer Events, umbral de gesto, estados grab/cancel/drop y equivalente por botones/teclado. Registra History cuando el orden o fecha cambie significativamente.

**Combina con:** T05, T12, T15, T35, T36.  
**No aplicar:** drag como única interacción o mezclar reorder con navegación sin handles.

## T23. Mouse Spotlight transformado en spotlight funcional

**Qué aporta:** dirige atención al control correcto sin oscurecer la aplicación.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T23-ARQ-01` | Arquitecto | Spotlight rectangular/halo sobre el control recomendado y callout con razón. | architect action target. | Target recibe foco y Escape cierra. |
| `T23-HE-01` | He help | Resaltar Format o Evidence al preguntar “¿qué elijo?”. | intent + current step. | No cambia selección automáticamente. |
| `T23-AI-01` | AI Results help | Señalar destination Content, result type o Confirm según paso. | current import state. | Nunca señala un control disabled sin explicar requisito. |
| `T23-STO-01` | Story visual | Luz ambiental leve sobre objeto activo, sin seguir puntero en touch. | hover/focus/section. | La escena sigue legible sin efecto. |

### Instrucción directa para IA

El spotlight se ancla mediante selector/ID estable, mueve foco y muestra explicación. Usa overlay no bloqueante, cierre explícito y fallback outline. No rastrees continuamente el mouse en workspaces.

**Combina con:** T30, T31, T32, T39, T41.  
**No aplicar:** oscurecer toda la pantalla o destacar varios targets simultáneos.

## T24. SVG Path Scroll

**Qué aporta:** explica flujo y trazabilidad mediante una ruta etiquetada.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T24-STO-01` | System flow | Ruta Input→Compiler→Handoff→Result→Production→QA→Calendar→Published. | capítulo activo. | Cada nodo enlaza a explicación/módulo real. |
| `T24-BRI-01` | Criterion compiler | Ruta Core→Pillar→Format→Campaign→Content→Prompt→QA. | selector format/content. | Se muestran precedencias y no un diagrama genérico. |
| `T24-QAH-01` | Trace view | Source→template version→AI result→human revision→approved asset→publication. | Content seleccionado. | El usuario puede abrir evidencia en cada nodo. |
| `T24-CAM-01` | Campaign timeline | Objetivo→planned content→production→published con bloqueos en la ruta. | campaign state. | No confunde secuencia con porcentaje. |

### Instrucción directa para IA

Dibuja path SVG a partir de nodos/datos, etiqueta cada paso y ofrece lista equivalente. La animación sigue sección/estado, no pixeles arbitrarios. No expongas el Production Graph completo por defecto.

**Combina con:** T06, T13, T28, T32, T35, T39.  
**No aplicar:** grafos decorativos o path como única navegación.

## T25. Brain Navigator ABRAXAS

**Qué aporta:** identidad y mapa conceptual del sistema; en v1.1.1 es overview secundario.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T25-HOM-01` | Home secondary | Botón “Ver cómo funciona ABRAXAS” abre Brain overview sin ocultar Today/Next Decision. | acción explícita. | Home se puede operar sin Brain. |
| `T25-STO-01` | Brain Story | Content como núcleo; nodos He, Shim, Production, Assets, QA, Calendar y Brand. | story section. | Cada hotspot tiene icono, label, leader line, purpose y CTA. |
| `T25-STO-02` | Morph chapters | Brain→routes→queue→calendar→network según capítulo. | storyActiveSection. | Volver a Overview recupera Brain. |
| `T25-HOM-02` | Zoom | Controles 100–200%, reset y escalado conjunto de partículas/hotspots. | `brainZoom`. | Centro espacial permanece estable. |
| `T25-ARQ-01` | Arquitecto | Activar/iluminar nodo relacionado con el módulo explicado. | current module/intent. | El nodo no sustituye el enlace directo. |

### Instrucción directa para IA

Conserva Canvas 2D local, chevrons ABRAXAS, paleta bone/gold/bronze y un solo RAF. Reubica Brain como overview opcional. Pausa fuera de vista; modo texto lista las mismas rutas.

**Combina con:** T02, T04, T07, T27, T30, T35, T39, T41.  
**No aplicar:** bloquear Dashboard con overlay, partículas genéricas o datos falsos.

## T26. Navegación global adaptativa y Command Palette

**Qué aporta:** acceso consistente a módulos, contenidos, campañas y vistas guardadas.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T26-GLO-01` | Global menu | Menú persistente agrupado Operar/Crear/Sistema con ruta activa. | route state. | Click navega y cierra menú devolviendo foco. |
| `T26-GLO-02` | Command Palette | Buscar módulos, Content por title/ID, Campaigns, Saved Views y acciones. | `Ctrl/Cmd+K` + query. | Resultado ejecuta ruta con contexto/filtros. |
| `T26-PRO-01` | Role Desk entry | Accesos Write, Record, Design, Edit, Verify, Publish con conteo real. | filtered tasks. | Cada acceso abre solo responsabilidad correspondiente. |
| `T26-LIB-01` | Saved Views | Today, This Week, AI Ready, To Record, Copy Pending, Visual Pending, Ready, Unscheduled. | saved query. | No copia datos; reproduce filtros. |
| `T26-STO-01` | Story topbar | Brand + nav local + Visual/Text + menú global compacto. | mode/section. | Story no pierde salida a workspaces. |

### Instrucción directa para IA

Unifica destinos en un registro de comandos. Evita menús duplicados. Implementa teclado, Escape, focus trap correcto y deep context. La paleta busca y actúa, no muestra resultados sin destino.

**Combina con:** T05, T15, T27, T30, T31, T35, T36.  
**No aplicar:** ocultar funciones esenciales en hover o crear navegación distinta por módulo.

## T27. Home orientado a intención, atención y continuidad

**Qué aporta:** convierte el Dashboard en centro de comando, no en tablero de números.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T27-HOM-01` | Intent launcher | Lista priorizada de 12 intenciones de la definición v1.1.1. | rutas autorizadas. | Cada intención abre módulo + filtro. |
| `T27-HOM-02` | Today | “3 salen hoy; 2 listos; 1 necesita portada” con CTA Resolver portada. | scheduled today + blockers. | CTA abre Visual Desk filtrado a la task. |
| `T27-HOM-03` | This Week | Conteos por estado y lista breve de riesgos próximos. | date window + lifecycle. | Cada riesgo es accionable. |
| `T27-HOM-04` | Next Decision | Content más urgente con unidad/tarea concreta, causa y deadline. | next_action engine. | No dice solo “continuar producción”. |
| `T27-HOM-05` | Continue | Último workspace/Content y progreso. | persisted returnContext. | Retoma sin perder tab/filtro. |
| `T27-HOM-06` | Empty state | Si no hay Content, guía Create Piece/Create Batch/Process Podcast. | dataset vacío. | Home sigue siendo útil sin métricas. |

### Instrucción directa para IA

Construye Home desde intents y queries reales. Ordena atención por deadline, bloqueo y dependencia. Cada tarjeta debe incluir situación, impacto y CTA con destino filtrado. Brain/Story va detrás de “Cómo funciona”.

**Combina con:** T02, T03, T05, T26, T30, T35, T39, T40, T41.  
**No aplicar:** grid de KPIs decorativos o enlaces que abren módulos sin contexto.

## T28. Apple Product Story

**Qué aporta:** explica producto/conocimiento con una idea y un visual por escena.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T28-STO-01` | ABRAXAS Story | Hero tesis, highlights de rutas, closer look del Content y flow to Published. | content story model. | Cada escena termina en comprensión/CTA. |
| `T28-BRI-01` | Method Explainer | 5 Drivers→25 Tools, qué input/output resuelve cada uno. | mode=method. | No muestra respuestas JOC como instrucciones. |
| `T28-BRI-02` | Applied to JOC | Core, Identity, Pillars, Formats y respuestas ya aplicadas. | mode=applied,JOC. | No aparece copy genérico “pregunte al cliente”. |
| `T28-CAM-01` | Campaign Story | Objetivo, message hierarchy, content mix, timeline y blockers. | campaign selected. | Workspace operativo sigue accesible. |
| `T28-STO-02` | Text mode | Documento equivalente con headings, listas, tables y links. | storyMode=text. | Toda información existe sin media/motion. |

### Instrucción directa para IA

Usa Story solo para explicación. Una idea fuerte por escena, títulos contenidos, suficiente contexto visual y disclosures. No conviertas He, Production, QA o Calendar en Story.

**Combina con:** T06, T12, T13, T24, T31, T32, T33, T34, T35, T39, T41.  
**No aplicar:** texto gigante sobre negro como sustituto de contenido.

## T29. Wizard de una decisión principal

**Qué aporta:** divide procesos complejos sin ocultar dependencias ni perder datos.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T29-HE-01` | Create Piece | Client→Physical Type→Pillar/Format→Objective/Audience/Topic→Coverage→Structure→Prompts→Save. | draft state. | Summary muestra Content que se creará. |
| `T29-HE-02` | Create Batch | Window→L1/L2/L3→pillars/platforms→Coverage Map→grid→prompts→Save batch. | batch config. | Repeticiones se detectan antes de guardar. |
| `T29-SHI-01` | Shim | Source→Outputs→Structures→Review→Export. | source/output config. | Transcript/timestamps nunca se pierden. |
| `T29-AI-01` | AI Results | Destination→Result Type→Paste/Import→Mapping Preview→Confirm. | import state. | Conflicts requieren decisión explícita. |
| `T29-ASS-01` | Asset package | Content→unit/slot→files→mapping preview→confirm. | files/expected slots. | Ningún archivo queda vinculado silenciosamente al slot equivocado. |

### Instrucción directa para IA

Define schema de cada paso, validación local, summary y Back. Mantén una acción primaria. No permitas avanzar si falta un dato requerido; explica por qué y conserva borrador.

**Combina con:** T02, T03, T05, T15, T30, T35, T39, T41.  
**No aplicar:** convertir edición libre de Studio en Wizard completo.

## T30. El Arquitecto contextual

**Qué aporta:** guía operativa basada en ubicación y estado, no chatbot abierto.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T30-HOM-01` | Home | “Te recomiendo Resolver portada: sale mañana y bloquea publicación”. | next_action. | CTA abre task exacta. |
| `T30-BRI-01` | Brand/Format | Explicar la regla activa, mostrar ejemplo/anti-ejemplo y enlazar el campo que la usa en He/QA. | format section. | La ayuda usa respuestas JOC, no instrucciones genéricas. |
| `T30-HE-01` | He | Explicar campo activo, impacto, ejemplo y qué producirá el paso. | wizard step/field. | Respuesta usa JOC/Format seleccionados. |
| `T30-SHI-01` | Shim | Explicar qué pegar, cómo conservar timestamps y qué devolverá la IA. | step + config. | Incluye return path. |
| `T30-AI-01` | Results | Explicar destination, result type, mapping y conflicto actual. | import state. | Nunca recomienda Confirm con conflictos sin resolver. |
| `T30-STU-01` | Studio | Explicar unidad activa, missing y siguiente gate. | Content/unit/tasks/QA. | Recomendación señala control real. |
| `T30-PRO-01` | Role Desk | Priorizar primera task por deadline/dependency y mostrar criterio de terminado. | filtered tasks. | No expone Branding Method irrelevante. |
| `T30-ASS-01` | Assets | Explicar Content/slot activo, tipo esperado, versión y condición de aprobación. | selected asset/slot. | Señala upload/map/approve correcto. |
| `T30-QAH-01` | QA/History | Explicar gate fallido, evidencia faltante y control para corregir/restaurar. | selected gate/revision. | La recomendación abre unidad/source exactos. |
| `T30-CAL-01` | Calendar | Explicar risk badge y requisito para publicar. | scheduled content blockers. | CTA abre módulo de resolución. |
| `T30-LIB-01` | Library | Explicar filtros activos, por qué no hay resultados y saved view apropiada. | query/filter/empty state. | Ayuda modifica filtros solo tras acción del usuario. |
| `T30-ARQ-01` | Utility window | Renderizar ubicación, explicación, primero, respuesta, CTA y privacy note desde `architectContext`. | cualquier cambio contextual. | El panel se actualiza in-place. |

### Instrucción directa para IA

Crea `architectContext()` y respuestas por intent: primero, pantalla, pegar, elegir, resultado, destino, terminado. Actualiza solo panel. Añade spotlight con T23. “Preparar pregunta para IA” exporta contexto; no llama servicios ni usa keys.

**Combina con:** T02, T05, T15, T23, T26, T31, T35, T39, T41.  
**No aplicar:** respuestas open-world, generación principal o rerender del shell.

## T31. Design system e iconografía Apple-like

**Qué aporta:** hace que técnicas combinadas parezcan un solo producto.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T31-GLO-01` | Tokens | Color, type, spacing, radius, border, elevation, motion, focus y semantic states. | theme/module/state. | Componentes no usan valores arbitrarios repetidos. |
| `T31-GLO-02` | Controls | Button, icon button, segmented, tab, input, select, textarea, checkbox, chip, progress, row. | component props/state. | Hover/pressed/focus/disabled/loading coherentes. |
| `T31-GLO-03` | Surfaces | Stable content, toolbar, sidebar, popover, sheet, inspector, utility window, toast. | surface role. | Glass solo aparece en surfaces funcionales autorizadas. |
| `T31-GLO-04` | Icons | Registro SVG interno para módulos, tasks, states y actions. | semantic icon id. | No emojis/engranajes genéricos como sistema principal. |
| `T31-GLO-05` | Density | Tokens Story, Workspace y Compact; misma identidad, distinta densidad. | route/screen size. | Workspaces no heredan espacios/títulos de landing. |

### Instrucción directa para IA

Construye componentes y tokens antes de estilizar módulos. Reutiliza anatomía y estados; permite acento JOC solo en contenido/contexto. Aplica radios concéntricos, focus visible y hit areas correctas.

**Combina con:** todas las técnicas UI, especialmente T11, T15, T26, T29, T30, T35, T39, T41.  
**No aplicar:** copiar assets Apple, glass-on-glass, pills universales o colores sin semántica.

## T32. Sticky showcase + scroll-spy + media swapping

**Qué aporta:** mantiene visible el objeto que se explica mientras cambia el contexto.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T32-BRI-01` | Format detail | Columna sticky con example; lista de Rules/Examples/Anti-examples/QA cambia el preview. | section/item active. | Preview y label activo coinciden. |
| `T32-STU-01` | Studio desktop | Unit list izquierda, preview sticky centro, inspector derecha. | active unit. | Scroll de lista no pierde preview ni inspector. |
| `T32-QAH-01` | QA review | Content/asset sticky y lista de gates; seleccionar fallo enfoca unidad. | gate selected. | Corregir/reevaluar actualiza ambos. |
| `T32-ANA-01` | Analytics | Chart sticky y lista de insights/filtros; insight resalta serie correspondiente. | insight/filter active. | Tabla equivalente permanece accesible. |
| `T32-STO-01` | Story | Media swaps por capítulo con nav local activa. | Intersection Observer. | En móvil se transforma en flujo vertical/tabs. |

### Instrucción directa para IA

Usa un único sticky principal por viewport, calcula offsets de topbar y crea layout alternativo en móvil. Media swapping reutiliza assets y evita descargas repetidas.

**Combina con:** T07, T12, T15, T28, T35, T36, T39.  
**No aplicar:** múltiples sticky compitiendo o panel tapado por Arquitecto.

## T33. Transiciones cromáticas por sección/campaña

**Qué aporta:** marca contexto sin cambiar la semántica del sistema.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T33-BRI-01` | Brand chapters | Tokens ambientales distintos para Core, Identity, Formats y Sources. | active chapter. | Controls y semantic colors permanecen estables. |
| `T33-CAM-01` | Campaign | `--campaign-accent` en heading, chart selected y timeline; no en status. | campaign selected. | Cambiar campaña actualiza acento sin reescribir CSS. |
| `T33-STO-01` | Story | Interpolar background/accent al cambiar capítulo. | section active. | Reduced motion cambia instantáneo. |
| `T33-STU-01` | Studio | Acento del Content/JOC en metadata y selección; error/warning/success independientes. | content/client. | QA visual no se tiñe. |

### Instrucción directa para IA

Deriva variables CSS desde datos y design tokens. Define matriz de contraste por tema. Nunca reemplaces colores de error, warning, success, focus o selection con acento de marca/campaña.

**Combina con:** T15, T28, T31, T32, T39, T41.  
**No aplicar:** gradientes saturados o tematizar cada card.

## T34. Tipografía cinética y composición editorial mixta

**Qué aporta:** demuestra voz y ritmo en contenido/Story sin contaminar la herramienta.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T34-BRI-01` | JOC preview | Composición real de hook, quote, proof y payoff dentro del example frame. | format/example selected. | El shell usa tipografía funcional separada. |
| `T34-STO-01` | Story | Titular contenido + subhead + evidencia con una animación de énfasis puntual. | chapter active. | No supera la información visual del viewport. |
| `T34-CAM-01` | Campaign story | Objective/message hierarchy como composición editorial secundaria. | campaign story mode. | Blockers/actions siguen con UI estándar. |
| `T34-STU-01` | Preview | Mostrar jerarquía del contenido tal como se espera en publicación, dentro del preview. | active unit/content. | No cambia inputs o labels del editor. |

### Instrucción directa para IA

Separa `systemTypography` de `contentTypography`. Limita familias/pesos, bundlea assets y conserva headings semánticos. Motion solo enfatiza una entrada o cambio seleccionado.

**Combina con:** T13, T16, T21, T28, T31, T33, T41.  
**No aplicar:** Production, QA, tablas, forms o navegación global.

## T35. Progress rail y navegación contextual

**Qué aporta:** muestra dónde está el usuario, qué terminó y qué falta sin exponer todo el grafo.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T35-HE-01` | He | Rail Steps + valid/error/completed; separado de Content production %. | wizard state. | Click vuelve a pasos permitidos. |
| `T35-HOM-01` | Home | Nav contextual Intentions/Today/Week/Next/Continue o secciones compactas. | sección visible/selección. | No compite con navegación global. |
| `T35-BRI-01` | Brand/Format | Rail Core/Identity/Pillars/Formats/Examples/Sources con sección activa. | active section. | Click lleva al heading correcto. |
| `T35-SHI-01` | Shim | Source→Outputs→Structures→Review→Export con missing indicators. | shim state. | No marca completo sin transcript/timestamps requeridos. |
| `T35-AI-01` | Results | Destination→Type→Input→Mapping→Confirm. | import state. | Conflicts bloquean Confirm y se explican. |
| `T35-STU-01` | Studio | Overview→Editorial→Visual→Copies→Production→QA→History con completitud. | Content/tasks/assets/QA. | Diferencia tab activo, completitud y lifecycle. |
| `T35-PRO-01` | Desk | Responsibility→Content→Task→Done y breadcrumb de filtros. | selection/filter. | Volver preserva lista. |
| `T35-CAM-01` | Campaign | Plan→Coverage→Production→QA→Calendar con blockers. | campaign data. | Click abre sección/filtro correspondiente. |
| `T35-ASS-01` | Assets | Content→unit→slot→file→review con conteo missing/ready. | mapping state. | Distingue navegación de completitud visual. |
| `T35-QAH-01` | QA/History | General→JOC→Format→Sources→Visual→Technical→Checkpoint. | QA results/revision. | El rail abre primer gate fallido. |
| `T35-CAL-01` | Calendar | Periodo/vista/filtro + breadcrumb al Content abierto. | calendar state. | Cerrar detalle regresa a fecha/vista. |
| `T35-LIB-01` | Library | Breadcrumb Saved View→filters→Content detail y count de resultados. | library state. | El usuario entiende por qué ve ese conjunto. |
| `T35-ANA-01` | Analytics | Period→dimension→metric→selection→drill-down. | analytics state. | Chart, table e insight señalan el mismo contexto. |
| `T35-ARQ-01` | Arquitecto | Mostrar módulo, paso/sección y next_action dentro del panel. | architect context. | La ubicación coincide con la pantalla. |

### Instrucción directa para IA

Modela tres conceptos separados: `flowStep`, `completion` y `lifecycle`. Renderiza rail desde datos, explica bloqueos y ofrece variante compacta móvil. El Arquitecto debe leer el mismo modelo.

**Combina con:** T02, T05, T15, T26, T29, T30, T31, T39, T41.  
**No aplicar:** usar un único porcentaje para pasos, producción y publicación.

## T36. Explorador visual, filtros, búsqueda y bookmarks

**Qué aporta:** encuentra objetos sin mostrar una matriz inmanejable.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T36-LIB-01` | Library | Search + filters Campaign/Pillar/Format/Type/Lifecycle/Platform/Lot/Responsible/Date/Series. | query/filter state. | Chips activos y conteo explican resultados. |
| `T36-LIB-02` | Saved Views | Guardar nombre + query + filters + sort, no contenidos. | save view action. | Reabrir reproduce la misma consulta. |
| `T36-ASS-01` | Assets | Filtros Content/unit/slot/type/version/status + expected-only. | asset mapping data. | Se distingue missing, draft y approved. |
| `T36-PRO-01` | Role Desk | Filtros Due Soon/Blocked/Campaign/Format/Duration; default calm-first. | task data. | La vista no muestra 200 tasks inicialmente. |
| `T36-CAM-01` | Campaign | Filtros status/pillar/format/platform/lot/blocker y saved view “Show blockers”. | campaign contents/tasks. | Resultado y métricas se recalculan juntos. |
| `T36-BRI-01` | Knowledge | Search Formats/Tools/Sources/Examples y bookmarks de consulta. | JOC knowledge. | Abrir resultado conserva término/posición. |
| `T36-QAH-01` | QA/History | Filtrar failed gates, unresolved claims, source status y revisions. | QA/history. | Filtro conduce a unidad exacta. |
| `T36-CAL-01` | Calendar | Filtros campaign/format/lot/lifecycle/risk y toggle scheduled/backlog. | calendar data. | Cards y conteos reflejan filtros activos. |

### Instrucción directa para IA

Implementa query normalizada, filtros combinables, reset, chips activos, empty states y saved views. Mantén filtros en state/returnContext. La búsqueda no muta objetos.

**Combina con:** T02, T04, T05, T12, T22, T26, T31, T35, T40.  
**No aplicar:** bookmarks como copias de Content o filtros ocultos sin indicador.

## T37. Gradient Mesh, blobs y metaballs

**Qué aporta:** ambiente semántico para Story, no relleno genérico.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T37-STO-01` | System Story | Mesh oscuro bone/gold detrás del objeto Content, movimiento lento o estático. | chapter/story mode. | Copy y CTA conservan contraste. |
| `T37-BRI-01` | Visual Identity | Frame que demuestra una regla visual JOC usando mesh aprobado. | visual example. | No se extiende a controles. |
| `T37-CAM-01` | Campaign Story | Mesh derivado del campaign accent para overview narrativo. | campaign accent. | Semantic colors no cambian. |
| `T37-HOM-01` | Overview | Fondo opcional de “Cómo funciona”, ausente en Dashboard operativo. | secondary story. | Home carga sin efecto. |

### Instrucción directa para IA

Prefiere CSS gradients o Canvas local lento, limita blur/área y pausa fuera de vista. Debe existir razón de contexto y versión estática.

**Combina con:** T04, T17, T28, T33, T39, T41.  
**No aplicar:** blobs por defecto, workspaces o low-power.

## T38. Storytelling espacial WebGL y portales 3D

**Qué aporta:** laboratorio opcional para explicar relaciones, nunca núcleo v1.1.1.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T38-STO-01` | Knowledge space | Content central y portales Brand, Formats, Production, QA, Calendar. | entrada voluntaria. | Cada portal tiene equivalente 2D y salida clara. |
| `T38-BRI-01` | Format space | Navegar formatos como nodos; seleccionar abre definición normal. | format dataset. | No reemplaza explorer T36. |
| `T38-STO-02` | Campaign journey | Vista inmersiva opcional del recorrido planned→published. | campaign story. | Datos son reales y existe tabla. |

### Instrucción directa para IA

No implementar durante el Proof operativo. Si se autoriza después, aislar runtime/assets offline, lazy load, keyboard alternative, 2D fallback, context-loss handling y destroy completo.

**Combina con:** T04, T07, T08, T14, T24, T28, T31, T39, T41.  
**No aplicar:** navegación obligatoria, operación diaria o datos sin equivalente.

## T39. Objeto hero funcional y coreografía de estados

**Qué aporta:** coloca en el centro el objeto real que el usuario está trabajando.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T39-HOM-01` | Home | Next Decision como objeto principal con title, physical type, campaign, deadline, missing y CTA. | next_action. | Se entiende qué resolver en 5 segundos. |
| `T39-BRI-01` | Brand/Format | Format o Tool seleccionado como objeto central con definición, example y QA. | explorer selection. | La selección gobierna showcase y acciones. |
| `T39-CAM-01` | Campaign | Campaign header/health central con objetivo, periodo, progress y blocker prioritario. | campaign selected. | Overview conduce a resolución. |
| `T39-HE-01` | He | Piece/Batch Blueprint central que cambia con Format, quantity y cadence. | draft configuration. | Preview explica output antes de guardar. |
| `T39-SHI-01` | Shim | Paso 1 fuente, paso 2 output plan, paso 4 selection summary como objeto dominante. | current step. | No repite el mismo card grid en todos los pasos. |
| `T39-AI-01` | Results | Mapping Preview central con columnas Incoming→Destination→Action. | parsed result. | Conflicts se ven antes de confirmar. |
| `T39-STU-01` | Studio | Content/unit preview central, unit list e inspector secundarios. | active content/unit. | Metadata, task y asset pertenecen al mismo objeto. |
| `T39-PRO-01` | Desk | Task workspace con instruction, source, inputs, expected output y Done criteria. | task selected. | El operador no necesita contexto irrelevante. |
| `T39-ASS-01` | Assets | Expected slot/asset seleccionado central con preview, metadata, mapping y review. | slot/asset selected. | Se ve exactamente qué archivo falta o se aprueba. |
| `T39-QAH-01` | QA | Unidad/asset evaluado central y gates a un lado. | failed gate/unit. | Corregir y revalidar sucede en contexto. |
| `T39-CAL-01` | Calendar | Content seleccionado como sheet/inspector con fecha, risk, dependencies y actions. | calendar card selected. | No se duplica ni pierde contexto de fecha. |
| `T39-LIB-01` | Library | Content seleccionado abre preview/quick actions o Studio como objeto central. | library selection. | ReturnContext restaura resultados. |
| `T39-ANA-01` | Analytics | Métrica/segmento seleccionado central con valor, causa, lista e intervención. | chart/table selection. | Insight termina en CTA filtrado. |
| `T39-ARQ-01` | Arquitecto | Next action/target como objeto breve dentro de la respuesta. | architect recommendation. | CTA, target y success condition coinciden. |

### Instrucción directa para IA

Define un objeto dominante por pantalla basado en la tarea. Coloca estado, missing y acción cerca. En workspaces no uses heroes decorativos; el objeto debe permitir actuar o comprender.

**Combina con:** T02, T05, T15, T29, T30, T31, T32, T35, T36, T41.  
**No aplicar:** grandes ilustraciones que empujen la tarea fuera del viewport.

## T40. Visualización radial, orbital y bubble-map

**Qué aporta:** detecta distribución, concentración y bottlenecks con datos reales.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T40-ANA-01` | Pillar coverage | Radial con planned/published por pillar y tabla equivalente. | Contents + pillar. | Click filtra Library/Campaign. |
| `T40-ANA-02` | Format mix | Bubbles por cantidad, color por lifecycle y borde por warning de sobreuso. | Content/Format. | Leyenda explica área/color/borde. |
| `T40-CAM-01` | Campaign health | Anillo planned→ready→published + bloqueados; lista al lado. | campaign contents. | Segmento abre piezas correspondientes. |
| `T40-HOM-01` | Attention map | Bubble breve por responsibility con tamaño=pending y color=risk. | open tasks. | Click abre Role Desk filtrado. |
| `T40-PRO-01` | Bottleneck | Radial por Writing/Recording/Visual/Editing/QA/Publishing. | tasks. | Muestra insight “Recording concentra X%”. |
| `T40-QAH-01` | QA health | Distribución pass/warning/fail por gate y formatos; tabla de fallos debajo. | QA results. | Seleccionar segmento abre gates correspondientes. |
| `T40-CAL-01` | Cadence | Heat/radial complementario por semana/lot; Calendar sigue principal. | scheduled contents. | Detecta concentración sin ocultar fechas. |

### Instrucción directa para IA

Define significado de tamaño, posición, color y borde antes de dibujar. Usa SVG/Canvas accesible, tabla y summary. Toda selección debe filtrar una vista operativa.

**Combina con:** T02, T04, T05, T27, T35, T36, T39, T41.  
**No aplicar:** órbitas decorativas, escalas engañosas o gráfico sin acción.

## T41. Theming ambiental semántico

**Qué aporta:** comunica contexto y estado de forma coherente entre módulos.

| ID | Módulo/zona | Construir exactamente | Trigger/dato | Terminado cuando |
|---|---|---|---|---|
| `T41-GLO-01` | Semantic tokens | `info`, `selected`, `success`, `warning`, `danger`, `blocked`, `ai`, `production`, `published`. | state. | Mismo estado luce igual en toda la app. |
| `T41-HOM-01` | Attention | Next Decision usa severity semántica + icono + texto. | risk/next action. | Color no es el único indicador. |
| `T41-HE-01` | Wizard | Neutral draft, warning missing, valid ready, error invalid; acento JOC separado. | validation state. | El usuario distingue requisito y selección. |
| `T41-AI-01` | Mapping | Create/update/ignore/conflict con tokens consistentes. | mapping action. | Confirm muestra resumen semántico. |
| `T41-PRO-01` | Tasks | Responsibility puede tener icono/acento, status mantiene tokens universales. | task role/status. | Designer no confunde categoría con error. |
| `T41-STU-01` | Studio | Acento JOC en metadata/selección; dirty, warning, approved y locked usan tokens universales. | content/draft/QA state. | Preview JOC y estado del editor no se confunden. |
| `T41-CAL-01` | Calendar | Card muestra lifecycle + risk badge + lot sin sobrecarga. | Content state. | Falta de cover/QA es visible y textual. |
| `T41-BRI-01` | JOC context | Colores JOC dentro de previews/metadata, no sustituyen estados. | client/content. | Shell sigue ABRAXAS. |
| `T41-ARQ-01` | Architect | Utility window toma acento contextual leve y conserva identidad propia. | current module. | Sigue legible sobre cualquier módulo. |

### Instrucción directa para IA

Construye tokens semánticos y tokens de contexto separados. Mapea estados desde datos. Añade icono/texto y verifica contraste. Glass solo en navegación, toolbar, popover, sheet, overlay y Arquitecto.

**Combina con:** T02, T05, T31, T33, T35, T39, T40.  
**No aplicar:** colorear módulos arbitrariamente o usar acento JOC como error/success.

---

# 5. Paquetes ejecutables por herramienta

Estos bloques pueden entregarse directamente a una IA junto con el código de ABRAXAS. Los IDs obligan a consultar las recetas exactas anteriores.

## P-HOM — Home / Dashboard

```text
Implementa Home usando T02-HOM-01, T03-HOM-01, T03-HOM-02,
T15-ARQ-01, T25-HOM-01, T26-GLO-02, T27-HOM-01, T27-HOM-02,
T27-HOM-03, T27-HOM-04, T27-HOM-05, T27-HOM-06, T30-HOM-01,
T35-HOM-01, T39-HOM-01, T40-HOM-01 y T41-HOM-01.

Construye: Intent Launcher, Today, This Week, Next Decision y Continue.
Cada CTA debe abrir módulo + filtros + Content/task correctos.
El Brain queda detrás de “Cómo funciona ABRAXAS”.
Usa datos de Content, Task, Campaign, Calendar y returnContext.
No muestres métricas que no tengan acción.
```

## P-BRI — Brand Intelligence + Format Library

```text
Implementa T02-BRI-01, T03-BRI-01, T06-BRI-01, T12-BRI-01, T12-BRI-02,
T15-BRI-01, T24-BRI-01, T28-BRI-01, T28-BRI-02,
T30-BRI-01, T32-BRI-01, T33-BRI-01,
T34-BRI-01, T35-BRI-01, T36-BRI-01, T39-BRI-01 y T41-BRI-01.

Crea dos modos: Method Explainer y Applied to JOC.
Format detail debe mostrar definición, cuándo usar/no usar, estructura,
examples, anti-examples, prompt template, output schema y QA.
Usa explorer + sticky showcase; no escribas reglas duplicadas en HTML.
```

## P-CAM — Campaigns

```text
Implementa T02-CAM-01, T03-CAM-01, T15-CAM-01,
T24-CAM-01, T28-CAM-01, T33-CAM-01, T35-CAM-01,
T36-CAM-01, T39-CAM-01, T40-CAM-01 y T41-GLO-01.

Construye overview con objetivo, periodo, target, pillars, platforms,
planned/published/blocked, mix, timeline y blockers.
Cada blocker debe abrir Content/task exactos.
No dupliques contenidos dentro de Campaign; relaciona por content_id.
```

## P-HE — He Content Factory

```text
Implementa T01-HE-01, T02-HE-01, T03-HE-01, T05-HE-01,
T15-HE-01, T23-HE-01, T29-HE-01, T29-HE-02, T30-HE-01,
T35-HE-01, T39-HE-01 y T41-HE-01.

Create Piece y Create Batch comparten compiler, no estado.
Muestra pieza/blueprint como objeto central.
Coverage Map debe diferenciar thesis, angle, example y payoff.
Exporta editorial prompt, visual prompt, output schema, QA y How to Use.
Guardar crea Content AI READY con IDs estables.
```

## P-SHI — Shim + Podcast

```text
Implementa T01-SHI-01, T02-SHI-01, T04-SHI-01, T05-SHI-01,
T07-SHI-01, T07-SHI-02, T15-SHI-01,
T20-SHI-01, T20-SHI-02,
T22-SHI-01, T29-SHI-01, T30-SHI-01, T35-SHI-01 y T39-SHI-01.

Construye Source→Outputs→Structures→Review→Export.
Preserva transcript, timestamps y speakers.
Coordina previews; nunca más de uno reproduce.
Seleccionar clips crea candidatos trazables y export Prompt/TXT/JSON/How to Use.
```

## P-AI — AI Handoff + AI Results

```text
Implementa T02-AI-01, T05-AI-01, T09-AI-01, T15-AI-01,
T23-AI-01, T29-AI-01, T30-AI-01, T35-AI-01,
T39-AI-01 y T41-AI-01.

Todo prompt exportado incluye WHAT/WHERE/PASTE/RETURN/DESTINATION/NEXT.
Results usa Destination→Type→Input→Mapping Preview→Confirm.
Marca create/update/ignore/conflict y bloquea overwrite de aprobado.
Confirm hidrata el mismo Content y registra History.
```

## P-STU — Content Studio

```text
Implementa T01-STU-01, T02-AI-01, T04-STU-01,
T05-STU-01, T07-STU-01, T12-STU-01, T15-LIB-01,
T20-STU-01, T22-STU-01, T32-STU-01, T35-STU-01,
T36-QAH-01, T39-STU-01 y T41-STU-01.

En desktop: unit list + preview + inspector.
En móvil: tabs/stack sin sticky triple.
Cada unidad muestra function, text, transition, evidence, visual intent,
asset slots, prompts, tasks y QA. Mantén returnContext al cerrar.
```

## P-PRO — Production Queue + Role Desks

```text
Implementa T01-PRO-01, T02-PRO-01, T05-PRO-01, T15-PRO-01,
T26-PRO-01, T30-PRO-01, T35-PRO-01, T36-PRO-01,
T39-PRO-01, T40-PRO-01 y T41-PRO-01.

Entrada por Writing, Recording, Visual, Editing, QA y Publishing.
Después filtra campaign/format/date y muestra un Content/task a la vez.
Task workspace contiene inputs, instructions, expected output,
dependencies, responsible, deadline y Done criteria.
Completar actualiza next_action y enfoca la siguiente tarea.
```

## P-ASS — Assets

```text
Implementa T04-ASS-01, T07-ASS-01, T09-ASS-01, T22-ASS-01,
T29-ASS-01, T30-ASS-01, T35-ASS-01,
T36-ASS-01, T39-ASS-01 y T41-GLO-01.

Construye expected slots + browser visual + mapping preview.
Cada Asset conoce content_id, unit_id, slot, type, version y status.
Upload no resuelve task hasta confirmar mapping/aprobación.
Preview exacto no usa filtros visuales decorativos.
```

## P-QAH — QA + History + Source Truth

```text
Implementa T02-QAH-01, T03-QAH-01, T05-QAH-01,
T15-PRO-01, T24-QAH-01, T30-QAH-01, T32-QAH-01,
T35-QAH-01, T36-QAH-01, T39-QAH-01, T40-QAH-01 y T41-GLO-01.

Combina gates generales, JOC y Format-specific.
Cada fallo apunta a unidad/campo/source y corrección esperada.
Source Truth clasifica FACT/HYPOTHESIS/ASPIRATION/UNVERIFIED.
Fix revision pide razón y crea checkpoint restaurable; no guarda cada tecla.
```

## P-CAL — Calendar + Backlog

```text
Implementa T01-CAL-01, T05-CAL-01, T15-CAL-01, T22-CAL-01,
T30-CAL-01, T35-CAL-01, T36-CAL-01,
T39-CAL-01, T40-CAL-01 y T41-CAL-01.

Ofrece month/week/list/backlog.
Drag modifica scheduled_at del mismo Content y soporta rollback.
Card muestra JOC, physical type/format, campaign, lot, lifecycle y risk.
Click abre detalle y vuelve a fecha/vista original.
```

## P-LIB — Library + Saved Views

```text
Implementa T04-LIB-01, T05-LIB-01, T15-LIB-01,
T26-LIB-01, T30-LIB-01, T35-LIB-01,
T36-LIB-01, T36-LIB-02, T39-LIB-01 y T40-ANA-02.

Library incluye todo Content.
Filtros combinables, chips, count, sort, empty state y Saved Views.
Abrir Content conserva query, filtros, sort y scroll.
Saved View guarda consulta, nunca duplica Content.
```

## P-ANA — Analytics

```text
Implementa T02-ANA-01, T04-LIB-01, T05-ANA-01,
T15-ANA-01, T32-ANA-01, T35-ANA-01, T36-LIB-01,
T39-ANA-01, T40-ANA-01, T40-ANA-02 y T41-GLO-01.

Prioriza métricas operativas: campaign, pillar, format, platform,
lifecycle, publication rate, backlog y coverage.
Cada gráfico tiene tabla, insight y CTA a vista filtrada.
No inventes performance marketing sin datos de plataforma.
```

## P-ARQ — El Arquitecto

```text
Implementa T05-ARQ-01, T15-ARQ-01, T23-ARQ-01,
T26-GLO-02, T30-ARQ-01, T30-HOM-01, T30-HE-01, T30-SHI-01, T30-AI-01,
T30-STU-01, T30-PRO-01, T30-CAL-01,
T35-ARQ-01, T39-ARQ-01 y T41-ARQ-01.

Utility window fixed-right, launcher persistente y respuestas in-place.
Contexto = módulo + Content + campaign + lifecycle + selection + pending.
Cada recomendación incluye razón, target y success condition.
No es ChatGPT clone ni ejecuta IA externa.
```

## P-STO — Story / Overviews

```text
Selecciona solo técnicas necesarias entre T01-STO-01, T06-STO-01,
T10-STO-01, T12-STO-01, T13-STO-01, T17-STO-01, T18-STO-01,
T19-STO-01, T21-STO-01, T24-STO-01, T25-STO-01, T25-STO-02,
T28-STO-01, T28-STO-02, T32-STO-01, T33-STO-01,
T34-STO-01, T37-STO-01 y T41-GLO-01.

Una idea + un visual + una acción por escena.
Nav local, disclosures, reduced motion y Text mode obligatorios.
T08-STO-01, T14-STO-01 y T38-STO-01 solo en laboratorio con fallback.
Story nunca reemplaza Dashboard/Workspace.
```

---

# 6. Orden de ejecución recomendado

1. **Fundamento:** T02, T04, T05, T31 y T41.
2. **Operación principal:** T26, T27, T29, T30, T35, T36 y T39.
3. **Continuidad y medios:** T01, T07, T12, T15, T20, T22 y T32.
4. **Visualización:** T24, T33, T34 y T40.
5. **Story opcional:** T06, T10, T11, T13, T16, T17, T18, T19, T21, T25, T28 y T37.
6. **Laboratorio posterior:** T08, T14, T23 ornamental y T38.

No se ejecuta la siguiente capa hasta que la anterior conserve boot, rutas, datos, accesibilidad y tareas reales.

---

# 7. Definition of Done para cualquier receta

Una receta `TNN-MOD-##` está terminada cuando:

- usa el objeto/estado indicado;
- produce el resultado observable de su fila;
- tiene loading, empty, success, error y cancel cuando aplican;
- funciona con teclado, foco visible y responsive;
- ofrece reduced motion/fallback cuando aplica;
- limpia observers, listeners, RAF y medios al salir;
- no rompe `content_id`, Campaign, Format, History ni Source Truth;
- no añade dependencias remotas;
- tiene prueba automatizada o checklist reproducible;
- el módulo sigue operando si se desactiva la mejora visual.

---

# 8. Prompt maestro para ejecutar una receta

```text
Actúa como Lead Product Designer, UX Architect y Frontend Principal de ABRAXAS v1.1.1.

TAREA
Implementa únicamente estas recetas del documento HTML REFERENCES:
[PEGAR IDs TNN-MOD-##]

ANTES DE PROGRAMAR
1. Localiza el módulo, render actual, datos, state y tests.
2. Explica qué tarea mejora cada receta.
3. Lista técnicas combinadas y conflictos descartados.
4. Define comportamiento desktop, móvil, teclado, reduced motion y fallback.
5. Escribe criterios observables y tests que fallen.

IMPLEMENTACIÓN
- Reutiliza Content, Campaign, Format, Task, Asset, Source y History.
- No crees datos paralelos ni métricas hardcoded.
- Mantén JOC-only, file://, offline, bootstrap único y Recovery Mode.
- No cargues CDN ni expongas secretos.
- Implementa por componentes/funciones aisladas.

VERIFICACIÓN
Ejecuta unit, runtime, route, browser-like boot, standalone final,
accessibility/reduced-motion y pruebas específicas de las recetas.
Entrega evidencia, archivos modificados, riesgos y resultado observable.
```

---

# 9. Resultado esperado de este documento

La IA ya no recibe “usa GSAP en He” o “aplica un explorador en Assets”. Recibe instrucciones como:

- `T01-HE-01`: animar el reordenamiento real de Coverage Map cuando cambia la cadencia.
- `T36-ASS-01`: filtrar Assets por Content, unidad, slot, versión y estado.
- `T39-PRO-01`: convertir una task en el objeto dominante con inputs, output y Done criteria.
- `T30-CAL-01`: explicar el riesgo de una publicación y abrir el módulo que lo resuelve.

Ese nivel de especificidad es el contrato para la futura implementación.
