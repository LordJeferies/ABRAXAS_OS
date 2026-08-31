import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("UI Static Encapsulation & Service Boundary (AC-P3A-003)", () => {
  const uiDir = "/Users/lordjef/Desktop/abraxasos/ABRAXAS_CORE/HE/06_TASKS_AND_TEAMS/ui";

  it("verifies zero raw store imports, zero any-casts, and zero private store access in UI components", () => {
    const files = fs.readdirSync(uiDir).filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
    expect(files.length).toBeGreaterThan(5);

    let privateStoreAccessCount = 0;
    let anyCastStoreEscapeCount = 0;
    let rawStoreExportImportCount = 0;

    for (const filename of files) {
      const fullPath = path.join(uiDir, filename);
      const content = fs.readFileSync(fullPath, "utf-8");

      if (content.includes("MemoryOperationsStore") || content.includes("JsonFileOperationsStore") || content.includes("OperationsStore")) {
        rawStoreExportImportCount++;
      }
      if (content.includes("from \"../runtime/infrastructure") || content.includes("from \"./infrastructure")) {
        rawStoreExportImportCount++;
      }
      if (content.includes(".store") || content.includes("store.")) {
        privateStoreAccessCount++;
      }
      if (content.includes("(service as any)") || content.includes("as any).store")) {
        anyCastStoreEscapeCount++;
      }
    }

    expect(rawStoreExportImportCount).toBe(0);
    expect(privateStoreAccessCount).toBe(0);
    expect(anyCastStoreEscapeCount).toBe(0);
  });
});
