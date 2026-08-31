import { describe, it, expect } from "vitest";
import { ModuleLifecycleManager, LifecycleAwareModule } from "../kernel/lifecycle-manager.js";
import { BootManager } from "../kernel/boot-manager.js";
import { UnifiedTreeOfLifeEngine, CANONICAL_CABALISTIC_TREE } from "../tree-of-life/canonical-states.js";
import { CognitiveNeuralEventBus } from "../events/neural-event-bus.js";
import { AutonomousSelfHealingGuardian } from "../guardian/self-healing.js";
import { AbraxasControlCenter } from "../kernel/control-center.js";
import { AbraxasKernel } from "../kernel/abraxas-kernel.js";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";

describe("ABRAXAS OS V5.2 — Autonomous Operating Layer Suite", () => {
  // 1. Module Lifecycle Manager
  it("manages full lifecycle states for all registered modules", async () => {
    const lifecycle = new ModuleLifecycleManager();

    let initCalled = false;
    let restartCalled = false;
    let shutdownCalled = false;

    const mockModule: LifecycleAwareModule = {
      name: "TEST_OPERATOR",
      version: "5.2.0",
      purpose: "Autonomous Execution Testing",
      status: "INITIALIZING",
      initialize: async () => { initCalled = true; },
      healthCheck: async () => ({ status: "HEALTHY" }),
      restart: async () => { restartCalled = true; },
      shutdown: async () => { shutdownCalled = true; }
    };

    lifecycle.register(mockModule);
    const initReport = await lifecycle.initializeAll();
    expect(initCalled).toBe(true);
    expect(initReport["TEST_OPERATOR"]).toBe("ACTIVE");

    const health = await lifecycle.healthCheckAll();
    expect(health["TEST_OPERATOR"].health).toBe("HEALTHY");

    const restartedStatus = await lifecycle.restartModule("TEST_OPERATOR");
    expect(restartCalled).toBe(true);
    expect(restartedStatus).toBe("ACTIVE");

    await lifecycle.shutdownAll();
    expect(shutdownCalled).toBe(true);
    expect(lifecycle.get("TEST_OPERATOR")?.status).toBe("STOPPED");
  });

  // 2. Real Sequential Boot Manager
  it("executes the complete 7-step boot ladder", async () => {
    const bootManager = new BootManager();
    const { kernel, arquitecto, report } = await bootManager.launch(":memory:");

    expect(kernel).toBeDefined();
    expect(arquitecto).toBeDefined();
    expect(report.stepsCompleted.length).toBe(7);
    expect(report.stepsCompleted[0]).toBe("DESKTOP_LAUNCH_TRIGGERED");
    expect(report.stepsCompleted[6]).toBe("ARQUITECTO_ONLINE");
    expect(report.kernelStatus).toBe("ONLINE");
    expect(report.memoryConnected).toBe(true);
    expect(report.totalBootTimeMs).toBeGreaterThanOrEqual(0);
  });

  // 3. Unified Cabalistic State Model
  it("enforces canonical transitions and validation requirements on Tree of Life", () => {
    const tree = new UnifiedTreeOfLifeEngine();
    expect(tree.getCurrentState().sefirah).toBe("KETER");
    expect(tree.getCurrentState().symbolicName).toContain("Primordial Intention");

    tree.transition("CHOKHMAH");
    tree.transition("BINAH");
    tree.transition("DAAT");

    // DAAT to TIFERET without SHIM certificate -> MUST THROW
    expect(() => tree.transition("TIFERET", { isShimVerified: false })).toThrow(/Cannot descend from DAAT to TIFERET/);

    // Valid verification
    const tiferet = tree.transition("TIFERET", { isShimVerified: true });
    expect(tiferet.sefirah).toBe("TIFERET");
    expect(tiferet.associatedOperator).toBe("VAV");

    tree.transition("HOD");
    tree.transition("YESOD");

    // YESOD to MALKHUT without approval -> MUST THROW
    expect(() => tree.transition("MALKHUT", { isApproved: false })).toThrow(/Cannot manifest into MALKHUT/);

    const malkhut = tree.transition("MALKHUT", { isApproved: true });
    expect(malkhut.sefirah).toBe("MALKHUT");
    expect(malkhut.allowedTransitions).toContain("KETER");
  });

  // 4. Cognitive Neural Event Intelligence
  it("emits cognitive events with meaning, confidence, consequences and recommended reactions", () => {
    const bus = new CognitiveNeuralEventBus();

    let capturedEvent: any = null;
    bus.subscribe((evt) => {
      capturedEvent = evt;
    });

    const emitted = bus.emitCognitive(
      "DAAT_REALITY_VERIFIED",
      "contenido_404",
      "Whisper transcription aligned perfectly with planned script",
      0.99,
      ["UNLOCK_VAV_RENDER", "PERMIT_HE_GOVERNANCE"],
      1.5,
      ["PROCEED_TO_FORMATION_FORGE"]
    );

    expect(capturedEvent).toBeDefined();
    expect(capturedEvent.recommendedReactions).toContain("PROCEED_TO_FORMATION_FORGE");
    expect(bus.getJournal().length).toBe(1);
  });

  // 5. Autonomous Self-Healing Guardian
  it("detects fault, creates repair plan, executes recovery and stores memory learning", async () => {
    const memory = new SqliteMemoryCore(":memory:");
    const lifecycle = new ModuleLifecycleManager();

    let restarted = false;
    lifecycle.register({
      name: "VAV_ENGINE",
      version: "5.2.0",
      purpose: "Render media",
      status: "DEGRADED",
      initialize: async () => {},
      healthCheck: async () => ({ status: "DEGRADED" }),
      restart: async () => { restarted = true; },
      shutdown: async () => {}
    });

    const guardian = new AutonomousSelfHealingGuardian(lifecycle, memory);
    const fault = { moduleName: "VAV_ENGINE", errorMessage: "FFmpeg child process timeout" };
    const plan = guardian.detectFailure(fault);

    expect(plan.targetModule).toBe("VAV_ENGINE");
    expect(plan.status).toBe("PROPOSED");

    const recoveryResult = await guardian.executeRecovery(plan);
    expect(recoveryResult.resolved).toBe(true);
    expect(restarted).toBe(true);
    expect(plan.status).toBe("RESOLVED");

    const memories = memory.queryEpisodic(0.9);
    expect(memories.length).toBe(1);
    expect(memories[0].topic).toBe("Self-Healing Execution");
  });

  // 6. Abraxas Control Center Dashboard
  it("provides unified telemetry dashboard for desktop control center", async () => {
    const kernel = new AbraxasKernel(":memory:");
    const controlCenter = new AbraxasControlCenter(kernel);
    const dashboard = await controlCenter.getDashboardData();

    expect(dashboard.kernelStatus).toBe("ONLINE");
    expect(dashboard.memoryConnected).toBe(true);
    expect(dashboard.activeModulesCount).toBeGreaterThanOrEqual(8);
    expect(dashboard.modules.some((m) => m.name === "YOD")).toBe(true);
  });

  // 7. Full Organism Autonomous Operating Simulation
  it("executes full autonomous loop: Intention -> ARQUITECTO -> Kernel -> Failure Injection -> Guardian Repair -> Learning", async () => {
    const boot = new BootManager();
    const { kernel, arquitecto } = await boot.launch(":memory:");

    // 1. Human Intention Execution
    const response = await arquitecto.executeHumanIntention("Manifest autonomous self-healing demonstration video");
    expect(response.verdict).toBe("INTENTION_MANIFESTED_SUCCESSFULLY");

    // 2. Failure Injection Simulation
    const healing = new AutonomousSelfHealingGuardian(undefined, kernel.memory);
    const repairPlan = healing.detectFailure({
      moduleName: "SHIM",
      errorMessage: "Transcription socket reset during reality check"
    });

    // 3. Autonomous Repair & Learning
    const recResult = await healing.executeRecovery(repairPlan);
    expect(recResult.resolved).toBe(true);

    const logs = healing.getRepairHistory();
    expect(logs.length).toBe(1);
    expect(logs[0].status).toBe("RESOLVED");
  });
});
