/**
 * ARQUITECTO Decision Memory
 * Stores causal rationale, options considered, and downstream consequences.
 */

import { randomUUID } from "node:crypto";

export interface DecisionRecord {
  decisionId: string;
  context: string;
  chosenOption: string;
  rejectedOptions: string[];
  rationale: string;
  confidence: number;
  timestamp: string;
}

export class DecisionMemory {
  private readonly decisions: DecisionRecord[] = [];

  public logDecision(
    context: string,
    chosenOption: string,
    rejectedOptions: string[],
    rationale: string,
    confidence = 0.95
  ): DecisionRecord {
    const record: DecisionRecord = {
      decisionId: `dec_${randomUUID().slice(0, 8)}`,
      context,
      chosenOption,
      rejectedOptions,
      rationale,
      confidence,
      timestamp: new Date().toISOString()
    };
    this.decisions.unshift(record);
    return record;
  }

  public getRecentDecisions(limit = 10): DecisionRecord[] {
    return this.decisions.slice(0, limit);
  }
}
