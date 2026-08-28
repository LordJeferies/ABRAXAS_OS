# Lienzo Canon

Lienzo es el objeto vivo, editable y versionado de un contenido.

No es solo ficha, brief, tarea ni metadata.

Combina:
intención
estrategia
texto
estructura
evidencia
decisiones
producción
artefactos
publicación
aprendizaje

## Capas

CORE
STRATEGY
PLANNED
OBSERVED
RESOLVED
PRODUCTION
DISTRIBUTION
PUBLICATION
LEARNING
HISTORY

## Secciones editables

GENERAL
CONTENT
COPY
VISUAL
COVER
MOTIONS
CAPTIONS
EDIT
AUDIO
VFX
SFX
PUBLISHING
METRICS

## Estados de componente

NOT_NEEDED
NOT_STARTED
DRAFT
IN_PROGRESS
WAITING
BLOCKED
READY_FOR_REVIEW
REVIEW
APPROVED
LOCKED
GENERATING
GENERATED
OUT_OF_SYNC
READY
DONE
ERROR

## Regla de versión

Generar no significa cerrar.

Un cambio de fuente:
- conserva artifact anterior;
- crea nueva versión;
- calcula impacto;
- marca dependientes como REVIEW/OUT_OF_SYNC cuando aplique;
- no regenera todo sin permiso.

LOCKED significa “esta versión alimenta la siguiente etapa”.
No significa ineditable.
