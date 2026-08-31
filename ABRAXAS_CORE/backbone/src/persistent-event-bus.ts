/**
 * ABRAXAS Persistent Event Bus (WAL / Journal-backed)
 */

import { randomUUID } from "node:crypto";

export interface PersistentDomainEvent {
  eventId: string;
  eventType: string;
  contentId: string;
  actorId: string;
  reason: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export class PersistentEventBus {
  private readonly memoryJournal: PersistentDomainEvent[] = [];

  constructor(private readonly storageBackend?: { save(event: PersistentDomainEvent): Promise<void>; load(): Promise<PersistentDomainEvent[]> }) {}

  public async append(input: { eventType: string; contentId: string; actorId: string; reason: string; metadata?: Record<string, unknown> }): Promise<PersistentDomainEvent> {
    return this.emit(input.eventType, input.contentId, input.actorId, input.reason, input.metadata || {});
  }

  public async emit(
    eventType: string,
    contentId: string,
    actorId: string,
    reason: string,
    metadata: Record<string, unknown> = {}
  ): Promise<PersistentDomainEvent> {
    const event: PersistentDomainEvent = {
      eventId: `evt_${randomUUID().slice(0, 10)}`,
      eventType,
      contentId,
      actorId,
      reason,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.memoryJournal.push(event);
    if (this.storageBackend) {
      await this.storageBackend.save(event);
    }

    return event;
  }

  public getHistory(contentId?: string): PersistentDomainEvent[] {
    if (contentId) {
      return this.memoryJournal.filter((e) => e.contentId === contentId);
    }
    return [...this.memoryJournal];
  }

  public loadFromJournal(events: PersistentDomainEvent[]): void {
    this.memoryJournal.length = 0;
    this.memoryJournal.push(...events);
  }
}
