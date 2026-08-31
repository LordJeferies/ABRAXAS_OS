import type {CutInvalidationResult, EditLock} from "@vav/cut-domain";

export const computeDerivativeInvalidation = (
  previousLock: EditLock | null,
  newLock: EditLock,
  reason: string = "CUT_PLAN_UPDATED"
): CutInvalidationResult => {
  if (!previousLock) {
    return {
      previousLockId: null,
      newLockId: newLock.editLockId,
      invalidatedDerivatives: [],
      reason: "INITIAL_LOCK_CREATED",
      timestamp: new Date().toISOString()
    };
  }

  if (
    previousLock.editLockId === newLock.editLockId &&
    previousLock.timeMappingHash === newLock.timeMappingHash &&
    previousLock.cutPlanVersion === newLock.cutPlanVersion
  ) {
    return {
      previousLockId: previousLock.editLockId,
      newLockId: newLock.editLockId,
      invalidatedDerivatives: [],
      reason: "NO_INVALIDATION",
      timestamp: new Date().toISOString()
    };
  }

  return {
    previousLockId: previousLock.editLockId,
    newLockId: newLock.editLockId,
    invalidatedDerivatives: ["CAPTIONS", "MOTIONS", "RENDER", "QC"] as const,
    reason,
    timestamp: new Date().toISOString()
  };
};
