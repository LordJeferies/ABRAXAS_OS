import type {Approval, ApprovalTargetType, Dependency, DependencyOverride, Task, TaskAssignment, TaskStatus} from "./types.ts";

export class DependencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DependencyError";
  }
}

const typedNodeKey = (type: string, id: string): string => `${type}:${id}`;

export const validateDependencyKindConstraints = (dep: Dependency): void => {
  const approvalTargetTypes: ApprovalTargetType[] = [
    "TASK",
    "LIENZO_COMPONENT",
    "COPY_VERSION",
    "COVER_VERSION",
    "EDIT_LOCK",
    "MOTION_PLAN",
    "PUBLICATION_TARGET"
  ];

  if (dep.dependencyKind === "BLOCKS" || dep.dependencyKind === "REQUIRES_COMPLETION") {
    if (dep.upstreamType !== "TASK" || dep.downstreamType !== "TASK") {
      throw new DependencyError(`Unsupported dependency combination in V1: '${dep.dependencyKind}' requires upstream and downstream of type 'TASK', got upstream '${dep.upstreamType}' and downstream '${dep.downstreamType}'.`);
    }
  } else if (dep.dependencyKind === "REQUIRES_APPROVAL") {
    if (!approvalTargetTypes.includes(dep.upstreamType as ApprovalTargetType) || dep.downstreamType !== "TASK") {
      throw new DependencyError(`Unsupported dependency combination in V1: 'REQUIRES_APPROVAL' requires upstream ApprovalTargetType (${approvalTargetTypes.join(", ")}) and downstream 'TASK', got upstream '${dep.upstreamType}' and downstream '${dep.downstreamType}'.`);
    }
  }
};

export const detectDependencyCycles = (
  newDep: Dependency,
  existingDeps: readonly Dependency[]
): void => {
  const adj = new Map<string, string[]>();

  for (const d of existingDeps) {
    if (d.dependencyKind === "BLOCKS" || d.dependencyKind === "REQUIRES_COMPLETION" || d.dependencyKind === "REQUIRES_APPROVAL") {
      const uKey = typedNodeKey(d.upstreamType, d.upstreamId);
      const dKey = typedNodeKey(d.downstreamType, d.downstreamId);
      const list = adj.get(uKey) ?? [];
      list.push(dKey);
      adj.set(uKey, list);
    }
  }

  if (newDep.dependencyKind === "BLOCKS" || newDep.dependencyKind === "REQUIRES_COMPLETION" || newDep.dependencyKind === "REQUIRES_APPROVAL") {
    const uKey = typedNodeKey(newDep.upstreamType, newDep.upstreamId);
    const dKey = typedNodeKey(newDep.downstreamType, newDep.downstreamId);
    const list = adj.get(uKey) ?? [];
    list.push(dKey);
    adj.set(uKey, list);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const isCyclic = (node: string): boolean => {
    visited.add(node);
    recStack.add(node);

    const neighbors = adj.get(node) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (isCyclic(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  };

  for (const node of adj.keys()) {
    if (!visited.has(node)) {
      if (isCyclic(node)) {
        throw new DependencyError(`Dependency cycle detected involving node '${newDep.upstreamType}:${newDep.upstreamId}' -> '${newDep.downstreamType}:${newDep.downstreamId}'. Blocking dependency rejected.`);
      }
    }
  }
};

export const evaluateTaskDependencies = (
  task: Task,
  allTasks: readonly Task[],
  dependencies: readonly Dependency[],
  overrides: readonly DependencyOverride[],
  approvals: readonly Approval[] = [],
  assignments: readonly TaskAssignment[] = []
): {
  isBlocked: boolean;
  waitingFor: string[];
  unresolvedBlockers: Dependency[];
  waitingForTaskIds: string[];
  waitingForUserIds: string[];
  reasons: string[];
} => {
  const taskMap = new Map(allTasks.map((t) => [t.taskId, t]));
  const overrideDepIds = new Set(overrides.filter((o) => o.targetTaskId === task.taskId).map((o) => o.dependencyId));

  const incomingDeps = dependencies.filter((d) => d.downstreamId === task.taskId && d.downstreamType === "TASK");
  const waitingFor: string[] = [];
  const unresolvedBlockers: Dependency[] = [];
  const waitingForTaskIds: string[] = [];
  const waitingForUserIds: string[] = [];
  const reasons: string[] = [];

  for (const dep of incomingDeps) {
    if (overrideDepIds.has(dep.dependencyId)) {
      continue;
    }

    if (dep.dependencyKind === "BLOCKS" || dep.dependencyKind === "REQUIRES_COMPLETION") {
      const upstream = taskMap.get(dep.upstreamId);
      const isUpstreamDone = upstream?.status === "DONE";

      if (!isUpstreamDone) {
        unresolvedBlockers.push(dep);
        waitingFor.push(upstream?.title ?? dep.upstreamId);
        waitingForTaskIds.push(dep.upstreamId);

        const upstreamAsgs = assignments.filter((a) => a.taskId === dep.upstreamId && a.status === "ACTIVE");
        for (const asg of upstreamAsgs) {
          waitingForUserIds.push(asg.userId);
        }

        reasons.push(`Awaiting completion of upstream task '${upstream?.title ?? dep.upstreamId}' (${upstream?.status ?? "UNKNOWN"})`);
      }
    } else if (dep.dependencyKind === "REQUIRES_APPROVAL") {
      const approvedApp = approvals.find(
        (a) => a.targetType === dep.upstreamType && a.targetId === dep.upstreamId && a.decision === "APPROVED"
      );

      if (!approvedApp) {
        unresolvedBlockers.push(dep);
        waitingFor.push(`Approval for ${dep.upstreamType}:${dep.upstreamId}`);
        reasons.push(`Awaiting formal approval on '${dep.upstreamType}:${dep.upstreamId}'`);
      }
    }
  }

  return {
    isBlocked: unresolvedBlockers.length > 0,
    waitingFor,
    unresolvedBlockers,
    waitingForTaskIds: Array.from(new Set(waitingForTaskIds)),
    waitingForUserIds: Array.from(new Set(waitingForUserIds)),
    reasons
  };
};

export const validateTaskStateTransition = (
  currentStatus: TaskStatus,
  nextStatus: TaskStatus,
  isBlocked: boolean,
  hasOverride: boolean
): void => {
  if (isBlocked && !hasOverride) {
    const allowedBlockedDestinations: TaskStatus[] = ["BACKLOG", "BLOCKED", "CANCELLED"];
    if (!allowedBlockedDestinations.includes(nextStatus)) {
      throw new DependencyError(`Task cannot transition to '${nextStatus}' because it has unresolved blocking dependencies without an authorized override.`);
    }
  }
};
