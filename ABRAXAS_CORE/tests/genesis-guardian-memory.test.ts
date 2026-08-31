import { describe, it, expect } from "vitest";
import { MemoryCore } from "../memory/src/memory-core.js";
import { SystemGuardian } from "../guardian/src/system-guardian.js";

describe("ABRAXAS OS Genesis — Memory Core & System Guardian", () => {
  it("records and queries stratigraphic memory events", async () => {
    const memory = new MemoryCore();

    const mem1 = await memory.record(
      "EPISODIC",
      "Episode 101 Render",
      "Rendered master video with Question Hook",
      { durationMs: 45000 },
      0.9,
      ["viral", "high_retention"]
    );

    const mem2 = await memory.record(
      "ARCHITECTURAL",
      "Da'at Gate Activation",
      "Enforced mandatory SHIM certificate before VAV renders",
      {},
      1.0,
      ["governance", "security"]
    );

    expect(memory.getAll().length).toBe(2);

    const highImp = memory.query({ minImportance: 0.95 });
    expect(highImp.length).toBe(1);
    expect(highImp[0].topic).toBe("Da'at Gate Activation");

    const viralMems = memory.query({ tag: "viral" });
    expect(viralMems.length).toBe(1);
  });

  it("audits entire system and produces an optimal health report", () => {
    const guardian = new SystemGuardian();
    const report = guardian.auditSystem();

    expect(report.overallStatus).toBe("OPTIMAL");
    expect(report.brokenConnectionsCount).toBe(0);
    expect(report.moduleAudits["YOD"].classification).toBe("KEEP");
    expect(report.moduleAudits["SHIM"].classification).toBe("KEEP");
    expect(report.moduleAudits["VAV"].classification).toBe("KEEP");
    expect(report.moduleAudits["HE"].classification).toBe("KEEP");
    expect(report.recommendations.length).toBeGreaterThan(0);
  });
});
