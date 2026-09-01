/**
 * YOD Content Intelligence & Opportunity Engine
 */

import { randomUUID } from "node:crypto";
import {
  ClientCore,
  Opportunity,
  ContentPlan,
  PlanItem,
  PromptBlockDefinition,
  RecordingPack
} from "./types.js";
import { LienzoService } from "../../../LIENZO/src/service.js";

export class YodEngine {
  public generateOpportunity(client: ClientCore, context: {
    underrepresentedPillar: string;
    coverageGap: string;
    recommendedFormatId: string;
    recommendedStructureId: string;
    hookConcept: string;
    score: number;
    actorId: string;
  }): Opportunity {
    return {
      opportunityId: `opp_${randomUUID().slice(0, 10)}`,
      clientId: client.clientId,
      title: `${client.name} — ${context.underrepresentedPillar} Strategy Piece`,
      angle: `Breakthrough insight on ${context.underrepresentedPillar}`,
      pillar: context.underrepresentedPillar,
      recommendedFormatId: context.recommendedFormatId,
      recommendedStructureId: context.recommendedStructureId,
      hookConcept: context.hookConcept,
      justification: {
        coverageGap: context.coverageGap,
        pillarDeficit: `Pillar "${context.underrepresentedPillar}" has lowest coverage in current cycle`,
        sourceAvailability: "Rich founder interview audio ready in backlog"
      },
      score: context.score,
      createdAt: new Date().toISOString(),
      createdBy: context.actorId
    };
  }

  public createPlanFromOpportunity(opportunity: Opportunity, items: Array<{
    title: string;
    formatId: string;
    structureId: string;
    targetPlatform: string;
  }>, actorId: string): ContentPlan {
    const planId = `plan_${randomUUID().slice(0, 10)}`;
    const planItems: PlanItem[] = items.map((item, idx) => ({
      itemId: `item_${idx + 1}_${randomUUID().slice(0, 6)}`,
      title: item.title,
      formatId: item.formatId,
      structureId: item.structureId,
      targetPlatform: item.targetPlatform
    }));

    return {
      planId,
      clientId: opportunity.clientId,
      opportunityId: opportunity.opportunityId,
      title: `Campaign Plan: ${opportunity.title}`,
      rationale: `Capitalize on opportunity "${opportunity.title}" across ${items.length} deliverables`,
      items: planItems,
      createdAt: new Date().toISOString(),
      createdBy: actorId
    };
  }

  public async instantiateLienzoFromPlanItem(
    lienzoService: LienzoService,
    plan: ContentPlan,
    item: PlanItem,
    client: ClientCore,
    actorId: string
  ): Promise<{ contentId: string; revision: number }> {
    const { lienzo } = await lienzoService.createLienzo({
      title: item.title,
      actorId,
      reason: `Spawned from Plan "${plan.title}" for item "${item.title}"`,
      initialLifecycle: "PLANNED"
    });

    // Write Strategy Component
    await lienzoService.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 1,
      actorId,
      reason: "Establish YOD editorial strategy from client core",
      componentId: "comp_strategy_yod",
      section: "CONTENT",
      layer: "STRATEGY",
      status: "APPROVED",
      data: {
        clientId: client.clientId,
        planId: plan.planId,
        formatId: item.formatId,
        structureId: item.structureId,
        brandVoice: client.brandVoice,
        approvedClaims: client.claims
      }
    });

    // Write Planned Script Outline
    await lienzoService.createComponent({
      contentId: lienzo.contentId,
      expectedRevision: 2,
      actorId,
      reason: "Establish YOD planned outline",
      componentId: "comp_planned_outline",
      section: "COPY",
      layer: "PLANNED",
      status: "DRAFT",
      data: {
        outline: `Planned outline for ${item.title} targeting ${item.targetPlatform}`
      }
    });

    return { contentId: lienzo.contentId, revision: 3 };
  }

  public compilePrompt(def: PromptBlockDefinition): string {
    return [
      `=== ROLE ===\n${def.role}`,
      `=== OBJECTIVE ===\n${def.objective}`,
      `=== CONTEXT ===\n${def.context}`,
      `=== INPUTS ===\n${JSON.stringify(def.inputs, null, 2)}`,
      `=== WHAT IT IS ===\n${def.whatItIs.map((x) => `- ${x}`).join("\n")}`,
      `=== WHAT IT IS NOT ===\n${def.whatItIsNot.map((x) => `- ${x}`).join("\n")}`,
      `=== STRUCTURE ===\n${def.structure}`,
      `=== CLIENT RULES ===\n${def.clientRules.map((x) => `- ${x}`).join("\n")}`,
      `=== FORMAT RULES ===\n${def.formatRules.map((x) => `- ${x}`).join("\n")}`,
      `=== PLATFORM RULES ===\n${def.platformRules.map((x) => `- ${x}`).join("\n")}`,
      `=== EVIDENCE ===\n${def.evidence.map((x) => `- ${x}`).join("\n")}`,
      `=== RESTRICTIONS ===\n${def.restrictions.map((x) => `- ${x}`).join("\n")}`,
      `=== NEGATIVES ===\n${def.negatives.map((x) => `- ${x}`).join("\n")}`,
      `=== OUTPUT CONTRACT ===\n${def.outputContract}`,
      `=== ACCEPTANCE CRITERIA ===\n${def.acceptanceCriteria.map((x) => `- ${x}`).join("\n")}`,
      `=== QA ===\n${def.qa.map((x) => `- ${x}`).join("\n")}`,
      `=== HANDOFF ===\n${def.handoff}`,
      `=== CONTINUITY ===\n${def.continuity}`
    ].join("\n\n");
  }

  public compileRecordingPack(input: {
    contentId: string;
    clientId: string;
    title: string;
    question: string;
    context: string;
    openTrigger: string;
    possibleHooks: string[];
    developmentDirections: string[];
    closeOptions: string[];
    sourceRequirements: string[];
    visualSupport: string[];
    recommendedLocation?: string | null | undefined;
    recordingIntent: string;
    actorId: string;
  }): RecordingPack {
    return {
      packId: `pack_${randomUUID().slice(0, 10)}`,
      contentId: input.contentId,
      clientId: input.clientId,
      title: input.title,
      question: input.question,
      context: input.context,
      openTrigger: input.openTrigger,
      possibleHooks: [...input.possibleHooks],
      developmentDirections: [...input.developmentDirections],
      closeOptions: [...input.closeOptions],
      sourceRequirements: [...input.sourceRequirements],
      visualSupport: [...input.visualSupport],
      recommendedLocation: input.recommendedLocation ?? null,
      recordingIntent: input.recordingIntent,
      compiledAt: new Date().toISOString(),
      compiledBy: input.actorId
    };
  }
}
