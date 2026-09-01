/**
 * System Health Registry — Aggregates health checks across all subsystems
 */

export interface SubsystemHealth {
  subsystem: string;
  status: "PASS" | "WARN" | "FAIL";
  details?: Record<string, unknown> | undefined;
}

export interface SystemHealthReport {
  overallStatus: "PASS" | "WARN" | "FAIL";
  subsystems: SubsystemHealth[];
  generatedAt: string;
}

export class HealthRegistry {
  private checks = new Map<string, () => Promise<SubsystemHealth>>();

  public registerCheck(subsystem: string, checkFn: () => Promise<SubsystemHealth>): void {
    this.checks.set(subsystem, checkFn);
  }

  public async evaluateHealth(): Promise<SystemHealthReport> {
    const subsystems: SubsystemHealth[] = [];
    let overallStatus: "PASS" | "WARN" | "FAIL" = "PASS";

    for (const [subsystem, checkFn] of this.checks.entries()) {
      try {
        const res = await checkFn();
        subsystems.push(res);
        if (res.status === "FAIL") overallStatus = "FAIL";
        else if (res.status === "WARN" && overallStatus !== "FAIL") overallStatus = "WARN";
      } catch (err: any) {
        subsystems.push({ subsystem, status: "FAIL", details: { error: err.message } });
        overallStatus = "FAIL";
      }
    }

    return {
      overallStatus,
      subsystems,
      generatedAt: new Date().toISOString()
    };
  }
}
