/**
 * ABRAXAS Pipeline Engine Types
 */

export interface PipelineNode {
  nodeId: string;
  moduleType: string;
  isHumanReview?: boolean | undefined;
  canSkip?: boolean | undefined;
}

export interface PipelineEdge {
  fromNodeId: string;
  toNodeId: string;
}

export interface PipelineDefinition {
  pipelineId: string;
  version: number;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

export type PipelineNodeStatus = "PENDING" | "RUNNING" | "COMPLETED" | "SKIPPED" | "FAILED";

export interface PipelineExecutionResult {
  executionId: string;
  pipelineId: string;
  nodeResults: Record<string, { status: PipelineNodeStatus; output?: unknown; error?: string }>;
  overallStatus: "COMPLETED" | "FAILED" | "BLOCKED_ON_HUMAN_REVIEW";
}
