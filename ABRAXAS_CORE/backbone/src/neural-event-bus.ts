/**
 * ABRAXAS Neural Event Bus
 * Cognitive event layer where events carry meaning, confidence, consequences & memory impact.
 */

import { randomUUID } from "node:crypto";

export interface NeuralEvent {
  eventId: string;
  eventType: string;
  contentId: string;
  meaning: string;
  confidence: number; // 0.0 to 1.0
  consequences: string[];
  memoryImpact: number; // Modifier applied to memory weight
  timestamp: string;
}

export class NeuralEventBus {
  private readonly eventStream: NeuralEvent[] = [];

  public emitCognitive(
    eventType: string,
    contentId: string,
    meaning: string,
    confidence = 0.95,
    consequences: string[] = [],
    memoryImpact = 1.0
  ): NeuralEvent {
    const evt: NeuralEvent = {
      eventId: `nevt_${randomUUID().slice(0, 10)}`,
      eventType,
      contentId,
      meaning,
      confidence,
      consequences,
      memoryImpact,
      timestamp: new Date().toISOString()
    };

    this.eventStream.push(evt);
    return evt;
  }

  public getEventsForContent(contentId: string): NeuralEvent[] {
    return this.eventStream.filter((e) => e.contentId === contentId);
  }

  public getHighImpactEvents(minImpact = 1.0): NeuralEvent[] {
    return this.eventStream.filter((e) => e.memoryImpact >= minImpact);
  }
}
