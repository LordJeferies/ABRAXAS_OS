/**
 * Canonical Append-Only Event Ledger
 */

import { randomUUID } from "node:crypto";
import { Event, BACKBONE_SCHEMA_VERSION } from "./types.js";
import { BackboneValidationError } from "./errors.js";

export interface AppendEventInput {
  eventType: string;
  contentId?: string | null | undefined;
  taskId?: string | null | undefined;
  componentId?: string | null | undefined;
  actorId: string;
  reason: string;
  previousVersion?: number | null | undefined;
  newVersion?: number | null | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface EventQueryFilter {
  contentId?: string | undefined;
  eventType?: string | undefined;
  actorId?: string | undefined;
  taskId?: string | undefined;
}

export class EventLedger {
  private events: Event[] = [];

  public async append(input: AppendEventInput): Promise<Event> {
    if (!input.eventType || input.eventType.trim().length === 0) {
      throw new BackboneValidationError("eventType must be non-empty");
    }
    if (!input.actorId || input.actorId.trim().length === 0) {
      throw new BackboneValidationError("actorId must be non-empty");
    }
    if (!input.reason || input.reason.trim().length === 0) {
      throw new BackboneValidationError("reason must be non-empty");
    }

    const event: Event = {
      schemaVersion: BACKBONE_SCHEMA_VERSION,
      eventId: `evt_${randomUUID().slice(0, 16)}`,
      eventType: input.eventType,
      contentId: input.contentId ?? null,
      taskId: input.taskId ?? null,
      componentId: input.componentId ?? null,
      actorId: input.actorId,
      timestamp: new Date().toISOString(),
      reason: input.reason,
      previousVersion: input.previousVersion ?? null,
      newVersion: input.newVersion ?? null,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {}
    };

    this.events.push(event);
    return event;
  }

  public async query(filter?: EventQueryFilter): Promise<Event[]> {
    return this.events.filter((e) => {
      if (filter?.contentId && e.contentId !== filter.contentId) return false;
      if (filter?.eventType && e.eventType !== filter.eventType) return false;
      if (filter?.actorId && e.actorId !== filter.actorId) return false;
      if (filter?.taskId && e.taskId !== filter.taskId) return false;
      return true;
    });
  }

  public async getAll(): Promise<Event[]> {
    return [...this.events];
  }
}
