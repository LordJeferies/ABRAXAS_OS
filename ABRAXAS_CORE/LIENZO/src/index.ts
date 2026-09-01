/**
 * @abraxas/lienzo — Public API Boundary
 * Exposes canonical domain types, errors, events, and safe service factory.
 * Internal raw store primitives are encapsulated.
 */

export * from "./types.js";
export * from "./errors.js";
export * from "./validator.js";
export * from "./dependency-graph.js";
export * from "./events.js";
export { LienzoService, createLienzoService } from "./service.js";
