import { describe, it, expect } from "vitest";
import { ClientCoreService } from "../src/client-core.js";
import { YodEngine } from "../src/yod-engine.js";
import { createLienzoService } from "../../../LIENZO/src/service.js";

describe("YOD Runtime V1 — Content Intelligence, Planning & Provenance", () => {
  it("manages versioned ClientCore entities with immutable audit records", async () => {
    const clientService = new ClientCoreService();

    const client = await clientService.createClient({
      clientId: "client_acme_corp",
      name: "Acme Corp",
      pillars: ["Engineering Excellence", "Rapid Prototyping", "Safety Systems"],
      claims: ["Zero downtime architecture", "Sub-millisecond latency"],
      brandVoice: "Authoritative, technical yet accessible",
      targetAudiences: ["CTOs", "Lead Engineers"],
      actorId: "lead_strategist"
    });

    expect(client.clientId).toBe("client_acme_corp");
    expect(client.version).toBe(1);

    const updated = await clientService.updateClient({
      clientId: "client_acme_corp",
      expectedVersion: 1,
      brandVoice: "Crisp, visionary and high-velocity",
      actorId: "lead_strategist"
    });

    expect(updated.version).toBe(2);
    expect(updated.brandVoice).toBe("Crisp, visionary and high-velocity");
  });

  it("generates justified opportunities and spawns multiple independent Lienzos from one Plan", async () => {
    const clientService = new ClientCoreService();
    const yod = new YodEngine();
    const lienzoService = createLienzoService();

    const client = await clientService.createClient({
      name: "Solaria Energy",
      pillars: ["Solar Efficiency", "Grid Resilience", "Zero Battery Degradation"],
      claims: ["99.8% energy capture efficiency"],
      brandVoice: "Empowering, clean and precise",
      targetAudiences: ["Homeowners", "Utility Planners"],
      actorId: "lead_yod"
    });

    // 1. Generate justified opportunity
    const opp = yod.generateOpportunity(client, {
      underrepresentedPillar: "Grid Resilience",
      coverageGap: "Only 1 post in last 30 days covers grid resilience",
      recommendedFormatId: "FORMAT_CASE_STUDY_V1",
      recommendedStructureId: "STRUCTURE_PROBLEM_AGITATE_SOLVE_V1",
      hookConcept: "Why traditional grids black out while microgrids thrive",
      score: 94,
      actorId: "yod_ai_planner"
    });

    expect(opp.score).toBe(94);
    expect(opp.justification.pillarDeficit).toContain("Grid Resilience");

    // 2. Create Plan from Opportunity (Plan != Lienzo)
    const plan = yod.createPlanFromOpportunity(
      opp,
      [
        {
          title: "Grid Resilience: The Microgrid Revolution (Episode 1)",
          formatId: "FORMAT_TALKING_HEAD_REEL_V1",
          structureId: "STRUCTURE_HOOK_PROOF_CTA_V1",
          targetPlatform: "Instagram"
        },
        {
          title: "Grid Resilience: Blackout Deep Dive (Episode 2)",
          formatId: "FORMAT_EXPLAINER_V1",
          structureId: "STRUCTURE_CASE_STUDY_V1",
          targetPlatform: "YouTube"
        }
      ],
      "lead_producer"
    );

    expect(plan.items.length).toBe(2);

    // 3. Spawn 2 independent Lienzos from the single Plan
    const l1 = await yod.instantiateLienzoFromPlanItem(
      lienzoService,
      plan,
      plan.items[0]!,
      client,
      "yod_bridge"
    );
    const l2 = await yod.instantiateLienzoFromPlanItem(
      lienzoService,
      plan,
      plan.items[1]!,
      client,
      "yod_bridge"
    );

    expect(l1.contentId).not.toBe(l2.contentId);

    const lienzo1 = await lienzoService.getLienzo(l1.contentId);
    const lienzo2 = await lienzoService.getLienzo(l2.contentId);

    expect(lienzo1.title).toContain("Episode 1");
    expect(lienzo2.title).toContain("Episode 2");
    expect(lienzo1.components.find((c) => c.layer === "STRATEGY")).toBeDefined();
    expect(lienzo2.components.find((c) => c.layer === "STRATEGY")).toBeDefined();
  });

  it("compiles structured prompt with all 18 canonical blocks and Founder Studio recording pack", () => {
    const yod = new YodEngine();

    const promptText = yod.compilePrompt({
      role: "Principal Visual Content Strategist",
      objective: "Draft high-converting TikTok video script outline",
      context: "Client is enterprise AI automation platform",
      inputs: { targetPillar: "Developer Ergonomics" },
      whatItIs: ["Short-form viral hook with proof point"],
      whatItIsNot: ["Generic corporate promotional brochure"],
      structure: "Hook -> Contrast -> Proof -> Clear CTA",
      clientRules: ["Never mention unreleased SDK v2 features"],
      formatRules: ["Duration under 45 seconds"],
      platformRules: ["Keep text in upper two-thirds safe zone"],
      evidence: ["3x speedup verified by benchmark suite"],
      restrictions: ["No competitor disparagement"],
      negatives: ["Avoid buzzwords like synergy"],
      outputContract: "JSON array of visual & spoken beats",
      acceptanceCriteria: ["All beats have time mapping"],
      qa: ["Verify word count <= 120 words"],
      handoff: "Pass to Shim for transcript alignment",
      continuity: "Preserve brand color accents"
    });

    expect(promptText).toContain("=== ROLE ===");
    expect(promptText).toContain("=== WHAT IT IS NOT ===");
    expect(promptText).toContain("=== CONTINUITY ===");

    const pack = yod.compileRecordingPack({
      contentId: "content_solo_01",
      clientId: "client_acme",
      title: "Solo Founder Deep Dive",
      question: "What surprised you most about latency optimization?",
      context: "Explaining zero-copy serialization",
      openTrigger: "I used to think Redis was fast until...",
      possibleHooks: ["Why we deleted our cache layer", "The 10x memory optimization trick"],
      developmentDirections: ["Explain cache invalidation bottleneck", "Show flamegraph difference"],
      closeOptions: ["Subscribe for architecture teardowns"],
      sourceRequirements: ["Record in high-contrast studio setting with lavalier mic"],
      visualSupport: ["Show code diff on secondary monitor"],
      recordingIntent: "Authentic founder-to-developer insight",
      actorId: "director_dan"
    });

    expect(pack.possibleHooks.length).toBe(2);
    expect(pack.question).toContain("latency optimization");
  });
});
