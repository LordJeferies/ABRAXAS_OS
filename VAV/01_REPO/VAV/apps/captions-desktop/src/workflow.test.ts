import {describe, expect, it} from "vitest";
import {
  completedWorkflowSteps,
  recommendedWorkflowStep
} from "./workflow.ts";

describe("guided workflow", () => {
  it("starts with media import", () => {
    expect(recommendedWorkflowStep({
      hasMedia: false,
      hasTranscript: false,
      hasReviewedCaptions: false,
      hasDesign: false
    })).toBe("source");
  });

  it("moves to transcription once media exists", () => {
    expect(recommendedWorkflowStep({
      hasMedia: true,
      hasTranscript: false,
      hasReviewedCaptions: false,
      hasDesign: false
    })).toBe("transcribe");
  });

  it("tracks completed stages deterministically", () => {
    expect(completedWorkflowSteps({
      hasMedia: true,
      hasTranscript: true,
      hasReviewedCaptions: false,
      hasDesign: false
    })).toEqual(["source", "transcribe"]);
  });
});
