import { describe, it, expect } from "vitest";
import { IntentionEngine } from "../ARQUITECTO/src/cognitive-core/intention-engine.js";
import { ReasoningEngine } from "../ARQUITECTO/src/cognitive-core/reasoning-engine.js";
import { CognitivePlanner } from "../ARQUITECTO/src/cognitive-core/planner.js";
import { DecisionMemory } from "../ARQUITECTO/src/cognitive-core/decision-memory.js";
import { SemanticVectorMemory } from "../memory/src/semantic-vector-memory.js";
import { AutonomousEvolutionEngine } from "../evolution/src/autonomous-evolution-engine.js";
import { NeuralEventBus } from "../backbone/src/neural-event-bus.js";
import { IdentityCore } from "../identity/src/identity-core.js";
import { TreeOfLifeEngine } from "../pipeline/src/tree-of-life-engine.js";
import { ArquitectoCentralInterface } from "../ARQUITECTO/src/arquitecto-central.js";

describe("ABRAXAS OS V5 — Cognitive Organism Evolution Suite", () => {
  // 1. ARQUITECTO Cognitive Core
  it("deconstructs intention, evaluates reasoning and generates bespoke execution DAG", () => {
    const intentionEngine = new IntentionEngine();
    const reasoningEngine = new ReasoningEngine();
    const planner = new CognitivePlanner();
    const decisionMemory = new DecisionMemory();

    const rawPrompt = "Synthesize an urgent breakdown of latency bottlenecks for systems architects";
    const structuredIntention = intentionEngine.parse(rawPrompt);
    expect(structuredIntention.priorityLevel).toBe("HIGH");
    expect(structuredIntention.targetEmotion).toBe("HIGH_TENSION_CURIOSITY");

    const reasoning = reasoningEngine.evaluate(structuredIntention, { QUESTION_HOOK: 1.2, STORY_HOOK: 1.0 });
    expect(reasoning.recommendedHookArchetype).toBe("QUESTION_HOOK");
    expect(reasoning.successProbability).toBeGreaterThan(0.9);

    const plan = planner.createPlan(structuredIntention, reasoning);
    expect(plan.steps.length).toBe(8);
    expect(plan.steps[0].sefirahState).toBe("KETER");
    expect(plan.steps[3].sefirahState).toBe("DAAT");
    expect(plan.steps[7].sefirahState).toBe("MALKHUT");

    const decision = decisionMemory.logDecision(
      "Hook Archetype Selection",
      "QUESTION_HOOK",
      ["STORY_HOOK", "CONTRARIAN_HOOK"],
      reasoning.rationale
    );
    expect(decision.chosenOption).toBe("QUESTION_HOOK");
    expect(decisionMemory.getRecentDecisions().length).toBe(1);
  });

  // 2. Semantic Vector Memory
  it("indexes semantic vectors and retrieves top matches via cosine similarity", () => {
    const vectorMemory = new SemanticVectorMemory();

    vectorMemory.index("vec_1", "Why traditional video editing architectures collapse at scale", { topic: "architecture" });
    vectorMemory.index("vec_2", "Kinetic subtitle typography physics and motion rules", { topic: "motion" });
    vectorMemory.index("vec_3", "Da'at reality metrology and empirical verification gate", { topic: "truth" });

    const results = vectorMemory.search("How does reality verification work in Da'at metrology?", 2);
    expect(results.length).toBe(2);
    expect(results[0].item.id).toBe("vec_3");
    expect(results[0].similarity).toBeGreaterThan(0.7);
  });

  // 3. Autonomous Evolution Engine
  it("detects architectural drift and logs mutation proposals", () => {
    const evolution = new AutonomousEvolutionEngine();

    const mutations = evolution.detectDrift({
      metricsLoopActive: true,
      yodWeightsMutated: false
    });

    expect(mutations.length).toBe(1);
    expect(mutations[0].targetModule).toBe("YOD");

    const applied = evolution.applyMutation(mutations[0].mutationId);
    expect(applied).toBe(true);
    expect(evolution.getHistory()[0].status).toBe("APPLIED");
  });

  // 4. Neural Event Bus
  it("emits high-impact cognitive events with meaning and downstream consequences", () => {
    const bus = new NeuralEventBus();
    const event = bus.emitCognitive(
      "DAAT_CERTIFICATE_ISSUED",
      "content_500",
      "Empirical reality certified with zero gaps detected",
      0.99,
      ["UNLOCKS_VAV_RENDER", "PERMITS_HE_GOVERNANCE"],
      1.5
    );

    expect(event.confidence).toBe(0.99);
    expect(event.consequences.length).toBe(2);
    expect(bus.getHighImpactEvents(1.0).length).toBe(1);
  });

  // 5. Identity Core
  it("enforces immutable canonical laws and blocks illegal actions", () => {
    const identity = new IdentityCore();
    const id = identity.getIdentity();

    expect(id.systemName).toBe("ABRAXAS OS");
    expect(id.principles.length).toBeGreaterThan(3);

    const checkBlocked = identity.validateActionAgainstRules("VAV_RENDER", false);
    expect(checkBlocked.allowed).toBe(false);
    expect(checkBlocked.violation).toContain("Cannot render without SHIM");

    const checkAllowed = identity.validateActionAgainstRules("VAV_RENDER", true);
    expect(checkAllowed.allowed).toBe(true);
  });

  // 6. Tree of Life State Machine Engine
  it("enforces sequential Sephirothic ladder and rejects Da'at bypass", () => {
    const tree = new TreeOfLifeEngine();

    expect(tree.getState()).toBe("KETER");
    tree.transition("CHOKHMAH", "YOD");
    tree.transition("BINAH", "CONTENIDO");
    tree.transition("DAAT", "SHIM");

    // Attempting DAAT -> TIFERET without SHIM verification -> MUST THROW
    expect(() => tree.transition("TIFERET", "VAV", { isShimVerified: false })).toThrow(/Cannot descend from DAAT to TIFERET/);

    // Transition with valid verification
    tree.transition("TIFERET", "VAV", { isShimVerified: true });
    expect(tree.getState()).toBe("TIFERET");

    tree.transition("HOD", "VAV_CAPTIONS");
    tree.transition("YESOD", "INTEGRATION");

    // Attempting YESOD -> MALKHUT without HE approval -> MUST THROW
    expect(() => tree.transition("MALKHUT", "HE_DESK", { isApproved: false })).toThrow(/Cannot manifest into MALKHUT/);

    tree.transition("MALKHUT", "HE_DESK", { isApproved: true });
    expect(tree.getState()).toBe("MALKHUT");
    expect(tree.getHistory().length).toBe(7);
  });

  // 7. Full Cognitive Organism Execution Cycle
  it("executes the complete cognitive loop: Intention -> ARQUITECTO -> YOD -> Contenido -> SHIM -> VAV -> HE -> Publish -> Metrics -> Memory -> Evolution", async () => {
    const arquitecto = new ArquitectoCentralInterface(":memory:");
    const response = await arquitecto.executeHumanIntention("Synthesize an unshakeable proof of the cognitive operating system");

    expect(response.verdict).toBe("INTENTION_MANIFESTED_SUCCESSFULLY");
    expect(response.casOutputUri.startsWith("cas://")).toBe(true);
    expect(response.systemHealth).toBe("OPTIMAL");
  });
});
