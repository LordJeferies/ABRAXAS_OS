import { describe, it, expect } from "vitest";
import { PipelineEngine } from "../src/pipeline-engine.js";
import { PipelineDefinition } from "../src/types.js";

describe("Pipeline Engine V1 — Modular DAG Orchestration", () => {
  const VIDEO_STANDARD_V1: PipelineDefinition = {
    pipelineId: "VIDEO_STANDARD_V1",
    version: 1,
    nodes: [
      { nodeId: "node_shim", moduleType: "SHIM" },
      { nodeId: "node_human_res", moduleType: "HUMAN_RESOLUTION", isHumanReview: true },
      { nodeId: "node_cuts", moduleType: "CUTS" },
      { nodeId: "node_captions", moduleType: "CAPTIONS", canSkip: true },
      { nodeId: "node_motions", moduleType: "SIMPLE_MOTION", canSkip: true },
      { nodeId: "node_qa", moduleType: "QA", isHumanReview: true },
      { nodeId: "node_render", moduleType: "RENDER" }
    ],
    edges: [
      { fromNodeId: "node_shim", toNodeId: "node_human_res" },
      { fromNodeId: "node_human_res", toNodeId: "node_cuts" },
      { fromNodeId: "node_cuts", toNodeId: "node_captions" },
      { fromNodeId: "node_captions", toNodeId: "node_motions" },
      { fromNodeId: "node_motions", toNodeId: "node_qa" },
      { fromNodeId: "node_qa", toNodeId: "node_render" }
    ]
  };

  const VIDEO_MINIMAL_V1: PipelineDefinition = {
    pipelineId: "VIDEO_MINIMAL_V1",
    version: 1,
    nodes: [
      { nodeId: "node_cuts", moduleType: "CUTS" },
      { nodeId: "node_render", moduleType: "RENDER" }
    ],
    edges: [{ fromNodeId: "node_cuts", toNodeId: "node_render" }]
  };

  it("executes the same module types in two different pipeline compositions successfully", async () => {
    const engine = new PipelineEngine();

    // Execute standard pipeline
    const stdResult = await engine.executePipeline(VIDEO_STANDARD_V1, {});
    expect(stdResult.overallStatus).toBe("COMPLETED");
    expect(Object.keys(stdResult.nodeResults).length).toBe(7);

    // Execute minimal pipeline
    const minResult = await engine.executePipeline(VIDEO_MINIMAL_V1, {});
    expect(minResult.overallStatus).toBe("COMPLETED");
    expect(Object.keys(minResult.nodeResults).length).toBe(2);
  });

  it("rejects invalid pipeline DAG containing cycles", () => {
    const engine = new PipelineEngine();
    const cyclicPipeline: PipelineDefinition = {
      pipelineId: "CYCLIC_PIPELINE",
      version: 1,
      nodes: [
        { nodeId: "A", moduleType: "CUTS" },
        { nodeId: "B", moduleType: "CAPTIONS" }
      ],
      edges: [
        { fromNodeId: "A", toNodeId: "B" },
        { fromNodeId: "B", toNodeId: "A" }
      ]
    };

    expect(() => engine.validatePipeline(cyclicPipeline)).toThrow(/Cycle detected/);
  });

  it("supports skipping allowed nodes and propagates failure to dependent nodes", async () => {
    const engine = new PipelineEngine();

    // 1. Skip captions and motions
    const skipResult = await engine.executePipeline(VIDEO_STANDARD_V1, {
      skipNodes: ["node_captions", "node_motions"]
    });
    expect(skipResult.nodeResults["node_captions"]?.status).toBe("SKIPPED");
    expect(skipResult.nodeResults["node_motions"]?.status).toBe("SKIPPED");

    // 2. Failure at Cuts stops dependent nodes
    const failResult = await engine.executePipeline(VIDEO_STANDARD_V1, {
      failNodes: ["node_cuts"]
    });
    expect(failResult.overallStatus).toBe("FAILED");
    expect(failResult.nodeResults["node_cuts"]?.status).toBe("FAILED");
    expect(failResult.nodeResults["node_captions"]?.status).toBe("SKIPPED");
    expect(failResult.nodeResults["node_render"]?.status).toBe("SKIPPED");
  });
});
