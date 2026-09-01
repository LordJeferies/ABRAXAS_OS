/**
 * ABRAXAS Metrics Types
 */

export interface RawMetrics {
  views: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  watchTimeSeconds: number;
  averageViewDurationSeconds: number;
  completionRate: number; // 0.0 - 1.0
  clicks: number;
  leads: number;
  conversions: number;
}

export interface MetricSnapshot {
  snapshotId: string;
  contentId: string;
  targetId: string;
  platform: string;
  raw: RawMetrics;
  ingestedAt: string;
}

export interface NormalizedMetrics {
  formulaId: string;
  formulaVersion: number;
  attentionScore: number; // 0 - 100
  retentionScore: number; // 0 - 100
  engagementScore: number; // 0 - 100
  amplificationScore: number; // 0 - 100
  conversionScore: number; // 0 - 100
  compositePerformanceScore: number; // 0 - 100
}
