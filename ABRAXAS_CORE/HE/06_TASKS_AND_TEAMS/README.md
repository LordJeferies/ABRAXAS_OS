# He Operations Core (@abraxas/he-operations)

## Canonical Ownership
He owns all operational work state, tasks, assignments, deadlines, dependencies, recording sessions, approvals, and team workload for ABRAXAS OS.

## Architecture
- `runtime/types.ts`: Canonical domain models, payloads, and contracts.
- `runtime/rbac.ts`: Authoritative Role-Based Access Control and Default Deny enforcement.
- `runtime/dependencies.ts`: Graph cycle detection, dependency evaluation, and override checks.
- `runtime/deadlines.ts`: Multi-level deterministic deadline risk evaluation.
- `runtime/recording.ts`: Multi-Lienzo recording session management.
- `runtime/approvals.ts`: Formal review and approval lifecycle.
- `runtime/projections.ts`: Pure projections (Solo Queue, Team Snapshot, Kanban, Calendar).
- `runtime/store.ts`: Storage providers (`MemoryOperationsStore`, `JsonFileOperationsStore`).
- `runtime/service.ts`: `HeOperationsService` centralizing authorization, domain invariants, mutations, and activity audit logging.
- `runtime/vav-adapter.ts`: Non-mutating bridge translating VAV production events into He operational suggestions.
