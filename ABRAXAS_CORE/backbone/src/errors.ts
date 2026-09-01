/**
 * Backbone Domain Errors
 */

export class BackboneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackboneError";
  }
}

export class ArtifactNotFoundError extends BackboneError {
  constructor(artifactId: string) {
    super(`Artifact not found: "${artifactId}"`);
    this.name = "ArtifactNotFoundError";
  }
}

export class BackboneValidationError extends BackboneError {
  constructor(message: string) {
    super(message);
    this.name = "BackboneValidationError";
  }
}
