# ABRAXAS v1.2 · Visual Fidelity Audit

## Fuentes estudiadas

### Apple HIG / WWDC
- Sidebars: navegación líder; en Mac/iPad pueden flotar sobre contenido dentro de la capa funcional Liquid Glass.
- Designing for macOS: aprovechar displays grandes para mostrar más información con menos niveles, manteniendo densidad cómoda.
- Liquid Glass: capa funcional para navegación y controles, no material universal para contenido; evitar glass-on-glass.
- New Design System: scroll edge effects, content-under-sidebar y continuidad espacial.

### CleanMyMac
- Smart Care: acción principal → scan → resultados → Review/Run.
- My Tools: reducir pasos mediante herramientas frecuentes, búsqueda y favoritos.
- Criterio aplicado a ABRAXAS: módulo protagonista, estado claro, acción dominante y rutas por responsabilidad.

### Técnicas web
- ScrollTrigger/GSAP: referencia para pin/snap/scrub/scroll state; v1.2 mantiene un runtime nativo/offline y no introduce CDN obligatorio.
- View Transitions API: progressive enhancement para transiciones de estado cuando exista soporte.
- `prefers-reduced-motion`: obligatorio para degradación de motion.
- Lenis: referencia para smooth scrolling; no se impone al workspace operativo ni se secuestra el scroll nativo.

## Capturas reales del HTML final

Guardadas en `reports/visual_audit/`:
- `06_dashboard_final.png`
- `02_architect.png`
- `03_calendar.png`
- `07_product_story_final.png`
- `08_studio_final.png`
- `09_studio_talent.png`
- `10_studio_editing.png`

## Resultado observable

### Dashboard
- Sidebar izquierda visible y legible.
- Topbar funcional `Dashboard | Product Story` + rol + ⌘K.
- Tipografía operativa legible (no 7–10 px como base de trabajo).
- Next action protagonista.
- Roles visibles como proyecciones.

### Architect
- Utility window derecha, no panel aleatorio dentro del contenido.
- Ubicación, explicación, preguntas rápidas, respuesta estructurada y CTA.

### Calendar
- Mes completo + filtros + Planning Insight.
- Riesgo se representa además del color.
- Backlog / Week / List / Month.

### Product Story
- Cerebro ocupa la mayor parte del canvas.
- Dos hemisferios, fisura, gyri/sulci, cerebellar/brainstem hints y chevrons ABRAXAS.
- Hotspots dentro de anatomía visible, no detrás del copy.
- Copy en panel funcional translúcido; el cerebro sigue visible.

### Studio
- Outline / Workspace / Inspector.
- Status operativo coherente: `Calendarizado · en riesgo` si hay fecha pero faltan source/assets/tasks.
- Vista Talent lista para lectura/teleprompter.
- Vista Editing presenta Recording/source, B-roll, Omni/VFX, SFX, Music y START/MIDDLE/END.

## Gate

No se declara “100% Apple” como equivalencia literal de materiales propietarios del sistema. El gate exige anatomía, jerarquía, densidad, comportamiento y jerarquía de materiales alineados con las referencias Apple y la lógica operacional CleanMyMac, preservando identidad ABRAXAS.
