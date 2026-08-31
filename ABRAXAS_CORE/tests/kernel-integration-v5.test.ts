import { describe, it, expect } from "vitest";
import { AbraxasKernel } from "../kernel/abraxas-kernel.js";
import { ModuleRegistry } from "../kernel/module-registry.js";
import { PersistentMemory } from "../kernel/memory/persistent-memory.js";
import { AbraxasOrchestrator } from "../runtime/orchestrator.js";
import { SystemStatusPanelProvider } from "../kernel/status-panel.js";
import { bootAbraxas } from "../../../VAV/01_REPO/VAV/apps/captions-desktop/src/boot.js";
import { IntentionEngine } from "../ARQUITECTO/src/cognitive-core/intention-engine.js";
import { ReasoningEngine } from "../ARQUITECTO/src/cognitive-core/reasoning-engine.js";
import { CognitivePlanner } from "../ARQUITECTO/src/cognitive-core/planner.js";
import { ArquitectoCentralInterface } from "../ARQUITECTO/src/arquitecto-central.js";
import { TreeEngine, State } from "../tree-of-life/state-machine.js";
import { EvolutionEngine } from "../guardian/evolution-engine.js";

describe("ABRAXAS OS V5.1+ — Kernel Integration & Organism Unification Suite", () => {
  it("boots AbraxasKernel and initializes all master subsystems", async () => {
    const kernel = new AbraxasKernel(":memory:");
    const bootResult = await kernel.boot();

    expect(bootResult.system).toBe("ABRAXAS OS");
    expect(bootResult.status).toBe("ONLINE");
    expect(bootResult.registeredModulesCount).toBeGreaterThanOrEqual(8);
    expect(bootResult.memoryConnected).toBe(true);
    expect(bootResult.guardianStatus).toBe("OPTIMAL");
  });

  it("registers and queries canonical modules with full lifecycle in ModuleRegistry", () => {
    const registry = new ModuleRegistry();
    const modules = registry.list();

    expect(modules.length).toBeGreaterThanOrEqual(8);
    expect(registry.get("YOD")?.status).toBe("ACTIVE");
    expect(registry.get("CONTENIDO")?.status).toBe("ACTIVE");
    expect(registry.get("SHIM")?.purpose).toContain("Da'at Reality Metrology");
    expect(registry.get("VAV")?.purpose).toContain("Audiovisual Formation Forge");
    expect(registry.get("HE")?.purpose).toContain("Operations Desk");
  });

  it("persists memories and executes semantic similarity search in PersistentMemory", () => {
    const persistentMemory = new PersistentMemory();

    const rec1 = persistentMemory.save({
      type: "EPISODIC",
      content: "Why traditional video editing systems break down under multi-channel scaling",
      importance: 0.9,
      tags: ["architecture", "scaling"]
    });

    const rec2 = persistentMemory.save({
      type: "EPISODIC",
      content: "Da'at reality metrology prevents audiovisual hallucinations",
      importance: 0.95,
      tags: ["truth", "metrology"]
    });

    expect(rec1.memoryId).toBeDefined();
    expect(rec2.memoryId).toBeDefined();

    const results = persistentMemory.search("How does Da'at reality verification work?", 1);
    expect(results.length).toBe(1);
    expect(results[0].text).toContain("Da'at reality metrology");
    expect(results[0].similarity).toBeGreaterThan(0.5);
  });

  it("orchestrates execution of a cognitive plan through the Sephirothic ladder", async () => {
    const intentionEngine = new IntentionEngine();
    const reasoningEngine = new ReasoningEngine();
    const planner = new CognitivePlanner();
    const orchestrator = new AbraxasOrchestrator();

    const intention = intentionEngine.parse("Synthesize a high-velocity breakdown of editing architecture");
    const reasoning = reasoningEngine.evaluate(intention);
    const plan = planner.createPlan(intention, reasoning);

    const result = await orchestrator.execute(plan, { contentId: "contenido_test_orchestrate" });
    expect(result.status).toBe("COMPLETED");
    expect(result.executedStepsCount).toBe(8);
  });

  it("validates Tree of Life state transitions and enforces Da'at reality gate", () => {
    const tree = new TreeEngine();
    expect(tree.getState()).toBe(State.KETER);

    tree.transition(State.CHOKHMAH);
    tree.transition(State.BINAH);
    tree.transition(State.DAAT);

    // Attempting transition to CREATION without SHIM verification -> MUST THROW
    expect(() => tree.transition(State.TIFERET, { isShimVerified: false })).toThrow(/Cannot descend from DAAT/);

    // Valid verified transition
    tree.transition(State.TIFERET, { isShimVerified: true });
    expect(tree.getState()).toBe(State.TIFERET);
  });

  it("evaluates architectural drift using EvolutionEngine", () => {
    const evo = new EvolutionEngine();
    const issues = evo.analyze({ memory: null, daatGateActive: true });
    expect(issues).toContain("Missing persistent memory");

    const cleanIssues = evo.analyze({ memory: {}, daatGateActive: true });
    expect(cleanIssues.length).toBe(0);
    expect(evo.getRecommendations().length).toBeGreaterThan(0);
  });

  it("generates system status panel model for desktop visualization", async () => {
    const kernel = new AbraxasKernel(":memory:");
    const provider = new SystemStatusPanelProvider(kernel);
    const model = await provider.getModel();

    expect(model.kernel).toBe("ONLINE");
    expect(model.memory).toBe("CONNECTED");
    expect(model.guardian).toBe("RUNNING");
    expect(model.pipeline).toBe("READY");
    expect(model.modules.length).toBeGreaterThanOrEqual(8);
  });

  it("executes desktop boot sequence cleanly", async () => {
    const { kernel, statusPanel } = await bootAbraxas(":memory:");

    expect(kernel).toBeDefined();
    expect(statusPanel.kernel).toBe("ONLINE");
    expect(statusPanel.modules.length).toBeGreaterThanOrEqual(8);
  });

  it("executes complete organism unification through ARQUITECTO and Kernel", async () => {
    const arquitecto = new ArquitectoCentralInterface(":memory:");
    const response = await arquitecto.executeHumanIntention("Demonstrate full unified kernel execution");

    expect(response.verdict).toBe("INTENTION_MANIFESTED_SUCCESSFULLY");
    expect(response.casOutputUri.startsWith("cas://")).toBe(true);
    expect(response.systemHealth).toBe("OPTIMAL");
  });
});
