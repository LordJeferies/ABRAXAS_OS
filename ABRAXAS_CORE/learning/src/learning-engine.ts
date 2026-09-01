/**
 * Learning Engine — Synthesizes feedback signals without mutating Source Truth
 */

import { randomUUID } from "node:crypto";
import { LearningSignal } from "./types.js";
import { MetricSnapshot } from "../../metrics/src/types.js";
import { MetricsEngine } from "../../metrics/src/metrics-engine.js";

export class LearningEngine {
  private signals: LearningSignal[] = [];

  constructor(private readonly metricsEngine: MetricsEngine) {}

  public generateLearningSignal(input: {
    contentId: string;
    clientId: string;
    structureId: string;
    formatId: string;
    snapshot: MetricSnapshot;
  }): LearningSignal {
    const normalized = this.metricsEngine.normalizeMetrics(input.snapshot.raw);
    const isHighPerformer = normalized.compositePerformanceScore >= 50;

    const signal: LearningSignal = {
      signalId: `sig_${randomUUID().slice(0, 10)}`,
      contentId: input.contentId,
      clientId: input.clientId,
      structureId: input.structureId,
      formatId: input.formatId,
      normalizedMetrics: normalized,
      observationWindow: "30_DAYS",
      confidence: 0.92,
      hypothesis: isHighPerformer
        ? `Structure "${input.structureId}" demonstrates high retention (${normalized.retentionScore}%) and engagement (${normalized.engagementScore}%)`
        : `Structure "${input.structureId}" underperformed on retention (${normalized.retentionScore}%)`,
      createdAt: new Date().toISOString()
    };

    this.signals.push(signal);
    return signal;
  }

  public getSignalsForClient(clientId: string): LearningSignal[] {
    return this.signals.filter((s) => s.clientId === clientId);
  }
}
