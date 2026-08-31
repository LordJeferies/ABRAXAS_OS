import type {EditLock} from "@vav/cut-domain";
import {
  validateMotionPlan,
  getMotionPreset,
  type MotionAssignment,
  type MotionPlan,
  type SimpleMotionFamilyId,
  type TextOwnership
} from "@vav/visual-motion-domain";
import {defaultPolicyForMotion} from "@vav/motion-caption-policy";
import {parseRationalFps, usToFrame} from "@vav/timebase";

export type EditorialMotionIntent = Readonly<{
  intentId: string;
  timelineStartUs: number;
  timelineEndUs: number;
  role: "HOOK" | "DEVELOPMENT" | "PAYOFF" | "CTA";
  suggestedFamily?: SimpleMotionFamilyId | undefined;
  suggestedPresetId?: string | undefined;
  parameters?: Record<string, number | string | boolean> | undefined;
}>;

export type ResolveMotionPlanInput = Readonly<{
  motionPlanId?: string | undefined;
  version?: number | undefined;
  contentId: string;
  deliverableId: string;
  editLock: EditLock;
  intents?: readonly EditorialMotionIntent[] | undefined;
  defaultOwnership?: TextOwnership | undefined;
  createdBy?: string | undefined;
}>;

export const resolveMotionPlan = (input: ResolveMotionPlanInput): MotionPlan => {
  const {editLock} = input;
  const fps = parseRationalFps(editLock.timebase.fpsRational);
  const totalDurationUs = editLock.timebase.durationUs;

  const assignments: MotionAssignment[] = [];
  const intents = input.intents ?? [];

  for (let i = 0; i < intents.length; i++) {
    const it = intents[i]!;
    const startUs = Math.max(0, it.timelineStartUs);
    const endUs = Math.min(totalDurationUs, it.timelineEndUs);
    if (endUs <= startUs) continue;

    // Resolve preset ONLY if explicitly suggested
    const resolvedPreset = it.suggestedPresetId ? getMotionPreset(it.suggestedPresetId) : undefined;
    const familyId: SimpleMotionFamilyId = it.suggestedFamily ?? resolvedPreset?.motionFamilyId ?? (
      it.role === "HOOK" ? "MOT_PUSH_IN" :
      it.role === "PAYOFF" ? "MOT_ZOOM_IN" :
      "MOT_ZOOM_OUT"
    );

    const startFrame = usToFrame(startUs, fps);
    const endFrame = usToFrame(endUs, fps);

    // Neutral baseline parameters when no preset or explicit parameters are supplied
    const neutralParameters: Record<string, number | string | boolean> = {
      startScale: 1.0,
      endScale: 1.0,
      translateXPercent: 0,
      scale: 1.0,
      deltaX: 0,
      deltaY: 0,
      direction: "LEFT_TO_RIGHT",
      foregroundMultiplier: 1.0,
      mode: "NONE"
    };

    const appliedParameters = it.parameters ?? (resolvedPreset ? {...resolvedPreset.parameters} : neutralParameters);

    assignments.push({
      assignmentId: `asg_${i + 1}_${familyId.toLowerCase()}`,
      motionFamilyId: familyId,
      presetId: resolvedPreset?.presetId, // undefined if intent was family-only
      timelineRange: {
        startUs,
        endUs,
        startFrame,
        endFrame
      },
      parameters: appliedParameters,
      priority: it.role === "HOOK" ? 100 : 50,
      visualOwnership: input.defaultOwnership ?? "visual-motion",
      captionPolicy: resolvedPreset?.captionPolicy ?? defaultPolicyForMotion(familyId),
      editorialIntentRef: it.intentId,
      provenance: {
        createdBy: input.createdBy ?? "VAV_MOTIONS_V1",
        createdAt: new Date().toISOString()
      }
    });
  }

  const motionPlan: MotionPlan = {
    motionPlanId: input.motionPlanId ?? `motion_plan_${input.contentId}_v${input.version ?? 1}`,
    version: input.version ?? 1,
    contentId: input.contentId,
    deliverableId: input.deliverableId,
    editLockId: editLock.editLockId,
    timeMappingHash: editLock.timeMappingHash,
    canvas: {
      width: editLock.timebase.width,
      height: editLock.timebase.height,
      fpsRational: editLock.timebase.fpsRational,
      totalDurationUs
    },
    assignments,
    provenance: {
      createdBy: input.createdBy ?? "VAV_MOTIONS_V1",
      createdAt: new Date().toISOString(),
      status: "DRAFT"
    }
  };

  validateMotionPlan(motionPlan, editLock.editLockId, editLock.timeMappingHash);
  return motionPlan;
};
