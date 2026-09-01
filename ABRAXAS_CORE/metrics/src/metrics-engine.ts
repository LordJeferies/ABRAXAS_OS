/**
 * Metrics Engine — Ingests raw metrics and computes normalized scores
 */

import { randomUUID } from "node:crypto";
import { MetricSnapshot, RawMetrics, NormalizedMetrics } from "./types.js";

export class MetricsEngine {
  private snapshots: MetricSnapshot[] = [];

  public ingestSnapshot(input: {
    contentId: string;
    targetId: string;
    platform: string;
    raw: RawMetrics;
  }): MetricSnapshot {
    const snap: MetricSnapshot = {
      snapshotId: `met_snap_${randomUUID().slice(0, 10)}`,
      contentId: input.contentId,
      targetId: input.targetId,
      platform: input.platform,
      raw: { ...input.raw },
      ingestedAt: new Date().toISOString()
    };
    this.snapshots.push(snap);
    return snap;
  }

  public normalizeMetrics(raw: RawMetrics): NormalizedMetrics {
    const attentionScore = Math.min(100, Math.round((raw.views / Math.max(1, raw.impressions)) * 100));
    const retentionScore = Math.min(100, Math.round(raw.completionRate * 100));
    const totalEngagements = raw.likes + raw.comments * 2 + raw.saves * 3;
    const engagementScore = Math.min(100, Math.round((totalEngagements / Math.max(1, raw.views)) * 100));
    const amplificationScore = Math.min(100, Math.round((raw.shares / Math.max(1, raw.reach)) * 100));
    const conversionScore = Math.min(100, Math.round((raw.conversions / Math.max(1, raw.clicks)) * 100));

    const compositePerformanceScore = Math.round(
      attentionScore * 0.25 +
      retentionScore * 0.35 +
      engagementScore * 0.2 +
      amplificationScore * 0.1 +
      conversionScore * 0.1
    );

    return {
      formulaId: "FORMULA_CORE_LOOP_NORMALIZER_V1",
      formulaVersion: 1,
      attentionScore,
      retentionScore,
      engagementScore,
      amplificationScore,
      conversionScore,
      compositePerformanceScore
    };
  }
}
