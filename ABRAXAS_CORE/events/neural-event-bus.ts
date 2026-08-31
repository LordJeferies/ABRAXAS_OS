/**
 * ABRAXAS Cognitive Neural Event Bus V5.2
 * Events carry meaning, confidence, consequences, memory impact & recommended reactions.
 */

import { randomUUID } from "node:crypto";

export interface CognitiveNeuralEvent {
  eventId: string;
  eventType: string;
  contentId: string;
  meaning: string;
  confidence: number;
  consequences: string[];
  memoryImpact: number;
  recommendedReactions: string[];
  timestamp: string;
}

export type CognitiveListener = (event: CognitiveNeuralEvent) => void;

export class CognitiveNeuralEventBus {
  public listeners: CognitiveListener[] = [];
  private readonly eventsJournal: CognitiveNeuralEvent[] = [];

  public emit(event: any): CognitiveNeuralEvent {
    const cognitiveEvent: CognitiveNeuralEvent = {
      eventId: event.eventId || `nevt_${randomUUID().slice(0, 8)}`,
      eventType: event.eventType || event.type || "NEURAL_EVENT",
      contentId: event.contentId || "SYSTEM",
      meaning: event.meaning || event.content || "Operational system event",
      confidence: event.confidence ?? 0.95,
      consequences: event.consequences || [],
      memoryImpact: event.memoryImpact ?? 1.0,
      recommendedReactions: event.recommendedReactions || ["OBSERVE_AND_RECORD"],
      timestamp: event.timestamp || new Date().toISOString()
    };

    console.log("ABRAXAS NEURAL EVENT", cognitiveEvent);
    this.eventsJournal.push(cognitiveEvent);
    this.listeners.forEach((listener) => {
      try { listener(cognitiveEvent); } catch (e) {}
    });

    return cognitiveEvent;
  }

  public subscribe(listener: CognitiveListener): () => void {
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
    memoryImpact = 1.0,
    recommendedReactions: string[] = ["CONTINUE_CYCLE"]
  ): CognitiveNeuralEvent {
    return this.emit({
      eventType,
      contentId,
      meaning,
      confidence,
      consequences,
      memoryImpact,
      recommendedReactions
    });
  }

  public getJournal(): CognitiveNeuralEvent[] {
    return [...this.eventsJournal];
  }

  public getEventsForContent(contentId: string): CognitiveNeuralEvent[] {
    return this.eventsJournal.filter((e) => e.contentId === contentId);
  }

  public getHighImpactEvents(minImpact = 1.0): CognitiveNeuralEvent[] {
    return this.eventsJournal.filter((e) => (e.memoryImpact ?? 0) >= minImpact);
  }
}

export const NeuralEventBus = CognitiveNeuralEventBus;
