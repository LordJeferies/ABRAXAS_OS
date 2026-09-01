import { describe, it, expect } from "vitest";
import { MetricsEngine } from "../src/metrics-engine.js";

describe("Metrics Engine V1 — Ingest & Normalization", () => {
  it("ingests raw metrics and calculates normalized scores using deterministic versioned formula", () => {
    const engine = new MetricsEngine();

    const snapshot = engine.ingestSnapshot({
      contentId: "content_perf_01",
      targetId: "target_ig_01",
      platform: "Instagram",
      raw: {
        views: 12000,
        reach: 10000,
        impressions: 15000,
        likes: 850,
        comments: 65,
        shares: 140,
        saves: 210,
        watchTimeSeconds: 420000,
        averageViewDurationSeconds: 35,
        completionRate: 0.78,
        clicks: 450,
        leads: 35,
        conversions: 12
      }
    });

    expect(snapshot.snapshotId).toBeDefined();

    const normalized = engine.normalizeMetrics(snapshot.raw);
    expect(normalized.formulaId).toBe("FORMULA_CORE_LOOP_NORMALIZER_V1");
    expect(normalized.formulaVersion).toBe(1);
    expect(normalized.retentionScore).toBe(78);
    expect(normalized.compositePerformanceScore).toBeGreaterThanOrEqual(50);
  });
});
