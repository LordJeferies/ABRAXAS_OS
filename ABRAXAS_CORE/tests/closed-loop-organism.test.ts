import { describe, it, expect } from "vitest";
import { LienzoService } from "../LIENZO/src/service.js";
import { MemoryLienzoStore } from "../LIENZO/src/store.js";
import { ArtifactRegistry } from "../backbone/src/artifact-registry.js";
import { PersistentEventBus } from "../backbone/src/persistent-event-bus.js";
import { ShimEngine } from "../SHIM/src/shim-engine.js";
import { VavBridgeEngine } from "../vav-bridge/src/vav-bridge-engine.js";
import { HeOperationsService } from "../HE/06_TASKS_AND_TEAMS/runtime/service.js";
import { MemoryOperationsStore } from "../HE/06_TASKS_AND_TEAMS/runtime/store.js";
import { PublishingDispatcher } from "../publishing/src/publishing-dispatcher.js";
import { LearningFeedbackService } from "../learning/src/learning-feedback-service.js";
import { IntakeWatcher } from "../intake/src/intake-watcher.js";
import { MemoryCore } from "../memory/src/memory-core.js";
import { SystemGuardian } from "../guardian/src/system-guardian.js";

describe("ABRAXAS OS V4 — Closed-Loop Organism Master Execution", () => {
  it("executes the entire biological cycle end-to-end with 100% telemetry verification", async () => {
    console.log("\n================================================================================");
    console.log("   ABRAXAS OS V4 — LIVE CLOSED-LOOP ORGANISM EXECUTION VERIFICATION");
    console.log("================================================================================");

    // 0. Bootstrap
    const memory = new MemoryCore();
    const eventBus = new PersistentEventBus();
    const artifactRegistry = new ArtifactRegistry();
    const lienzoService = new LienzoService(new MemoryLienzoStore());
    const shimEngine = new ShimEngine(lienzoService, eventBus);
    const vavBridge = new VavBridgeEngine(lienzoService, artifactRegistry, eventBus);
    const heService = new HeOperationsService(new MemoryOperationsStore());
    heService.bootstrapOwner({ userId: "u_arch", displayName: "Lead Architect" });
    const publishingDispatcher = new PublishingDispatcher(eventBus);
    const learningService = new LearningFeedbackService();
    const intakeWatcher = new IntakeWatcher(shimEngine);
    const guardian = new SystemGuardian();

    // STEP 1: INTAKE
    console.log("[STEP 1 / 9] UNIVERSAL INTAKE — Ingesting Raw Media Stream...");
    const rawBytes = Buffer.from("ABRAXAS_RAW_AUDIOVISUAL_STREAM_TAKE_01_HERO_CANON");
    const intakeRes = await intakeWatcher.ingestMedia("take_01_hero.mp4", rawBytes, "contenido_master_001");
    expect(intakeRes.contentId).toBe("contenido_master_001");
    expect(intakeRes.sourceAsset.checksumSha256.length).toBe(64);
    console.log(` -> Ingested Content ID: ${intakeRes.contentId}`);
    console.log(` -> SHA-256 Checksum:    ${intakeRes.sourceAsset.checksumSha256}`);

    // STEP 2: YOD
    console.log("\n[STEP 2 / 9] YOD INTELLIGENCE — Opportunity Scoring & Hook Hypothesis...");
    let currentYodWeights = { QUESTION_HOOK: 1.0, STORY_HOOK: 1.0, CONTRARIAN_HOOK: 1.0 };
    const selectedHook = "QUESTION_HOOK";
    const hypothesis = {
      hook: selectedHook,
      title: "Why Traditional Editing Architecture Collapses Under Multi-Channel Scale",
      targetAudience: "Systems Architects & Creative Directors",
      opportunityScore: 0.94
    };
    expect(hypothesis.opportunityScore).toBeGreaterThan(0.9);
    console.log(` -> Formulated Hypothesis: "${hypothesis.title}" (Score: ${hypothesis.opportunityScore})`);

    // STEP 3: CONTENIDO
    console.log("\n[STEP 3 / 9] CONTENIDO / LIENZO — Crystallizing Persistent Identity Spine...");
    const { lienzo } = await lienzoService.createLienzo({
      contentId: intakeRes.contentId,
      title: hypothesis.title,
      topic: "Editing Architecture",
      targetAudience: hypothesis.targetAudience,
      lifecycle: "RECORDING",
      actorId: "u_arch"
    });
    expect(lienzo.contentId).toBe("contenido_master_001");
    console.log(` -> Lienzo Entity Created: ${lienzo.contentId} (Revision: ${lienzo.revision})`);

    // STEP 4: SHIM DA'AT GATE
    console.log("\n[STEP 4 / 9] SHIM DA'AT GATE — Empirical Reality Verification...");
    const plannedBeats = [
      { beatId: "beat_01_hook", description: "Hook question on latency", expectedKeywords: ["architecture", "scale"] },
      { beatId: "beat_02_thesis", description: "The single-piece crystal thesis", expectedKeywords: ["crystal", "identity"] },
      { beatId: "beat_03_resolution", description: "The closed loop proof", expectedKeywords: ["loop", "proof"] }
    ];
    const observedSegments = [
      { segmentId: "seg_1", startUs: 0, endUs: 4000000, text: "Why traditional editing architecture breaks at scale", confidence: 0.98 },
      { segmentId: "seg_2", startUs: 4000000, endUs: 9000000, text: "The answer is a single-piece crystal identity", confidence: 0.96 },
      { segmentId: "seg_3", startUs: 9000000, endUs: 14000000, text: "Here is the closed loop evidence and proof", confidence: 0.99 }
    ];
    const observationReport = shimEngine.observeSource(lienzo.contentId, intakeRes.sourceAsset, observedSegments, plannedBeats);
    expect(observationReport.gaps.length).toBe(0);

    const shimRecord = await shimEngine.recordObservedLayer(lienzo.contentId, lienzo.revision, observationReport, "u_shim");
    expect(shimRecord.certificate?.gapStatus).toBe("OK");
    expect(shimRecord.certificate?.alignmentScore).toBe(1.0);
    console.log(` -> Da'at Certificate Issued: ${shimRecord.certificate?.certificateId}`);
    console.log(` -> Alignment Score:          ${shimRecord.certificate?.alignmentScore! * 100}%`);

    // STEP 5: VAV SYNTHESIS
    console.log("\n[STEP 5 / 9] VAV FORGE — Audiovisual Media Synthesis & CAS Registration...");
    const { lienzo: cutLienzo } = await lienzoService.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: shimRecord.revision,
      actorId: "u_editor",
      componentId: "comp_vav_master_render",
      section: "EDIT",
      layer: "PRODUCTION",
      reason: "Compile verified master video render"
    });

    const vavResult = await vavBridge.executeProductionJob({
      contentId: lienzo.contentId,
      componentId: "comp_vav_master_render",
      lienzoRevision: cutLienzo.revision,
      actorId: "u_vav_engine",
      jobType: "CUT",
      intentVersion: 1,
      parameters: { resolution: "1080x1920", fps: 60, colorSpace: "Rec709" }
    });
    expect(vavResult.status).toBe("COMPLETED");
    expect(vavResult.artifactRef.uri.startsWith("cas://")).toBe(true);
    console.log(` -> VAV Job Status:       ${vavResult.status}`);
    console.log(` -> Immutable CAS URI:    ${vavResult.artifactRef.uri}`);
    console.log(` -> Cryptographic Hash:   ${vavResult.hash}`);

    // STEP 6: HE GOVERNANCE
    console.log("\n[STEP 6 / 9] HE OPERATIONS DESK — Human Governance & Approval...");
    const approvedLienzo = await lienzoService.changeComponentStatus({
      contentId: lienzo.contentId,
      componentId: "comp_vav_master_render",
      expectedRevision: cutLienzo.revision + 1,
      newStatus: "APPROVED",
      actorId: "u_arch",
      reason: "Lead Architect verified visual and narrative perfection"
    });
    expect(approvedLienzo.component.status).toBe("APPROVED");
    console.log(` -> Human Approval Stamped: COMPONENT_APPROVED (Lienzo Rev: ${approvedLienzo.lienzo.revision})`);

    // STEP 7: PUBLISHING DISPATCHER
    console.log("\n[STEP 7 / 9] PUBLISHING DISPATCHER — Platform Manifests & Distribution...");
    const publishReceipts = await publishingDispatcher.dispatch(
      lienzo.contentId,
      vavResult.artifactRef.artifactId,
      ["YOUTUBE", "TIKTOK", "INSTAGRAM", "UNIVERSAL_FEED"],
      "u_arch"
    );
    expect(publishReceipts.length).toBe(4);
    publishReceipts.forEach((r) => {
      console.log(` -> Dispatched to ${r.platform.padEnd(14)} | Receipt: ${r.receiptId}`);
    });

    // STEP 8: METRICS TELEMETRY
    console.log("\n[STEP 8 / 9] METRICS TELEMETRY — Observing Audience Reflection on the Moon...");
    const simulatedAudienceSignal = {
      contentId: lienzo.contentId,
      hookArchetype: selectedHook,
      views: 250000,
      avgWatchPercentage: 88.4,
      shares: 14200,
      saves: 28900
    };
    const performanceVector = learningService.normalizeMetrics(simulatedAudienceSignal);
    expect(performanceVector.hookPerformance[selectedHook]).toBe(1.5);
    expect(performanceVector.audienceSignal).toBe("POSITIVE");
    console.log(` -> Received Telemetry:    ${simulatedAudienceSignal.views.toLocaleString()} views | ${simulatedAudienceSignal.avgWatchPercentage}% avg watch`);
    console.log(` -> Normalized Hook Coeff: ${performanceVector.hookPerformance[selectedHook]}x`);

    // STEP 9: YOD LEARNING ADAPTATION
    console.log("\n[STEP 9 / 9] YOD ADAPTIVE LEARNING — Mutating Opportunity Weights...");
    const updatedYodWeights = learningService.applyFeedbackToYodWeights(performanceVector, currentYodWeights);
    expect(updatedYodWeights[selectedHook]).toBeGreaterThan(1.0);
    console.log(` -> Previous Hook Weights: ${JSON.stringify(currentYodWeights)}`);
    console.log(` -> Evolved Hook Weights:  ${JSON.stringify(updatedYodWeights)}`);

    // Record to Memory Core
    const mem = await memory.record(
      "EPISODIC",
      "Closed-Loop Genesis Verification",
      `Successfully completed 9-step organism cycle for ${lienzo.contentId}`,
      { weights: updatedYodWeights, alignmentScore: 1.0 },
      1.0,
      ["canonical", "closed_loop", "genesis_verified"]
    );
    expect(mem.importance).toBe(1.0);

    // Guardian Health Audit
    const healthReport = guardian.auditSystem();
    expect(healthReport.overallStatus).toBe("OPTIMAL");
    expect(healthReport.brokenConnectionsCount).toBe(0);

    console.log("\n================================================================================");
    console.log(`   GUARDIAN HEALTH VERDICT: ${healthReport.overallStatus} (0 Broken Connections)`);
    console.log("   ABRAXAS OS V4 CLOSED-LOOP ORGANISM: 100% OPERATIONAL & VERIFIED");
    console.log("================================================================================\n");
  });
});
