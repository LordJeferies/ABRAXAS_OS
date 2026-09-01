/**
 * ABRAXAS Publishing Types — Targets, Snapshots & Adapters
 */

export type PublishingPlatform = "Instagram" | "TikTok" | "LinkedIn" | "YouTube";

export type PublicationStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";

export interface PublicationSnapshot {
  snapshotId: string;
  targetId: string;
  contentId: string;
  frozenAt: string;
  copyText: string;
  mediaArtifactId: string;
  coverArtifactId?: string | undefined;
  platformMetadata: Record<string, unknown>;
}

export interface PublicationTarget {
  targetId: string;
  contentId: string;
  platform: PublishingPlatform;
  accountId: string;
  scheduledAt?: string | undefined;
  timezone: string;
  status: PublicationStatus;
  copyVersion: number;
  assetVersion: number;
  coverVersion: number;
  snapshot?: PublicationSnapshot | undefined;
  remotePostId?: string | null | undefined;
  lastSyncAt?: string | undefined;
  createdAt: string;
  createdBy: string;
}

export interface PublisherAdapter {
  platform: PublishingPlatform;
  publish(snapshot: PublicationSnapshot): Promise<{ remotePostId: string; publishedAt: string }>;
}
