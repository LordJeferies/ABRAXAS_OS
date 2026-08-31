# ABRAXAS OS - Agent Governance

Canonical workspace: `~/Desktop/abraxasos`.

## Source authority
1. recent approved decision;
2. live code + fresh verification;
3. current contract/canon;
4. verified GREEN evidence;
5. reference;
6. historical functional implementation;
7. backup/handoff.

Documentation is not runtime proof.

## Ownership
- YOD: reusable intelligence and criteria.
- Lienzo: persistent versioned identity/state of one content piece.
- Shim: observation/resolution of real source material.
- VAV: audiovisual production.
- He: operations, tasks, deadlines, approvals and management.
- Arquitecto: contextual guidance; consumes YOD and does not duplicate it.
- Pipeline Engine: orchestration of reusable modules.
- AI Runtime: provider-agnostic AI execution.
- Publishing: platform targets and publication state.
- Metrics: external performance evidence.

## Invariants
- `PLANNED != OBSERVED != RESOLVED`.
- canonical content/state is data; UI is a projection.
- AI never silently mutates canonical Lienzo.
- Learning never silently becomes Source Truth.
- meaningful outputs become Artifacts.
- meaningful transitions become Events.
- upstream edits invalidate only affected derivatives using `OUT_OF_SYNC`.
- runtime/models/secrets stay outside Git when appropriate.
- audit historical functional systems before replacement.
- communicate between modules through explicit/versioned contracts.

## Before implementation
1. Verify branch, HEAD, `origin/main`, working tree and relevant runtime.
2. Read relevant canon/contracts.
3. Identify the owning module.
4. Audit current implementation.
5. Audit historical functional implementations when relevant.
6. Classify: `REUSE_DIRECT`, `ADAPT`, `MIGRATE`, `MERGE_CONTRACT`,
   `REFERENCE_ONLY`, `DEPRECATE_LATER`, or `NEW`.
7. Define scope and acceptance criteria.
8. Make the smallest coherent change.
9. Test / run the required runtime gate.
10. Inspect diff.
11. Produce an ABRAXAS Execution Report.

## Safety
Never automatically:
- `git add .` / `git add -A`;
- `git reset --hard`;
- `git clean -fd`;
- force push;
- delete quarantine/evidence;
- expose secrets;
- rewrite working functionality without audit;
- claim `DESIGN_READY` is `IMPLEMENTED`;
- commit/push without explicit user authorization.

## Definition of Done
When applicable:
SPEC -> CONTRACT -> FAILING TEST -> IMPLEMENTATION -> PASSING TEST ->
INTEGRATION -> ERROR STATES -> PERMISSIONS -> VERSIONING -> PROVENANCE ->
DOCS -> TARGETED COMMIT -> REMOTE SHA VERIFICATION.

If root `README.md` is not present yet, use `00_START_HERE/`, current code and
current contracts for navigation until the canonical README is installed.
