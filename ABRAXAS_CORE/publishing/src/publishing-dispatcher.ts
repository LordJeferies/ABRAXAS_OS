/**
 * ABRAXAS Publishing Dispatcher
 * Automatically triggers platform distribution upon HE approval.
 */

import { randomUUID, createHash } from "node:crypto";
import { EventLedger } from "../../backbone/src/event-ledger.js";

export interface PublishReceipt {
  receiptId: string;
  artifactId: string;
  contentId: string;
  platform: "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "TWITTER" | "UNIVERSAL_FEED";
  timestamp: string;
  status: "DISPATCHED" | "PUBLISHED";
  manifestHash: string;
}

export class PublishingDispatcher {
  constructor(private readonly eventLedger?: EventLedger) {}

  public async dispatch(
    contentId: string,
    artifactId: string,
    platforms: Array<"YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "TWITTER" | "UNIVERSAL_FEED"> = ["UNIVERSAL_FEED"],
    actorId = "HE_APPROVAL_TRIGGER"
  ): Promise<PublishReceipt[]> {
    const receipts: PublishReceipt[] = [];
    const now = new Date().toISOString();

    for (const platform of platforms) {
      const manifestHash = createHash("sha256")
        .update(`${contentId}:${artifactId}:${platform}:${now}`)
        .digest("hex");

      const receipt: PublishReceipt = {
        receiptId: `pub_rec_${randomUUID().slice(0, 10)}`,
        artifactId,
        contentId,
        platform,
        timestamp: now,
        status: "DISPATCHED",
        manifestHash
      };

      receipts.push(receipt);

      if (this.eventLedger) {
        await this.eventLedger.append({
          eventType: "PUBLISHED",
          contentId,
          actorId,
          reason: `Artifact dispatched to ${platform}`,
          metadata: {
            receiptId: receipt.receiptId,
            platform,
            artifactId,
            manifestHash
          }
        });
      }
    }

    return receipts;
  }
}
