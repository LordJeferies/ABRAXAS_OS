/**
 * ABRAXAS Learning Types
 */

import { NormalizedMetrics } from "../../metrics/src/types.js";

export interface LearningSignal {
  signalId: string;
  contentId: string;
  clientId: string;
  structureId: string;
  formatId: string;
  normalizedMetrics: NormalizedMetrics;
  observationWindow: string;
  confidence: number;
  hypothesis: string;
  createdAt: string;
}
