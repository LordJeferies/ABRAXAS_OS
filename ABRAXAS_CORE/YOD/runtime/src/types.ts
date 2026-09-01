/**
 * ABRAXAS YOD Domain Runtime Types
 */

export interface ClientCore {
  clientId: string;
  name: string;
  pillars: string[];
  claims: string[];
  brandVoice: string;
  targetAudiences: string[];
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface OpportunityJustification {
  coverageGap?: string | undefined;
  pillarDeficit?: string | undefined;
  formatRepetitionRisk?: string | undefined;
  sourceAvailability?: string | undefined;
  performanceSignal?: string | undefined;
}

export interface Opportunity {
  opportunityId: string;
  clientId: string;
  title: string;
  angle: string;
  pillar: string;
  recommendedFormatId: string;
  recommendedStructureId: string;
  hookConcept: string;
  justification: OpportunityJustification;
  score: number;
  createdAt: string;
  createdBy: string;
}

export interface PlanItem {
  itemId: string;
  title: string;
  formatId: string;
  structureId: string;
  targetPlatform: string;
}

export interface ContentPlan {
  planId: string;
  clientId: string;
  opportunityId: string;
  title: string;
  rationale: string;
  items: PlanItem[];
  createdAt: string;
  createdBy: string;
}

export interface PromptBlockDefinition {
  role: string;
  objective: string;
  context: string;
  inputs: Record<string, unknown>;
  whatItIs: string[];
  whatItIsNot: string[];
  structure: string;
  clientRules: string[];
  formatRules: string[];
  platformRules: string[];
  evidence: string[];
  restrictions: string[];
  negatives: string[];
  outputContract: string;
  acceptanceCriteria: string[];
  qa: string[];
  handoff: string;
  continuity: string;
}

export interface RecordingPack {
  packId: string;
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
  recommendedLocation: string | null;
  recordingIntent: string;
  compiledAt: string;
  compiledBy: string;
}
