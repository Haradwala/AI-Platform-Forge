import type { ServiceToken } from './interfaces';

// ─── Base ─────────────────────────────────────────────────────────────────────

export class ContainerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintain proper prototype chain in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Circular dependency ─────────────────────────────────────────────────────

export class CircularDependencyError extends ContainerError {
  readonly cycle: readonly string[];

  constructor(cycle: string[]) {
    super(`Circular dependency detected: ${cycle.join(' → ')}`);
    this.cycle = cycle;
  }
}

// ─── Missing dependency ──────────────────────────────────────────────────────

export class MissingDependencyError extends ContainerError {
  readonly requiredBy: string;
  readonly missingToken: ServiceToken;

  constructor(requiredBy: string, missingToken: ServiceToken) {
    super(
      `Service "${requiredBy}" requires "${missingToken.toString()}" which is not registered. ` +
      `Ensure the module providing this service is loaded before "${requiredBy}".`,
    );
    this.requiredBy = requiredBy;
    this.missingToken = missingToken;
  }
}

// ─── Duplicate registration ──────────────────────────────────────────────────

export class DuplicateRegistrationError extends ContainerError {
  readonly token: ServiceToken;
  readonly existingName: string;

  constructor(token: ServiceToken, existingName: string) {
    super(
      `A service is already registered for token "${token.toString()}" ` +
      `(existing: "${existingName}"). ` +
      `Use a unique token for each service, or call tryResolve() if the service may not exist.`,
    );
    this.token = token;
    this.existingName = existingName;
  }
}

// ─── Frozen container ────────────────────────────────────────────────────────

export class FrozenContainerError extends ContainerError {
  constructor(operation: string) {
    super(
      `Cannot perform "${operation}": the container has been frozen. ` +
      `Service registrations are locked after StartupManager.boot() completes. ` +
      `Use loadPlugin() to register services through the PluginManager.`,
    );
  }
}

// ─── Duplicate module ────────────────────────────────────────────────────────

export class DuplicateModuleError extends ContainerError {
  readonly moduleName: string;

  constructor(moduleName: string) {
    super(
      `Module "${moduleName}" is already loaded. ` +
      `Each module may only be loaded once per container instance.`,
    );
    this.moduleName = moduleName;
  }
}

// ─── Unregistered service ────────────────────────────────────────────────────

export class UnregisteredServiceError extends ContainerError {
  readonly token: ServiceToken;

  constructor(token: ServiceToken, context?: string) {
    super(
      `No service is registered for token "${token.toString()}". ` +
      (context ? `Requested by: ${context}. ` : '') +
      `Ensure the module providing this service is loaded and container.validate() passes.`,
    );
    this.token = token;
  }
}

// ─── Module dependency error ─────────────────────────────────────────────────

export class ModuleDependencyError extends ContainerError {
  readonly moduleName: string;
  readonly missingDependency: string;

  constructor(moduleName: string, missingDependency: string) {
    super(
      `Module "${moduleName}" depends on module "${missingDependency}" ` +
      `which has not been loaded yet. Load modules in dependency order.`,
    );
    this.moduleName = moduleName;
    this.missingDependency = missingDependency;
  }
}

// ─── Async init error ────────────────────────────────────────────────────────

export class ServiceInitializationError extends ContainerError {
  readonly serviceName: string;
  readonly cause: Error;

  constructor(serviceName: string, cause: Error) {
    super(`Failed to initialize service "${serviceName}": ${cause.message}`);
    this.serviceName = serviceName;
    this.cause = cause;
  }
}
