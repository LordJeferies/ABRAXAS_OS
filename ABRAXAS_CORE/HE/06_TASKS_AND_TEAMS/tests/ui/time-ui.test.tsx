import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, TimeTrackingView} from "../../ui/index.ts";

describe("UI Integration — Time Tracking View (AC-P3B-009)", () => {
  it("renders active timer controls, manual entry form, and personal summary", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    const task = service.createTask({title: "UI Time Test Task"}, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <TimeTrackingView />
      </HeProvider>
    );

    expect(html).toContain("Operational Time Tracking");
    expect(html).toContain("Active Timer");
    expect(html).toContain("Manual Time Entry");
    expect(html).toContain("Personal Time Summary");
    expect(html).toContain("Start Timer");
  });
});
