export const CURRENT_PROJECT_SCHEMA_VERSION = 1;

export const canOpenProjectVersion = (schemaVersion: number): boolean =>
  Number.isInteger(schemaVersion) && schemaVersion > 0 && schemaVersion <= CURRENT_PROJECT_SCHEMA_VERSION;
