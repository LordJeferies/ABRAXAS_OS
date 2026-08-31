import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, HeProductShell} from "../../ui/index.ts";

describe("UI Integration — Shell, Navigation & Global States (AC-P3A-001, AC-P3A-002)", () => {
  it("renders FIRST_RUN bootstrap screen when store is empty", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);

    const html = renderToString(
      <HeProvider service={service}>
        <HeProductShell />
      </HeProvider>
    );

    expect(html).toContain("Welcome to He Operations Core");
    expect(html).toContain("first-run-screen");
    expect(html).toContain("Initialize He Core");
  });

  it("renders main product shell with navigation when store is initialized", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <HeProductShell />
      </HeProvider>
    );

    expect(html).toContain("he-product-shell");
    expect(html).toContain("Solo Queue");
    expect(html).toContain("Team Dashboard");
    expect(html).toContain("Kanban");
    expect(html).toContain("Calendar");
    expect(html).toContain("Deadlines");
    expect(html).toContain("Recordings");
    expect(html).toContain("Reviews");
    expect(html).toContain("People &amp; Roles");
    expect(html).toContain("Activity");
  });
});
