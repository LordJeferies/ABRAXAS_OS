# ABRAXAS v1.1.2 · Manual operativo

ABRAXAS organiza una misma pieza desde contexto hasta publicación. No necesitas memorizar la arquitectura: Home y El Arquitecto deben decirte dónde entrar.

## 1. Elegir representación
Arriba a la derecha: **Dashboard | Product Story**.
- Dashboard: trabajar.
- Product Story: comprender/explorar Home, Clients, Brand Intelligence y Roadmap.
Los datos son los mismos.

## 2. Crear contenido nuevo
Home → Crear contenido → He.
1. Cliente.
2. Formato físico.
3. Pilar.
4. Patrón cliente/universal.
5. Tema/contexto/cantidad.
6. Coverage Map / estructura.
7. Prompt editorial + visual.
8. Guardar AI READY o ejecutar externamente.

## 3. Procesar una grabación
Home → Convertir una grabación → Shim.
1. Pega transcript + timestamps.
2. Elige verticales/horizontales/carruseles y plataformas.
3. Elige estructuras o distribución inteligente.
4. Revisa contrato.
5. Exporta Prompt + Request JSON.
6. Ejecuta en IA.
7. Revisa el HTML resultante.
8. Cambia candidatos a CONFIRMADO/NEEDS_FIX/DESCARTADO.
9. Exporta SHIM_CONFIRMED_MANIFEST.
10. Videos → Terminal/DaVinci; carruseles → Content Studio/Assets.

## 4. Terminal / FFmpeg
`automation_bridge/terminal/ABRAXAS_SHIM.command`.
Elige un clip/varios/todos, separados/unido/ambos y precisión. El source es READ ONLY.

## 5. DaVinci Resolve
Ejecuta `automation_bridge/davinci/ABRAXAS_IMPORT_TO_RESOLVE.py` en un entorno compatible con Resolve scripting. Importa el mismo manifest confirmado y crea timelines/markers editables.

## 6. Revisar una pieza
Library/Production → Content Studio 1×1.
Overview, Contenido + Producción, Copies, Prompts, Producción, QA, Historial.
En cada unidad se muestra Reference/Quality Context y las capas Recording/B-roll/Omni/SFX/Music/Cover/Copies/START-MIDDLE-END.

## 7. Resolver pendientes
Production Queue → categoría → pieza → task. Copia prompt o sigue instrucciones. Marcar resuelta cambia progreso y next action.

## 8. Devolver resultados IA
AI Results → Destination → Type → Input → Mapping Preview → Confirm. No sobrescribas secciones aprobadas silenciosamente.

## 9. Assets
Selecciona content_id + unit/slot. Vincula archivo, revisa versión/preview y aprueba mapping.

## 10. Calendar
Mes/semana/backlog. Drag & drop cambia fecha del mismo Content. No duplica.

## 11. El Arquitecto
Pregunta en lenguaje natural: “¿Dónde creo contenido?”, “¿Cómo proceso un podcast?”, “¿Qué falta aquí?”, “¿Dónde llevo este resultado?”. La respuesta incluye pasos, rutas sugeridas, razón y success condition.

## 12. Si algo falla al abrir
Recovery Mode debe aparecer en vez de pantalla negra. No borres datos manualmente sin antes exportar backup. Revisa `reports/` y ejecuta los tests del release si estás desarrollando.
