# Event Model

Los módulos no sobrescriben el Lienzo completo sin contexto.

Eventos ejemplo:
YOD_PLAN_CREATED
YOD_COPY_CREATED
SHIM_ANALYSIS_COMPLETED
SHIM_CONTENT_RESOLVED
EDIT_STARTED
EDIT_LOCKED
CAPTIONS_COMPLETED
MOTIONS_COMPLETED
COPY_UPDATED
COVER_UPDATED
ARTIFACT_GENERATED
QA_APPROVED
PLATFORM_SCHEDULED
PLATFORM_PUBLISHED
METRICS_SYNCED

Cada evento:
event_id
content_id
component
actor
timestamp
previous_version
new_version
reason
metadata
