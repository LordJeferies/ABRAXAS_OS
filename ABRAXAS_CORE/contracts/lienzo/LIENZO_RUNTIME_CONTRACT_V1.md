# LIENZO RUNTIME CONTRACT V1
**Gate**: R1 — LIENZO DOMAIN CORE V1  
**Authority**: Frozen Canon & Live Runtime Specification  
**Status**: ACTIVE / FROZEN  

---

## 1. Domain Purpose & Identity
Lienzo is the persistent, structured, versioned Source of Truth for a single piece of audiovisual content.

- **Primary Identifier**: `contentId` (opaque string, UUIDv4/v5/ULID/slug compatible).
- **Core Principle**: Content/state is canonical; UI and renderers are projections.
- **Invariants**:
  1. `PLANNED != OBSERVED != RESOLVED`.
  2. AI/automated engines never silently mutate Lienzo.
  3. Learning feedback never silently overwrites Source Truth.
  4. Generation never closes revision lineage ("Generar no significa cerrar").
  5. Upstream edits preserve prior artifact references and compute downstream impact (`OUT_OF_SYNC`).

---

## 2. Canonical Lifecycle States
Every Lienzo instance progresses through explicit lifecycle states:
```text
IDEA → PLANNED → PREPRODUCTION → RECORDING → INGESTED → RESOLVED → PRODUCTION → QA → READY → SCHEDULED → PUBLISHED → LEARNING → ARCHIVED
```
- Lifecycle transitions require an explicit mutation, actor identity, and reason.
- Silent lifecycle transitions are rejected.

---

## 3. Conceptual Layers
Lienzo maintains strict layer boundaries:
1. `CORE` — Intrinsic identity, metadata, title, and target parameters.
2. `STRATEGY` — YOD-derived angles, narrative frameworks, and audience targeting.
3. `PLANNED` — Script outline, proposed b-roll, planned hooks, and intended timing.
4. `OBSERVED` — Real transcriptions, raw footage spans, and measured telemetry.
5. `RESOLVED` — Editorial mapping binding observed realities to planned intent.
6. `PRODUCTION` — Render parameters, safe zones, color tokens, and composition trees.
7. `DISTRIBUTION` — Packaging targets, platform-specific metadata, and aspect ratios.
8. `PUBLICATION` — Remote deployment identifiers, URLs, and release timestamps.
9. `LEARNING` — Performance telemetry signals for retrospective criteria feedback.
10. `HISTORY` — Immutable audit log of all committed revisions and impact reports.

**Layer Separation Invariant**:
- Writing to `PLANNED` must never mutate `OBSERVED`.
- Writing to `OBSERVED` must never mutate `RESOLVED`.
- Promoting `OBSERVED` to `RESOLVED` requires an explicit, actor-attributed mutation.

---

## 4. Canonical Sections
Components are grouped into strongly typed functional sections:
- `GENERAL`, `CONTENT`, `COPY`, `VISUAL`, `COVER`, `MOTIONS`, `CAPTIONS`, `EDIT`, `AUDIO`, `VFX`, `SFX`, `PUBLISHING`, `METRICS`, `HISTORY`.

---

## 5. Component Status Vocabulary
Components follow a strict state vocabulary:
- `NOT_NEEDED`, `NOT_STARTED`, `DRAFT`, `IN_PROGRESS`, `WAITING`, `BLOCKED`, `READY_FOR_REVIEW`, `REVIEW`, `APPROVED`, `LOCKED`, `GENERATING`, `GENERATED`, `OUT_OF_SYNC`, `READY`, `DONE`, `ERROR`.

---

## 6. Revision & Concurrency Model
1. **Optimistic Concurrency**: Every mutating command requires `expectedRevision`. If `expectedRevision !== currentRevision`, the mutation is rejected with `LienzoRevisionConflictError`.
2. **Immutable Revisions**: Each accepted mutation produces a new monotonic revision (`revision = parentRevision + 1`) and appends a `LienzoRevision` entry to history.
3. **Component Versioning**: A mutation increments the `version` of changed components (`version + 1`) while unchanged component versions remain strictly stable.

---

## 7. Dependency Graph & Impact Engine
1. **DAG Constraints**: Dependencies are directed edges (`upstreamComponentId → downstreamComponentId`).
   - Self-dependencies are rejected (`LienzoDependencyError`).
   - Cycles are rejected (`LienzoDependencyError`).
   - Dangling/unresolvable component IDs are rejected (`LienzoDependencyError`).
2. **Impact Calculation**:
   - Modifying an upstream component evaluates all transitive downstream dependents.
   - Dependents currently in `APPROVED`, `LOCKED`, `GENERATING`, `GENERATED`, `READY`, or `DONE` states are transitioned to `OUT_OF_SYNC`.
   - Prior artifact references attached to downstream components are strictly preserved.
   - Automatic background re-generation is forbidden.
   - An `ImpactReport` is returned detailing all affected components and state changes.

---

## 8. Source & Artifact References
- `SourceRef`: Opaque reference to an external observed asset (`sourceId`, `uri`, `checksum`, `timeSpanUs`).
- `ArtifactRef`: Opaque reference to a generated or intermediate render deliverable (`artifactId`, `kind`, `uri`, `checksum`, `createdAt`).
- **Storage Rule**: Binary media, raw video payloads, and large cache objects are NEVER stored inside Lienzo. Only immutable reference descriptors are retained.

---

## 9. Domain Events
Every successful service mutation produces a typed domain event:
- `LIENZO_CREATED`
- `LIENZO_LIFECYCLE_CHANGED`
- `LIENZO_COMPONENT_CREATED`
- `LIENZO_COMPONENT_UPDATED`
- `LIENZO_COMPONENT_STATUS_CHANGED`
- `LIENZO_IMPACT_DETECTED`
- `LIENZO_REVISION_COMMITTED`

Each event carries `eventId`, `contentId`, `componentId`, `actorId`, `timestamp`, `previousRevision`, `newRevision`, `reason`, and event-specific payload metadata.

---

## 10. Persistence & Validation
- **Schema Version**: `schemaVersion: 1`.
- **Implementations**: `MemoryLienzoStore` and atomic `JsonFileLienzoStore`.
- **Fail-Closed Guarantees**:
  - Rejects corrupt or unparseable JSON.
  - Rejects unsupported schema versions (`LienzoSchemaVersionError`).
  - Enforces referential integrity of components, dependencies, and revision histories.
  - Zero silent overwrites or automatic data repairs.

---

## 11. Security & RBAC Boundary
- Provenance: All mutating commands require `actorId` and `reason`.
- RBAC Authority: Permission checks (e.g. `lienzo.create`, `lienzo.edit`, `lienzo.approve`) are evaluated by He Operations Core before delegating to Lienzo Service. Lienzo does not duplicate RBAC engine logic.

---

## 12. Out of Scope for V1
- Global Distributed Event Store
- Global Artifact Registry (cross-system deduplication)
- Real-time WebRTC collaborative editing
- Autonomous AI prompt orchestration
- UI Canvas Renderer (He 01_LIENZO_UI integration)
