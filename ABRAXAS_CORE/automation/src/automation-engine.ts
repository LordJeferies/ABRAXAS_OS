/**
 * Automation Engine — Evaluates rules and triggers actions safely
 */

import { randomUUID } from "node:crypto";
import { AutomationRule, AutomationTriggerType, AutomationExecutionEvent } from "./types.js";

export class AutomationEngine {
  private rules: AutomationRule[] = [];
  private executionLog: AutomationExecutionEvent[] = [];

  constructor() {
    this.seedDefaultRules();
  }

  private seedDefaultRules(): void {
    this.rules.push({
      ruleId: "rule_shim_gap_to_pickup_task",
      name: "Auto-create pickup task on Shim gap",
      trigger: "shim.gap_detected",
      action: "create_task",
      actionPayload: { taskTitle: "Record Pickup Take", priority: "HIGH" },
      isEnabled: true
    });

    this.rules.push({
      ruleId: "rule_render_to_qa_notification",
      name: "Notify QA on render complete",
      trigger: "render.completed",
      action: "notify",
      actionPayload: { recipientRole: "QA_LEAD", message: "Render ready for final review" },
      isEnabled: true
    });
  }

  public registerRule(rule: AutomationRule): void {
    this.rules.push(rule);
  }

  public async evaluateTrigger(trigger: AutomationTriggerType, eventData: Record<string, unknown>): Promise<AutomationExecutionEvent[]> {
    const matchedRules = this.rules.filter((r) => r.isEnabled && r.trigger === trigger);
    const results: AutomationExecutionEvent[] = [];

    for (const rule of matchedRules) {
      const execEvent: AutomationExecutionEvent = {
        ruleId: rule.ruleId,
        triggerEvent: trigger,
        actionExecuted: rule.action,
        result: {
          success: true,
          triggeredBy: eventData,
          payload: rule.actionPayload
        },
        timestamp: new Date().toISOString()
      };
      this.executionLog.push(execEvent);
      results.push(execEvent);
    }

    return results;
  }

  public getExecutionLog(): AutomationExecutionEvent[] {
    return [...this.executionLog];
  }
}
