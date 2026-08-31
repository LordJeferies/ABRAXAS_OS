/**
 * ABRAXAS Control Center Data & Telemetry Provider
 */

import { AbraxasKernel } from "./abraxas-kernel.js";

export interface ControlCenterDashboard {
  systemTitle: string;
  kernelStatus: "ONLINE" | "INITIALIZING" | "DEGRADED" | "OFFLINE";
  sefirahState: string;
  sefirahPurpose: string;
  memoryConnected: boolean;
  activeModulesCount: number;
  totalModulesCount: number;
  modules: Array<{ name: string; status: string; purpose: string }>;
  recentEventsCount: number;
  healingEventsCount: number;
  timestamp: string;
}

export class AbraxasControlCenter {
  constructor(private readonly kernel: AbraxasKernel) {}

  public async getDashboardData(): Promise<ControlCenterDashboard> {
    const boot = await this.kernel.boot();
    const modules = this.kernel.modules.list().map((m) => ({
      name: m.name,
      status: m.status,
      purpose: m.purpose
    }));

    return {
      systemTitle: "ABRAXAS OS — Autonomous Operating Control Center",
      kernelStatus: boot.status === "ONLINE" ? "ONLINE" : "DEGRADED",
      sefirahState: String(boot.state),
      sefirahPurpose: "Primary Sephirothic Operating State",
      memoryConnected: boot.memoryConnected,
      activeModulesCount: modules.filter((m) => m.status === "ACTIVE").length,
      totalModulesCount: modules.length,
      modules,
      recentEventsCount: this.kernel.events.getJournal().length,
      healingEventsCount: 0,
      timestamp: new Date().toISOString()
    };
  }
}
