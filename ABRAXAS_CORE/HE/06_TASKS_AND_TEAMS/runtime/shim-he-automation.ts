/**
 * SHIM ↔ HE Automation Bridge
 * Automatically creates 'PICKUP_RECORDING' tasks in HE when SHIM detects GAPs.
 */

import { HeOperationsService } from "./service.js";
import { ShimObservationReport, BeatObservation } from "../../../SHIM/src/types.js";

export interface PickupTaskPayload {
  contenidoId: string;
  beatId: string;
  missingElement: string;
  priority: "HIGH" | "URGENT" | "NORMAL";
  deadline: string;
}

export class ShimHeAutomationBridge {
  constructor(
    private readonly heService: HeOperationsService,
    private readonly defaultActorId = "u_owner"
  ) {}

  public processShimReport(report: ShimObservationReport): Array<{ taskId: string; beatId: string }> {
    const createdTasks: Array<{ taskId: string; beatId: string }> = [];

    for (const gap of report.gaps) {
      const deadline = new Date(Date.now() + 86400000 * 2).toISOString(); // +48 hours
      const payload: PickupTaskPayload = {
        contenidoId: report.contentId,
        beatId: gap.beatId,
        missingElement: gap.beatId,
        priority: "HIGH",
        deadline
      };

      const task = this.heService.createTask(
        {
          title: `[PICKUP REQUIRED] Re-record Beat ${gap.beatId} for Content ${report.contentId}`,
          description: `SHIM Da'at metrology identified missing beat '${gap.beatId}'. Scripted intent not observed in source ${report.sourceId}.`,
          priority: "HIGH",
          dueDate: deadline
        },
        this.defaultActorId
      );

      createdTasks.push({
        taskId: task.taskId,
        beatId: gap.beatId
      });
    }

    return createdTasks;
  }
}
