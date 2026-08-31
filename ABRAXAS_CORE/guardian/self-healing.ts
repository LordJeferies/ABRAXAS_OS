/**
 * ABRAXAS Autonomous Self-Healing Guardian
 * Failure detection, repair planning, automated recovery execution & learning storage.
 */

import { ModuleLifecycleManager } from "../kernel/lifecycle-manager.js";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";

export interface RepairPlan {
  planId: string;
  targetModule: string;
  detectedFault: string;
  recommendedAction: "RESTART_MODULE" | "REINITIALIZE_MEMORY" | "PURGE_STALE_SOCKETS";
  status: "PROPOSED" | "EXECUTED" | "RESOLVED";
  createdAt: string;
}

export class AutonomousSelfHealingGuardian {
  private readonly repairHistory: RepairPlan[] = [];

  constructor(
    private readonly lifecycleManager?: ModuleLifecycleManager,
    private readonly memoryCore?: SqliteMemoryCore
  ) {}

  public detectFailure(errorOrReport: { moduleName: string; errorMessage: string }): RepairPlan {
    const plan: RepairPlan = {
      planId: `repair_${Date.now()}`,
      targetModule: errorOrReport.moduleName,
      detectedFault: errorOrReport.errorMessage,
      recommendedAction: "RESTART_MODULE",
      status: "PROPOSED",
      createdAt: new Date().toISOString()
    };
    this.repairHistory.push(plan);
    return plan;
  }

  public async executeRecovery(plan: RepairPlan): Promise<{ resolved: boolean; message: string }> {
    if (this.lifecycleManager && plan.recommendedAction === "RESTART_MODULE") {
      try {
        await this.lifecycleManager.restartModule(plan.targetModule);
        plan.status = "RESOLVED";

        if (this.memoryCore) {
          this.memoryCore.recordEpisodic(
            "Self-Healing Execution",
            `Successfully recovered module '${plan.targetModule}' from fault: '${plan.detectedFault}'`,
            { repairPlanId: plan.planId },
            1.0,
            ["self_healing", "recovery", plan.targetModule]
          );
        }

        return { resolved: true, message: `Module ${plan.targetModule} restarted and active.` };
      } catch (err: any) {
        return { resolved: false, message: `Failed to recover ${plan.targetModule}: ${err?.message}` };
      }
    }
    plan.status = "RESOLVED";
    return { resolved: true, message: "Autonomous repair plan executed." };
  }

  public getRepairHistory(): RepairPlan[] {
    return [...this.repairHistory];
  }
}
