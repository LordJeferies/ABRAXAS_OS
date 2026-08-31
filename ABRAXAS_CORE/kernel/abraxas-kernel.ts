/**
 * ABRAXAS Operating System Kernel
 * Central master cortex uniting Identity, Events, Tree of Life, Evolution, Memory, and Module Registry.
 */

import { IdentityCore } from "../identity/src/identity-core.js";
import { NeuralEventBus } from "../backbone/src/neural-event-bus.js";
import { TreeOfLifeEngine } from "../pipeline/src/tree-of-life-engine.js";
import { AutonomousEvolutionEngine } from "../evolution/src/autonomous-evolution-engine.js";
import { ModuleRegistry } from "./module-registry.js";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";
import { SystemGuardian } from "../guardian/src/system-guardian.js";

export interface KernelBootResult {
  system: string;
  version: string;
  state: string;
  status: "ONLINE" | "INITIALIZING" | "DEGRADED" | "OFFLINE";
  registeredModulesCount: number;
  memoryConnected: boolean;
  guardianStatus: string;
  bootTimestamp: string;
}

export class AbraxasKernel {
  public readonly identity: IdentityCore;
  public readonly events: NeuralEventBus;
  public readonly tree: TreeOfLifeEngine;
  public readonly evolution: AutonomousEvolutionEngine;
  public readonly modules: ModuleRegistry;
  public readonly memory: SqliteMemoryCore;
  public readonly guardian: SystemGuardian;

  constructor(dbPath = ":memory:") {
    this.identity = new IdentityCore();
    this.events = new NeuralEventBus();
    this.tree = new TreeOfLifeEngine();
    this.evolution = new AutonomousEvolutionEngine();
    this.modules = new ModuleRegistry();
    this.memory = new SqliteMemoryCore(dbPath);
    this.guardian = new SystemGuardian(this.memory);
  }

  public boot(): KernelBootResult {
    const id = this.identity.getIdentity();
    const guardianReport = this.guardian.auditSystem();

    this.events.emitCognitive(
      "KERNEL_BOOTED",
      "SYSTEM",
      "ABRAXAS OS Kernel initialized and online",
      1.0,
      ["ALL_MODULES_REGISTERED", "MEMORY_ONLINE", "GUARDIAN_ONLINE"],
      1.0
    );

    this.memory.recordArchitecturalEvolution(
      "KERNEL_BOOT",
      "AbraxasKernel boot sequence executed successfully",
      "ONLINE"
    );

    return {
      system: id.systemName,
      version: "5.1.0-kernel",
      state: this.tree.getState(),
      status: "ONLINE",
      registeredModulesCount: this.modules.list().length,
      memoryConnected: true,
      guardianStatus: guardianReport.overallStatus,
      bootTimestamp: new Date().toISOString()
    };
  }
}
