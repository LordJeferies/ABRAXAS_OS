import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, RecordingSessionsView} from "../../ui/index.ts";

describe("UI Integration — Recording Sessions Manager (AC-P3A-010)", () => {
  it("renders scheduled sessions and confirmation controls", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    service.createRecordingSession({
      title: "Batch Studio Capture",
      startsAt: "2026-09-02T10:00:00Z",
      endsAt: "2026-09-02T14:00:00Z",
      timezone: "America/Bogota",
      locationType: "PHYSICAL",
      people: [{userId: "u_owner", role: "Presenter"}]
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <RecordingSessionsView />
      </HeProvider>
    );

    expect(html).toContain("Recording Sessions");
    expect(html).toContain("Batch Studio Capture");
    expect(html).toContain("DRAFT");
    expect(html).toContain("Confirm");
  });
});
