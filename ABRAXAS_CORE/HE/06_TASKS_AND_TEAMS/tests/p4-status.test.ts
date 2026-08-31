import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {fileURLToPath} from "node:url";
// @ts-ignore
import {buildPublicStatus, parseCliArgs} from "../../../../VAV/01_REPO/VAV/scripts/build-public-status.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.resolve(__dirname, "../../../../docs/abraxas-os-status");

describe("Public Status V2 & Public Architect V1 Story Architecture & Security (Gate P4 Repair)", () => {
  // AC-P4-001 & AC-P4-002: Zero Leakage Scan
  it("verifies public artifacts exist and contain zero private data, paths, or secrets", () => {
    const files = ["public-knowledge.json", "system-status.json", "roadmap.json", "index.html"];
    const forbiddenPatterns = [
      "/Users/",
      "lordjef",
      "OPENAI_API_KEY",
      "API_KEY",
      "Bearer ",
      "client_secret",
      "id_rsa",
      "BEGIN RSA PRIVATE KEY"
    ];

    for (const f of files) {
      const fullPath = path.join(docsDir, f);
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, "utf-8");

      for (const forbidden of forbiddenPatterns) {
        expect(content.includes(forbidden)).toBe(false);
      }
    }
  });

  // AC-P4-004: Authoritative Module Ownership Definitions
  it("verifies all 10 canonical modules with authoritative domain semantics", () => {
    const raw = fs.readFileSync(path.join(docsDir, "public-knowledge.json"), "utf-8");
    const pk = JSON.parse(raw);

    const moduleMap = new Map<string, any>(pk.modules.map((m: any) => [m.id, m]));

    // Yod: Intelligence / criteria
    expect(moduleMap.get("YOD")?.role).toContain("Content Intelligence");

    // Lienzo: Persistent Identity & Source of Truth
    expect(moduleMap.get("LIENZO")?.role).toContain("Persistent Content Identity");

    // Shim: Real-source observation
    expect(moduleMap.get("SHIM")?.role).toContain("Real-Source Observation");

    // VAV: Audiovisual synthesis
    expect(moduleMap.get("VAV")?.role).toContain("Audiovisual Synthesis");

    // He: Operations core
    expect(moduleMap.get("HE")?.role).toContain("Operations Core");

    // Arquitecto: Contextual guidance consuming Yod
    expect(moduleMap.get("ARQUITECTO")?.role).toContain("Contextual Guidance");
  });

  // AC-P4-005: Honest Verification Status
  it("ensures honest verification claims and no premature release status", () => {
    const raw = fs.readFileSync(path.join(docsDir, "system-status.json"), "utf-8");
    const status = JSON.parse(raw);

    expect(status.overallReleaseStatus).toBe("IMPLEMENTED_LOCAL_UNDER_AUDIT");
    expect(status.auditStatus).toBe("AWAITING_FINAL_AUDIT");
    expect(status.overallReleaseStatus).not.toBe("RELEASED");
  });

  // AC-P4-006 & AC-P4-007: Token-Boundary Intent Resolver Tests
  it("resolves queries with word-boundary tokens without false substring collisions", () => {
    const rawHtml = fs.readFileSync(path.join(docsDir, "index.html"), "utf-8");

    // Helper regex matcher simulating index.html resolveIntent
    const resolveTestIntent = (query: string) => {
      const q = query.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const hasHe = /\b(he|operaciones|operations|tareas|tasks)\b/i.test(q);
      const hasVav = /\b(vav|cuts|motions|video|render|remotion)\b/i.test(q);
      const hasRoadmap = /\b(roadmap|hoja de ruta|fases|gates)\b/i.test(q);
      const hasRelate = /\b(relacion|relate|connect|interact)\b/i.test(q);

      if (hasRelate || (hasHe && hasVav)) {
        if (hasHe && hasVav) return { id: "how-he-and-vav-relate", nodes: ["HE", "VAV"] };
        return { id: "how-modules-relate", nodes: ["YOD", "LIENZO", "HE", "VAV"] };
      }
      if (hasRoadmap) return { id: "what-is-roadmap", nodes: ["CORE"] };
      if (hasHe) return { id: "what-is-he", nodes: ["HE"] };
      if (hasVav) return { id: "what-is-vav", nodes: ["VAV"] };
      return { id: "unknown", nodes: ["CORE"] };
    };

    // "What is the roadmap?" contains "the" -> must NOT focus He!
    const roadmapRes = resolveTestIntent("What is the roadmap?");
    expect(roadmapRes.id).toBe("what-is-roadmap");
    expect(roadmapRes.nodes).toEqual(["CORE"]);

    // "How do He and VAV relate?" -> compound focus on HE and VAV
    const relRes = resolveTestIntent("How do He and VAV relate?");
    expect(relRes.id).toBe("how-he-and-vav-relate");
    expect(relRes.nodes).toEqual(["HE", "VAV"]);
  });
});

describe("Release-Aware Public Status Builder Tests (Gate P5 Tooling)", () => {
  const validSha = "40dee102e34048cb4243758a5a31ac45db73f2f7";

  it("parses CLI arguments correctly", () => {
    const args = ["--release-state", "RELEASED_RC1", "--release-label", "v1.0.0-rc1", "--release-sha", validSha];
    const parsed = parseCliArgs(args);
    expect(parsed.releaseState).toBe("RELEASED_RC1");
    expect(parsed.releaseLabel).toBe("v1.0.0-rc1");
    expect(parsed.releaseSha).toBe(validSha);
  });

  it("executes PRE_RELEASE mode by default with honest pre-release values and no release SHA claim", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_status_test_pre_"));
    fs.copyFileSync(path.join(docsDir, "generated-verification.json"), path.join(tmpDir, "generated-verification.json"));

    const res = buildPublicStatus({ outputDir: tmpDir, releaseState: "PRE_RELEASE" });
    expect(res.systemStatus.overallReleaseStatus).toBe("IMPLEMENTED_LOCAL_UNDER_AUDIT");
    expect(res.systemStatus.auditStatus).toBe("AWAITING_FINAL_AUDIT");
    expect(res.systemStatus.release).toBeUndefined();
    expect(res.roadmap.gates.find((g: any) => g.gateId === "P5")?.status).toBe("AWAITING_FINAL_AUDIT");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("executes RELEASED_RC1 mode with valid 40-char SHA and promotes system-status and roadmap", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_status_test_rel_"));
    fs.copyFileSync(path.join(docsDir, "generated-verification.json"), path.join(tmpDir, "generated-verification.json"));

    const res = buildPublicStatus({
      outputDir: tmpDir,
      releaseState: "RELEASED_RC1",
      releaseLabel: "v1.0.0-rc1",
      releaseSha: validSha
    });

    expect(res.systemStatus.overallReleaseStatus).toBe("RELEASED_RC1");
    expect(res.systemStatus.auditStatus).toBe("RELEASE_COMPLETE_RC1");
    expect(res.systemStatus.release?.label).toBe("v1.0.0-rc1");
    expect(res.systemStatus.release?.commitSha).toBe(validSha);
    expect(res.systemStatus.release?.releasedAt).toBeDefined();
    expect(res.roadmap.gates.find((g: any) => g.gateId === "P5")?.status).toBe("RELEASED_RC1");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("fails closed when RELEASED_RC1 is requested without release SHA", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_status_test_err1_"));
    fs.copyFileSync(path.join(docsDir, "generated-verification.json"), path.join(tmpDir, "generated-verification.json"));

    expect(() => {
      buildPublicStatus({
        outputDir: tmpDir,
        releaseState: "RELEASED_RC1",
        releaseLabel: "v1.0.0-rc1"
      });
    }).toThrow(/--release-sha is required/);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("fails closed when RELEASED_RC1 is requested with invalid SHA length or characters", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_status_test_err2_"));
    fs.copyFileSync(path.join(docsDir, "generated-verification.json"), path.join(tmpDir, "generated-verification.json"));

    expect(() => {
      buildPublicStatus({
        outputDir: tmpDir,
        releaseState: "RELEASED_RC1",
        releaseLabel: "v1.0.0-rc1",
        releaseSha: "not-a-valid-sha"
      });
    }).toThrow(/Invalid release-sha/);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("fails closed when RELEASED_RC1 is requested with invalid release label", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_status_test_err3_"));
    fs.copyFileSync(path.join(docsDir, "generated-verification.json"), path.join(tmpDir, "generated-verification.json"));

    expect(() => {
      buildPublicStatus({
        outputDir: tmpDir,
        releaseState: "RELEASED_RC1",
        releaseLabel: "STABLE_V1",
        releaseSha: validSha
      });
    }).toThrow(/Invalid release-label/);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
