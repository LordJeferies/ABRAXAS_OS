/**
 * ABRAXAS Lienzo Typed Domain Errors
 */

export class LienzoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LienzoError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LienzoValidationError extends LienzoError {
  public readonly field?: string | undefined;
  constructor(message: string, field?: string) {
    super(message);
    this.name = "LienzoValidationError";
    this.field = field;
  }
}

export class LienzoNotFoundError extends LienzoError {
  public readonly contentId: string;
  constructor(contentId: string) {
    super(`Lienzo content not found for id: "${contentId}"`);
    this.name = "LienzoNotFoundError";
    this.contentId = contentId;
  }
}

export class LienzoRevisionConflictError extends LienzoError {
  public readonly contentId: string;
  public readonly expectedRevision: number;
  public readonly actualRevision: number;
  constructor(contentId: string, expectedRevision: number, actualRevision: number) {
    super(
      `Lienzo revision conflict on "${contentId}": expected revision ${expectedRevision}, but actual is ${actualRevision}`
    );
    this.name = "LienzoRevisionConflictError";
    this.contentId = contentId;
    this.expectedRevision = expectedRevision;
    this.actualRevision = actualRevision;
  }
}

export class LienzoDependencyError extends LienzoError {
  public readonly details?: Record<string, unknown> | undefined;
  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "LienzoDependencyError";
    this.details = details;
  }
}

export class LienzoPersistenceError extends LienzoError {
  public readonly causeError?: unknown | undefined;
  constructor(message: string, causeError?: unknown) {
    super(message);
    this.name = "LienzoPersistenceError";
    this.causeError = causeError;
  }
}

export class LienzoSchemaVersionError extends LienzoError {
  public readonly receivedVersion: unknown;
  public readonly supportedVersion: number;
  constructor(receivedVersion: unknown, supportedVersion: number) {
    super(
      `Unsupported Lienzo schema version "${receivedVersion}". Expected schema version ${supportedVersion}.`
    );
    this.name = "LienzoSchemaVersionError";
    this.receivedVersion = receivedVersion;
    this.supportedVersion = supportedVersion;
  }
}
