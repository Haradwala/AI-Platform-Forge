export abstract class ForgeError extends Error {
  public abstract readonly isFatal: boolean;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class RecoverableError extends ForgeError {
  public readonly isFatal = false;
}

export class FatalError extends ForgeError {
  public readonly isFatal = true;
}

export class CircularDependencyError extends FatalError {
  constructor(message: string) {
    super(`Circular dependency detected: ${message}`);
  }
}
