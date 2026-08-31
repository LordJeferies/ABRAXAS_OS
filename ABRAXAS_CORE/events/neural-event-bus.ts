/**
 * ABRAXAS Neural Event Bus — Unified Nervous System
 */

import { randomUUID } from "node:crypto";

export interface CognitiveEvent {
  id?: string;
  eventId?: string;
  type?: string;
  eventType?: string;
  contentId?: string;
  content?: string;
  meaning?: string;
  confidence?: number;
  consequences?: string[];
  memoryImpact?: number;
  timestamp: string;
}

export type EventListener = (event: CognitiveEvent) => void;

export class NeuralEventBus {
  public listeners: EventListener[] = [];
  private readonly eventStream: CognitiveEvent[] = [];

  public emit(event: any): void {
    const cognitiveEvent: CognitiveEvent = {
      id: event.id || `evt_${randomUUID().slice(0, 8)}`,
      eventId: event.eventId || event.id || `evt_${randomUUID().slice(0, 8)}`,
      type: event.type || event.eventType || "GENERIC_EVENT",
      eventType: event.eventType || event.type || "GENERIC_EVENT",
      contentId: event.contentId || "GLOBAL",
      content: event.content || event.meaning || "",
      meaning: event.meaning || event.content || "",
      confidence: event.confidence ?? 0.95,
      consequences: event.consequences || [],
      memoryImpact: event.memoryImpact ?? 1.0,
      timestamp: event.timestamp || new Date().toISOString()
    };

    console.log("ABRAXAS EVENT", cognitiveEvent);
    this.eventStream.push(cognitiveEvent);
    this.listeners.forEach((listener) => {
      try {
        listener(cognitiveEvent);
      } catch (err) {
        console.error("Event listener error:", err);
      }
    });
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public emitCognitive(
    eventType: string,
    contentId: string,
    meaning: string,
    confidence = 0.95,
    consequences: string[] = [],
    memoryImpact = 1.0
  ): CognitiveEvent {
    const evt: CognitiveEvent = {
      eventId: `nevt_${randomUUID().slice(0, 10)}`,
      eventType,
      type: eventType,
      contentId,
      content: meaning,
      meaning,
      confidence,
      consequences,
      memoryImpact,
      timestamp: new Date().toISOString()
    };

    this.emit(evt);
    return evt;
  }

  public getEventsForContent(contentId: string): CognitiveEvent[] {
    return this.eventStream.filter((e) => e.contentId === contentId);
  }

  public getHighImpactEvents(minImpact = 1.0): CognitiveEvent[] {
    return this.eventStream.filter((e) => (e.memoryImpact ?? 0) >= minImpact);
  }
}
