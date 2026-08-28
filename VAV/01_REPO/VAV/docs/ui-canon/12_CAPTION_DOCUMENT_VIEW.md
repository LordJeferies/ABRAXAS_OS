# Caption Document View / Riverside-inspired Reading Space

## Problema
Un editor de captions no puede depender únicamente de timeline chips o del
caption sobre el preview. El usuario necesita ver el texto completo de forma
continua para detectar errores de lectura, puntuación, segmentación y ritmo.

## Solución VAV
Agregar una superficie persistente de lectura/edición sincronizada, inspirada
funcionalmente en Riverside, pero adaptada al layout general de VAV.

## Requisitos funcionales
- visible en el flujo principal;
- texto completo disponible sin abrir un modal separado;
- highlight del bloque activo;
- seek al hacer click;
- selección sincronizada con timeline;
- timestamps por bloque;
- estado visual de bloques: normal / seleccionado / activo / editado / error;
- futuro soporte para búsqueda y replace;
- futuro soporte para speaker labels opcionales.

## Requisitos visuales
- superficie calmada y legible;
- contraste alto;
- texto no demasiado pequeño;
- timestamps secundarios;
- active line con acento VAV pero sin saturación;
- scroll propio;
- spacing suficiente entre bloques.

## Requisito de arquitectura
Este panel trabaja sobre el mismo source of truth del timeline. No existe un
modelo textual separado. Debe leer/escribir sobre los mismos caption segments.
