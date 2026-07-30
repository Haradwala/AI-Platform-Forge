import { IDesktopContainer, IServiceDescriptor, IServiceResolver, IServiceScope, IContainerModule, IPluginModule, IValidationResult, IDependencyGraph, IContainerMetrics, IContainerHealth, IDesktopEventBus, ContainerEvent, ContainerEventListener, ServiceToken, RuntimeEnvironment, RuntimePlatform } from './interfaces';
/**
 * DesktopContainer — production-grade dependency injection container
 * for the Forge Desktop main process.
 *
 * Features:
 * - Singleton / Transient / Scoped lifetimes
 * - Lazy initialization (factory stored, not called on registration)
 * - Container module system (IContainerModule)
 * - Conditional registration (environment, platform, predicate)
 * - Circular dependency detection (at resolution AND validation time)
 * - Startup validation (11 phases)
 * - Async initialization in topological order
 * - Async shutdown in reverse topological order
 * - Immutable registrations after freeze()
 * - Container events (internal + optional EventBus)
 * - Resolution metrics
 * - Health checks
 * - Dependency graph export (JSON, Mermaid, DOT)
 *
 * Electron-independent: no electron imports.
 */
export declare class DesktopContainer implements IDesktopContainer, IServiceResolver {
    private readonly descriptors;
    private readonly loadedModules;
    private readonly pluginCount_;
    private readonly singletonInstances;
    private readonly initializedTokens;
    private frozen_;
    private readonly listeners;
    private eventBus_;
    private metrics_;
    private readonly environment_;
    private readonly platform_;
    constructor(options?: {
        environment?: RuntimeEnvironment;
        platform?: RuntimePlatform;
    });
    registerSingleton<T>(descriptor: IServiceDescriptor<T>): void;
    registerTransient<T>(descriptor: IServiceDescriptor<T>): void;
    registerScoped<T>(descriptor: IServiceDescriptor<T>): void;
    registerFactory<T>(token: ServiceToken, name: string, factory: (r: IServiceResolver) => T): void;
    private register;
    loadModule(module: IContainerModule): void;
    loadPlugin(plugin: IPluginModule): void;
    private loadModuleInternal;
    isModuleLoaded(name: string): boolean;
    getLoadedModules(): readonly IContainerModule[];
    resolve<T>(token: ServiceToken): T;
    tryResolve<T>(token: ServiceToken): T | null;
    private resolveInternal;
    createScope(name: string): IServiceScope;
    validate(): IValidationResult;
    initializeAll(): Promise<void>;
    shutdownAll(): Promise<void>;
    dispose(): Promise<void>;
    freeze(): void;
    isFrozen(): boolean;
    getDescriptor(token: ServiceToken): IServiceDescriptor | undefined;
    getAll(): readonly IServiceDescriptor[];
    getDependencyGraph(): IDependencyGraph;
    exportDependencyGraph(format: 'json' | 'mermaid' | 'dot'): string;
    getMetrics(): IContainerMetrics;
    health(): Promise<IContainerHealth>;
    on(event: ContainerEvent, listener: ContainerEventListener): () => void;
    setEventBus(bus: IDesktopEventBus): void;
    private emit;
    private assertNotFrozen;
    private evaluateCondition;
    /**
     * Kahn's algorithm topological sort.
     * Returns tokens in dependency-first order (leaves first, roots last).
     * If cycles exist, returns remaining nodes in arbitrary order (cycles detected in validate()).
     */
    private topologicalSort;
    /**
     * DFS-based cycle detection.
     * Returns an array of cycles, each cycle is an array of service names.
     */
    private detectCycles;
    private trackResolveTime;
    private detectEnvironment;
    private detectPlatform;
}
