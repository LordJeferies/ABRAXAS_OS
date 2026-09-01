/**
 * ABRAXAS Lienzo Local Domain Events
 * Strongly typed events emitted across service boundaries.
 */

import { randomUUID } from "node:crypto";

export const LIENZO_EVENT_TYPES = [
  "LIENZO_CREATED",
  "LIENZO_LIFECYCLE_CHANGED",
  "LIENZO_COMPONENT_CREATED",
  "LIENZO_COMPONENT_UPDATED",
  "LIENZO_COMPONENT_STATUS_CHANGED",
  "LIENZO_IMPACT_DETECTED",
  "LIENZO_REVISION_COMMITTED"
] as const;

export type LienzoEventType = typeof LIENZO_EVENT_TYPES[number];

export interface LienzoDomainEvent {
  eventId: string;
  eventType: LienzoEventType;
  contentId: string;
  componentId: string | null;
  actorId: string;
  timestamp: string;
  previousRevision: number | null;
  newRevision: number;
  reason: string;
  payload: Record<string, unknown>;
}

export type LienzoEventListener = (event: LienzoDomainEvent) => void | Promise<void>;

export class LienzoEventEmitter {
  private listeners: Set<LienzoEventListener> = new Set();

  public subscribe(listener: LienzoEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: Omit<LienzoDomainEvent, "eventId">): LienzoDomainEvent {
    const fullEvent: LienzoDomainEvent = {
      eventId: randomUUID(),
      ...event
    };

    for (const listener of this.listeners) {
      try {
        listener(fullEvent);
      } catch (err) {
        // Event listeners must not break synchronous service transactions
        console.error("Lienzo domain event listener error:", err);
      }
    }

    return fullEvent;
  }
}
