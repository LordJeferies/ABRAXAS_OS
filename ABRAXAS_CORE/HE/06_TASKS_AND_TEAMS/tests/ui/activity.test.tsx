import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, ActivityView} from "../../ui/index.ts";

describe("UI Integration — Activity Ledger (AC-P3A-014)", () => {
  it("renders chronological audit ledger with entry details", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.createTask({title: "Audit Test Task"}, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <ActivityView />
      </HeProvider>
    );

    expect(html).toContain("Operational Audit Ledger");
    expect(html).toContain("BOOTSTRAP_INITIALIZED");
    expect(html).toContain("TASK_CREATED");
    expect(html).toContain("Audit Test Task");
  });
});
