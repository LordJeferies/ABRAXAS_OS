/**
 * ABRAXAS Master Operating System Kernel
 */

import { IdentityCore } from "../identity/src/identity-core.js";
import { NeuralEventBus } from "../events/neural-event-bus.js";
import { ModuleRegistry } from "./module-registry.js";
import { TreeEngine, State } from "../tree-of-life/state-machine.js";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";
import { EvolutionEngine } from "../guardian/evolution-engine.js";

export class AbraxasKernel {
  public identity: IdentityCore;
  public events: NeuralEventBus;
  public modules: ModuleRegistry;
  public tree: TreeEngine;
  public memory: SqliteMemoryCore;
  public evolution: EvolutionEngine;

  constructor(dbPath = ":memory:") {
    this.identity = new IdentityCore();
    this.events = new NeuralEventBus();
    this.modules = new ModuleRegistry();
    this.tree = new TreeEngine();
    this.memory = new SqliteMemoryCore(dbPath);
    this.evolution = new EvolutionEngine();
  }

  public async boot() {
    console.log("ABRAXAS KERNEL STARTING");

    this.events.emit({
      type: "KERNEL_STARTING",
      meaning: "AbraxasKernel boot sequence initiated",
      timestamp: new Date().toISOString()
    });

    return {
      status: "ONLINE",
      system: this.identity.getIdentity().systemName,
      state: this.tree.getState(),
      identity: this.identity.getIdentity(),
      modules: this.modules.list(),
      registeredModulesCount: this.modules.list().length,
      memoryConnected: true,
      guardianStatus: "OPTIMAL"
    };
  }
}
