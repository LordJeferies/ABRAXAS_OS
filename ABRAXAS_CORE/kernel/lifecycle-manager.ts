/**
 * ABRAXAS Real Module Lifecycle Manager
 * Manages full lifecycle states: INITIALIZING -> ACTIVE -> DEGRADED -> RESTARTING -> STOPPED.
 */

export type ModuleState = "INITIALIZING" | "ACTIVE" | "DEGRADED" | "RESTARTING" | "STOPPED";

export interface LifecycleAwareModule {
  name: string;
  version: string;
  purpose: string;
  status: ModuleState;
  dependencies?: string[];
  capabilities?: string[];
  initialize(): Promise<void>;
  healthCheck(): Promise<{ status: "HEALTHY" | "DEGRADED" | "FAILING"; details?: Record<string, unknown> }>;
  restart(): Promise<void>;
  shutdown(): Promise<void>;
}

export class ModuleLifecycleManager {
  private readonly modules: Map<string, LifecycleAwareModule> = new Map();

  public register(module: LifecycleAwareModule): void {
    this.modules.set(module.name, module);
  }

  public async initializeAll(): Promise<Record<string, ModuleState>> {
    const results: Record<string, ModuleState> = {};
    for (const [name, mod] of this.modules.entries()) {
      try {
        mod.status = "INITIALIZING";
        await mod.initialize();
        mod.status = "ACTIVE";
      } catch (err) {
        mod.status = "DEGRADED";
      }
      results[name] = mod.status;
    }
    return results;
  }

  public async healthCheckAll(): Promise<Record<string, { status: string; health: string }>> {
    const report: Record<string, { status: string; health: string }> = {};
    for (const [name, mod] of this.modules.entries()) {
      try {
        const check = await mod.healthCheck();
        report[name] = { status: mod.status, health: check.status };
      } catch (err) {
        mod.status = "DEGRADED";
        report[name] = { status: mod.status, health: "FAILING" };
      }
    }
    return report;
  }

  public async restartModule(name: string): Promise<ModuleState> {
    const mod = this.modules.get(name);
    if (!mod) throw new Error(`Module ${name} not found in lifecycle manager`);

    mod.status = "RESTARTING";
    await mod.shutdown();
    await mod.restart();
    mod.status = "ACTIVE";
    return mod.status;
  }

  public async shutdownAll(): Promise<void> {
    for (const mod of this.modules.values()) {
      await mod.shutdown();
      mod.status = "STOPPED";
    }
  }

  public get(name: string): LifecycleAwareModule | undefined {
    return this.modules.get(name);
  }

  public list(): LifecycleAwareModule[] {
    return Array.from(this.modules.values());
  }
}
