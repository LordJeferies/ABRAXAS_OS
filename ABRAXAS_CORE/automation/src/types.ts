/**
 * Automation Rule Engine Types
 */

export type AutomationTriggerType =
  | "task.completed"
  | "deadline.approaching"
  | "shim.gap_detected"
  | "render.completed"
  | "approval.granted"
  | "lienzo.out_of_sync";

export type AutomationActionType =
  | "create_task"
  | "notify"
  | "request_approval"
  | "change_allowed_state"
  | "suggest_next_action";

export interface AutomationRule {
  ruleId: string;
  name: string;
  trigger: AutomationTriggerType;
  conditions?: Record<string, unknown> | undefined;
  action: AutomationActionType;
  actionPayload: Record<string, unknown>;
  isEnabled: boolean;
}

export interface AutomationExecutionEvent {
  ruleId: string;
  triggerEvent: string;
  actionExecuted: AutomationActionType;
  result: Record<string, unknown>;
  timestamp: string;
}
