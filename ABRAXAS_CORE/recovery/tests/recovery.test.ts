import { describe, it, expect } from "vitest";
import { WorkspaceRecoveryService } from "../src/workspace-recovery.js";

describe("Workspace Recovery V1 — Safe Export & Manifest Verification", () => {
  it("generates truthful workspace export manifest with SHA-256 integrity checksum", () => {
    const recovery = new WorkspaceRecoveryService();

    const manifest = recovery.generateExportManifest({
      workspaceName: "ABRAXAS_CANONICAL_PROD",
      contentCount: 42,
      artifactCount: 156,
      eventCount: 380
    });

    expect(manifest.manifestVersion).toBe(1);
    expect(manifest.workspaceName).toBe("ABRAXAS_CANONICAL_PROD");
    expect(manifest.checksum).toContain("sha256:");
  });
});
