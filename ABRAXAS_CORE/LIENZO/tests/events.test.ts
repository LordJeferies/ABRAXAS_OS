import { describe, it, expect } from "vitest";
import { createLienzoService } from "../src/service.js";
import { LienzoDomainEvent } from "../src/events.js";

describe("Lienzo Domain Core V1 — Domain Events & Provenance Boundary", () => {
  // Test 27: Local domain events contain contentId/revision/actor/reason
  it("emits strongly typed domain events capturing complete actor and revision provenance", async () => {
    const service = createLienzoService();
    const emittedEvents: LienzoDomainEvent[] = [];

    // Subscribe to domain event stream
    service.events.subscribe((event) => {
      emittedEvents.push(event);
    });

    // 1. Create Lienzo
    await service.createLienzo({
      contentId: "content_events_1",
      title: "Events Provenance Content",
      actorId: "actor_creator",
      reason: "Initial project kickoff"
    });

    // 2. Create Component
    await service.createComponent({
      contentId: "content_events_1",
      expectedRevision: 1,
      actorId: "actor_writer",
      reason: "Drafting intro headline",
      componentId: "comp_headline",
      section: "CONTENT",
      layer: "CORE"
    });

    // 3. Advance Lifecycle
    await service.changeLifecycle({
      contentId: "content_events_1",
      newLifecycle: "PRODUCTION",
      expectedRevision: 2,
      actorId: "actor_producer",
      reason: "Approved for production"
    });

    // 3 mutations * 2 events (specific event + LIENZO_REVISION_COMMITTED) = 6 events
    expect(emittedEvents.length).toBe(6);

    // Event 1: LIENZO_CREATED
    const ev1 = emittedEvents[0]!;
    expect(ev1.eventType).toBe("LIENZO_CREATED");
    expect(ev1.contentId).toBe("content_events_1");
    expect(ev1.actorId).toBe("actor_creator");
    expect(ev1.reason).toBe("Initial project kickoff");
    expect(ev1.previousRevision).toBeNull();
    expect(ev1.newRevision).toBe(1);

    // Event 2: LIENZO_REVISION_COMMITTED
    expect(emittedEvents[1]?.eventType).toBe("LIENZO_REVISION_COMMITTED");

    // Event 3: LIENZO_COMPONENT_CREATED
    const ev3 = emittedEvents[2]!;
    expect(ev3.eventType).toBe("LIENZO_COMPONENT_CREATED");
    expect(ev3.contentId).toBe("content_events_1");
    expect(ev3.componentId).toBe("comp_headline");
    expect(ev3.actorId).toBe("actor_writer");
    expect(ev3.previousRevision).toBe(1);
    expect(ev3.newRevision).toBe(2);

    // Event 5: LIENZO_LIFECYCLE_CHANGED
    const ev5 = emittedEvents[4]!;
    expect(ev5.eventType).toBe("LIENZO_LIFECYCLE_CHANGED");
    expect(ev5.actorId).toBe("actor_producer");
    expect(ev5.previousRevision).toBe(2);
    expect(ev5.newRevision).toBe(3);
  });
});
