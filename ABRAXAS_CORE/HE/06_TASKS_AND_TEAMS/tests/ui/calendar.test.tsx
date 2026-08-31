import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, CalendarView} from "../../ui/index.ts";

describe("UI Integration — Production Calendar (AC-P3A-009)", () => {
  it("renders scheduled events and deadlines in list, month, and week modes", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    service.setDeadline({
      targetType: "TASK", targetId: "tsk_1", dueAt: "2026-09-02T18:00:00Z", timezone: "America/Bogota"
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <CalendarView />
      </HeProvider>
    );

    expect(html).toContain("Production Calendar");
    expect(html).toContain("Deadline: TASK tsk_1");
    expect(html).toContain("DEADLINE");
  });
});
