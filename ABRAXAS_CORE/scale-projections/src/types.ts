/**
 * Scale Experience Projections Types
 */

export type SearchEntityType =
  | "client"
  | "lienzo"
  | "task"
  | "artifact"
  | "structure"
  | "prompt"
  | "person"
  | "publication_target";

export interface SearchIndexItem {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string | undefined;
  tags: string[];
}

export interface NavigationCommand {
  commandId: string;
  title: string;
  category: "NAVIGATION" | "ACTION" | "QUERY";
  route?: string | undefined;
  actionKey?: string | undefined;
  requiredRole?: string | undefined;
}

export interface VersionDiffResult {
  entityType: string;
  entityId: string;
  fromRevision: number;
  toRevision: number;
  changes: Array<{
    field: string;
    before: unknown;
    after: unknown;
  }>;
}
