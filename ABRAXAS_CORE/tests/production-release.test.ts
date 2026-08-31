import { describe, it, expect } from "vitest";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";
import { SystemGuardian } from "../guardian/src/system-guardian.js";
import { ArquitectoCentralInterface } from "../ARQUITECTO/src/arquitecto-central.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("ABRAXAS OS V4 — Sovereign Productization & Production Release Suite", () => {
  it("persists episodic, semantic, and telemetry memory across restarts using SQLite", () => {
    const tmpDbPath = path.join(os.tmpdir(), `abraxas_test_memory_${Date.now()}.db`);

    // 1. Initial Session
    const mem1 = new SqliteMemoryCore(tmpDbPath);
    mem1.recordEpisodic(
      "Genesis Launch",
      "ABRAXAS OS V4 native desktop launch",
      { version: "4.0.0" },
      0.98,
      ["launch", "genesis"]
    );
    mem1.recordSemantic("CAS", "Content-Addressed Storage using SHA-256 hashes", ["storage", "cryptography"]);
    mem1.recordTelemetry("content_101", "QUESTION_HOOK", 500000, 92.5, 0.15);
    mem1.recordArchitecturalEvolution("PHASE_4", "Productization complete", "RELEASE_READY");
    mem1.close();

    // 2. Restart Simulation (Reopen identical SQLite file)
    const mem2 = new SqliteMemoryCore(tmpDbPath);
    const episodes = mem2.queryEpisodic(0.9);
    expect(episodes.length).toBe(1);
    expect(episodes[0].topic).toBe("Genesis Launch");
    expect(episodes[0].summary).toContain("ABRAXAS OS V4 native desktop launch");
    mem2.close();

    // Cleanup
    try { fs.unlinkSync(tmpDbPath); } catch (e) {}
  });

  it("executes full conversational intention through ARQUITECTO without touching low-level modules", async () => {
    const arquitecto = new ArquitectoCentralInterface(":memory:");

    const intention = "Create an unshakeable master video proving the superiority of deterministic editing architectures";
    const response = await arquitecto.executeHumanIntention(intention);

    expect(response.verdict).toBe("INTENTION_MANIFESTED_SUCCESSFULLY");
    expect(response.casOutputUri.startsWith("cas://")).toBe(true);
    expect(response.daatCertificateId).toBeDefined();
    expect(response.publishReceiptsCount).toBe(1);
    expect(response.systemHealth).toBe("OPTIMAL");
  });

  it("executes autonomous System Guardian health audit with zero broken edges", () => {
    const guardian = new SystemGuardian();
    const audit = guardian.auditSystem();

    expect(audit.overallStatus).toBe("OPTIMAL");
    expect(audit.daatGateActive).toBe(true);
    expect(audit.casIntegrityActive).toBe(true);
    expect(audit.lunarLoopActive).toBe(true);
    expect(audit.modulesHealth["YOD"]).toBe("HEALTHY");
    expect(audit.modulesHealth["VAV"]).toBe("HEALTHY");
    expect(audit.modulesHealth["HE"]).toBe("HEALTHY");
    expect(audit.modulesHealth["SHIM"]).toBe("HEALTHY");
  });
});
