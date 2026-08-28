# ABRAXAS A v1.1.2 · Product + UX + Frontend Evolution

## Base canónica
v1.1.2 se construye desde el FULL RELEASE v1.0. v0.9.6.x queda únicamente como referencia histórica/recovery; la release v1.1.1 defectuosa no es base de implementación.

## UI / UX
- Selector global superior derecho `Dashboard | Product Story`.
- Dashboard conserva sidebar izquierda, navegación operativa, estados, next action y densidad de aplicación macOS.
- Product Story usa los mismos datos como hero, Brain Navigator, highlights, closer-look, escenas y narrativa progresiva.
- Home, Clients, Brand Intelligence y Roadmap soportan ambas representaciones.
- He, Shim, Production, AI Results, Content Studio, Assets y Calendar permanecen workspaces operativos.
- Liquid Glass se reserva para navigation/control/utility layers; no se aplica indiscriminadamente a cada card.
- Técnica/motion se aplica por módulo según `TECHNIQUE_APPLICATION_MATRIX_v1.1.2.json`; las 41 técnicas no se activan simultáneamente.

## Production Queue
Recupera el flujo `categoría → pieza → tarea`. La cola no depende de una base paralela: filtra `productionTasks` del mismo Content/Production Graph y ofrece un prompt específico por tarea.

## El Arquitecto 2.1
- Utility window derecha.
- Conoce módulo, flow stage, Content, campaign, lifecycle, selección y pendientes.
- Respuestas con diagnóstico, pasos, sugerencias, razón, target y success condition.
- Preguntas como “¿dónde puedo crear contenido?” distinguen He, Shim y Biblioteca según el punto de partida.
- Puede preparar una pregunta contextual para IA externa sin incrustar secretos.

## Shim 2.1
Arquitectura:
`Transcripción → Shim Master Prompt → HTML de revisión → confirmación humana → SHIM_CONFIRMED_MANIFEST → Terminal/FFmpeg o DaVinci Resolve`.

Regla: **Shim no automatiza candidatos; automatiza decisiones CONFIRMADAS.**

El output exigido incluye:
- `editable_html` tipo estación editorial Moka-v3 ampliada;
- `master_json`;
- estados CANDIDATO / REVISADO / CONFIRMADO / NEEDS FIX / DESCARTADO;
- `SHIM_CONFIRMED_MANIFEST.json` como fuente única;
- `CUT_AUTOMATION_PACKAGE.json`;
- `CAROUSEL_PRODUCTION_PACKAGE.json` separado;
- Terminal/FFmpeg package;
- DaVinci package.

## Automation Bridge
`automation_bridge/terminal/` contiene launcher, parser/renderer y verificación de entorno.
`automation_bridge/davinci/` contiene script ejecutable de importación, timeline/markers/subtitles/edit notes y README.
Ambos consumen la misma selección editorial confirmada. El source video es READ ONLY y todos los outputs son derivados.

## Calidad visual/prompt
Las capas especializadas ahora tienen prompts propios y auditados:
- Recording/source
- B-roll
- Omni/VFX
- SFX
- Music
- Cover
- Copies
- START / MIDDLE / END references
- Still
- Carousel WITH TEXT
- Carousel WITHOUT TEXT

El criterio exige textura/materiales/luz/cámara/timing/continuidad, negativos anti-AI-slop y output contracts. “Premium/cinematic” nunca funciona como especificación única.

## Moka Source Truth actualizado
Los assets actuales de Moka se incorporan al release. El sistema visual de Moka conserva paleta oficial, Codec Pro + Century Expanded, conectividad, líneas/nodos/flujos/módulos/iconos/gráficas simples, laboratorio/botánica/microfotografía/tecnología y una guía aproximada 40% texto / 60% imagen cuando el formato lo permite. Investor-deck claims siguen bloqueados por Source Truth hasta validación.

## Validación
- 186 tests de regresión/contratos.
- Browser source smoke: PASS.
- Standalone boot + routes: PASS.
- Prompt QA: 932 prompts, mínimo 100/100, promedio 100/100, mínimo 324 palabras.
- Strict scan: 0 prompts cortos, 0 placeholders.
