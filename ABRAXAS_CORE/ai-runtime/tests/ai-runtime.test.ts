import { describe, it, expect } from "vitest";
import { AIRuntimeService, LogicProvider, ExternalRoundtripProvider } from "../src/ai-runtime-service.js";

describe("AI Runtime V1 — Providers & External Roundtrip", () => {
  it("executes jobs via Deterministic Logic Provider and External Roundtrip Provider returning valid AIResult", async () => {
    const aiService = new AIRuntimeService();

    const job = {
      jobId: "ai_job_001",
      contentId: "content_ai_01",
      prompt: "Synthesize 3 punchy hooks for latency breakdown",
      requiredCapabilities: ["TEXT" as const],
      createdAt: new Date().toISOString()
    };

    // 1. Execute with Logic Provider
    const logicResult = await aiService.executeJob(job, "provider_deterministic_logic");
    expect(logicResult.jobId).toBe("ai_job_001");
    expect(logicResult.output).toContain("[LOGIC_PROCESSED]");

    // 2. Execute with External Roundtrip Provider
    const roundtripProvider = aiService.getProvider("provider_external_roundtrip") as ExternalRoundtripProvider;
    const exportedTxt = roundtripProvider.exportJobToHumanReadable(job);
    expect(exportedTxt).toContain("=== ABRAXAS AI JOB EXPORT ===");

    const roundtripResult = roundtripProvider.parseAndValidateExternalResponse(
      job,
      "1. Zero cache invalidation\n2. Sub-millisecond queries\n3. Zero socket leaks"
    );
    expect(roundtripResult.output).toContain("Zero cache invalidation");
    expect(roundtripResult.structuredData?.["roundtripVerified"]).toBe(true);
  });
});
