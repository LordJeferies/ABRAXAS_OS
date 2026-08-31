import type {MotionPlan, MotionInvalidationResult} from "./types.ts";

export type MotionArtifactRef = Readonly<{
  artifactId: string;
  contentId: string;
  type: "motion_plan" | "motion_preview" | "motion_render";
  version: number;
  createdBy: string;
  createdAt: string;
  basedOnLock: string;
  pathOrUri: string;
  status: string;
}>;

export type MotionEventEnvelope = Readonly<{
  eventId: string;
  contentId: string;
  component: "VAV_MOTIONS" | "PIPELINE_ENGINE";
  actor: string;
  timestamp: string;
  reason: string;
  metadata?: Record<string, unknown> | undefined;
}>;

export type LienzoMotionsLayerWriteback = Readonly<{
  motionPlanRef: string;
  motionPlanVersion: number;
  editLockRef: string;
  timeMappingHash: string;
  assignmentCount: number;
  status: "DRAFT" | "LOCKED" | "OUT_OF_SYNC";
  lastModifiedAt: string;
}>;

export const createMotionPlanArtifact = (plan: MotionPlan, uri: string): MotionArtifactRef => ({
  artifactId: `art_motionplan_${plan.contentId}_v${plan.version}`,
  contentId: plan.contentId,
  type: "motion_plan",
  version: plan.version,
  createdBy: plan.provenance.createdBy,
  createdAt: plan.provenance.createdAt,
  basedOnLock: plan.editLockId,
  pathOrUri: uri,
  status: plan.provenance.status
});

export const createMotionPlanCreatedEvent = (plan: MotionPlan, actor: string = "VAV_MOTIONS"): MotionEventEnvelope => ({
  eventId: `evt_motionplan_${plan.contentId}_v${plan.version}_${Date.now()}`,
  contentId: plan.contentId,
  component: "VAV_MOTIONS",
  actor,
  timestamp: new Date().toISOString(),
  reason: "MOTION_PLAN_CREATED",
  metadata: {motionPlanId: plan.motionPlanId, editLockId: plan.editLockId}
});

export const createMotionOutOfSyncEvent = (inv: MotionInvalidationResult, contentId: string): MotionEventEnvelope => ({
  eventId: `evt_motion_outofsync_${contentId}_${Date.now()}`,
  contentId,
  component: "PIPELINE_ENGINE",
  actor: "PIPELINE_ENGINE",
  timestamp: inv.timestamp,
  reason: inv.reason,
  metadata: {motionPlanId: inv.motionPlanId, expectedLockId: inv.expectedLockId, currentLockId: inv.currentLockId}
});

export const createLienzoMotionsLayerWriteback = (
  plan: MotionPlan,
  isOutOfSync: boolean = false
): LienzoMotionsLayerWriteback => ({
  motionPlanRef: plan.motionPlanId,
  motionPlanVersion: plan.version,
  editLockRef: plan.editLockId,
  timeMappingHash: plan.timeMappingHash,
  assignmentCount: plan.assignments.length,
  status: isOutOfSync ? "OUT_OF_SYNC" : "LOCKED",
  lastModifiedAt: new Date().toISOString()
});
