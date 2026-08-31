import type {MotionPlan, MotionAssignment} from "./types.ts";
import {SIMPLE_MOTION_FAMILIES} from "./registry.ts";
import {parseRationalFps} from "@vav/timebase";

export class MotionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MotionValidationError";
  }
}

export const validateMotionAssignment = (
  asg: MotionAssignment,
  timelineDurationUs: number
): void => {
  if (!asg.assignmentId?.trim()) throw new MotionValidationError("assignmentId is required");
  const known = SIMPLE_MOTION_FAMILIES.some((f) => f.familyId === asg.motionFamilyId);
  if (!known) throw new MotionValidationError(`Unknown motionFamilyId: ${asg.motionFamilyId}`);
  if (asg.timelineRange.startUs < 0) {
    throw new MotionValidationError(`Assignment ${asg.assignmentId} has negative startUs`);
  }
  if (asg.timelineRange.endUs <= asg.timelineRange.startUs) {
    throw new MotionValidationError(`Assignment ${asg.assignmentId} has zero or negative duration`);
  }
  if (asg.timelineRange.endUs > timelineDurationUs) {
    throw new MotionValidationError(`Assignment ${asg.assignmentId} endUs (${asg.timelineRange.endUs}) exceeds timeline duration (${timelineDurationUs})`);
  }
};

export const validateMotionPlan = (
  plan: MotionPlan,
  expectedLockId?: string,
  expectedHash?: string
): void => {
  if (!plan.motionPlanId?.trim()) throw new MotionValidationError("motionPlanId is required");
  if (plan.version < 1) throw new MotionValidationError("MotionPlan version must be >= 1");
  if (!plan.editLockId?.trim()) throw new MotionValidationError("editLockId is required");
  if (!plan.timeMappingHash?.trim()) throw new MotionValidationError("timeMappingHash is required");

  if (expectedLockId && plan.editLockId !== expectedLockId) {
    throw new MotionValidationError(`MotionPlan editLockId mismatch: expected ${expectedLockId}, got ${plan.editLockId}`);
  }
  if (expectedHash && plan.timeMappingHash !== expectedHash) {
    throw new MotionValidationError(`MotionPlan timeMappingHash mismatch: expected ${expectedHash}, got ${plan.timeMappingHash}`);
  }

  try {
    parseRationalFps(plan.canvas.fpsRational);
  } catch (err: any) {
    throw new MotionValidationError(`Invalid canvas fpsRational: ${err.message}`);
  }

  for (const asg of plan.assignments) {
    validateMotionAssignment(asg, plan.canvas.totalDurationUs);
  }
};
