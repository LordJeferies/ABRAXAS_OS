import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Container / Cloud Readiness Audit V1", () => {
  it("verifies the presence and completeness of CONTAINER_READINESS_REPORT_V1.md", () => {
    const reportPath = path.resolve(__dirname, "../CONTAINER_READINESS_REPORT_V1.md");
    expect(fs.existsSync(reportPath)).toBe(true);

    const content = fs.readFileSync(reportPath, "utf-8");
    expect(content).toContain("CONTAINER_READY");
    expect(content).toContain("NEEDS_ADAPTER");
    expect(content).toContain("LIENZO Domain Core");
    expect(content).toContain("VAV Video Engine");
  });
});
