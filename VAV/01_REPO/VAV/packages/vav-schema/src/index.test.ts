import {describe, expect, it} from "vitest";
import {VavProjectSchema} from "./index.ts";

describe("VAV project schema", () => {
  it("accepts an empty schema-v1 project", () => {
    const result = VavProjectSchema.parse({
      schemaVersion: 1,
      projectId: "P001",
      words: [],
      captions: []
    });
    expect(result.projectId).toBe("P001");
  });
});
