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

describe("ABRAXAS OS V5.1 — Kernel Integration & Organism Unification Suite", () => {
  it("boots AbraxasKernel and initializes all master subsystems", () => {
    const kernel = new AbraxasKernel(":memory:");
    const bootResult = kernel.boot();

    expect(bootResult.system).toBe("ABRAXAS OS");
    expect(bootResult.status).toBe("ONLINE");
    expect(bootResult.version).toContain("5.1.0");
    expect(bootResult.registeredModulesCount).toBe(13);
    expect(bootResult.memoryConnected).toBe(true);
    expect(bootResult.guardianStatus).toBe("OPTIMAL");
  });

  it("registers and queries all 13 canonical modules in ModuleRegistry", () => {
    const registry = new ModuleRegistry();
    const modules = registry.list();

    expect(modules.length).toBe(13);
    expect(registry.get("YOD")?.status).toBe("ACTIVE");
    expect(registry.get("CONTENIDO")?.status).toBe("ACTIVE");
    expect(registry.get("SHIM")?.capabilities).toContain("DAAT_REALITY_METROLOGY");
    expect(registry.get("VAV")?.capabilities).toContain("LOSSLESS_CUTS");
    expect(registry.get("HE")?.capabilities).toContain("OPERATIONS_DESK");
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
    expect(result.finalSefirahState).toBe("MALKHUT");
  });

  it("generates system status panel model for desktop visualization", () => {
    const kernel = new AbraxasKernel(":memory:");
    const provider = new SystemStatusPanelProvider(kernel);
    const model = provider.getModel();

    expect(model.kernel).toBe("ONLINE");
    expect(model.memory).toBe("CONNECTED");
    expect(model.guardian).toBe("RUNNING");
    expect(model.pipeline).toBe("READY");
    expect(model.modules.length).toBe(13);
  });

  it("executes desktop boot sequence cleanly", async () => {
    const { kernel, statusPanel } = await bootAbraxas(":memory:");

    expect(kernel).toBeDefined();
    expect(statusPanel.kernel).toBe("ONLINE");
    expect(statusPanel.modules.length).toBe(13);
  });

  it("executes complete organism unification through ARQUITECTO and Kernel", async () => {
    const arquitecto = new ArquitectoCentralInterface(":memory:");
    const response = await arquitecto.executeHumanIntention("Demonstrate full unified kernel execution");

    expect(response.verdict).toBe("INTENTION_MANIFESTED_SUCCESSFULLY");
    expect(response.casOutputUri.startsWith("cas://")).toBe(true);
    expect(response.systemHealth).toBe("OPTIMAL");
  });
});
