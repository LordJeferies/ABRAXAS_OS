# ABRAXAS v0.9.5 Replacement R2 · Visual Reference Audit

## Apple · MacBook Pro / macOS product pages
Las grabaciones muestran una jerarquía de producto basada en escenas: una idea por bloque, títulos contenidos en relación con el viewport, controles discretos, highlights horizontales, comparadores y modales contextuales. No se usa una pared homogénea de tarjetas. Para ABRAXAS: escenas narrativas + rails + disclosures + workspace específico por herramienta.

## CleanMyMac
La referencia muestra una navegación lateral estable en herramientas, una tarea protagonista por módulo, gran estado/objeto central y un CTA dominante. Los resultados aparecen luego como módulos/tiles de revisión. Para ABRAXAS: He, Shim y Production conservan workspace; cada módulo explica primero la tarea actual y reduce acciones simultáneas.

## Dala
La referencia utiliza campos de líneas radiales, transiciones cromáticas y geometría en movimiento para dar profundidad al hero sin convertir el fondo en contenido. Para ABRAXAS: el Home incorpora un canvas con chevrons/triángulos abiertos derivados del monograma A, oro/ámbar y movimiento radial suave. Se respeta prefers-reduced-motion.

## Refero / experiencias editoriales oscuras
Las referencias muestran sliders, flechas contextuales, cambios de escala, navegación por escena y contenido que aparece de forma progresiva. Para ABRAXAS: rails con controles visibles, secciones desplegables y menús internos; no se replica su estética si entra en conflicto con Apple.

## Ainsley
La referencia trabaja negro, tipografía editorial, secciones identificables y navegación espacial. Se toma el ritmo y la claridad de capítulo, no el tamaño extremo de tipografía.

## Decisiones para Replacement R2
- Story hero máximo ~68 px en desktop, no 118 px.
- Scene headings máximo ~54 px.
- Home prioriza la pregunta “¿Qué quieres hacer ahora?” y ofrece rutas operativas.
- Story rails tienen Prev/Next y scroll-snap.
- Cada historia ofrece disclosures para profundidad en vez de texto gigante permanente.
- Menú global fijo arriba a la izquierda en cualquier módulo.
- Menú interno de story surfaces mediante Secciones, no una fila extensa de links.
- El Arquitecto actualiza solo su utility window; no vuelve a renderizar la página al responder.
- Branding Method tiene entrada genérica o aplicada por cliente y las respuestas aplicadas se derivan del contexto real de cada marca.
