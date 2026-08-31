/**
 * ARQUITECTO Real-Time System Telemetry Monitor
 * Answers: "What is happening inside ABRAXAS right now?"
 */

export interface SystemTelemetryState {
  systemHealth: "OPTIMAL" | "DEGRADED" | "CRITICAL";
  activeWorkflowsCount: number;
  totalArtifactsCount: number;
  lastVerifiedContentId?: string;
  metrologyGapsDetectedCount: number;
  recentEvents: string[];
  timestamp: string;
}

export class ArquitectoSystemMonitor {
  private activeWorkflows = 0;
  private totalArtifacts = 0;
  private gapCount = 0;
  private lastVerifiedId?: string;
  private readonly eventLog: string[] = [];

  public recordEvent(eventDesc: string): void {
    this.eventLog.unshift(`[${new Date().toISOString()}] ${eventDesc}`);
    if (this.eventLog.length > 50) this.eventLog.pop();
  }

  public recordMetrologyResult(contentId: string, gaps: number): void {
    this.lastVerifiedId = contentId;
    this.gapCount += gaps;
    this.recordEvent(`SHIM verified '${contentId}' with ${gaps} gaps`);
  }

  public getRealtimeSystemState(): SystemTelemetryState {
    return {
      systemHealth: this.gapCount === 0 ? "OPTIMAL" : "DEGRADED",
      activeWorkflowsCount: this.activeWorkflows,
      totalArtifactsCount: this.totalArtifacts,
      lastVerifiedContentId: this.lastVerifiedId,
      metrologyGapsDetectedCount: this.gapCount,
      recentEvents: this.eventLog.slice(0, 10),
      timestamp: new Date().toISOString()
    };
  }
}
