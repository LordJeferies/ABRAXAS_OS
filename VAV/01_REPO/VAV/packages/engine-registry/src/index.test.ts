import {describe, expect, it} from "vitest";
import {engines} from "./index.ts";

describe("engine registry", () => {
  it("registers all architectural engines in Corrida 01", () => {
    expect(engines.length).toBeGreaterThanOrEqual(40);
    expect(engines.some((engine) => engine.id === "scene-smart")).toBe(true);
    expect(engines.some((engine) => engine.id === "render")).toBe(true);
  });
});
