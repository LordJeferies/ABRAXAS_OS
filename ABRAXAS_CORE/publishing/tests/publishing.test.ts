import { describe, it, expect } from "vitest";
import { PublishingService } from "../src/publishing-service.js";
import { EventLedger } from "../../backbone/src/event-ledger.js";

describe("Publishing V1 — Targets, Snapshots & Immutability", () => {
  it("creates multiple independent publication targets for one Lienzo and freezes snapshots safely", async () => {
    const eventLedger = new EventLedger();
    const pubService = new PublishingService(eventLedger);

    const contentId = "content_pub_demo_01";

    // 1. Create Target A: Instagram
    const targetA = await pubService.createTarget({
      contentId,
      platform: "Instagram",
      accountId: "@acme_eng",
      timezone: "America/New_York",
      actorId: "social_lead"
    });

    // 2. Create Target B: LinkedIn
    const targetB = await pubService.createTarget({
      contentId,
      platform: "LinkedIn",
      accountId: "acme-corporation",
      timezone: "America/New_York",
      actorId: "social_lead"
    });

    // 3. Create Target C: YouTube
    const targetC = await pubService.createTarget({
      contentId,
      platform: "YouTube",
      accountId: "UC_AcmeEngineering",
      timezone: "America/New_York",
      actorId: "social_lead"
    });

    // Schedule Target A (Instagram) with specific caption and aspect ratio
    await pubService.scheduleTarget({
      targetId: targetA.targetId,
      scheduledAt: "2026-09-01T14:00:00Z",
      copyText: "Instagram Caption: Link in bio for deep dive! #engineering",
      mediaArtifactId: "art_vertical_reel_mp4",
      actorId: "social_lead"
    });

    // Schedule Target B (LinkedIn) with professional long-form copy
    await pubService.scheduleTarget({
      targetId: targetB.targetId,
      scheduledAt: "2026-09-02T10:00:00Z",
      copyText: "LinkedIn Post: How we optimized latency in enterprise clusters without cache invalidation risks.",
      mediaArtifactId: "art_horizontal_explainer_mp4",
      actorId: "social_lead"
    });

    // Check independent snapshots
    const loadedA = await pubService.getTarget(targetA.targetId);
    const loadedB = await pubService.getTarget(targetB.targetId);
    const loadedC = await pubService.getTarget(targetC.targetId);

    expect(loadedA.status).toBe("SCHEDULED");
    expect(loadedA.snapshot?.copyText).toContain("Link in bio");
    expect(loadedA.snapshot?.mediaArtifactId).toBe("art_vertical_reel_mp4");

    expect(loadedB.status).toBe("SCHEDULED");
    expect(loadedB.snapshot?.copyText).toContain("enterprise clusters");
    expect(loadedB.snapshot?.mediaArtifactId).toBe("art_horizontal_explainer_mp4");

    expect(loadedC.status).toBe("DRAFT");
    expect(loadedC.snapshot).toBeUndefined();

    // 4. Publish Target A
    const publishedA = await pubService.executePublish(targetA.targetId, "scheduler_cron");
    expect(publishedA.status).toBe("PUBLISHED");
    expect(publishedA.remotePostId).toContain("post_instagram_");

    // Target B remains untouched in SCHEDULED state
    const postPubB = await pubService.getTarget(targetB.targetId);
    expect(postPubB.status).toBe("SCHEDULED");

    // Check backbone events
    const events = await eventLedger.query({ contentId });
    expect(events.length).toBe(3); // 2 scheduled + 1 published
  });
});
