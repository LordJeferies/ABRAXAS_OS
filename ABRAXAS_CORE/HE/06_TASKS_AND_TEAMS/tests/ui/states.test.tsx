import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, HeProductShell} from "../../ui/index.ts";

describe("UI Integration — Global State Handling (AC-P3A-002)", () => {
  it("renders empty state messages cleanly across views", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    const shellHtml = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <HeProductShell />
      </HeProvider>
    );

    expect(shellHtml).toContain("Solo queue is clear");
  });
});
