import type {CutPlan, EditLock, CutInvalidationResult} from "./types.ts";

export type ArtifactRef = Readonly<{
  artifactId: string;
  contentId: string;
  type: string;
  version: number;
  createdBy: string;
  createdAt: string;
  basedOn?: string | undefined;
  pathOrUri: string;
  status: string;
}>;

export type EventEnvelope = Readonly<{
  eventId: string;
  contentId: string;
  component: string;
  actor: string;
  timestamp: string;
  previousVersion: number | null;
  newVersion: number;
  reason: string;
  metadata?: Record<string, unknown> | undefined;
}>;

export type LienzoEditLayerWriteback = Readonly<{
  cutPlanRef: string;
  cutPlanVersion: number;
  editLockRef: string;
  editLockVersion: number;
  timeMappingHash: string;
  durationUs: number;
  status: "DRAFT" | "LOCKED" | "OUT_OF_SYNC";
  outOfSyncDerivatives: readonly string[];
  lastModifiedAt: string;
}>;

export const createCutPlanArtifact = (cutPlan: CutPlan, uri: string): ArtifactRef => ({
  artifactId: `art_cutplan_${cutPlan.contentId}_v${cutPlan.version}`,
  contentId: cutPlan.contentId,
  type: "cut_plan",
  version: cutPlan.version,
  createdBy: cutPlan.provenance.createdBy,
  createdAt: cutPlan.provenance.createdAt,
  pathOrUri: uri,
  status: cutPlan.provenance.status
});

export const createEditLockArtifact = (editLock: EditLock, uri: string): ArtifactRef => ({
  artifactId: `art_editlock_${editLock.contentId}_v${editLock.cutPlanVersion}`,
  contentId: editLock.contentId,
  type: "edit_lock",
  version: editLock.cutPlanVersion,
  createdBy: editLock.lockedBy,
  createdAt: editLock.lockedAt,
  basedOn: editLock.cutPlanId,
  pathOrUri: uri,
  status: "LOCKED"
});

export const createCutPlanCreatedEvent = (cutPlan: CutPlan, actor: string = "VAV_CUTS"): EventEnvelope => ({
  eventId: `evt_cutplan_${cutPlan.contentId}_v${cutPlan.version}_${Date.now()}`,
  contentId: cutPlan.contentId,
  component: "VAV_CUTS",
  actor,
  timestamp: new Date().toISOString(),
  previousVersion: cutPlan.version > 1 ? cutPlan.version - 1 : null,
  newVersion: cutPlan.version,
  reason: "CUT_PLAN_CREATED",
  metadata: {cutPlanId: cutPlan.cutPlanId, deliverableId: cutPlan.deliverableId}
});

export const createEditLockCreatedEvent = (editLock: EditLock, actor: string = "VAV_CUTS"): EventEnvelope => ({
  eventId: `evt_editlock_${editLock.contentId}_v${editLock.cutPlanVersion}_${Date.now()}`,
  contentId: editLock.contentId,
  component: "VAV_CUTS",
  actor,
  timestamp: new Date().toISOString(),
  previousVersion: editLock.cutPlanVersion > 1 ? editLock.cutPlanVersion - 1 : null,
  newVersion: editLock.cutPlanVersion,
  reason: "EDIT_LOCK_CREATED",
  metadata: {editLockId: editLock.editLockId, timeMappingHash: editLock.timeMappingHash}
});

export const createDerivativeOutOfSyncEvent = (invalidation: CutInvalidationResult, contentId: string, actor: string = "PIPELINE_ENGINE"): EventEnvelope => ({
  eventId: `evt_invalidation_${contentId}_${Date.now()}`,
  contentId,
  component: "PIPELINE_ENGINE",
  actor,
  timestamp: invalidation.timestamp,
  previousVersion: null,
  newVersion: 0,
  reason: invalidation.reason,
  metadata: {
    previousLockId: invalidation.previousLockId,
    newLockId: invalidation.newLockId,
    invalidatedDerivatives: invalidation.invalidatedDerivatives
  }
});

export const createLienzoEditLayerWriteback = (
  cutPlan: CutPlan,
  editLock: EditLock,
  invalidation?: CutInvalidationResult | undefined
): LienzoEditLayerWriteback => ({
  cutPlanRef: cutPlan.cutPlanId,
  cutPlanVersion: cutPlan.version,
  editLockRef: editLock.editLockId,
  editLockVersion: editLock.cutPlanVersion,
  timeMappingHash: editLock.timeMappingHash,
  durationUs: editLock.timebase.durationUs,
  status: "LOCKED",
  outOfSyncDerivatives: invalidation ? invalidation.invalidatedDerivatives : [],
  lastModifiedAt: new Date().toISOString()
});
