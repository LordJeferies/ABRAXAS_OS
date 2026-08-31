/**
 * ABRAXAS Learning Feedback Service (Cosmic Lunar Closed Loop)
 * Ingests platform metrics, normalizes PerformanceVector, and mutates YOD scoring weights.
 */

export interface PerformanceVector {
  hookPerformance: Record<string, number>; // hook archetype -> retention coefficient (0.0 to 2.0)
  overallRetention: number;
  conversionRate: number;
  audienceSignal: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  creativePattern?: string;
}

export interface PlatformMetricsInput {
  contentId: string;
  hookArchetype: string;
  views: number;
  avgWatchPercentage: number;
  shares: number;
  saves: number;
}

export class LearningFeedbackService {
  private readonly hookWeightModifiers = new Map<string, number>();

  public normalizeMetrics(input: PlatformMetricsInput): PerformanceVector {
    // Retention coefficient baseline: 1.0. If watch > 60%, boost. If watch < 30%, penalize.
    let hookCoeff = 1.0;
    if (input.avgWatchPercentage >= 70) {
      hookCoeff = 1.5;
    } else if (input.avgWatchPercentage >= 50) {
      hookCoeff = 1.2;
    } else if (input.avgWatchPercentage < 30) {
      hookCoeff = 0.7;
    }

    const conversionRate = input.views > 0 ? (input.shares + input.saves) / input.views : 0;
    const signal = input.avgWatchPercentage >= 50 ? "POSITIVE" : "NEUTRAL";

    return {
      hookPerformance: {
        [input.hookArchetype]: hookCoeff
      },
      overallRetention: input.avgWatchPercentage,
      conversionRate,
      audienceSignal: signal
    };
  }

  public applyFeedbackToYodWeights(
    vector: PerformanceVector,
    currentWeights: Record<string, number>
  ): Record<string, number> {
    const updated = { ...currentWeights };

    for (const [hookType, modifier] of Object.entries(vector.hookPerformance)) {
      const base = updated[hookType] || 1.0;
      // Exponential moving average update
      const newWeight = Number((base * 0.7 + base * modifier * 0.3).toFixed(3));
      updated[hookType] = newWeight;
      this.hookWeightModifiers.set(hookType, newWeight);
    }

    return updated;
  }

  public getModifier(hookType: string): number {
    return this.hookWeightModifiers.get(hookType) || 1.0;
  }
}
