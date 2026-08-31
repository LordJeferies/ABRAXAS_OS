import type {EditLock} from "@vav/cut-domain";
import type {MotionPlan, MotionInvalidationResult} from "@vav/visual-motion-domain";

export const checkMotionPlanLockSync = (
  motionPlan: MotionPlan,
  activeEditLock: EditLock
): MotionInvalidationResult => {
  if (
    motionPlan.editLockId === activeEditLock.editLockId &&
    motionPlan.timeMappingHash === activeEditLock.timeMappingHash
  ) {
    return {
      motionPlanId: motionPlan.motionPlanId,
      expectedLockId: activeEditLock.editLockId,
      currentLockId: motionPlan.editLockId,
      status: "CURRENT",
      reason: "EDIT_LOCK_MATCHED",
      timestamp: new Date().toISOString()
    };
  }

  return {
    motionPlanId: motionPlan.motionPlanId,
    expectedLockId: activeEditLock.editLockId,
    currentLockId: motionPlan.editLockId,
    status: "OUT_OF_SYNC",
    reason: "EDIT_LOCK_CHANGED_OR_SUPERSEDED",
    timestamp: new Date().toISOString()
  };
};
