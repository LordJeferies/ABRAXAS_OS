# VAV ↔ ABRAXAS Lienzo Bridge

Este documento describe contrato futuro. No reemplaza código VAV existente.

VAV devuelve al Lienzo:
- component status;
- artifact IDs;
- versions;
- timestamps;
- hashes;
- errors;
- provenance;
- completion events.

Ejemplos:

VAV Captions
→ captions.status
→ caption_document
→ caption_plan
→ parity/verify status

VAV Motions
→ motions.status
→ motion_plan
→ frames
→ motion render

Editing
→ edit.status
→ edit lock
→ master render

No crear source-of-truth paralelo.
He refleja el Lienzo/eventos.
