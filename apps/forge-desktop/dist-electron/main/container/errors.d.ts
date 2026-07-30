import type { ServiceToken } from './interfaces';
export declare class ContainerError extends Error {
    constructor(message: string);
}
export declare class CircularDependencyError extends ContainerError {
    readonly cycle: readonly string[];
    constructor(cycle: string[]);
}
export declare class MissingDependencyError extends ContainerError {
    readonly requiredBy: string;
    readonly missingToken: ServiceToken;
    constructor(requiredBy: string, missingToken: ServiceToken);
}
export declare class DuplicateRegistrationError extends ContainerError {
    readonly token: ServiceToken;
    readonly existingName: string;
    constructor(token: ServiceToken, existingName: string);
}
export declare class FrozenContainerError extends ContainerError {
    constructor(operation: string);
}
export declare class DuplicateModuleError extends ContainerError {
    readonly moduleName: string;
    constructor(moduleName: string);
}
export declare class UnregisteredServiceError extends ContainerError {
    readonly token: ServiceToken;
    constructor(token: ServiceToken, context?: string);
}
export declare class ModuleDependencyError extends ContainerError {
    readonly moduleName: string;
    readonly missingDependency: string;
    constructor(moduleName: string, missingDependency: string);
}
export declare class ServiceInitializationError extends ContainerError {
    readonly serviceName: string;
    readonly cause: Error;
    constructor(serviceName: string, cause: Error);
}
