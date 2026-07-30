"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceInitializationError = exports.ModuleDependencyError = exports.UnregisteredServiceError = exports.DuplicateModuleError = exports.FrozenContainerError = exports.DuplicateRegistrationError = exports.MissingDependencyError = exports.CircularDependencyError = exports.ContainerError = void 0;
// ─── Base ─────────────────────────────────────────────────────────────────────
class ContainerError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        // Maintain proper prototype chain in TypeScript
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ContainerError = ContainerError;
// ─── Circular dependency ─────────────────────────────────────────────────────
class CircularDependencyError extends ContainerError {
    cycle;
    constructor(cycle) {
        super(`Circular dependency detected: ${cycle.join(' → ')}`);
        this.cycle = cycle;
    }
}
exports.CircularDependencyError = CircularDependencyError;
// ─── Missing dependency ──────────────────────────────────────────────────────
class MissingDependencyError extends ContainerError {
    requiredBy;
    missingToken;
    constructor(requiredBy, missingToken) {
        super(`Service "${requiredBy}" requires "${missingToken.toString()}" which is not registered. ` +
            `Ensure the module providing this service is loaded before "${requiredBy}".`);
        this.requiredBy = requiredBy;
        this.missingToken = missingToken;
    }
}
exports.MissingDependencyError = MissingDependencyError;
// ─── Duplicate registration ──────────────────────────────────────────────────
class DuplicateRegistrationError extends ContainerError {
    token;
    existingName;
    constructor(token, existingName) {
        super(`A service is already registered for token "${token.toString()}" ` +
            `(existing: "${existingName}"). ` +
            `Use a unique token for each service, or call tryResolve() if the service may not exist.`);
        this.token = token;
        this.existingName = existingName;
    }
}
exports.DuplicateRegistrationError = DuplicateRegistrationError;
// ─── Frozen container ────────────────────────────────────────────────────────
class FrozenContainerError extends ContainerError {
    constructor(operation) {
        super(`Cannot perform "${operation}": the container has been frozen. ` +
            `Service registrations are locked after StartupManager.boot() completes. ` +
            `Use loadPlugin() to register services through the PluginManager.`);
    }
}
exports.FrozenContainerError = FrozenContainerError;
// ─── Duplicate module ────────────────────────────────────────────────────────
class DuplicateModuleError extends ContainerError {
    moduleName;
    constructor(moduleName) {
        super(`Module "${moduleName}" is already loaded. ` +
            `Each module may only be loaded once per container instance.`);
        this.moduleName = moduleName;
    }
}
exports.DuplicateModuleError = DuplicateModuleError;
// ─── Unregistered service ────────────────────────────────────────────────────
class UnregisteredServiceError extends ContainerError {
    token;
    constructor(token, context) {
        super(`No service is registered for token "${token.toString()}". ` +
            (context ? `Requested by: ${context}. ` : '') +
            `Ensure the module providing this service is loaded and container.validate() passes.`);
        this.token = token;
    }
}
exports.UnregisteredServiceError = UnregisteredServiceError;
// ─── Module dependency error ─────────────────────────────────────────────────
class ModuleDependencyError extends ContainerError {
    moduleName;
    missingDependency;
    constructor(moduleName, missingDependency) {
        super(`Module "${moduleName}" depends on module "${missingDependency}" ` +
            `which has not been loaded yet. Load modules in dependency order.`);
        this.moduleName = moduleName;
        this.missingDependency = missingDependency;
    }
}
exports.ModuleDependencyError = ModuleDependencyError;
// ─── Async init error ────────────────────────────────────────────────────────
class ServiceInitializationError extends ContainerError {
    serviceName;
    cause;
    constructor(serviceName, cause) {
        super(`Failed to initialize service "${serviceName}": ${cause.message}`);
        this.serviceName = serviceName;
        this.cause = cause;
    }
}
exports.ServiceInitializationError = ServiceInitializationError;
//# sourceMappingURL=errors.js.map