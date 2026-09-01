import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ALLOWED_OWNER_MODULES = new Set([
  "YOD",
  "LIENZO",
  "HE",
  "SHIM",
  "VAV",
  "ARQUITECTO",
  "PIPELINE_ENGINE",
  "AI_RUNTIME",
  "PUBLISHING",
  "METRICS",
  "UNIVERSAL_INTAKE"
]);

const ALLOWED_EXECUTION_KINDS = new Set(["AUTOMATED", "HUMAN_GATE", "EXTERNAL_TOOL"]);

describe("Pipeline Blueprint Design Registry V1 — Strict Canon & DAG Validation", () => {
  it("validates that all 11 canonical seed blueprints conform strictly to normalized owner modules and valid DAG topology", () => {
    const registryPath = path.resolve(__dirname, "../PIPELINE_BLUEPRINT_REGISTRY_V1.json");
    expect(fs.existsSync(registryPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
    expect(data.registryClassification).toBe("DESIGN_REGISTRY");
    expect(data.executionState).toBe("NOT_RUNTIME_EXECUTABLE");
    expect(data.blueprints.length).toBe(11);

    for (const bp of data.blueprints) {
      expect(bp.stages.length).toBeGreaterThan(0);
      expect(bp.supportedScopes.length).toBeGreaterThan(0);

      const stageIdSet = new Set<string>();

      for (const stage of bp.stages) {
        // Unique stage IDs
        expect(stageIdSet.has(stage.stageId)).toBe(false);
        stageIdSet.add(stage.stageId);

        // Owner module & execution kind validation
        expect(ALLOWED_OWNER_MODULES.has(stage.ownerModule)).toBe(true);
        expect(ALLOWED_EXECUTION_KINDS.has(stage.executionKind)).toBe(true);
        expect(stage.title).toBeDefined();
        expect(stage.operation).toBeDefined();
        expect(Array.isArray(stage.requiredInputs)).toBe(true);
        expect(Array.isArray(stage.emittedOutputs)).toBe(true);
      }

      // Edge validation (valid endpoints and no self loops)
      for (const edge of bp.edges) {
        expect(stageIdSet.has(edge.fromStageId)).toBe(true);
        expect(stageIdSet.has(edge.toStageId)).toBe(true);
        expect(edge.fromStageId).not.toBe(edge.toStageId);
      }

      // Cycle detection (Topological sort verification)
      const inDegree = new Map<string, number>();
      const adj = new Map<string, string[]>();

      for (const sId of stageIdSet) {
        inDegree.set(sId, 0);
        adj.set(sId, []);
      }

      for (const edge of bp.edges) {
        adj.get(edge.fromStageId)!.push(edge.toStageId);
        inDegree.set(edge.toStageId, inDegree.get(edge.toStageId)! + 1);
      }

      const queue: string[] = [];
      for (const [sId, deg] of inDegree.entries()) {
        if (deg === 0) queue.push(sId);
      }

      let visitedCount = 0;
      while (queue.length > 0) {
        const u = queue.shift()!;
        visitedCount++;
        for (const v of adj.get(u)!) {
          const newDeg = inDegree.get(v)! - 1;
          inDegree.set(v, newDeg);
          if (newDeg === 0) queue.push(v);
        }
      }

      expect(visitedCount).toBe(stageIdSet.size); // Must be a valid DAG with 0 cycles
    }
  });

  it("verifies semantic input satisfiability across alternative execution paths in VAV_STANDARD_VIDEO_V1", () => {
    const registryPath = path.resolve(__dirname, "../PIPELINE_BLUEPRINT_REGISTRY_V1.json");
    const data = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
    const vavStandard = data.blueprints.find((b: any) => b.blueprintId === "VAV_STANDARD_VIDEO_V1");
    expect(vavStandard).toBeDefined();

    // Helper to evaluate if a stage's inputs are satisfied given available artifacts
    function isStageSatisfiable(stage: any, availableArtifacts: Set<string>): boolean {
      if (stage.requiredInputs.every((i: string) => availableArtifacts.has(i))) {
        return true;
      }
      if (stage.acceptedInputAlternatives && Array.isArray(stage.acceptedInputAlternatives)) {
        return stage.acceptedInputAlternatives.some((alt: string[]) =>
          alt.every((i: string) => availableArtifacts.has(i))
        );
      }
      return false;
    }

    // Path 1: WITH_CAPTIONS (Full path)
    const artifactsP1 = new Set<string>(["ResolvedLayer"]);
    for (const stage of vavStandard.stages) {
      expect(isStageSatisfiable(stage, artifactsP1)).toBe(true);
      stage.emittedOutputs.forEach((out: string) => artifactsP1.add(out));
    }
    expect(artifactsP1.has("QAResult")).toBe(true);

    // Path 2: WITHOUT_CAPTIONS (s_caption skipped)
    const artifactsP2 = new Set<string>(["ResolvedLayer"]);
    for (const stage of vavStandard.stages) {
      if (stage.stageId === "s_caption") continue; // Skip caption stage
      expect(isStageSatisfiable(stage, artifactsP2)).toBe(true);
      stage.emittedOutputs.forEach((out: string) => artifactsP2.add(out));
    }
    expect(artifactsP2.has("QAResult")).toBe(true);

    // Path 3: WITHOUT_CAPTIONS_OR_MOTIONS (s_caption and s_motion skipped)
    const artifactsP3 = new Set<string>(["ResolvedLayer"]);
    for (const stage of vavStandard.stages) {
      if (stage.stageId === "s_caption" || stage.stageId === "s_motion") continue;
      expect(isStageSatisfiable(stage, artifactsP3)).toBe(true);
      stage.emittedOutputs.forEach((out: string) => artifactsP3.add(out));
    }
    expect(artifactsP3.has("QAResult")).toBe(true);
  });
});
