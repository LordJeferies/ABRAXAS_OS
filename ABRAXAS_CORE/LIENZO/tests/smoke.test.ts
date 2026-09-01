import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createLienzoService } from "../src/service.js";

describe("Lienzo Domain Core V1 — Phase 9 Deterministic Non-UI Runtime Smoke", () => {
  it("executes full lifecycle: CREATE -> UPDATE -> IMPACT -> OUT_OF_SYNC -> PRESERVE_ARTIFACT -> PERSIST -> RELOAD", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_lienzo_smoke_"));
    const service = createLienzoService({ storageDir: tmpDir });

    // 1. CREATE Lienzo
    const { lienzo } = await service.createLienzo({
      contentId: "smoke_content_001",
      title: "Viral Hook Breakdown #42",
      actorId: "author_alice",
      reason: "Kickoff viral hook content",
      initialLifecycle: "IDEA"
    });
    expect(lienzo.revision).toBe(1);
    expect(lienzo.lifecycle).toBe("IDEA");

    // 2. Create CONTENT Component (Hook)
    const hookComp = await service.createComponent({
      contentId: "smoke_content_001",
      expectedRevision: 1,
      actorId: "author_alice",
      reason: "Add hook component",
      componentId: "comp_hook_main",
      section: "CONTENT",
      layer: "STRATEGY",
      status: "APPROVED",
      data: { hookType: "CURIOSITY_GAP", text: "Nobody is talking about this AI trick..." }
    });
    expect(hookComp.component.version).toBe(1);

    // 3. Create COPY Component dependent on CONTENT
    const copyComp = await service.createComponent({
      contentId: "smoke_content_001",
      expectedRevision: 2,
      actorId: "writer_bob",
      reason: "Add script copy for body",
      componentId: "comp_copy_body",
      section: "COPY",
      layer: "PLANNED",
      status: "DRAFT",
      data: { script: "Here is the exact step by step..." }
    });
    expect(copyComp.component.version).toBe(1);

    // 4. Add Dependency: Hook -> Copy
    await service.addDependency({
      contentId: "smoke_content_001",
      upstreamComponentId: "comp_hook_main",
      downstreamComponentId: "comp_copy_body",
      relation: "INPUT",
      expectedRevision: 3,
      actorId: "lead_carol",
      reason: "Link hook to body copy"
    });

    // 5. Mark COPY as GENERATED with Artifact Reference
    const generatedCopy = await service.changeComponentStatus({
      contentId: "smoke_content_001",
      componentId: "comp_copy_body",
      newStatus: "GENERATED",
      expectedRevision: 4,
      actorId: "ai_dispatcher",
      reason: "Synthesized teleprompter copy artifact",
      artifactRef: {
        artifactId: "art_teleprompter_copy_v1",
        kind: "teleprompter_text_bundle",
        uri: "file:///artifacts/copy/smoke_001_v1.json",
        checksum: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        createdAt: new Date().toISOString()
      }
    });
    expect(generatedCopy.component.status).toBe("GENERATED");
    expect(generatedCopy.component.artifactRefs.length).toBe(1);
    expect(generatedCopy.component.version).toBe(2);

    // 6. Update CONTENT Component (Hook text changes) -> Trigger Impact
    const updateHookRes = await service.updateComponent({
      contentId: "smoke_content_001",
      componentId: "comp_hook_main",
      expectedRevision: 5,
      actorId: "author_alice",
      reason: "Refine hook with sharper retention angle",
      data: { hookType: "PATTERN_INTERRUPT", text: "Stop scrolling: this AI trick is about to disappear..." }
    });

    // 7. Assert Impact & OUT_OF_SYNC Transition
    expect(updateHookRes.impactReport.triggeringComponentId).toBe("comp_hook_main");
    expect(updateHookRes.impactReport.affectedComponents.length).toBe(1);
    expect(updateHookRes.impactReport.affectedComponents[0]?.componentId).toBe("comp_copy_body");
    expect(updateHookRes.impactReport.affectedComponents[0]?.previousStatus).toBe("GENERATED");
    expect(updateHookRes.impactReport.affectedComponents[0]?.newStatus).toBe("OUT_OF_SYNC");

    // 8. Assert Artifact Reference PRESERVED intact and version incremented to 3
    const postUpdateCopy = updateHookRes.lienzo.components.find((c) => c.componentId === "comp_copy_body")!;
    expect(postUpdateCopy.status).toBe("OUT_OF_SYNC");
    expect(postUpdateCopy.version).toBe(3); // Generated was v2 -> OUT_OF_SYNC becomes v3
    expect(postUpdateCopy.artifactRefs.length).toBe(1);
    expect(postUpdateCopy.artifactRefs[0]?.artifactId).toBe("art_teleprompter_copy_v1");
    expect(postUpdateCopy.artifactRefs[0]?.uri).toBe("file:///artifacts/copy/smoke_001_v1.json");

    // 9. RELOAD from Fresh Service Instance
    const reloadService = createLienzoService({ storageDir: tmpDir });
    const reloaded = await reloadService.getLienzo("smoke_content_001");

    expect(reloaded).not.toBeNull();
    expect(reloaded.contentId).toBe("smoke_content_001");
    expect(reloaded.revision).toBe(6);
    expect(reloaded.history.length).toBe(6);
    expect(reloaded.components.length).toBe(2);

    const reloadedHook = reloaded.components.find((c) => c.componentId === "comp_hook_main")!;
    const reloadedCopy = reloaded.components.find((c) => c.componentId === "comp_copy_body")!;

    expect(reloadedHook.version).toBe(2);
    expect(reloadedHook.data["hookType"]).toBe("PATTERN_INTERRUPT");

    expect(reloadedCopy.version).toBe(3);
    expect(reloadedCopy.status).toBe("OUT_OF_SYNC");
    expect(reloadedCopy.artifactRefs.length).toBe(1);
    expect(reloadedCopy.artifactRefs[0]?.artifactId).toBe("art_teleprompter_copy_v1");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
