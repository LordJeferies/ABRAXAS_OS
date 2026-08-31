import { describe, it, expect, beforeEach } from "vitest";
import { LienzoService } from "../LIENZO/src/service.js";
import { MemoryLienzoStore } from "../LIENZO/src/store.js";
import { ArtifactRegistry } from "../backbone/src/artifact-registry.js";
import { EventLedger } from "../backbone/src/event-ledger.js";
import { ShimEngine } from "../SHIM/src/shim-engine.js";
import { UnverifiedRealityError } from "../SHIM/src/types.js";
import { VavBridgeEngine } from "../vav-bridge/src/vav-bridge-engine.js";
import { HeOperationsService } from "../HE/06_TASKS_AND_TEAMS/runtime/service.js";
import { MemoryOperationsStore } from "../HE/06_TASKS_AND_TEAMS/runtime/store.js";
import { ShimHeAutomationBridge } from "../HE/06_TASKS_AND_TEAMS/runtime/shim-he-automation.js";
import { PublishingDispatcher } from "../publishing/src/publishing-dispatcher.js";
import { PipelineRunner } from "../pipeline/src/pipeline-runner.js";
import { LearningFeedbackService } from "../learning/src/learning-feedback-service.js";
import { AiRuntimeService } from "../ai-runtime/src/ai-runtime-service.js";
import { IntakeWatcher } from "../intake/src/intake-watcher.js";
import { PersistentEventBus } from "../backbone/src/persistent-event-bus.js";
import { ArquitectoSystemMonitor } from "../ARQUITECTO/src/system-monitor.js";

describe("ABRAXAS OS Phase 2 — Closed-Loop Intelligence & Da'at Gate Evolution", () => {
  let lienzoStore: MemoryLienzoStore;
  let lienzoService: LienzoService;
  let artifactRegistry: ArtifactRegistry;
  let eventLedger: EventLedger;
  let shimEngine: ShimEngine;
  let vavBridge: VavBridgeEngine;
  let heService: HeOperationsService;

  beforeEach(async () => {
    lienzoStore = new MemoryLienzoStore();
    lienzoService = new LienzoService(lienzoStore);
    artifactRegistry = new ArtifactRegistry();
    eventLedger = new EventLedger();
    shimEngine = new ShimEngine(lienzoService, eventLedger);
    vavBridge = new VavBridgeEngine(lienzoService, artifactRegistry, eventLedger);

    const heStore = new MemoryOperationsStore();
    heService = new HeOperationsService(heStore);
    heService.bootstrapOwner({ userId: "u_owner", displayName: "System Architect" });
  });

  // =========================================================================
  // STAGE 1: DA'AT REALITY GATE (SHIM -> VAV)
  // =========================================================================
  describe("Stage 1: Da'at Gate Enforcement", () => {
    it("rejects VAV execution with UnverifiedRealityError when SHIM observed layer contains GAPs", async () => {
      // 1. Create Contenido
      const { lienzo: c } = await lienzoService.createLienzo({
        title: "Test Episode",
        topic: "Philosophy",
        targetAudience: "Tech",
        lifecycle: "RECORDING",
        actorId: "u_author"
      });

      // 2. Record SHIM observed layer with missing beat
      const source = {
        sourceId: "src_01",
        uri: "file:///raw_01.mp4",
        durationUs: 20000000,
        format: "video/mp4",
        checksumSha256: "abc123hash"
      };
      const report = shimEngine.observeSource(
        c.contentId,
        source,
        [{ segmentId: "seg_1", startUs: 0, endUs: 5000000, text: "Hello world intro", confidence: 0.95 }],
        [
          { beatId: "beat_1", description: "Intro", expectedKeywords: ["Hello"] },
          { beatId: "beat_2", description: "Thesis", expectedKeywords: ["Abraxas", "Metrology"] } // Missing!
        ]
      );
      expect(report.gaps.length).toBe(1);

      const recRes = await shimEngine.recordObservedLayer(c.contentId, c.revision, report, "u_shim");

      // 3. Add a production cut component
      const { lienzo: cutLienzo } = await lienzoService.createComponent({
        contentId: c.contentId,
        expectedRevision: recRes.revision,
        actorId: "u_editor",
        componentId: "comp_cut_01",
        section: "EDIT",
        layer: "PRODUCTION",
        reason: "Initial rough cut attempt"
      });

      // 4. Attempt VAV execution -> MUST THROW UnverifiedRealityError
      await expect(
        vavBridge.executeProductionJob({
          contentId: c.contentId,
          componentId: "comp_cut_01",
          lienzoRevision: cutLienzo.revision,
          actorId: "u_vav",
          jobType: "CUT",
          intentVersion: 1,
          parameters: { segments: [{ startUs: 0, endUs: 5000000 }] }
        })
      ).rejects.toThrow(UnverifiedRealityError);
    });

    it("allows VAV execution and outputs cas:// URI when SHIM verifies 100% alignment", async () => {
      const { lienzo: c } = await lienzoService.createLienzo({
        title: "Verified Episode",
        topic: "Metrology",
        targetAudience: "Architects",
        lifecycle: "RECORDING",
        actorId: "u_author"
      });

      const source = {
        sourceId: "src_02",
        uri: "file:///raw_02.mp4",
        durationUs: 20000000,
        format: "video/mp4",
        checksumSha256: "def456hash"
      };
      const report = shimEngine.observeSource(
        c.contentId,
        source,
        [
          { segmentId: "seg_1", startUs: 0, endUs: 5000000, text: "Hello and welcome to Abraxas", confidence: 0.95 },
          { segmentId: "seg_2", startUs: 5000000, endUs: 10000000, text: "Here is the exact metrology", confidence: 0.95 }
        ],
        [
          { beatId: "beat_1", description: "Intro", expectedKeywords: ["welcome"] },
          { beatId: "beat_2", description: "Thesis", expectedKeywords: ["metrology"] }
        ]
      );
      expect(report.gaps.length).toBe(0);

      const recRes = await shimEngine.recordObservedLayer(c.contentId, c.revision, report, "u_shim");
      expect(recRes.certificate?.gapStatus).toBe("OK");
      expect(recRes.certificate?.alignmentScore).toBe(1.0);

      const { lienzo: cutLienzo } = await lienzoService.createComponent({
        contentId: c.contentId,
        expectedRevision: recRes.revision,
        actorId: "u_editor",
        componentId: "comp_cut_verified",
        section: "EDIT",
        layer: "PRODUCTION",
        reason: "Verified clean cut"
      });

      const vavResult = await vavBridge.executeProductionJob({
        contentId: c.contentId,
        componentId: "comp_cut_verified",
        lienzoRevision: cutLienzo.revision,
        actorId: "u_vav",
        jobType: "CUT",
        intentVersion: 1,
        parameters: { segments: [{ startUs: 0, endUs: 10000000 }] }
      });

      expect(vavResult.status).toBe("COMPLETED");
      expect(vavResult.artifactRef.uri.startsWith("cas://")).toBe(true);
    });
  });

  // =========================================================================
  // STAGE 2: SHIM -> HE AUTOMATION
  // =========================================================================
  describe("Stage 2: SHIM -> HE Pickup Task Automation", () => {
    it("automatically creates a PICKUP_RECORDING task in HE when SHIM detects GAPs", () => {
      const bridge = new ShimHeAutomationBridge(heService);
      const report = {
        reportId: "rep_gap_test",
        contentId: "content_42",
        sourceId: "src_rec_01",
        observations: [],
        gaps: [
          { beatId: "beat_hook_missing", status: "MISSING" as const, matchingSegmentIds: [], confidence: 0 }
        ],
        createdAt: new Date().toISOString()
      };

      const tasks = bridge.processShimReport(report);
      expect(tasks.length).toBe(1);
      expect(tasks[0].beatId).toBe("beat_hook_missing");

      const createdTask = heService.getTask(tasks[0].taskId);
      expect(createdTask.title).toContain("PICKUP REQUIRED");
      expect(createdTask.priority).toBe("HIGH");
    });
  });

  // =========================================================================
  // STAGE 3: HE -> PUBLISHING DISPATCHER
  // =========================================================================
  describe("Stage 3: HE -> Publishing Dispatcher", () => {
    it("generates publish receipts and emits PUBLISHED events upon dispatch", async () => {
      const dispatcher = new PublishingDispatcher(eventLedger);
      const receipts = await dispatcher.dispatch("content_42", "art_master_001", ["YOUTUBE", "TIKTOK"]);

      expect(receipts.length).toBe(2);
      expect(receipts[0].status).toBe("DISPATCHED");
      expect(receipts[0].platform).toBe("YOUTUBE");
      expect(receipts[1].platform).toBe("TIKTOK");
    });
  });

  // =========================================================================
  // STAGE 4: UNIVERSAL CAS ARTIFACT SYSTEM
  // =========================================================================
  describe("Stage 4: Universal CAS Artifact Storage", () => {
    it("stores artifacts with cas:// URI scheme and retrieves them by SHA-256", async () => {
      const art = await artifactRegistry.register({
        contentId: "content_cas_test",
        componentId: "comp_vav_01",
        type: "vav_rendered_master",
        version: 1,
        createdBy: "vav_engine",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        uri: "cas://e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      });

      expect(art.uri).toBe("cas://e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

      const retrieved = await artifactRegistry.getArtifactByHash("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
      expect(retrieved?.artifactId).toBe(art.artifactId);
    });
  });

  // =========================================================================
  // STAGE 5: PIPELINE RUNNER ENGINE
  // =========================================================================
  describe("Stage 5: Pipeline Runner Engine", () => {
    it("executes a complete DAG pipeline autonomously with step executors", async () => {
      const runner = new PipelineRunner();

      runner.registerExecutor("YOD", async (nodeId, input) => {
        return { hookAngle: "Question Hook", opportunityScore: 0.92 };
      });
      runner.registerExecutor("SHIM", async (nodeId, input) => {
        return { metrologyStatus: "VERIFIED_OK", gapCount: 0 };
      });
      runner.registerExecutor("VAV", async (nodeId, input) => {
        return { renderCasUri: "cas://vav_rendered_hash_abc", durationMs: 45000 };
      });

      const blueprint = {
        blueprintId: "TEST_CORE_LOOP",
        nodes: [
          { nodeId: "node_yod", operator: "YOD", dependsOn: [] },
          { nodeId: "node_shim", operator: "SHIM", dependsOn: ["node_yod"] },
          { nodeId: "node_vav", operator: "VAV", dependsOn: ["node_shim"] }
        ]
      };

      const record = await runner.startExecution(blueprint, "content_dag_test");
      expect(record.status).toBe("COMPLETED");
      expect(record.nodeStates["node_yod"].status).toBe("COMPLETED");
      expect(record.nodeStates["node_shim"].status).toBe("COMPLETED");
      expect(record.nodeStates["node_vav"].status).toBe("COMPLETED");
      expect(record.nodeStates["node_vav"].output.renderCasUri).toBe("cas://vav_rendered_hash_abc");
    });
  });

  // =========================================================================
  // STAGE 6: METRICS -> YOD LEARNING LOOP
  // =========================================================================
  describe("Stage 6: Metrics -> YOD Learning Loop", () => {
    it("normalizes platform telemetry and mutates YOD hook scoring weights", () => {
      const learning = new LearningFeedbackService();
      const initialWeights = { QUESTION_HOOK: 1.0, STORY_HOOK: 1.0, CONTRARIAN_HOOK: 1.0 };

      // High retention on QUESTION_HOOK
      const vector = learning.normalizeMetrics({
        contentId: "content_viral_01",
        hookArchetype: "QUESTION_HOOK",
        views: 100000,
        avgWatchPercentage: 85,
        shares: 4500,
        saves: 8000
      });

      expect(vector.hookPerformance["QUESTION_HOOK"]).toBe(1.5);
      const updated = learning.applyFeedbackToYodWeights(vector, initialWeights);

      // Verify weight increased
      expect(updated["QUESTION_HOOK"]).toBeGreaterThan(1.0);
      expect(updated["STORY_HOOK"]).toBe(1.0);
    });
  });

  // =========================================================================
  // STAGE 7: AI RUNTIME SERVICE
  // =========================================================================
  describe("Stage 7: AI Runtime Token Accounting & Caching", () => {
    it("centralizes inference, tracks tokens used and returns cached response for identical prompt", async () => {
      const ai = new AiRuntimeService();

      const res1 = await ai.executeInference({
        provider: "MOCK",
        prompt: "Generate high retention hook for Peruvian culinary tradition"
      });

      expect(res1.cached).toBe(false);
      expect(res1.tokensUsed.totalTokens).toBeGreaterThan(0);
      expect(ai.getTotalTokensUsed()).toBe(res1.tokensUsed.totalTokens);

      // Repeat identical prompt -> must return cached: true without adding tokens
      const res2 = await ai.executeInference({
        provider: "MOCK",
        prompt: "Generate high retention hook for Peruvian culinary tradition"
      });

      expect(res2.cached).toBe(true);
      expect(res2.responseId).toBe(res1.responseId);
      expect(ai.getTotalTokensUsed()).toBe(res1.tokensUsed.totalTokens);
    });
  });

  // =========================================================================
  // STAGE 8: UNIVERSAL INTAKE WATCHER
  // =========================================================================
  describe("Stage 8: Universal Intake Watcher", () => {
    it("hashes input buffer and creates valid source asset reference", async () => {
      const intake = new IntakeWatcher();
      const dummyBuffer = Buffer.from("mock video media stream bytes 12345");
      const res = await intake.ingestMedia("sample_recording.mp4", dummyBuffer, "content_intake_01");

      expect(res.contentId).toBe("content_intake_01");
      expect(res.sourceAsset.checksumSha256.length).toBe(64);
      expect(res.sourceAsset.format).toBe("video/mp4");
    });
  });

  // =========================================================================
  // STAGE 9: PERSISTENT EVENT BUS
  // =========================================================================
  describe("Stage 9: Persistent Event Bus", () => {
    it("persists domain events and replays history correctly", async () => {
      const bus = new PersistentEventBus();
      await bus.emit("CONTENT_CREATED", "c_1", "u_author", "New concept");
      await bus.emit("SHIM_VERIFIED", "c_1", "u_shim", "100% match");
      await bus.emit("CUT_RENDERED", "c_1", "u_vav", "Render completed");

      const history = bus.getHistory("c_1");
      expect(history.length).toBe(3);
      expect(history[0].eventType).toBe("CONTENT_CREATED");
      expect(history[1].eventType).toBe("SHIM_VERIFIED");
      expect(history[2].eventType).toBe("CUT_RENDERED");
    });
  });

  // =========================================================================
  // STAGE 10: ARQUITECTO REAL-TIME SYSTEM MONITOR
  // =========================================================================
  describe("Stage 10: Arquitecto System Monitor", () => {
    it("aggregates real-time telemetry and answers system health queries", () => {
      const monitor = new ArquitectoSystemMonitor();
      monitor.recordMetrologyResult("content_test_01", 0);
      monitor.recordEvent("VAV rendered cut cas://abc12345");

      const state = monitor.getRealtimeSystemState();
      expect(state.systemHealth).toBe("OPTIMAL");
      expect(state.lastVerifiedContentId).toBe("content_test_01");
      expect(state.recentEvents.length).toBeGreaterThan(0);
    });
  });
});
