/**
 * DesktopContainer — Full Interface Contracts
 *
 * These interfaces are the single source of truth for Epic 5.
 * Every concrete implementation depends only on these types.
 *
 * Electron-independent: no electron imports are allowed in this file
 * or in any file within the container/ directory.
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

export type ServiceLifetime   = 'singleton' | 'transient' | 'scoped';
export type ServiceToken      = symbol;
export type RuntimeEnvironment = 'development' | 'production' | 'test';
export type RuntimePlatform   = 'win32' | 'darwin' | 'linux' | 'all';
export type HealthStatus      = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

// ─── Conditional Registration ─────────────────────────────────────────────────

export interface IRegistrationCondition {
  /** Register only in these environments */
  readonly environment?: RuntimeEnvironment | RuntimeEnvironment[];
  /** Register only on these platforms */
  readonly platform?: RuntimePlatform | RuntimePlatform[];
  /** Arbitrary predicate — evaluated at loadModule() time */
  readonly predicate?: () => boolean;
}

// ─── Service Descriptor ───────────────────────────────────────────────────────

export interface IServiceDescriptor<T = unknown> {
  /** Opaque symbol identifier — enforces interface binding */
  readonly token: ServiceToken;
  /** Human-readable name used in diagnostics, errors, graphs */
  readonly name: string;
  /** Controls how long instances live */
  readonly lifetime: ServiceLifetime;
  /** Tokens of all services this service depends on */
  readonly dependencies: readonly ServiceToken[];
  /** Factory called lazily on first resolve() */
  readonly factory: (resolver: IServiceResolver) => T;
  /** Optional sync or async dispose callback */
  readonly dispose?: (instance: T) => Promise<void> | void;
  /** Optional async initialization — called by initializeAll() in dep order */
  readonly initialize?: (instance: T) => Promise<void>;
  /** Optional health probe — called by container.health() */
  readonly healthCheck?: (instance: T) => Promise<IHealthStatus>;
  /** Conditional registration — if condition fails, service is skipped */
  readonly condition?: IRegistrationCondition;
  /** Arbitrary tags for future filtering/grouping */
  readonly tags?: readonly string[];
}

// ─── Service Resolver ─────────────────────────────────────────────────────────

export interface IServiceResolver {
  resolve<T>(token: ServiceToken): T;
  tryResolve<T>(token: ServiceToken): T | null;
}

// ─── Service Scope ────────────────────────────────────────────────────────────

export interface IServiceScope extends IServiceResolver {
  readonly name: string;
  /** Dispose all instances created within this scope */
  dispose(): Promise<void>;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface IValidationError {
  readonly token: ServiceToken;
  readonly name: string;
  readonly phase: string;
  readonly message: string;
}

export interface IValidationWarning {
  readonly token: ServiceToken;
  readonly name: string;
  readonly phase: string;
  readonly message: string;
}

export interface IValidationResult {
  readonly valid: boolean;
  readonly errors: readonly IValidationError[];
  readonly warnings: readonly IValidationWarning[];
  readonly durationMs: number;
}

// ─── Dependency Graph ────────────────────────────────────────────────────────

export interface IDependencyNode {
  readonly token: ServiceToken;
  readonly name: string;
  readonly lifetime: ServiceLifetime;
  readonly module?: string;
}

export interface IDependencyEdge {
  readonly from: ServiceToken;
  readonly fromName: string;
  readonly to: ServiceToken;
  readonly toName: string;
}

export interface IDependencyGraph {
  readonly nodes: IDependencyNode[];
  readonly edges: IDependencyEdge[];
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export interface IContainerMetrics {
  // Registration
  readonly totalRegistrations: number;
  readonly singletonCount: number;
  readonly transientCount: number;
  readonly scopedCount: number;
  readonly moduleCount: number;
  readonly pluginCount: number;

  // Resolution
  readonly totalResolves: number;
  readonly lazyInitializations: number;
  readonly cacheHits: number;
  readonly failedResolutions: number;

  // Timing
  readonly averageResolveMs: number;
  readonly p95ResolveMs: number;
  readonly slowestResolve: { readonly name: string; readonly durationMs: number } | null;

  // Validation
  readonly lastValidationDurationMs: number;
  readonly lastValidationErrorCount: number;

  // Async init
  readonly asyncInitializationDurationMs: number;

  readonly collectedAt: string;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface IHealthStatus {
  readonly status: HealthStatus;
  readonly message?: string;
  readonly checkedAt: string;
  readonly durationMs: number;
}

export interface IServiceHealth {
  readonly token: ServiceToken;
  readonly name: string;
  readonly lifetime: ServiceLifetime;
  readonly initialized: boolean;
  readonly health: IHealthStatus;
}

export interface IContainerHealth {
  readonly overall: HealthStatus;
  readonly services: readonly IServiceHealth[];
  readonly checkedAt: string;
  readonly durationMs: number;
}

// ─── Container Events ────────────────────────────────────────────────────────

export type ContainerEvent =
  | 'service.registered'
  | 'service.resolved'
  | 'service.initialized'
  | 'service.disposed'
  | 'service.failed'
  | 'module.loaded'
  | 'module.skipped'
  | 'plugin.loaded'
  | 'validation.started'
  | 'validation.completed'
  | 'container.frozen'
  | 'container.disposed';

export interface ContainerEventPayload {
  readonly timestamp: number;
  readonly event: ContainerEvent;
  readonly name?: string;
  readonly token?: ServiceToken;
  readonly durationMs?: number;
  readonly error?: string;
  readonly metadata?: Record<string, unknown>;
}

export type ContainerEventListener = (payload: ContainerEventPayload) => void;

// ─── EventBus (Electron-independent minimal interface) ────────────────────────

export interface IDesktopEventBus {
  emit(topic: string, payload: unknown): void;
  on(topic: string, listener: (payload: unknown) => void): () => void;
}

// ─── Module ───────────────────────────────────────────────────────────────────

export interface IContainerModule {
  /** Unique stable name — used for diagnostics and duplicate detection */
  readonly name: string;
  /** Names of modules that must be loaded before this one */
  readonly dependencies?: readonly string[];
  /** Called once when the module is loaded. All service registrations happen here. */
  register(container: IDesktopContainer): void;
  /** Optional async initialization hook — called by container.initializeAll() */
  initialize?(): Promise<void>;
  /** Optional async cleanup — called by container.shutdownAll() */
  shutdown?(): Promise<void>;
}

export interface IPluginModule extends IContainerModule {
  /** Globally unique plugin identifier */
  readonly pluginId: string;
  /** Semver version string */
  readonly version: string;
}

// ─── Main Container Interface ─────────────────────────────────────────────────

export interface IDesktopContainer {
  // ── Registration ──────────────────────────────────────────────────────────
  registerSingleton<T>(descriptor: IServiceDescriptor<T>): void;
  registerTransient<T>(descriptor: IServiceDescriptor<T>): void;
  registerScoped<T>(descriptor: IServiceDescriptor<T>): void;
  registerFactory<T>(token: ServiceToken, name: string, factory: (r: IServiceResolver) => T): void;

  // ── Module loading ────────────────────────────────────────────────────────
  loadModule(module: IContainerModule): void;
  loadPlugin(plugin: IPluginModule): void;
  isModuleLoaded(name: string): boolean;
  getLoadedModules(): readonly IContainerModule[];

  // ── Resolution ────────────────────────────────────────────────────────────
  resolve<T>(token: ServiceToken): T;
  tryResolve<T>(token: ServiceToken): T | null;

  // ── Scoping ───────────────────────────────────────────────────────────────
  createScope(name: string): IServiceScope;

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  validate(): IValidationResult;
  initializeAll(): Promise<void>;
  shutdownAll(): Promise<void>;
  dispose(): Promise<void>;
  freeze(): void;
  isFrozen(): boolean;

  // ── Diagnostics ───────────────────────────────────────────────────────────
  getDescriptor(token: ServiceToken): IServiceDescriptor | undefined;
  getAll(): readonly IServiceDescriptor[];
  getDependencyGraph(): IDependencyGraph;
  exportDependencyGraph(format: 'json' | 'mermaid' | 'dot'): string;
  getMetrics(): IContainerMetrics;
  health(): Promise<IContainerHealth>;

  // ── Events ────────────────────────────────────────────────────────────────
  on(event: ContainerEvent, listener: ContainerEventListener): () => void;
  setEventBus(bus: IDesktopEventBus): void;
}
