import type {Approval, Deadline, DeadlineEvaluation, DeadlineRiskState, Dependency, DependencyOverride, Task, TaskAssignment} from "./types.ts";
import {evaluateTaskDependencies} from "./dependencies.ts";

export const evaluateDeadline = (
  deadline: Deadline,
  targetTask: Task | undefined,
  allTasks: readonly Task[] = [],
  dependencies: readonly Dependency[] = [],
  overrides: readonly DependencyOverride[] = [],
  approvals: readonly Approval[] = [],
  assignments: readonly TaskAssignment[] = [],
  nowIso: string = new Date().toISOString()
): DeadlineEvaluation => {
  const now = new Date(nowIso).getTime();
  const due = new Date(deadline.dueAt).getTime();
  const diffHours = (due - now) / (1000 * 60 * 60);

  const riskReasons: string[] = [];

  if (deadline.status === "COMPLETED" || targetTask?.status === "DONE") {
    return {
      deadlineId: deadline.deadlineId,
      targetType: deadline.targetType,
      targetId: deadline.targetId,
      dueAt: deadline.dueAt,
      riskState: "COMPLETED",
      riskReasons: [],
      hoursRemaining: diffHours
    };
  }

  const isBlocked = targetTask
    ? evaluateTaskDependencies(targetTask, allTasks, dependencies, overrides, approvals, assignments).isBlocked
    : false;

  // Severity precedence: COMPLETED -> OVERDUE -> DUE_SOON -> AT_RISK -> ON_TRACK
  let riskState: DeadlineRiskState = "ON_TRACK";

  if (diffHours < 0) {
    riskState = "OVERDUE";
    riskReasons.push(`Deadline expired ${Math.abs(Math.round(diffHours))} hours ago`);
    if (isBlocked) {
      riskReasons.push("Target task is also BLOCKED by upstream dependencies");
    }
  } else if (diffHours <= 48) {
    riskState = "DUE_SOON";
    riskReasons.push(`Due within ${Math.round(diffHours)} hours`);
    if (isBlocked) {
      riskReasons.push("Target task is currently BLOCKED by upstream dependencies");
    }
  } else if (isBlocked || targetTask?.status === "BLOCKED") {
    riskState = "AT_RISK";
    riskReasons.push("Target task is currently BLOCKED by upstream dependencies");
  }

  return {
    deadlineId: deadline.deadlineId,
    targetType: deadline.targetType,
    targetId: deadline.targetId,
    dueAt: deadline.dueAt,
    riskState,
    riskReasons,
    hoursRemaining: diffHours
  };
};
