/**
 * ARQUITECTO Intention Engine
 * Deconstructs human natural language intention into structured objectives.
 */

export interface StructuredIntention {
  rawPrompt: string;
  primaryObjective: string;
  targetEmotion: string;
  audiencePersona: string;
  styleKeywords: string[];
  priorityLevel: "NORMAL" | "HIGH" | "CRITICAL";
  estimatedComplexity: number; // 1 to 5
}

export class IntentionEngine {
  public parse(rawPrompt: string): StructuredIntention {
    const lower = rawPrompt.toLowerCase();
    
    let targetEmotion = "AUTHORITATIVE_INSPIRATION";
    if (lower.includes("urgent") || lower.includes("breakdown") || lower.includes("crisis")) {
      targetEmotion = "HIGH_TENSION_CURIOSITY";
    } else if (lower.includes("guide") || lower.includes("how to") || lower.includes("teach")) {
      targetEmotion = "CLARITY_MASTERY";
    }

    let audiencePersona = "SYSTEMS_ARCHITECTS_AND_CREATIVE_DIRECTORS";
    if (lower.includes("beginner") || lower.includes("public") || lower.includes("client")) {
      audiencePersona = "GENERAL_STRATEGIC_LEADERS";
    }

    const styleKeywords = ["DETERMINISTIC", "CINEMATIC", "EVIDENCE_FIRST"];
    if (lower.includes("fast") || lower.includes("short")) styleKeywords.push("HIGH_VELOCITY");
    if (lower.includes("philosophical") || lower.includes("canon")) styleKeywords.push("ONTOLOGICAL_DEPTH");

    return {
      rawPrompt,
      primaryObjective: rawPrompt.trim(),
      targetEmotion,
      audiencePersona,
      styleKeywords,
      priorityLevel: lower.includes("urgent") ? "HIGH" : "NORMAL",
      estimatedComplexity: rawPrompt.length > 80 ? 4 : 2
    };
  }
}
