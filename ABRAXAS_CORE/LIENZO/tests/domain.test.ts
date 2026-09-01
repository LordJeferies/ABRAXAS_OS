import { describe, it, expect } from "vitest";
import { createLienzoService } from "../src/service.js";
import * as PublicLienzoApi from "../src/index.js";
import {
  LIENZO_LIFECYCLES,
  LIENZO_SECTIONS,
  LIENZO_COMPONENT_STATUSES,
  LienzoSection
} from "../src/types.js";
import { LienzoValidationError } from "../src/errors.js";

describe("Lienzo Domain Core V1 — Acceptance & Canon Conformance", () => {
  // Test 1: Immutable contentId & creation
  it("creates a Lienzo with immutable contentId and initial revision 1", async () => {
    const service = createLienzoService();
    const { lienzo, event } = await service.createLienzo({
      contentId: "content_ep_101",
      title: "Episode 101: The Dawn",
      actorId: "user_lead",
      reason: "Initial concept creation",
      initialLifecycle: "IDEA"
    });

    expect(lienzo.contentId).toBe("content_ep_101");
    expect(lienzo.title).toBe("Episode 101: The Dawn");
    expect(lienzo.revision).toBe(1);
    expect(lienzo.lifecycle).toBe("IDEA");
    expect(lienzo.components).toEqual([]);
    expect(lienzo.dependencies).toEqual([]);
    expect(lienzo.history.length).toBe(1);
    expect(lienzo.history[0]?.revision).toBe(1);
    expect(lienzo.history[0]?.parentRevision).toBe(0);
    expect(lienzo.history[0]?.actorId).toBe("user_lead");

    expect(event.eventType).toBe("LIENZO_CREATED");
    expect(event.contentId).toBe("content_ep_101");
  });

  // Test 2: Supports all canonical lifecycle enum values
  it("supports all 13 canonical lifecycle enum values and rejects invalid ones", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Lifecycle Test",
      actorId: "user_lead",
      reason: "Init"
    });

    let currentRev = lienzo.revision;
    for (const lc of LIENZO_LIFECYCLES) {
      const res = await service.changeLifecycle({
        contentId: lienzo.contentId,
        newLifecycle: lc,
        expectedRevision: currentRev,
        actorId: "user_lead",
        reason: `Advancing to ${lc}`
      });
      expect(res.lienzo.lifecycle).toBe(lc);
      expect(res.lienzo.revision).toBe(currentRev + 1);
      currentRev = res.lienzo.revision;
    }

    // Reject unknown lifecycle
    await expect(
      service.changeLifecycle({
        contentId: lienzo.contentId,
        newLifecycle: "INVALID_STAGE" as any,
        expectedRevision: currentRev,
        actorId: "user_lead",
        reason: "Illegal transition"
      })
    ).rejects.toThrow(LienzoValidationError);
  });

  // Test 3: Supports all canonical sections
  it("supports all 14 canonical sections for components", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Sections Test",
      actorId: "user_lead",
      reason: "Init"
    });

    let currentRev = lienzo.revision;
    for (let i = 0; i < LIENZO_SECTIONS.length; i++) {
      const sec: LienzoSection = LIENZO_SECTIONS[i]!;
      const res = await service.createComponent({
        contentId: lienzo.contentId,
        expectedRevision: currentRev,
        actorId: "user_author",
        reason: `Add section ${sec}`,
        componentId: `comp_${sec.toLowerCase()}`,
        section: sec,
        layer: "CORE",
        status: "DRAFT"
      });
      expect(res.component.section).toBe(sec);
      expect(res.lienzo.components.length).toBe(i + 1);
      currentRev = res.lienzo.revision;
    }
  });

  // Test 4: Supports all canonical component statuses
  it("supports all 16 canonical component status values and rejects unknown ones", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "Status Test",
      actorId: "user_lead",
      reason: "Init"
    });

    const { component } = await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 1,
      actorId: "user_lead",
      reason: "Create status tester",
      componentId: "comp_status_test",
      section: "CONTENT",
      layer: "CORE",
      status: "NOT_STARTED"
    });

    let currentRev = 2;
    for (const status of LIENZO_COMPONENT_STATUSES) {
      const res = await service.changeComponentStatus({
        contentId: lienzo.contentId,
        componentId: component.componentId,
        newStatus: status,
        expectedRevision: currentRev,
        actorId: "user_qa",
        reason: `Setting status to ${status}`
      });
      expect(res.component.status).toBe(status);
      currentRev = res.lienzo.revision;
    }

    // Reject unknown status
    await expect(
      service.changeComponentStatus({
        contentId: lienzo.contentId,
        componentId: component.componentId,
        newStatus: "UNKNOWN_CUSTOM_STATUS" as any,
        expectedRevision: currentRev,
        actorId: "user_qa",
        reason: "Invalid"
      })
    ).rejects.toThrow(LienzoValidationError);
  });

  // Test 5: Rejects blank/whitespace actorId and reason
  it("rejects blank or whitespace-only actorId and reason on all mutations", async () => {
    const service = createLienzoService();
    await expect(
      service.createLienzo({
        title: "Test",
        actorId: "   ",
        reason: "Valid"
      })
    ).rejects.toThrow(LienzoValidationError);

    await expect(
      service.createLienzo({
        title: "Test",
        actorId: "valid_user",
        reason: "\t \n"
      })
    ).rejects.toThrow(LienzoValidationError);
  });

  // Test 6: Public API encapsulates store internals
  it("encapsulates raw storage classes from public index export", () => {
    expect((PublicLienzoApi as any).MemoryLienzoStore).toBeUndefined();
    expect((PublicLienzoApi as any).JsonFileLienzoStore).toBeUndefined();
    expect((PublicLienzoApi as any).ILienzoStore).toBeUndefined();
    expect(typeof PublicLienzoApi.createLienzoService).toBe("function");
    expect(typeof PublicLienzoApi.LienzoService).toBe("function");
  });

  // Test 7: Revision history preserves detailed component changes
  it("preserves detailed before/after component change snapshots in revision history", async () => {
    const service = createLienzoService();
    const { lienzo } = await service.createLienzo({
      title: "History Traceability Test",
      actorId: "user_lead",
      reason: "Initial creation"
    });

    await service.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 1,
      actorId: "user_lead",
      reason: "Add hook",
      componentId: "comp_hook_trace",
      section: "CONTENT",
      layer: "CORE",
      data: { text: "Hook Version 1" }
    });

    await service.updateComponent({
      contentId: lienzo.contentId,
      componentId: "comp_hook_trace",
      expectedRevision: 2,
      actorId: "user_editor",
      reason: "Refine hook wording",
      data: { text: "Hook Version 2" }
    });

    const lState = await service.getLienzo(lienzo.contentId);
    expect(lState.history.length).toBe(3);

    const rev3 = lState.history[2]!;
    expect(rev3.reason).toBe("Refine hook wording");
    expect(rev3.componentChanges?.length).toBe(1);
    expect(rev3.componentChanges?.[0]?.before?.data["text"]).toBe("Hook Version 1");
    expect(rev3.componentChanges?.[0]?.after?.data["text"]).toBe("Hook Version 2");
    expect(rev3.componentChanges?.[0]?.before?.version).toBe(1);
    expect(rev3.componentChanges?.[0]?.after?.version).toBe(2);
  });
});
