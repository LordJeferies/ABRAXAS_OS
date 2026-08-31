import type {Approval, ApprovalDecision, TeamMember} from "./types.ts";
import {hasPermission, SecurityError} from "./rbac.ts";

export class ApprovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApprovalError";
  }
}

export const validateApprovalDecision = (
  approval: Approval,
  decision: ApprovalDecision,
  actor: TeamMember,
  nowIso: string,
  comments?: string
): Approval => {
  const validDecisions: ApprovalDecision[] = ["APPROVED", "CHANGES_REQUESTED", "REJECTED"];
  if (!validDecisions.includes(decision)) {
    throw new ApprovalError(`Invalid approval decision '${decision}'. decideApproval accepts only 'APPROVED', 'CHANGES_REQUESTED', or 'REJECTED'. Use cancelApproval() for cancellation.`);
  }

  const isDesignatedReviewer = approval.reviewers.includes(actor.userId);
  const hasDecideAny = hasPermission(actor, "approval.decide_any");
  const hasDecide = hasPermission(actor, "approval.decide");

  if (!hasDecideAny && !(hasDecide && isDesignatedReviewer)) {
    throw new SecurityError(`Actor '${actor.userId}' lacks authorization to decide approval '${approval.approvalId}'. Requires designated reviewer with 'approval.decide' or 'approval.decide_any'.`);
  }

  if (approval.decision !== "PENDING") {
    throw new ApprovalError(`Approval '${approval.approvalId}' is already resolved with status '${approval.decision}'.`);
  }

  return {
    ...approval,
    decision,
    comments: comments ?? approval.comments,
    decidedAt: nowIso,
    decidedBy: actor.userId,
    version: approval.version + 1
  };
};
