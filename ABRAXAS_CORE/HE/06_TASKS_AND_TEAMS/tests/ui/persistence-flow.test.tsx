import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {JsonFileOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, HeProductShell} from "../../ui/index.ts";

describe("UI Integration — Real Local Persistence & First-Run Flow (AC-P3A-015)", () => {
  const tmpDir = "/tmp/he_ui_persistence_flow_test";
  const tmpFile = path.join(tmpDir, "operations_store_v1.json");

  it("handles uninitialized first-run and persists real mutations across reloads", () => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, {recursive: true, force: true});

    const store1 = new JsonFileOperationsStore(tmpFile);
    let idCounter = 1;
    const service1 = new HeOperationsService(store1, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    // First run screen render
    const firstRunHtml = renderToString(
      <HeProvider service={service1}>
        <HeProductShell />
      </HeProvider>
    );
    expect(firstRunHtml).toContain("first-run-screen");

    // Execute bootstrap
    service1.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service1.createTask({title: "Real Persisted Task"}, "u_owner");

    expect(fs.existsSync(tmpFile)).toBe(true);

    // Reload fresh instance
    const store2 = new JsonFileOperationsStore(tmpFile);
    const service2 = new HeOperationsService(store2);
    const readyHtml = renderToString(
      <HeProvider service={service2} initialActorId="u_owner">
        <HeProductShell />
      </HeProvider>
    );

    expect(readyHtml).toContain("he-product-shell");
    expect(store2.listTasks().length).toBe(1);
    expect(store2.listTasks()[0]?.title).toBe("Real Persisted Task");

    fs.rmSync(tmpDir, {recursive: true, force: true});
  });
});
