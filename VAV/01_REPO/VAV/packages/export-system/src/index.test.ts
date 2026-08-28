import {describe, expect, it} from "vitest";
import {canExportWithIssues} from "./index.ts";

describe("export system", () => {
  it("blocks export on QC errors", () => {
    expect(canExportWithIssues([{
      id: "q1",
      code: "font-missing",
      severity: "error",
      targetId: null,
      message: "Missing font"
    }])).toBe(false);
  });
});
