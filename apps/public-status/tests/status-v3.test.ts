import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.resolve(__dirname, "../../../docs/abraxas-os-status");
const canonicalRegistryPath = path.resolve(__dirname, "../../../ABRAXAS_CORE/contracts/pipeline/PIPELINE_BLUEPRINT_REGISTRY_V1.json");

describe("Public Status V3 — Full Runtime & Truth Integrity Tests", () => {
  it("verifies compiled assets exist and have deterministic names", () => {
    expect(fs.existsSync(path.join(docsDir, "index.html"))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, "assets/status-v3.js"))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, "assets/status-v3.css"))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, "pipeline-blueprints.json"))).toBe(true);
  });

  it("verifies compiled assets contain 0 remote CDN URLs and 0 node_modules references", () => {
    const jsContent = fs.readFileSync(path.join(docsDir, "assets/status-v3.js"), "utf-8");
    const htmlContent = fs.readFileSync(path.join(docsDir, "index.html"), "utf-8");

    expect(jsContent.includes("node_modules")).toBe(false);
    expect(htmlContent.includes("https://cdn.")).toBe(false);
    expect(htmlContent.includes("https://unpkg.com")).toBe(false);
    expect(htmlContent.includes("https://cdnjs.cloudflare.com")).toBe(false);
  });

  it("verifies public dossiers have deep coverage across all 13 modules and all 15 required dimensions", () => {
    const pk = JSON.parse(fs.readFileSync(path.join(docsDir, "public-knowledge.json"), "utf-8"));
    const moduleIds = pk.modules.map((m: any) => m.id);

    const requiredModules = [
      "YOD",
      "LIENZO",
      "HE",
      "SHIM",
      "VAV",
      "ARQUITECTO",
      "PIPELINE_ENGINE",
      "AI_RUNTIME",
      "PUBLISHING",
      "METRICS",
      "UNIVERSAL_INTAKE",
      "EVENTS",
      "ARTIFACTS"
    ];

    for (const req of requiredModules) {
      expect(moduleIds).toContain(req);
      const mod = pk.modules.find((m: any) => m.id === req);

      // 15 required dimensions check
      expect(mod.shortDefinition).toBeDefined(); // 1 WHAT
      expect(mod.why).toBeDefined();             // 2 WHY
      expect(Array.isArray(mod.owns)).toBe(true); // 3 OWNS
      expect(Array.isArray(mod.doesNotOwn)).toBe(true); // 4 DOES NOT OWN
      expect(Array.isArray(mod.inputs)).toBe(true);  // 5 INPUTS
      expect(Array.isArray(mod.outputs)).toBe(true); // 6 OUTPUTS
      expect(mod.status).toBeDefined();          // 7 CURRENT STATUS
      expect(Array.isArray(mod.targetCapabilities)).toBe(true); // 8 TARGET ARCHITECTURE
      expect(Array.isArray(mod.connections)).toBe(true); // 9 CONNECTIONS
      expect(Array.isArray(mod.eventFootprint)).toBe(true); // 10 EVENT FOOTPRINT
      expect(Array.isArray(mod.artifactFootprint)).toBe(true); // 11 ARTIFACT FOOTPRINT
      expect(mod.exampleFlow).toBeDefined();     // 12 EXAMPLE FLOW
      expect(Array.isArray(mod.evidenceRefs)).toBe(true); // 13 EVIDENCE
      expect(Array.isArray(mod.boundedDebt)).toBe(true); // 14 BOUNDED DEBT
      expect(Array.isArray(mod.roadmapRefs)).toBe(true); // 15 ROADMAP

      // Truth Layer check
      expect(["RELEASED_CURRENT", "POST_RC1_CANDIDATE", "TARGET"]).toContain(mod.truthLayer);
    }
  });

  it("verifies explicit and accurate semantic wording for Lienzo (persistent, editable, versioned Source of Truth)", () => {
    const pk = JSON.parse(fs.readFileSync(path.join(docsDir, "public-knowledge.json"), "utf-8"));
    const lienzo = pk.modules.find((m: any) => m.id === "LIENZO");
    expect(lienzo).toBeDefined();

    // Must NOT describe Lienzo as immutable content state
    expect(lienzo.shortDefinition.toLowerCase()).toContain("editable");
    expect(lienzo.shortDefinition.toLowerCase()).toContain("versioned");
    expect(lienzo.shortDefinition.toLowerCase()).toContain("source of truth");
    expect(lienzo.shortDefinition.toLowerCase()).not.toContain("immutable content state");
  });

  it("verifies projected pipeline blueprints match canonical registry exactly (11 blueprints)", () => {
    const canonical = JSON.parse(fs.readFileSync(canonicalRegistryPath, "utf-8"));
    const projected = JSON.parse(fs.readFileSync(path.join(docsDir, "pipeline-blueprints.json"), "utf-8"));

    expect(projected.blueprints.length).toBe(11);
    expect(projected.blueprints.length).toBe(canonical.blueprints.length);
    expect(projected.registryClassification).toBe("DESIGN_REGISTRY");
    expect(projected.executionState).toBe("NOT_RUNTIME_EXECUTABLE");
  });

  it("verifies zero private data or machine paths across all status artifacts", () => {
    const forbidden = ["/Users/lordjef", "OPENAI_API_KEY", "client_secret", "id_rsa", "BEGIN RSA", ".gemini"];
    const files = ["index.html", "assets/status-v3.js", "assets/status-v3.css", "public-knowledge.json", "system-status.json", "roadmap.json", "pipeline-blueprints.json"];

    for (const file of files) {
      const p = path.join(docsDir, file);
      if (fs.existsSync(p)) {
        const c = fs.readFileSync(p, "utf-8");
        for (const pattern of forbidden) {
          expect(c.includes(pattern)).toBe(false);
        }
      }
    }
  });
});
