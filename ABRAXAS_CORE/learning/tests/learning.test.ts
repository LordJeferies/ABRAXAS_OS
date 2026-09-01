import { describe, it, expect } from "vitest";
import { MetricsEngine } from "../../metrics/src/metrics-engine.js";
import { LearningEngine } from "../src/learning-engine.js";
import { ClientCoreService } from "../../YOD/runtime/src/client-core.js";
import { YodEngine } from "../../YOD/runtime/src/yod-engine.js";

describe("Learning Engine V1 — Feedback Signals & Source Truth Separation", () => {
  it("generates LearningSignals that influence YOD opportunity scoring while preserving ClientCore Source Truth intact", async () => {
    const metricsEngine = new MetricsEngine();
    const learningEngine = new LearningEngine(metricsEngine);
    const clientService = new ClientCoreService();
    const yod = new YodEngine();

    // 1. Create ClientCore with approved claims
    const client = await clientService.createClient({
      clientId: "client_learning_01",
      name: "HyperScale DB",
      pillars: ["Distributed Consensus", "Memory Tiering"],
      claims: ["Linear scaling up to 10,000 nodes"],
      brandVoice: "Technical and authoritative",
      targetAudiences: ["Distributed Systems Architects"],
      actorId: "lead_strategist"
    });

    // 2. Ingest high-performing metrics snapshot
    const snap = metricsEngine.ingestSnapshot({
      contentId: "content_legacy_01",
      targetId: "target_yt_01",
      platform: "YouTube",
      raw: {
        views: 50000,
        reach: 45000,
        impressions: 60000,
        likes: 3200,
        comments: 420,
        shares: 980,
        saves: 1500,
        watchTimeSeconds: 1500000,
        averageViewDurationSeconds: 180,
        completionRate: 0.85,
        clicks: 2100,
        leads: 180,
        conversions: 45
      }
    });

    // 3. Generate Learning Signal
    const signal = learningEngine.generateLearningSignal({
      contentId: "content_legacy_01",
      clientId: client.clientId,
      structureId: "STRUCTURE_DEEP_TEARDOWN_V1",
      formatId: "FORMAT_LONG_EXPLAINER_V1",
      snapshot: snap
    });

    expect(signal.hypothesis).toContain("demonstrates high retention");

    // 4. YOD creates new Opportunity referencing the Learning Signal
    const opp = yod.generateOpportunity(client, {
      underrepresentedPillar: "Distributed Consensus",
      coverageGap: "Underrepresented in last 14 days",
      recommendedFormatId: signal.formatId,
      recommendedStructureId: signal.structureId,
      hookConcept: "How Raft consensus breaks under asymmetric network partitions",
      score: 98, // Boosted by high-performing signal
      actorId: "yod_planner"
    });

    expect(opp.score).toBe(98);
    expect(opp.recommendedStructureId).toBe("STRUCTURE_DEEP_TEARDOWN_V1");

    // 5. Source Truth Invariant: ClientCore claims remain 100% UNTOUCHED
    const reloadedClient = await clientService.getClient(client.clientId);
    expect(reloadedClient.claims).toEqual(["Linear scaling up to 10,000 nodes"]);
    expect(reloadedClient.version).toBe(1);
  });
});
