/**
 * ABRAXAS Lienzo Domain Validator
 * Enforces strict fail-closed referential integrity, enum compliance, and schema contracts.
 */

import {
  Lienzo,
  LienzoComponent,
  LienzoDependency,
  LienzoLifecycle,
  LienzoLayer,
  LienzoSection,
  LienzoComponentStatus,
  DependencyRelation,
  LIENZO_SCHEMA_VERSION,
  LIENZO_LIFECYCLES,
  LIENZO_LAYERS,
  LIENZO_SECTIONS,
  LIENZO_COMPONENT_STATUSES,
  DEPENDENCY_RELATIONS
} from "./types.js";
import {
  LienzoValidationError,
  LienzoSchemaVersionError,
  LienzoDependencyError
} from "./errors.js";

const LIFECYCLE_SET = new Set<string>(LIENZO_LIFECYCLES);
const LAYER_SET = new Set<string>(LIENZO_LAYERS);
const SECTION_SET = new Set<string>(LIENZO_SECTIONS);
const STATUS_SET = new Set<string>(LIENZO_COMPONENT_STATUSES);
const RELATION_SET = new Set<string>(DEPENDENCY_RELATIONS);

export function validateActorAndReason(actorId: unknown, reason: unknown): void {
  if (typeof actorId !== "string" || actorId.trim().length === 0) {
    throw new LienzoValidationError("actorId must be a non-empty, non-whitespace string", "actorId");
  }
  if (typeof reason !== "string" || reason.trim().length === 0) {
    throw new LienzoValidationError("reason must be a non-empty, non-whitespace string", "reason");
  }
}

export function validateLifecycle(lifecycle: unknown): asserts lifecycle is LienzoLifecycle {
  if (typeof lifecycle !== "string" || !LIFECYCLE_SET.has(lifecycle)) {
    throw new LienzoValidationError(`Invalid Lienzo lifecycle: "${lifecycle}"`, "lifecycle");
  }
}

export function validateLayer(layer: unknown): asserts layer is LienzoLayer {
  if (typeof layer !== "string" || !LAYER_SET.has(layer)) {
    throw new LienzoValidationError(`Invalid Lienzo layer: "${layer}"`, "layer");
  }
}

export function validateSection(section: unknown): asserts section is LienzoSection {
  if (typeof section !== "string" || !SECTION_SET.has(section)) {
    throw new LienzoValidationError(`Invalid Lienzo section: "${section}"`, "section");
  }
}

export function validateComponentStatus(status: unknown): asserts status is LienzoComponentStatus {
  if (typeof status !== "string" || !STATUS_SET.has(status)) {
    throw new LienzoValidationError(`Invalid Lienzo component status: "${status}"`, "status");
  }
}

export function validateDependencyRelation(relation: unknown): asserts relation is DependencyRelation {
  if (typeof relation !== "string" || !RELATION_SET.has(relation)) {
    throw new LienzoValidationError(`Invalid dependency relation: "${relation}"`, "relation");
  }
}

export function validateIsoDate(dateStr: unknown, fieldName: string): void {
  if (typeof dateStr !== "string" || isNaN(Date.parse(dateStr))) {
    throw new LienzoValidationError(`Invalid ISO date format for ${fieldName}: "${dateStr}"`, fieldName);
  }
}

export function validateComponent(comp: unknown, componentIdSet: Set<string>): asserts comp is LienzoComponent {
  if (!comp || typeof comp !== "object") {
    throw new LienzoValidationError("Component must be a non-null object", "component");
  }
  const c = comp as Partial<LienzoComponent>;

  if (typeof c.componentId !== "string" || c.componentId.trim().length === 0) {
    throw new LienzoValidationError("Component componentId must be a non-empty string", "componentId");
  }
  if (componentIdSet.has(c.componentId)) {
    throw new LienzoValidationError(`Duplicate componentId detected: "${c.componentId}"`, "componentId");
  }
  componentIdSet.add(c.componentId);

  validateSection(c.section);
  validateLayer(c.layer);
  validateComponentStatus(c.status);

  if (typeof c.version !== "number" || c.version < 1 || !Number.isInteger(c.version)) {
    throw new LienzoValidationError(`Invalid component version ${c.version} on "${c.componentId}"`, "version");
  }

  validateIsoDate(c.createdAt, "createdAt");
  validateIsoDate(c.updatedAt, "updatedAt");

  if (typeof c.createdBy !== "string" || c.createdBy.trim().length === 0) {
    throw new LienzoValidationError("Component createdBy must be non-empty", "createdBy");
  }
  if (typeof c.updatedBy !== "string" || c.updatedBy.trim().length === 0) {
    throw new LienzoValidationError("Component updatedBy must be non-empty", "updatedBy");
  }

  if (!Array.isArray(c.sourceRefs)) {
    throw new LienzoValidationError(`Component "${c.componentId}" sourceRefs must be an array`, "sourceRefs");
  }
  if (!Array.isArray(c.artifactRefs)) {
    throw new LienzoValidationError(`Component "${c.componentId}" artifactRefs must be an array`, "artifactRefs");
  }
}

export function validateDependency(
  dep: unknown,
  componentIds: Set<string>,
  seenEdges: Set<string>
): asserts dep is LienzoDependency {
  if (!dep || typeof dep !== "object") {
    throw new LienzoValidationError("Dependency must be a non-null object", "dependency");
  }
  const d = dep as Partial<LienzoDependency>;

  if (typeof d.upstreamComponentId !== "string" || !componentIds.has(d.upstreamComponentId)) {
    throw new LienzoDependencyError(
      `Dependency upstreamComponentId "${d.upstreamComponentId}" is dangling or invalid`,
      { upstreamComponentId: d.upstreamComponentId }
    );
  }

  if (typeof d.downstreamComponentId !== "string" || !componentIds.has(d.downstreamComponentId)) {
    throw new LienzoDependencyError(
      `Dependency downstreamComponentId "${d.downstreamComponentId}" is dangling or invalid`,
      { downstreamComponentId: d.downstreamComponentId }
    );
  }

  if (d.upstreamComponentId === d.downstreamComponentId) {
    throw new LienzoDependencyError(
      `Self-dependency detected on component "${d.upstreamComponentId}"`,
      { componentId: d.upstreamComponentId }
    );
  }

  validateDependencyRelation(d.relation);

  const edgeKey = `${d.upstreamComponentId}->${d.downstreamComponentId}`;
  if (seenEdges.has(edgeKey)) {
    throw new LienzoDependencyError(`Duplicate dependency edge: "${edgeKey}"`, { edgeKey });
  }
  seenEdges.add(edgeKey);
}

export function detectCycles(dependencies: LienzoDependency[], componentIds: Set<string>): void {
  const adj = new Map<string, string[]>();
  for (const id of componentIds) {
    adj.set(id, []);
  }
  for (const dep of dependencies) {
    adj.get(dep.upstreamComponentId)?.push(dep.downstreamComponentId);
  }

  const visited = new Map<string, "WHITE" | "GRAY" | "BLACK">();
  for (const id of componentIds) {
    visited.set(id, "WHITE");
  }

  function dfs(u: string, path: string[]) {
    visited.set(u, "GRAY");
    path.push(u);
    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      const state = visited.get(v);
      if (state === "GRAY") {
        const cyclePath = path.slice(path.indexOf(v)).concat(v).join(" -> ");
        throw new LienzoDependencyError(`Dependency cycle detected: ${cyclePath}`, { cyclePath });
      }
      if (state === "WHITE") {
        dfs(v, path);
      }
    }
    path.pop();
    visited.set(u, "BLACK");
  }

  for (const id of componentIds) {
    if (visited.get(id) === "WHITE") {
      dfs(id, []);
    }
  }
}

export function validateLienzoState(lienzo: unknown): asserts lienzo is Lienzo {
  if (!lienzo || typeof lienzo !== "object") {
    throw new LienzoValidationError("Lienzo must be a non-null object");
  }
  const l = lienzo as Partial<Lienzo>;

  if (l.schemaVersion !== LIENZO_SCHEMA_VERSION) {
    throw new LienzoSchemaVersionError(l.schemaVersion, LIENZO_SCHEMA_VERSION);
  }

  if (typeof l.contentId !== "string" || l.contentId.trim().length === 0) {
    throw new LienzoValidationError("contentId must be a non-empty string", "contentId");
  }

  if (typeof l.title !== "string" || l.title.trim().length === 0) {
    throw new LienzoValidationError("title must be a non-empty string", "title");
  }

  if (typeof l.revision !== "number" || l.revision < 1 || !Number.isInteger(l.revision)) {
    throw new LienzoValidationError("revision must be an integer >= 1", "revision");
  }

  validateLifecycle(l.lifecycle);

  validateIsoDate(l.createdAt, "createdAt");
  validateIsoDate(l.updatedAt, "updatedAt");

  if (typeof l.createdBy !== "string" || l.createdBy.trim().length === 0) {
    throw new LienzoValidationError("createdBy must be non-empty", "createdBy");
  }
  if (typeof l.updatedBy !== "string" || l.updatedBy.trim().length === 0) {
    throw new LienzoValidationError("updatedBy must be non-empty", "updatedBy");
  }

  if (!Array.isArray(l.components)) {
    throw new LienzoValidationError("components must be an array", "components");
  }

  const componentIdSet = new Set<string>();
  for (const comp of l.components) {
    validateComponent(comp, componentIdSet);
  }

  if (!Array.isArray(l.dependencies)) {
    throw new LienzoValidationError("dependencies must be an array", "dependencies");
  }

  const seenEdges = new Set<string>();
  for (const dep of l.dependencies) {
    validateDependency(dep, componentIdSet, seenEdges);
  }

  detectCycles(l.dependencies, componentIdSet);

  if (!Array.isArray(l.history)) {
    throw new LienzoValidationError("history must be an array", "history");
  }

  if (l.history.length === 0) {
    throw new LienzoValidationError("Lienzo history must contain at least the initial revision entry", "history");
  }

  if (l.history.length !== l.revision) {
    throw new LienzoValidationError(
      `Lienzo history length (${l.history.length}) does not match current revision (${l.revision})`,
      "history"
    );
  }

  // Validate history revision sequence and parent chain
  for (let i = 0; i < l.history.length; i++) {
    const rev = l.history[i]!;
    const expectedRevNum = i + 1;
    const expectedParent = i;

    if (rev.revision !== expectedRevNum) {
      throw new LienzoValidationError(
        `History entry at index ${i} has revision ${rev.revision}, expected ${expectedRevNum}`,
        "history"
      );
    }
    if (rev.parentRevision !== expectedParent) {
      throw new LienzoValidationError(
        `History entry at revision ${rev.revision} has parentRevision ${rev.parentRevision}, expected ${expectedParent}`,
        "history"
      );
    }
    validateActorAndReason(rev.actorId, rev.reason);
    validateIsoDate(rev.timestamp, `history[${i}].timestamp`);
  }
}
