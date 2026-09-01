import { describe, it, expect } from "vitest";
import { HealthRegistry } from "../src/health-registry.js";

describe("Health Registry V1 — System Health Aggregation", () => {
  it("aggregates subsystem health checks and reports truthful overall health status", async () => {
    const registry = new HealthRegistry();

    registry.registerCheck("STORAGE", async () => ({ subsystem: "STORAGE", status: "PASS" }));
    registry.registerCheck("VAV_RENDERER", async () => ({ subsystem: "VAV_RENDERER", status: "PASS" }));
    registry.registerCheck("GIT_STATE", async () => ({ subsystem: "GIT_STATE", status: "PASS" }));

    const report = await registry.evaluateHealth();
    expect(report.overallStatus).toBe("PASS");
    expect(report.subsystems.length).toBe(3);
  });
});
