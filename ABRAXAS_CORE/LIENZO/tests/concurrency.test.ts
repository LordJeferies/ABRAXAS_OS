import { describe, it, expect } from "vitest";
import { LienzoService } from "../src/service.js";
import { LienzoRevisionConflictError } from "../src/errors.js";

describe("Lienzo Domain Core V1 — Optimistic Concurrency & Revision Protection", () => {
  // Test 12: Stale expectedRevision rejected
  it("rejects stale expectedRevision and prevents lost updates", async () => {
    const service = new LienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Concurrency Test",
      actorId: "user_lead"
    });

    // Client A and Client B both see revision 1
    const revisionSeenByBoth = lienzo.revision; // 1

    // Client A successfully commits an update -> advances to revision 2
    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: revisionSeenByBoth,
      actorId: "client_a",
      reason: "Client A adds Hook",
      componentId: "comp_hook",
      section: "CONTENT",
      layer: "CORE"
    });

    // Client B attempts to commit with stale revision 1 -> must fail closed
    await expect(
      service.createComponent({
        contentId: lienzo.contentId,
        expectedRevision: revisionSeenByBoth, // Stale! Current is 2
        actorId: "client_b",
        reason: "Client B adds Copy",
        componentId: "comp_copy",
        section: "COPY",
        layer: "CORE"
      })
    ).rejects.toThrow(LienzoRevisionConflictError);

    // Verify state remained intact at revision 2
    const finalState = await service.getLienzo(lienzo.contentId);
    expect(finalState.revision).toBe(2);
    expect(finalState.components.length).toBe(1);
    expect(finalState.components[0]?.componentId).toBe("comp_hook");
  });
});
