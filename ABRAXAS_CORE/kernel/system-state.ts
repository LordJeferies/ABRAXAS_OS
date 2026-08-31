/**
 * ABRAXAS System State Model
 */

import { State } from "../tree-of-life/state-machine.js";

export interface SystemStateSnapshot {
  systemName: string;
  kernelStatus: "ONLINE" | "INITIALIZING" | "OFFLINE";
  currentSefirah: State;
  activeModulesCount: number;
  memoryConnected: boolean;
  timestamp: string;
}

export class SystemStateTracker {
  private status: "ONLINE" | "INITIALIZING" | "OFFLINE" = "INITIALIZING";

  public setStatus(s: "ONLINE" | "INITIALIZING" | "OFFLINE"): void {
    this.status = s;
  }

  public getStatus(): "ONLINE" | "INITIALIZING" | "OFFLINE" {
    return this.status;
  }
}
