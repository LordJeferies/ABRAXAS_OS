/**
 * ABRAXAS System Status Panel Data Provider
 */

import { AbraxasKernel } from "./abraxas-kernel.js";

export interface SystemStatusPanelModel {
  kernel: "ONLINE" | "OFFLINE";
  modules: Array<{ name: string; status: "ACTIVE" | "INACTIVE"; capabilitiesCount: number }>;
  memory: "CONNECTED" | "DISCONNECTED";
  guardian: "RUNNING" | "STOPPED";
  pipeline: "READY" | "BUSY" | "ERROR";
  systemVersion: string;
  activeSefirah: string;
}

export class SystemStatusPanelProvider {
  constructor(private readonly kernel: AbraxasKernel) {}

  public getModel(): SystemStatusPanelModel {
    const boot = this.kernel.boot();
    const modules = this.kernel.modules.list().map((m) => ({
      name: m.name,
      status: m.status,
      capabilitiesCount: m.capabilities.length
    }));

    return {
      kernel: boot.status === "ONLINE" ? "ONLINE" : "OFFLINE",
      modules,
      memory: "CONNECTED",
      guardian: boot.guardianStatus === "OPTIMAL" ? "RUNNING" : "STOPPED",
      pipeline: "READY",
      systemVersion: boot.version,
      activeSefirah: boot.state
    };
  }
}
