/**
 * Pipeline Engine — Deterministic DAG Orchestrator
 */

import { randomUUID } from "node:crypto";
import {
  PipelineDefinition,
  PipelineExecutionResult,
  PipelineNodeStatus
} from "./types.js";

export class PipelineEngine {
  public validatePipeline(pipeline: PipelineDefinition): void {
    const nodeIds = new Set(pipeline.nodes.map((n) => n.nodeId));
    const adj = new Map<string, string[]>();
    for (const id of nodeIds) adj.set(id, []);

    for (const edge of pipeline.edges) {
      if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
        throw new Error(`Invalid edge endpoints: ${edge.fromNodeId} -> ${edge.toNodeId}`);
      }
      if (edge.fromNodeId === edge.toNodeId) {
        throw new Error(`Self edge detected: ${edge.fromNodeId}`);
      }
      adj.get(edge.fromNodeId)?.push(edge.toNodeId);
    }

    // Cycle detection using DFS
    const visited = new Map<string, "WHITE" | "GRAY" | "BLACK">();
    for (const id of nodeIds) visited.set(id, "WHITE");

    const dfs = (u: string) => {
      visited.set(u, "GRAY");
      for (const v of adj.get(u) || []) {
        if (visited.get(v) === "GRAY") {
          throw new Error(`Cycle detected in pipeline DAG at node "${v}"`);
        }
        if (visited.get(v) === "WHITE") {
          dfs(v);
        }
      }
      visited.set(u, "BLACK");
    };

    for (const id of nodeIds) {
      if (visited.get(id) === "WHITE") dfs(id);
    }
  }

  public async executePipeline(
    pipeline: PipelineDefinition,
    context: {
      skipNodes?: string[] | undefined;
      failNodes?: string[] | undefined;
      moduleHandlers?: Record<string, (nodeId: string) => Promise<unknown>> | undefined;
    }
  ): Promise<PipelineExecutionResult> {
    this.validatePipeline(pipeline);

    const executionId = `exec_${randomUUID().slice(0, 10)}`;
    const nodeResults: Record<string, { status: PipelineNodeStatus; output?: unknown; error?: string }> = {};

    for (const n of pipeline.nodes) {
      nodeResults[n.nodeId] = { status: "PENDING" };
    }

    // Build incoming edge map
    const incoming = new Map<string, string[]>();
    for (const n of pipeline.nodes) incoming.set(n.nodeId, []);
    for (const e of pipeline.edges) incoming.get(e.toNodeId)?.push(e.fromNodeId);

    let overallStatus: "COMPLETED" | "FAILED" | "BLOCKED_ON_HUMAN_REVIEW" = "COMPLETED";

    for (const node of pipeline.nodes) {
      const upstreams = incoming.get(node.nodeId) || [];
      const upstreamBlocked = upstreams.some(
        (u) => nodeResults[u]?.status === "FAILED" || (nodeResults[u]?.status === "SKIPPED" && nodeResults[u]?.error)
      );

      if (upstreamBlocked) {
        nodeResults[node.nodeId] = { status: "SKIPPED", error: "Upstream dependency failed or blocked" };
        continue;
      }

      if (context.skipNodes?.includes(node.nodeId)) {
        if (node.canSkip) {
          nodeResults[node.nodeId] = { status: "SKIPPED" };
          continue;
        } else {
          nodeResults[node.nodeId] = { status: "FAILED", error: `Node ${node.nodeId} cannot be skipped` };
          overallStatus = "FAILED";
          continue;
        }
      }

      if (context.failNodes?.includes(node.nodeId)) {
        nodeResults[node.nodeId] = { status: "FAILED", error: `Execution failure simulated at ${node.nodeId}` };
        overallStatus = "FAILED";
        continue;
      }

      if (node.isHumanReview) {
        nodeResults[node.nodeId] = { status: "COMPLETED", output: { reviewStatus: "APPROVED" } };
        continue;
      }

      // Execute handler or default mock output
      const handler = context.moduleHandlers?.[node.moduleType];
      const output = handler ? await handler(node.nodeId) : { executed: true, moduleType: node.moduleType };

      nodeResults[node.nodeId] = { status: "COMPLETED", output };
    }

    return {
      executionId,
      pipelineId: pipeline.pipelineId,
      nodeResults,
      overallStatus
    };
  }
}
