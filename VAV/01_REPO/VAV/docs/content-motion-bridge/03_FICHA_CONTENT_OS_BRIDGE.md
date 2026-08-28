# Universal Content OS ↔ VAV-Captions Bridge

The supplied Content OS defines:
- Ficha as atomic unit;
- one ficha, many views;
- planned / observed / resolved separation;
- future CAPTIONS and MOTIONS modules;
- module versioning;
- provenance;
- source vs timeline timestamps in editing;
- TXT human projection, JSON structured projection, HTML view.

VAV should preserve those principles.

## Import lifecycle

TXT / MD / HTML / JSON
        ↓
RawImportArtifact
        ↓
Projection Parser
        ↓
ImportCandidate[]
        ↓
Validation + Review
        ↓
ContentBridge
        ↓
FichaProjection / ContentIntentMap / MotionContext[]
        ↓
VAV Project modules

The imported original never gets overwritten.

## Module status compatibility

NOT_STARTED
PLANNED
WAITING_FOR_SOURCE
DRAFT
REVIEW_REQUIRED
APPROVED
FINAL
BLOCKED
NOT_APPLICABLE

VAV can map these directly into its module status layer.
