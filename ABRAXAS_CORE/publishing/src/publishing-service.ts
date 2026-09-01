/**
 * ABRAXAS Publishing Service
 */

import { randomUUID } from "node:crypto";
import {
  PublicationTarget,
  PublicationSnapshot,
  PublishingPlatform,
  PublisherAdapter
} from "./types.js";
import { EventLedger } from "../../backbone/src/event-ledger.js";

export class DeterministicTestAdapter implements PublisherAdapter {
  constructor(public readonly platform: PublishingPlatform) {}

  public async publish(snapshot: PublicationSnapshot): Promise<{ remotePostId: string; publishedAt: string }> {
    return {
      remotePostId: `post_${this.platform.toLowerCase()}_${randomUUID().slice(0, 8)}`,
      publishedAt: new Date().toISOString()
    };
  }
}

export class PublishingService {
  private targets = new Map<string, PublicationTarget>();
  private adapters = new Map<PublishingPlatform, PublisherAdapter>();

  constructor(private readonly eventLedger?: EventLedger) {
    this.registerAdapter(new DeterministicTestAdapter("Instagram"));
    this.registerAdapter(new DeterministicTestAdapter("TikTok"));
    this.registerAdapter(new DeterministicTestAdapter("LinkedIn"));
    this.registerAdapter(new DeterministicTestAdapter("YouTube"));
  }

  public registerAdapter(adapter: PublisherAdapter): void {
    this.adapters.set(adapter.platform, adapter);
  }

  public async createTarget(input: {
    contentId: string;
    platform: PublishingPlatform;
    accountId: string;
    timezone?: string | undefined;
    actorId: string;
  }): Promise<PublicationTarget> {
    const targetId = `target_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();

    const target: PublicationTarget = {
      targetId,
      contentId: input.contentId,
      platform: input.platform,
      accountId: input.accountId,
      timezone: input.timezone ?? "UTC",
      status: "DRAFT",
      copyVersion: 1,
      assetVersion: 1,
      coverVersion: 1,
      createdAt: now,
      createdBy: input.actorId
    };

    this.targets.set(targetId, target);
    return target;
  }

  public async scheduleTarget(input: {
    targetId: string;
    scheduledAt: string;
    copyText: string;
    mediaArtifactId: string;
    coverArtifactId?: string | undefined;
    platformMetadata?: Record<string, unknown> | undefined;
    actorId: string;
  }): Promise<PublicationTarget> {
    const target = this.targets.get(input.targetId);
    if (!target) throw new Error(`Publication target "${input.targetId}" not found`);

    const now = new Date().toISOString();
    // Freeze immutable snapshot!
    const snapshot: PublicationSnapshot = {
      snapshotId: `snap_${randomUUID().slice(0, 10)}`,
      targetId: target.targetId,
      contentId: target.contentId,
      frozenAt: now,
      copyText: input.copyText,
      mediaArtifactId: input.mediaArtifactId,
      coverArtifactId: input.coverArtifactId,
      platformMetadata: input.platformMetadata ?? {}
    };

    const updated: PublicationTarget = {
      ...target,
      status: "SCHEDULED",
      scheduledAt: input.scheduledAt,
      snapshot
    };

    this.targets.set(input.targetId, updated);

    if (this.eventLedger) {
      await this.eventLedger.append({
        eventType: "PUBLICATION_TARGET_SCHEDULED",
        contentId: target.contentId,
        actorId: input.actorId,
        reason: `Target scheduled for ${input.scheduledAt} on ${target.platform}`,
        metadata: { targetId: target.targetId, snapshotId: snapshot.snapshotId }
      });
    }

    return updated;
  }

  public async executePublish(targetId: string, actorId: string): Promise<PublicationTarget> {
    const target = this.targets.get(targetId);
    if (!target) throw new Error(`Publication target "${targetId}" not found`);
    if (!target.snapshot) throw new Error(`Cannot publish target without frozen snapshot: "${targetId}"`);

    const adapter = this.adapters.get(target.platform);
    if (!adapter) throw new Error(`No publisher adapter registered for platform "${target.platform}"`);

    const pubRes = await adapter.publish(target.snapshot);
    const now = new Date().toISOString();

    const updated: PublicationTarget = {
      ...target,
      status: "PUBLISHED",
      remotePostId: pubRes.remotePostId,
      lastSyncAt: now
    };

    this.targets.set(targetId, updated);

    if (this.eventLedger) {
      await this.eventLedger.append({
        eventType: "PUBLICATION_TARGET_PUBLISHED",
        contentId: target.contentId,
        actorId,
        reason: `Successfully published to ${target.platform} (remoteId: ${pubRes.remotePostId})`,
        metadata: { targetId, remotePostId: pubRes.remotePostId }
      });
    }

    return updated;
  }

  public async getTarget(targetId: string): Promise<PublicationTarget> {
    const t = this.targets.get(targetId);
    if (!t) throw new Error(`Target not found: "${targetId}"`);
    return t;
  }

  public async listTargetsByContent(contentId: string): Promise<PublicationTarget[]> {
    return Array.from(this.targets.values()).filter((t) => t.contentId === contentId);
  }
}
