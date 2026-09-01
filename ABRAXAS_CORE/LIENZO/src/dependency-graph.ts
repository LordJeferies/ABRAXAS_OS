/**
 * ABRAXAS Lienzo Dependency & Impact Analysis Engine
 * Evaluates transitive downstream dependencies and applies deterministic OUT_OF_SYNC transitions.
 */

import {
  LienzoComponent,
  LienzoDependency,
  LienzoComponentStatus,
  ImpactItem,
  ImpactReport
} from "./types.js";
import { LienzoValidationError } from "./errors.js";

const OUT_OF_SYNC_TARGET_STATUSES = new Set<LienzoComponentStatus>([
  "APPROVED",
  "LOCKED",
  "GENERATING",
  "GENERATED",
  "READY",
  "DONE"
]);

export interface DependencyGraph {
  downstreamAdj: Map<string, string[]>;
  upstreamAdj: Map<string, string[]>;
}

export function buildDependencyGraph(
  components: LienzoComponent[],
  dependencies: LienzoDependency[]
): DependencyGraph {
  const downstreamAdj = new Map<string, string[]>();
  const upstreamAdj = new Map<string, string[]>();

  for (const c of components) {
    downstreamAdj.set(c.componentId, []);
    upstreamAdj.set(c.componentId, []);
  }

  for (const dep of dependencies) {
    downstreamAdj.get(dep.upstreamComponentId)?.push(dep.downstreamComponentId);
    upstreamAdj.get(dep.downstreamComponentId)?.push(dep.upstreamComponentId);
  }

  return { downstreamAdj, upstreamAdj };
}

/**
 * Returns all transitive downstream component IDs in BFS/topological order.
 */
export function getTransitiveDownstream(
  graph: DependencyGraph,
  upstreamComponentId: string
): string[] {
  const result: string[] = [];
  const visited = new Set<string>();
  const queue: string[] = [upstreamComponentId];
  visited.add(upstreamComponentId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = graph.downstreamAdj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        result.push(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

/**
 * Calculates downstream impact when an upstream component is mutated.
 * Components in approved/locked/generated/ready/done states become OUT_OF_SYNC.
 * Fails closed if triggeringComponentId is not found.
 */
export function calculateImpact(
  components: LienzoComponent[],
  dependencies: LienzoDependency[],
  triggeringComponentId: string,
  reason: string
): ImpactReport {
  const componentMap = new Map<string, LienzoComponent>(components.map((c) => [c.componentId, c]));

  if (!componentMap.has(triggeringComponentId)) {
    throw new LienzoValidationError(
      `Triggering component "${triggeringComponentId}" not found in Lienzo components`,
      "triggeringComponentId"
    );
  }

  const graph = buildDependencyGraph(components, dependencies);
  const downstreamIds = getTransitiveDownstream(graph, triggeringComponentId);

  const affectedComponents: ImpactItem[] = [];

  for (const downId of downstreamIds) {
    const comp = componentMap.get(downId);
    if (!comp) continue;

    const prevStatus = comp.status;
    let newStatus = prevStatus;

    if (OUT_OF_SYNC_TARGET_STATUSES.has(prevStatus)) {
      newStatus = "OUT_OF_SYNC";
    }

    affectedComponents.push({
      componentId: downId,
      previousStatus: prevStatus,
      newStatus,
      reason: `Upstream component "${triggeringComponentId}" mutated: ${reason}`
    });
  }

  return {
    triggeringComponentId,
    affectedComponents,
    timestamp: new Date().toISOString()
  };
}
