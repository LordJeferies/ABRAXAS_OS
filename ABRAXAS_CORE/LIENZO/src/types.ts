/**
 * ABRAXAS Lienzo Domain Types
 * Canonical Source of Truth for persistent content identity.
 */

export const LIENZO_SCHEMA_VERSION = 1 as const;

export const LIENZO_LIFECYCLES = [
  "IDEA",
  "PLANNED",
  "PREPRODUCTION",
  "RECORDING",
  "INGESTED",
  "RESOLVED",
  "PRODUCTION",
  "QA",
  "READY",
  "SCHEDULED",
  "PUBLISHED",
  "LEARNING",
  "ARCHIVED"
] as const;

export type LienzoLifecycle = typeof LIENZO_LIFECYCLES[number];

export const LIENZO_LAYERS = [
  "CORE",
  "STRATEGY",
  "PLANNED",
  "OBSERVED",
  "RESOLVED",
  "PRODUCTION",
  "DISTRIBUTION",
  "PUBLICATION",
  "LEARNING",
  "HISTORY"
] as const;

export type LienzoLayer = typeof LIENZO_LAYERS[number];

export const LIENZO_SECTIONS = [
  "GENERAL",
  "CONTENT",
  "COPY",
  "VISUAL",
  "COVER",
  "MOTIONS",
  "CAPTIONS",
  "EDIT",
  "AUDIO",
  "VFX",
  "SFX",
  "PUBLISHING",
  "METRICS",
  "HISTORY"
] as const;

export type LienzoSection = typeof LIENZO_SECTIONS[number];

export const LIENZO_COMPONENT_STATUSES = [
  "NOT_NEEDED",
  "NOT_STARTED",
  "DRAFT",
  "IN_PROGRESS",
  "WAITING",
  "BLOCKED",
  "READY_FOR_REVIEW",
  "REVIEW",
  "APPROVED",
  "LOCKED",
  "GENERATING",
  "GENERATED",
  "OUT_OF_SYNC",
  "READY",
  "DONE",
  "ERROR"
] as const;

export type LienzoComponentStatus = typeof LIENZO_COMPONENT_STATUSES[number];

export const DEPENDENCY_RELATIONS = [
  "INPUT",
  "TIMING",
  "STYLE",
  "CONTEXT",
  "DIRECT_REFERENCE"
] as const;

export type DependencyRelation = typeof DEPENDENCY_RELATIONS[number];

export interface SourceRef {
  sourceId: string;
  uri: string;
  checksum?: string | undefined;
  timeSpanUs?: {
    startUs: number;
    endUs: number;
  } | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface ArtifactRef {
  artifactId: string;
  kind: string;
  uri: string;
  checksum?: string | undefined;
  createdAt: string;
  metadata?: Record<string, unknown> | undefined;
}

export interface LienzoComponent {
  componentId: string;
  section: LienzoSection;
  layer: LienzoLayer;
  version: number;
  status: LienzoComponentStatus;
  data: Record<string, unknown>;
  sourceRefs: SourceRef[];
  artifactRefs: ArtifactRef[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface LienzoComponentSnapshot {
  componentId: string;
  section: LienzoSection;
  layer: LienzoLayer;
  version: number;
  status: LienzoComponentStatus;
  data: Record<string, unknown>;
  sourceRefs: SourceRef[];
  artifactRefs: ArtifactRef[];
}

export interface ComponentChangeEntry {
  componentId: string;
  changeType: "CREATED" | "UPDATED" | "STATUS_CHANGED" | "DELETED";
  before?: LienzoComponentSnapshot | undefined;
  after?: LienzoComponentSnapshot | undefined;
}

export interface LifecycleChangeEntry {
  before: LienzoLifecycle;
  after: LienzoLifecycle;
}

export interface DependencyChangeEntry {
  changeType: "ADDED" | "REMOVED";
  upstreamComponentId: string;
  downstreamComponentId: string;
  relation?: DependencyRelation | undefined;
}

export interface LienzoDependency {
  upstreamComponentId: string;
  downstreamComponentId: string;
  relation: DependencyRelation;
  metadata?: Record<string, unknown> | undefined;
}

export interface ImpactItem {
  componentId: string;
  previousStatus: LienzoComponentStatus;
  newStatus: LienzoComponentStatus;
  reason: string;
}

export interface ImpactReport {
  triggeringComponentId: string;
  affectedComponents: ImpactItem[];
  timestamp: string;
}

export interface LienzoRevision {
  revision: number;
  parentRevision: number;
  actorId: string;
  timestamp: string;
  reason: string;
  changedComponentIds: string[];
  componentChanges?: ComponentChangeEntry[] | undefined;
  lifecycleChange?: LifecycleChangeEntry | undefined;
  dependencyChanges?: DependencyChangeEntry[] | undefined;
  impact?: ImpactItem[] | undefined;
}

export interface Lienzo {
  schemaVersion: typeof LIENZO_SCHEMA_VERSION;
  contentId: string;
  title: string;
  revision: number;
  lifecycle: LienzoLifecycle;
  components: LienzoComponent[];
  dependencies: LienzoDependency[];
  sourceRefs: SourceRef[];
  artifactRefs: ArtifactRef[];
  history: LienzoRevision[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// Service Command Inputs
export interface CreateLienzoInput {
  contentId?: string | undefined;
  title: string;
  actorId: string;
  reason?: string | undefined;
  initialLifecycle?: LienzoLifecycle | undefined;
  initialComponents?: Array<Omit<LienzoComponent, "version" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy">> | undefined;
}

export interface CreateComponentInput {
  contentId: string;
  expectedRevision: number;
  actorId: string;
  reason: string;
  componentId?: string | undefined;
  section: LienzoSection;
  layer: LienzoLayer;
  status?: LienzoComponentStatus | undefined;
  data?: Record<string, unknown> | undefined;
  sourceRefs?: SourceRef[] | undefined;
  artifactRefs?: ArtifactRef[] | undefined;
}

export interface UpdateComponentInput {
  contentId: string;
  componentId: string;
  expectedRevision: number;
  actorId: string;
  reason: string;
  section?: LienzoSection | undefined;
  layer?: LienzoLayer | undefined;
  status?: LienzoComponentStatus | undefined;
  data?: Record<string, unknown> | undefined;
  sourceRefs?: SourceRef[] | undefined;
  artifactRefs?: ArtifactRef[] | undefined;
}

export interface ChangeComponentStatusInput {
  contentId: string;
  componentId: string;
  newStatus: LienzoComponentStatus;
  expectedRevision: number;
  actorId: string;
  reason: string;
  artifactRef?: ArtifactRef | undefined;
}

export interface ChangeLifecycleInput {
  contentId: string;
  newLifecycle: LienzoLifecycle;
  expectedRevision: number;
  actorId: string;
  reason: string;
}

export interface AddDependencyInput {
  contentId: string;
  upstreamComponentId: string;
  downstreamComponentId: string;
  relation?: DependencyRelation | undefined;
  expectedRevision: number;
  actorId: string;
  reason: string;
}

export interface RemoveDependencyInput {
  contentId: string;
  upstreamComponentId: string;
  downstreamComponentId: string;
  expectedRevision: number;
  actorId: string;
  reason: string;
}
