/**
 * ABRAXAS Lienzo Domain Service
 * Public service and command boundary for persistent content identity operations.
 */

import { randomUUID } from "node:crypto";
import {
  Lienzo,
  LienzoComponent,
  LienzoComponentSnapshot,
  LienzoDependency,
  LienzoRevision,
  ComponentChangeEntry,
  ImpactReport,
  LIENZO_SCHEMA_VERSION,
  CreateLienzoInput,
  CreateComponentInput,
  UpdateComponentInput,
  ChangeComponentStatusInput,
  ChangeLifecycleInput,
  AddDependencyInput,
  RemoveDependencyInput
} from "./types.js";
import { ILienzoStore, MemoryLienzoStore, JsonFileLienzoStore } from "./store.js";
import { LienzoEventEmitter, LienzoDomainEvent } from "./events.js";
import {
  validateActorAndReason,
  validateLifecycle,
  validateLayer,
  validateSection,
  validateComponentStatus,
  validateLienzoState
} from "./validator.js";
import { calculateImpact } from "./dependency-graph.js";
import {
  LienzoNotFoundError,
  LienzoRevisionConflictError,
  LienzoValidationError,
  LienzoDependencyError
} from "./errors.js";

function createSnapshot(c: LienzoComponent): LienzoComponentSnapshot {
  return {
    componentId: c.componentId,
    section: c.section,
    layer: c.layer,
    version: c.version,
    status: c.status,
    data: JSON.parse(JSON.stringify(c.data)),
    sourceRefs: JSON.parse(JSON.stringify(c.sourceRefs)),
    artifactRefs: JSON.parse(JSON.stringify(c.artifactRefs))
  };
}

export class LienzoService {
  private readonly store: ILienzoStore;
  public readonly events: LienzoEventEmitter;

  constructor(store?: ILienzoStore, eventEmitter?: LienzoEventEmitter) {
    this.store = store ?? new MemoryLienzoStore();
    this.events = eventEmitter ?? new LienzoEventEmitter();
  }

  public async getLienzo(contentId: string): Promise<Lienzo> {
    const lienzo = await this.store.load(contentId);
    if (!lienzo) {
      throw new LienzoNotFoundError(contentId);
    }
    return lienzo;
  }

  public async listLienzos(): Promise<Lienzo[]> {
    return this.store.list();
  }

  public async createLienzo(input: CreateLienzoInput): Promise<{
    lienzo: Lienzo;
    event: LienzoDomainEvent;
  }> {
    if (!input.title || input.title.trim().length === 0) {
      throw new LienzoValidationError("Title must be provided", "title");
    }
    const reason = input.reason ?? "Initial Lienzo creation";
    validateActorAndReason(input.actorId, reason);

    const contentId = input.contentId ?? `lienzo_${randomUUID().slice(0, 12)}`;
    const exists = await this.store.exists(contentId);
    if (exists) {
      throw new LienzoValidationError(`Lienzo contentId "${contentId}" already exists`, "contentId");
    }

    const initialLifecycle = input.initialLifecycle ?? "IDEA";
    validateLifecycle(initialLifecycle);

    const now = new Date().toISOString();

    const initialComponents: LienzoComponent[] = (input.initialComponents ?? []).map((c) => {
      validateSection(c.section);
      validateLayer(c.layer);
      validateComponentStatus(c.status);
      return {
        componentId: c.componentId ?? `comp_${randomUUID().slice(0, 8)}`,
        section: c.section,
        layer: c.layer,
        version: 1,
        status: c.status,
        data: c.data ?? {},
        sourceRefs: c.sourceRefs ?? [],
        artifactRefs: c.artifactRefs ?? [],
        createdAt: now,
        createdBy: input.actorId,
        updatedAt: now,
        updatedBy: input.actorId
      };
    });

    const componentChanges: ComponentChangeEntry[] = initialComponents.map((c) => ({
      componentId: c.componentId,
      changeType: "CREATED",
      after: createSnapshot(c)
    }));

    const initialRevision: LienzoRevision = {
      revision: 1,
      parentRevision: 0,
      actorId: input.actorId,
      timestamp: now,
      reason,
      changedComponentIds: initialComponents.map((c) => c.componentId),
      componentChanges
    };

    const newLienzo: Lienzo = {
      schemaVersion: LIENZO_SCHEMA_VERSION,
      contentId,
      title: input.title,
      revision: 1,
      lifecycle: initialLifecycle,
      components: initialComponents,
      dependencies: [],
      sourceRefs: [],
      artifactRefs: [],
      history: [initialRevision],
      createdAt: now,
      createdBy: input.actorId,
      updatedAt: now,
      updatedBy: input.actorId
    };

    await this.store.createInitial(newLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_CREATED",
      contentId: newLienzo.contentId,
      componentId: null,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: null,
      newRevision: 1,
      reason,
      payload: { title: newLienzo.title, lifecycle: newLienzo.lifecycle }
    });

    this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: newLienzo.contentId,
      componentId: null,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: null,
      newRevision: 1,
      reason,
      payload: { revision: 1 }
    });

    return { lienzo: newLienzo, event };
  }

  public async createComponent(input: CreateComponentInput): Promise<{
    lienzo: Lienzo;
    component: LienzoComponent;
    event: LienzoDomainEvent;
  }> {
    validateActorAndReason(input.actorId, input.reason);
    const current = await this.getLienzo(input.contentId);
    if (input.expectedRevision !== current.revision) {
      throw new LienzoRevisionConflictError(input.contentId, input.expectedRevision, current.revision);
    }

    validateSection(input.section);
    validateLayer(input.layer);
    const status = input.status ?? "DRAFT";
    validateComponentStatus(status);

    const componentId = input.componentId ?? `comp_${randomUUID().slice(0, 8)}`;
    if (current.components.some((c) => c.componentId === componentId)) {
      throw new LienzoValidationError(`Component "${componentId}" already exists in "${input.contentId}"`);
    }

    const now = new Date().toISOString();
    const newRevisionNumber = current.revision + 1;

    const newComp: LienzoComponent = {
      componentId,
      section: input.section,
      layer: input.layer,
      version: 1,
      status,
      data: input.data ?? {},
      sourceRefs: input.sourceRefs ?? [],
      artifactRefs: input.artifactRefs ?? [],
      createdAt: now,
      createdBy: input.actorId,
      updatedAt: now,
      updatedBy: input.actorId
    };

    const revisionEntry: LienzoRevision = {
      revision: newRevisionNumber,
      parentRevision: current.revision,
      actorId: input.actorId,
      timestamp: now,
      reason: input.reason,
      changedComponentIds: [componentId],
      componentChanges: [
        {
          componentId,
          changeType: "CREATED",
          after: createSnapshot(newComp)
        }
      ]
    };

    const updatedLienzo: Lienzo = {
      ...current,
      revision: newRevisionNumber,
      components: [...current.components, newComp],
      history: [...current.history, revisionEntry],
      updatedAt: now,
      updatedBy: input.actorId
    };

    await this.store.commit(current.contentId, current.revision, updatedLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_COMPONENT_CREATED",
      contentId: updatedLienzo.contentId,
      componentId,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: { section: newComp.section, layer: newComp.layer, status: newComp.status }
    });

    this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: updatedLienzo.contentId,
      componentId,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: { revision: newRevisionNumber }
    });

    return { lienzo: updatedLienzo, component: newComp, event };
  }

  public async updateComponent(input: UpdateComponentInput): Promise<{
    lienzo: Lienzo;
    component: LienzoComponent;
    impactReport: ImpactReport;
    event: LienzoDomainEvent;
  }> {
    validateActorAndReason(input.actorId, input.reason);
    const current = await this.getLienzo(input.contentId);
    if (input.expectedRevision !== current.revision) {
      throw new LienzoRevisionConflictError(input.contentId, input.expectedRevision, current.revision);
    }

    const compIndex = current.components.findIndex((c) => c.componentId === input.componentId);
    if (compIndex === -1) {
      throw new LienzoValidationError(`Component "${input.componentId}" not found in Lienzo "${input.contentId}"`);
    }

    const existingComp = current.components[compIndex]!;
    if (input.section) validateSection(input.section);
    if (input.layer) validateLayer(input.layer);
    if (input.status) validateComponentStatus(input.status);

    const now = new Date().toISOString();
    const newRevisionNumber = current.revision + 1;

    const beforeSnapshot = createSnapshot(existingComp);

    const updatedComp: LienzoComponent = {
      componentId: existingComp.componentId,
      section: input.section ?? existingComp.section,
      layer: input.layer ?? existingComp.layer,
      status: input.status ?? existingComp.status,
      data: input.data ?? existingComp.data,
      sourceRefs: input.sourceRefs ?? existingComp.sourceRefs,
      artifactRefs: input.artifactRefs ?? existingComp.artifactRefs,
      version: existingComp.version + 1, // Mutated component increments version
      createdAt: existingComp.createdAt,
      createdBy: existingComp.createdBy,
      updatedAt: now,
      updatedBy: input.actorId
    };

    // Calculate downstream impact
    const tempComponents = [...current.components];
    tempComponents[compIndex] = updatedComp;

    const impactReport = calculateImpact(
      tempComponents,
      current.dependencies,
      input.componentId,
      input.reason
    );

    const impactMap = new Map(impactReport.affectedComponents.map((a) => [a.componentId, a.newStatus]));
    const componentChanges: ComponentChangeEntry[] = [
      {
        componentId: input.componentId,
        changeType: "UPDATED",
        before: beforeSnapshot,
        after: createSnapshot(updatedComp)
      }
    ];

    // Apply OUT_OF_SYNC updates while preserving existing artifactRefs and sourceRefs, AND incrementing version!
    const finalComponents = tempComponents.map((c) => {
      if (impactMap.has(c.componentId)) {
        const newStatus = impactMap.get(c.componentId)!;
        if (newStatus !== c.status) {
          const compBefore = createSnapshot(c);
          const compOut: LienzoComponent = {
            ...c,
            status: newStatus,
            version: c.version + 1, // Impacted component version increments to reflect new invalid state!
            updatedAt: now,
            updatedBy: input.actorId
          };
          componentChanges.push({
            componentId: c.componentId,
            changeType: "STATUS_CHANGED",
            before: compBefore,
            after: createSnapshot(compOut)
          });
          return compOut;
        }
      }
      return c;
    });

    const changedComponentIds = componentChanges.map((c) => c.componentId);

    const revisionEntry: LienzoRevision = {
      revision: newRevisionNumber,
      parentRevision: current.revision,
      actorId: input.actorId,
      timestamp: now,
      reason: input.reason,
      changedComponentIds,
      componentChanges,
      impact: impactReport.affectedComponents
    };

    const updatedLienzo: Lienzo = {
      ...current,
      revision: newRevisionNumber,
      components: finalComponents,
      history: [...current.history, revisionEntry],
      updatedAt: now,
      updatedBy: input.actorId
    };

    await this.store.commit(current.contentId, current.revision, updatedLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_COMPONENT_UPDATED",
      contentId: updatedLienzo.contentId,
      componentId: input.componentId,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: {
        componentVersion: updatedComp.version,
        affectedCount: impactReport.affectedComponents.length
      }
    });

    if (impactReport.affectedComponents.length > 0) {
      this.events.emit({
        eventType: "LIENZO_IMPACT_DETECTED",
        contentId: updatedLienzo.contentId,
        componentId: input.componentId,
        actorId: input.actorId,
        timestamp: now,
        previousRevision: current.revision,
        newRevision: newRevisionNumber,
        reason: input.reason,
        payload: {
          affectedComponents: impactReport.affectedComponents
        }
      });
    }

    this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: updatedLienzo.contentId,
      componentId: input.componentId,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: { revision: newRevisionNumber }
    });

    return {
      lienzo: updatedLienzo,
      component: finalComponents.find((c) => c.componentId === input.componentId)!,
      impactReport,
      event
    };
  }

  public async changeComponentStatus(input: ChangeComponentStatusInput): Promise<{
    lienzo: Lienzo;
    component: LienzoComponent;
    event: LienzoDomainEvent;
  }> {
    validateActorAndReason(input.actorId, input.reason);
    const current = await this.getLienzo(input.contentId);
    if (input.expectedRevision !== current.revision) {
      throw new LienzoRevisionConflictError(input.contentId, input.expectedRevision, current.revision);
    }

    validateComponentStatus(input.newStatus);

    const compIndex = current.components.findIndex((c) => c.componentId === input.componentId);
    if (compIndex === -1) {
      throw new LienzoValidationError(`Component "${input.componentId}" not found in Lienzo "${input.contentId}"`);
    }

    const existingComp = current.components[compIndex]!;
    const now = new Date().toISOString();
    const newRevisionNumber = current.revision + 1;

    const beforeSnapshot = createSnapshot(existingComp);

    // Preserving all prior artifact refs and appending any new reference
    const artifactRefs = input.artifactRef
      ? [...existingComp.artifactRefs, input.artifactRef]
      : existingComp.artifactRefs;

    const updatedComp: LienzoComponent = {
      componentId: existingComp.componentId,
      section: existingComp.section,
      layer: existingComp.layer,
      data: existingComp.data,
      sourceRefs: existingComp.sourceRefs,
      status: input.newStatus,
      artifactRefs,
      version: existingComp.version + 1,
      createdAt: existingComp.createdAt,
      createdBy: existingComp.createdBy,
      updatedAt: now,
      updatedBy: input.actorId
    };

    const finalComponents = [...current.components];
    finalComponents[compIndex] = updatedComp;

    const componentChanges: ComponentChangeEntry[] = [
      {
        componentId: input.componentId,
        changeType: "STATUS_CHANGED",
        before: beforeSnapshot,
        after: createSnapshot(updatedComp)
      }
    ];

    const revisionEntry: LienzoRevision = {
      revision: newRevisionNumber,
      parentRevision: current.revision,
      actorId: input.actorId,
      timestamp: now,
      reason: input.reason,
      changedComponentIds: [input.componentId],
      componentChanges
    };

    const updatedLienzo: Lienzo = {
      ...current,
      revision: newRevisionNumber,
      components: finalComponents,
      history: [...current.history, revisionEntry],
      updatedAt: now,
      updatedBy: input.actorId
    };

    await this.store.commit(current.contentId, current.revision, updatedLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_COMPONENT_STATUS_CHANGED",
      contentId: updatedLienzo.contentId,
      componentId: input.componentId,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: {
        previousStatus: existingComp.status,
        newStatus: input.newStatus
      }
    });

    this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: updatedLienzo.contentId,
      componentId: input.componentId,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: { revision: newRevisionNumber }
    });

    return { lienzo: updatedLienzo, component: updatedComp, event };
  }

  public async changeLifecycle(input: ChangeLifecycleInput): Promise<{
    lienzo: Lienzo;
    event: LienzoDomainEvent;
  }> {
    validateActorAndReason(input.actorId, input.reason);
    const current = await this.getLienzo(input.contentId);
    if (input.expectedRevision !== current.revision) {
      throw new LienzoRevisionConflictError(input.contentId, input.expectedRevision, current.revision);
    }

    validateLifecycle(input.newLifecycle);

    const now = new Date().toISOString();
    const newRevisionNumber = current.revision + 1;

    const revisionEntry: LienzoRevision = {
      revision: newRevisionNumber,
      parentRevision: current.revision,
      actorId: input.actorId,
      timestamp: now,
      reason: input.reason,
      changedComponentIds: [],
      lifecycleChange: {
        before: current.lifecycle,
        after: input.newLifecycle
      }
    };

    const updatedLienzo: Lienzo = {
      ...current,
      lifecycle: input.newLifecycle,
      revision: newRevisionNumber,
      history: [...current.history, revisionEntry],
      updatedAt: now,
      updatedBy: input.actorId
    };

    await this.store.commit(current.contentId, current.revision, updatedLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_LIFECYCLE_CHANGED",
      contentId: updatedLienzo.contentId,
      componentId: null,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: {
        previousLifecycle: current.lifecycle,
        newLifecycle: input.newLifecycle
      }
    });

    this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: updatedLienzo.contentId,
      componentId: null,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: { revision: newRevisionNumber }
    });

    return { lienzo: updatedLienzo, event };
  }

  public async addDependency(input: AddDependencyInput): Promise<{
    lienzo: Lienzo;
    event: LienzoDomainEvent;
  }> {
    validateActorAndReason(input.actorId, input.reason);
    const current = await this.getLienzo(input.contentId);
    if (input.expectedRevision !== current.revision) {
      throw new LienzoRevisionConflictError(input.contentId, input.expectedRevision, current.revision);
    }

    const newDep: LienzoDependency = {
      upstreamComponentId: input.upstreamComponentId,
      downstreamComponentId: input.downstreamComponentId,
      relation: input.relation ?? "INPUT"
    };

    const now = new Date().toISOString();
    const newRevisionNumber = current.revision + 1;

    const revisionEntry: LienzoRevision = {
      revision: newRevisionNumber,
      parentRevision: current.revision,
      actorId: input.actorId,
      timestamp: now,
      reason: input.reason,
      changedComponentIds: [input.upstreamComponentId, input.downstreamComponentId],
      dependencyChanges: [
        {
          changeType: "ADDED",
          upstreamComponentId: input.upstreamComponentId,
          downstreamComponentId: input.downstreamComponentId,
          relation: newDep.relation
        }
      ]
    };

    const updatedLienzo: Lienzo = {
      ...current,
      revision: newRevisionNumber,
      dependencies: [...current.dependencies, newDep],
      history: [...current.history, revisionEntry],
      updatedAt: now,
      updatedBy: input.actorId
    };

    // Validation checks for cycles, self-dependencies, dangling refs
    validateLienzoState(updatedLienzo);

    await this.store.commit(current.contentId, current.revision, updatedLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: updatedLienzo.contentId,
      componentId: null,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: {
        action: "ADD_DEPENDENCY",
        upstream: input.upstreamComponentId,
        downstream: input.downstreamComponentId
      }
    });

    return { lienzo: updatedLienzo, event };
  }

  public async removeDependency(input: RemoveDependencyInput): Promise<{
    lienzo: Lienzo;
    event: LienzoDomainEvent;
  }> {
    validateActorAndReason(input.actorId, input.reason);
    const current = await this.getLienzo(input.contentId);
    if (input.expectedRevision !== current.revision) {
      throw new LienzoRevisionConflictError(input.contentId, input.expectedRevision, current.revision);
    }

    const filtered = current.dependencies.filter(
      (d) =>
        !(
          d.upstreamComponentId === input.upstreamComponentId &&
          d.downstreamComponentId === input.downstreamComponentId
        )
    );

    if (filtered.length === current.dependencies.length) {
      throw new LienzoDependencyError("Dependency not found to remove", {
        upstreamComponentId: input.upstreamComponentId,
        downstreamComponentId: input.downstreamComponentId
      });
    }

    const now = new Date().toISOString();
    const newRevisionNumber = current.revision + 1;

    const revisionEntry: LienzoRevision = {
      revision: newRevisionNumber,
      parentRevision: current.revision,
      actorId: input.actorId,
      timestamp: now,
      reason: input.reason,
      changedComponentIds: [input.upstreamComponentId, input.downstreamComponentId],
      dependencyChanges: [
        {
          changeType: "REMOVED",
          upstreamComponentId: input.upstreamComponentId,
          downstreamComponentId: input.downstreamComponentId
        }
      ]
    };

    const updatedLienzo: Lienzo = {
      ...current,
      revision: newRevisionNumber,
      dependencies: filtered,
      history: [...current.history, revisionEntry],
      updatedAt: now,
      updatedBy: input.actorId
    };

    await this.store.commit(current.contentId, current.revision, updatedLienzo);

    const event = this.events.emit({
      eventType: "LIENZO_REVISION_COMMITTED",
      contentId: updatedLienzo.contentId,
      componentId: null,
      actorId: input.actorId,
      timestamp: now,
      previousRevision: current.revision,
      newRevision: newRevisionNumber,
      reason: input.reason,
      payload: {
        action: "REMOVE_DEPENDENCY",
        upstream: input.upstreamComponentId,
        downstream: input.downstreamComponentId
      }
    });

    return { lienzo: updatedLienzo, event };
  }

  public async calculateImpact(
    contentId: string,
    triggeringComponentId: string,
    reason: string
  ): Promise<ImpactReport> {
    const current = await this.getLienzo(contentId);
    return calculateImpact(current.components, current.dependencies, triggeringComponentId, reason);
  }
}

/**
 * Safe Factory for creating LienzoService instances without exposing raw store internals.
 */
export function createLienzoService(options?: { storageDir?: string }): LienzoService {
  if (options?.storageDir) {
    return new LienzoService(new JsonFileLienzoStore(options.storageDir));
  }
  return new LienzoService(new MemoryLienzoStore());
}
