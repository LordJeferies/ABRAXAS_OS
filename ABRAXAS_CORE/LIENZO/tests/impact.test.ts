import { describe, it, expect } from "vitest";
import { createLienzoService } from "../src/service.js";
import { LienzoDomainEvent } from "../src/events.js";
import { LienzoDependencyError, LienzoValidationError } from "../src/errors.js";

describe("Lienzo Domain Core V1 — Dependency Graph & Impact Engine", () => {
  // Test 1: Self-dependency rejected
  it("rejects self-dependency on a component", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Self Dep Test",
      actorId: "user_lead",
      reason: "Init"
    });

    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 1,
      actorId: "user_lead",
      reason: "Create comp",
      componentId: "comp_self",
      section: "CONTENT",
      layer: "CORE"
    });

    await expect(
      service.addDependency({
        contentId: lienzo.contentId,
        upstreamComponentId: "comp_self",
        downstreamComponentId: "comp_self",
        expectedRevision: 2,
        actorId: "user_lead",
        reason: "Illegal self dependency"
      })
    ).rejects.toThrow(LienzoDependencyError);
  });

  // Test 2: Dependency cycle rejected
  it("rejects dependency cycles across direct and transitive edges", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Cycle Test",
      actorId: "user_lead",
      reason: "Init"
    });

    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 1,
      actorId: "user_lead",
      reason: "Add A",
      componentId: "comp_a",
      section: "CONTENT",
      layer: "CORE"
    });
    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 2,
      actorId: "user_lead",
      reason: "Add B",
      componentId: "comp_b",
      section: "COPY",
      layer: "CORE"
    });
    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 3,
      actorId: "user_lead",
      reason: "Add C",
      componentId: "comp_c",
      section: "MOTIONS",
      layer: "PRODUCTION"
    });

    await service.addDependency({
      contentId: lienzo.contentId,
      upstreamComponentId: "comp_a",
      downstreamComponentId: "comp_b",
      expectedRevision: 4,
      actorId: "user_lead",
      reason: "A -> B"
    });

    await service.addDependency({
      contentId: lienzo.contentId,
      upstreamComponentId: "comp_b",
      downstreamComponentId: "comp_c",
      expectedRevision: 5,
      actorId: "user_lead",
      reason: "B -> C"
    });

    await expect(
      service.addDependency({
        contentId: lienzo.contentId,
        upstreamComponentId: "comp_c",
        downstreamComponentId: "comp_a",
        expectedRevision: 6,
        actorId: "user_lead",
        reason: "Illegal cycle C -> A"
      })
    ).rejects.toThrow(LienzoDependencyError);
  });

  // Test 3: calculateImpact with invalid component ID fails closed
  it("fails closed when calculating impact for a non-existent component ID", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Invalid Impact Target Test",
      actorId: "user_lead",
      reason: "Init"
    });

    await expect(
      service.calculateImpact(lienzo.contentId, "non_existent_component_id", "Check impact")
    ).rejects.toThrow(LienzoValidationError);
  });

  // Test 4: Impact calculation, version increment on impacted components, event emission, artifact preservation
  it("increments version on OUT_OF_SYNC impacted components and emits LIENZO_IMPACT_DETECTED", async () => {
    const service = createLienzoService();
    const emittedEvents: LienzoDomainEvent[] = [];
    service.events.subscribe((e) => {
      emittedEvents.push(e);
    });

    const { lienzo } = await service.createLienzo({
      title: "Production Impact Test",
      actorId: "user_lead",
      reason: "Init"
    });

    // 1. Upstream Hook
    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 1,
      actorId: "user_writer",
      reason: "Create Hook",
      componentId: "comp_hook",
      section: "CONTENT",
      layer: "STRATEGY",
      status: "APPROVED",
      data: { text: "Original Hook Line" }
    });

    // 2. Downstream Copy
    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 2,
      actorId: "user_writer",
      reason: "Create Copy",
      componentId: "comp_copy",
      section: "COPY",
      layer: "PLANNED",
      status: "APPROVED",
      data: { body: "Copy expanding on hook" }
    });

    // 3. Downstream Motion Title (status GENERATED at version 1)
    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 3,
      actorId: "user_animator",
      reason: "Create Motion Title",
      componentId: "comp_motion_title",
      section: "MOTIONS",
      layer: "PRODUCTION",
      status: "GENERATED",
      artifactRefs: [
        {
          artifactId: "art_rendered_title_v1",
          kind: "remotion_render_mp4",
          uri: "file:///renders/title_v1.mp4",
          checksum: "sha256:1111222233334444555566667777888899990000aaaa",
          createdAt: "2026-08-31T00:00:00Z"
        }
      ]
    });

    // Dependencies: Hook -> Copy -> Motion Title
    await service.addDependency({
      contentId: lienzo.contentId,
      upstreamComponentId: "comp_hook",
      downstreamComponentId: "comp_copy",
      expectedRevision: 4,
      actorId: "user_lead",
      reason: "Hook feeds Copy"
    });

    await service.addDependency({
      contentId: lienzo.contentId,
      upstreamComponentId: "comp_copy",
      downstreamComponentId: "comp_motion_title",
      expectedRevision: 5,
      actorId: "user_lead",
      reason: "Copy feeds Motion Title"
    });

    // Update Hook -> Trigger impact
    const updateRes = await service.updateComponent({
      contentId: lienzo.contentId,
      componentId: "comp_hook",
      expectedRevision: 6,
      actorId: "user_writer",
      reason: "Change hook line to boost retention",
      data: { text: "Brand New Provocative Hook Line" }
    });

    const lState = await service.getLienzo(lienzo.contentId);
    const hookComp = lState.components.find((c) => c.componentId === "comp_hook")!;
    const copyComp = lState.components.find((c) => c.componentId === "comp_copy")!;
    const motionComp = lState.components.find((c) => c.componentId === "comp_motion_title")!;

    // Hook version incremented from 1 to 2
    expect(hookComp.version).toBe(2);

    // Copy was APPROVED -> became OUT_OF_SYNC -> version MUST increment from 1 to 2!
    expect(copyComp.status).toBe("OUT_OF_SYNC");
    expect(copyComp.version).toBe(2);

    // Motion Title was GENERATED -> became OUT_OF_SYNC -> version MUST increment from 1 to 2!
    expect(motionComp.status).toBe("OUT_OF_SYNC");
    expect(motionComp.version).toBe(2);

    // Prior artifact reference remains 100% intact!
    expect(motionComp.artifactRefs.length).toBe(1);
    expect(motionComp.artifactRefs[0]?.artifactId).toBe("art_rendered_title_v1");

    // Check emitted events contains LIENZO_IMPACT_DETECTED
    const impactEvent = emittedEvents.find((e) => e.eventType === "LIENZO_IMPACT_DETECTED");
    expect(impactEvent).toBeDefined();
    expect(impactEvent?.contentId).toBe(lienzo.contentId);
    expect(impactEvent?.componentId).toBe("comp_hook");
  });
});
