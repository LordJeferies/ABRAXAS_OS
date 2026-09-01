import { describe, it, expect } from "vitest";
import { AutomationEngine } from "../src/automation-engine.js";

describe("Automation Engine V1 — Rule Evaluation & Event Response", () => {
  it("evaluates trigger events against rules and executes automated actions safely", async () => {
    const engine = new AutomationEngine();

    const events = await engine.evaluateTrigger("shim.gap_detected", {
      contentId: "content_auto_01",
      gaps: ["P3"]
    });

    expect(events.length).toBe(1);
    expect(events[0]?.actionExecuted).toBe("create_task");
    expect(events[0]?.result["payload"]).toEqual({
      taskTitle: "Record Pickup Take",
      priority: "HIGH"
    });
  });
});
