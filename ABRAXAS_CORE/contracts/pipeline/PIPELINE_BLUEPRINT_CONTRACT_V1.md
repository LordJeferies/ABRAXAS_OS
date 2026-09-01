# ABRAXAS PIPELINE BLUEPRINT CONTRACT V1

## Registry Classification
- **Classification**: `DESIGN_REGISTRY`
- **Execution State**: `NOT_RUNTIME_EXECUTABLE` (Defines structural workflow topologies for Public Status visualizers and future orchestrators).

---

## 1. Purpose & Scope
A **Pipeline Blueprint** defines a named, reusable, modular workflow graph describing how data, components, and artifacts transition through ABRAXAS subsystems.

---

## 2. Canonical Owner Modules & Execution Kinds
Allowed `ownerModule` values:
- `YOD` (Intelligence, Criteria, Opportunities, Plans, Prompts, Learning)
- `LIENZO` (Persistent Content Identity, Components, Versions, Dependencies, Impact)
- `HE` (Operations, Governance, Tasks, Approvals, Calendar, Recording Sessions)
- `SHIM` (Real-Source Observation, Alignment, Gap Detection, Resolution)
- `VAV` (Audiovisual Synthesis, FFmpeg Cuts, Captions, Remotion Motions, Master Render)
- `ARQUITECTO` (Contextual Guidance, Recording/Production Coaching)
- `PIPELINE_ENGINE` (Modular DAG Orchestration)
- `AI_RUNTIME` (Provider-Agnostic AI Inference Dispatch)
- `PUBLISHING` (Distribution Targets, Snapshot Freezing, Dispatch)
- `METRICS` (Telemetry Ingest, 5-Score Normalization)
- `UNIVERSAL_INTAKE` (Document & Media Ingest)

Execution kinds:
- `AUTOMATED` (Machine service execution)
- `HUMAN_GATE` (Human review, explicit verification or signoff)
- `EXTERNAL_TOOL` (External NLE, camera hardware, or third-party tool)

---

## 3. Blueprint Schema

```typescript
export type BlueprintScope = "FULL" | "FROM_STAGE" | "TO_STAGE" | "RANGE" | "SELECTED_STAGES";

export type CanonicalOwnerModule =
  | "YOD"
  | "LIENZO"
  | "HE"
  | "SHIM"
  | "VAV"
  | "ARQUITECTO"
  | "PIPELINE_ENGINE"
  | "AI_RUNTIME"
  | "PUBLISHING"
  | "METRICS"
  | "UNIVERSAL_INTAKE";

export type ExecutionKind = "AUTOMATED" | "HUMAN_GATE" | "EXTERNAL_TOOL";

export interface BlueprintStage {
  stageId: string;
  ownerModule: CanonicalOwnerModule;
  governanceOwner?: CanonicalOwnerModule;
  executorLabel?: string;
  operation: string;
  executionKind: ExecutionKind;
  title: string;
  description: string;
  isHumanGate?: boolean;
  canSkip?: boolean;
  requiredInputs: string[];
  emittedOutputs: string[];
}

export interface PipelineBlueprint {
  blueprintId: string;
  version: number;
  name: string;
  description: string;
  supportedScopes: BlueprintScope[];
  stages: BlueprintStage[];
  edges: Array<{ fromStageId: string; toStageId: string }>;
}
```

---

## 4. 11 Canonical Seed Blueprints
1. `CORE_LOOP_FULL_V1` — Complete 10-module closed-loop lifecycle.
2. `YOD_TO_RECORDING_V1` — Pre-production planning to studio session.
3. `RECORDING_TO_RESOLVED_V1` — Media ingest to resolved beats.
4. `GAP_RECOVERY_V1` — Shim gap detection to pickup resolution.
5. `VAV_STANDARD_VIDEO_V1` — Full video synthesis with cuts, captions, and motion.
6. `VAV_MINIMAL_VIDEO_V1` — Fast-path cut and master render.
7. `LONGFORM_TO_SHORT_V1` — Longform intake to short-form short batches.
8. `OUT_OF_SYNC_REPAIR_V1` — Upstream change invalidation and targeted re-render.
9. `PUBLISH_MULTI_TARGET_V1` — Multi-platform distribution and snapshot freeze.
10. `METRICS_TO_LEARNING_V1` — Telemetry normalization to YOD learning signals.
11. `EXTERNAL_EDITOR_ROUNDTRIP_V1` — NLE EDL export to DaVinci edit and re-import.
