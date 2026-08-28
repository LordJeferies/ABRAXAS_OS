# ABRAXAS v1.2 · Root Cause & Product Recovery

## Por qué v1.1.3 se percibía roto

1. **Acciones y UI no tenían un contrato end-to-end suficientemente fuerte.** El boot podía pasar aunque una acción útil no cambiara el dominio o la siguiente pantalla.
2. **Roles incompletos.** Recording y Editing podían compartir señales demasiado genéricas (`video`) y no representar la dependencia real source → editing.
3. **Calendar era una proyección pasiva.** Mostraba fechas pero no ayudaba a leer riesgo, backlog, balance o reprogramar de forma accesible.
4. **Estados heredados podían contradecir Production.** Ejemplo detectado durante la auditoría v1.2: `READY_TO_PUBLISH` con source, covers y QA todavía pendientes.
5. **Arquitecto tenía contexto, pero no suficientes rutas canónicas ni success conditions para guiar a una persona no experta.
6. **Escala visual demasiado baja.** La grabación de la versión defectuosa mostraba mucha superficie negra y widgets/texto demasiado pequeños para un canvas Mac.
7. **Brain visualmente insuficiente.** Tener partículas dentro de una masa no bastaba para que se reconociera como cerebro.

## Correcciones estructurales v1.2

- Action Controller único con eventos delegados y fallos seguros.
- Proyecciones por rol sobre un solo Production Graph.
- Recording source-aware; Editing bloqueado hasta existir source/master.
- Operational Status derivado de tasks + assets + fecha; lifecycle histórico se preserva, UI muestra el estado operativo real.
- Content Studio 3.0 con Outline / Workspace / Inspector y vistas específicas.
- Calendar 2.0: Month / Week / List / Backlog + filtros + riesgo + Planning Insight + reprogramación accesible.
- Architect 4.0: intención → ruta → razón → primer paso → resultado → condición de terminado.
- Brain Navigator 4.0: anatomía explícita + chevrons ABRAXAS + hotspots + zoom + morph.
- Product Story 2.0 separado del Dashboard operativo.
- Technique Registry con 41 técnicas y estados `implemented`, `selective`, `lab`.
- Browser-like end-to-end smoke sobre el standalone final.
- Auditoría visual real por Chromium/DevTools sobre el standalone embebido.
