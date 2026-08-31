import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, DeadlinesView} from "../../ui/index.ts";

describe("UI Integration — Deadlines Manager (AC-P3A-011)", () => {
  it("renders active deadlines table and set deadline form", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    service.setDeadline({
      targetType: "LIENZO", targetId: "lz_01", dueAt: "2026-09-05T18:00:00Z", timezone: "America/Bogota"
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <DeadlinesView />
      </HeProvider>
    );

    expect(html).toContain("Deadlines &amp; Milestone Tracking");
    expect(html).toContain("LIENZO: lz_01");
    expect(html).toContain("ACTIVE");
  });
});
