import type {TargetRef} from "./types.ts";

export type VavOperationalEvent =
  | {eventType: "EDIT_LOCK_CREATED"; editLockId: string; contentId: string; deliverableId: string; lockedBy: string; timestamp: string}
  | {eventType: "DERIVATIVE_OUT_OF_SYNC"; previousLockId: string; newLockId: string; invalidatedDerivatives: readonly string[]; timestamp: string}
  | {eventType: "RENDER_COMPLETED"; outputMp4Path: string; contentId: string; deliverableId: string; timestamp: string};

export type HeOperationalSuggestion = Readonly<{
  suggestionId: string;
  sourceEvent: VavOperationalEvent;
  recommendedAction: "UNBLOCK_TASK" | "MARK_NEEDS_REVIEW" | "READY_FOR_QA";
  targetRef: TargetRef;
  rationale: string;
}>;

export const translateVavEventToHeSuggestion = (
  event: VavOperationalEvent,
  idProvider: (prefix: string) => string = (p) => `${p}_${Date.now()}`
): HeOperationalSuggestion => {
  switch (event.eventType) {
    case "EDIT_LOCK_CREATED":
      return {
        suggestionId: idProvider("sug_lock"),
        sourceEvent: event,
        recommendedAction: "UNBLOCK_TASK",
        targetRef: {targetType: "LIENZO", targetId: event.contentId, component: "EDIT_LOCK"},
        rationale: `EditLock '${event.editLockId}' was locked by '${event.lockedBy}'. Downstream motion/color review tasks can now be unblocked.`
      };

    case "DERIVATIVE_OUT_OF_SYNC":
      return {
        suggestionId: idProvider("sug_sync"),
        sourceEvent: event,
        recommendedAction: "MARK_NEEDS_REVIEW",
        targetRef: {targetType: "LIENZO", targetId: event.previousLockId, component: "DERIVATIVES"},
        rationale: `Derivatives (${event.invalidatedDerivatives.join(", ")}) were invalidated by a CutPlan modification. Operational tasks must be reviewed.`
      };

    case "RENDER_COMPLETED":
      return {
        suggestionId: idProvider("sug_render"),
        sourceEvent: event,
        recommendedAction: "READY_FOR_QA",
        targetRef: {targetType: "PUBLICATION_TARGET", targetId: event.deliverableId, component: "MP4_RENDER"},
        rationale: `Render completed at '${event.outputMp4Path}'. QA verification task is now READY.`
      };
  }
};
