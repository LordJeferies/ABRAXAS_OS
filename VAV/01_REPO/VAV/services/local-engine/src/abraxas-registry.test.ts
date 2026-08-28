import {describe, expect, it} from "vitest";
import {writeFileSync, mkdtempSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {importAbraxasFile} from "./abraxas-registry.ts";

describe("local ABRAXAS import", () => {
  it("imports HTML as reference-only without executing it", () => {
    const dir = mkdtempSync(join(tmpdir(), "vav-abraxas-"));
    const path = join(dir, "board.html");
    writeFileSync(path, "<script>throw new Error('must not run')</script><h1>QVR</h1>");
    const result = importAbraxasFile(path);
    expect(result.artifact.kind).toBe("quick-reference");
    expect(result.artifact.executable).toBe(false);
  });
});
