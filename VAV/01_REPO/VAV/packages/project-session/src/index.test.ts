import {describe, expect, it} from "vitest";
import {
  AUTOSAVE_INTERVAL_MS,
  CURRENT_PROJECT_SCHEMA_VERSION,
  canOpenProjectVersion,
  scoreRelinkCandidate
} from "./index.ts";

describe("project session foundation", () => {
  it("has an autosave interval", () => {
    expect(AUTOSAVE_INTERVAL_MS).toBeGreaterThan(0);
  });

  it("guards future project versions", () => {
    expect(canOpenProjectVersion(CURRENT_PROJECT_SCHEMA_VERSION)).toBe(true);
    expect(canOpenProjectVersion(CURRENT_PROJECT_SCHEMA_VERSION + 1)).toBe(false);
  });

  it("strong relink evidence scores highly", () => {
    expect(scoreRelinkCandidate({
      filenameMatch: true,
      byteSizeMatch: true,
      durationDeltaMs: 20,
      partialHashMatch: true
    })).toBe(100);
  });
});
