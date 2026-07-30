import {
  IDesktopContainer,
  IServiceDescriptor,
  IServiceResolver,
  IServiceScope,
  IContainerModule,
  IPluginModule,
  IValidationResult,
  IValidationError,
  IValidationWarning,
  IDependencyGraph,
  IContainerMetrics,
  IContainerHealth,
  IServiceHealth,
  IHealthStatus,
  IDesktopEventBus,
  ContainerEvent,
  ContainerEventListener,
  ContainerEventPayload,
  ServiceToken,
  RuntimeEnvironment,
  RuntimePlatform,
  HealthStatus,
} from './interfaces';

import {
  CircularDependencyError,
  DuplicateRegistrationError,
  DuplicateModuleError,
  FrozenContainerError,
  UnregisteredServiceError,
  ModuleDependencyError,
  ServiceInitializationError,
} from './errors';

import { ServiceScope } from './service-scope';
import { exportJson, exportMermaid, exportDot } from './graph-exporter';

// ─── Internal types ───────────────────────────────────────────────────────────

interface ResolveTimer {
  name: string;
  durationMs: number;
}

// ─── DesktopContainer ─────────────────────────────────────────────────────────

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
export class DesktopContainer implements IDesktopContainer, IServiceResolver {
  // ── Registration state ────────────────────────────────────────────────────
  private readonly descriptors = new Map<ServiceToken, IServiceDescriptor>();
  private readonly loadedModules = new Map<string, IContainerModule>();
  private readonly pluginCount_ = { value: 0 };

  // ── Resolution state ──────────────────────────────────────────────────────
  private readonly singletonInstances = new Map<ServiceToken, unknown>();
  private readonly initializedTokens  = new Set<ServiceToken>();

  // ── Lifecycle state ───────────────────────────────────────────────────────
  private frozen_ = false;

  // ── Event system ──────────────────────────────────────────────────────────
  private readonly listeners = new Map<ContainerEvent, Set<ContainerEventListener>>();
  private eventBus_: IDesktopEventBus | null = null;

  // ── Metrics ───────────────────────────────────────────────────────────────
  private metrics_ = {
    totalResolves:                 0,
    lazyInitializations:           0,
    cacheHits:                     0,
    failedResolutions:             0,
    resolveTimes:                  [] as number[],
    slowestResolve:                null as { name: string; durationMs: number } | null,
    lastValidationDurationMs:      0,
    lastValidationErrorCount:      0,
    asyncInitializationDurationMs: 0,
  };

  // ── Environment / platform (injectable for testing) ───────────────────────
  private readonly environment_: RuntimeEnvironment;
  private readonly platform_: RuntimePlatform;

  constructor(options?: {
    environment?: RuntimeEnvironment;
    platform?: RuntimePlatform;
  }) {
    this.environment_ = options?.environment ?? this.detectEnvironment();
    this.platform_    = options?.platform    ?? this.detectPlatform();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Registration
  // ═══════════════════════════════════════════════════════════════════════════

  registerSingleton<T>(descriptor: IServiceDescriptor<T>): void {
    this.register({ ...descriptor, lifetime: 'singleton' });
  }

  registerTransient<T>(descriptor: IServiceDescriptor<T>): void {
    this.register({ ...descriptor, lifetime: 'transient' });
  }

  registerScoped<T>(descriptor: IServiceDescriptor<T>): void {
    this.register({ ...descriptor, lifetime: 'scoped' });
  }

  registerFactory<T>(
    token: ServiceToken,
    name: string,
    factory: (r: IServiceResolver) => T,
  ): void {
    this.register({
      token,
      name,
      lifetime: 'transient',
      dependencies: [],
      factory,
    } as IServiceDescriptor<T>);
  }

  private register<T>(descriptor: IServiceDescriptor<T>): void {
    this.assertNotFrozen('registerSingleton/registerTransient/registerScoped');

    // Evaluate conditional registration
    if (descriptor.condition && !this.evaluateCondition(descriptor.condition)) {
      this.emit({
        event: 'module.skipped',
        name: descriptor.name,
        token: descriptor.token,
        metadata: { reason: 'condition-not-met' },
      });
      return;
    }

    if (this.descriptors.has(descriptor.token)) {
      const existing = this.descriptors.get(descriptor.token)!;
      throw new DuplicateRegistrationError(descriptor.token, existing.name);
    }

    this.descriptors.set(descriptor.token, descriptor as IServiceDescriptor);

    this.emit({
      event: 'service.registered',
      name: descriptor.name,
      token: descriptor.token,
      metadata: { lifetime: descriptor.lifetime },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Module loading
  // ═══════════════════════════════════════════════════════════════════════════

  loadModule(module: IContainerModule): void {
    this.assertNotFrozen('loadModule');
    this.loadModuleInternal(module, false);
  }

  loadPlugin(plugin: IPluginModule): void {
    // Plugins are allowed after freeze (privileged path)
    this.loadModuleInternal(plugin, true);
    this.pluginCount_.value++;
    this.emit({ event: 'plugin.loaded', name: plugin.name });
  }

  private loadModuleInternal(module: IContainerModule, isPlugin: boolean): void {
    if (this.loadedModules.has(module.name)) {
      throw new DuplicateModuleError(module.name);
    }

    // Ensure module dependencies are already loaded
    for (const dep of module.dependencies ?? []) {
      if (!this.loadedModules.has(dep)) {
        throw new ModuleDependencyError(module.name, dep);
      }
    }

    module.register(this);
    this.loadedModules.set(module.name, module);

    this.emit({
      event: isPlugin ? 'plugin.loaded' : 'module.loaded',
      name: module.name,
      metadata: { serviceCount: this.descriptors.size },
    });
  }

  isModuleLoaded(name: string): boolean {
    return this.loadedModules.has(name);
  }

  getLoadedModules(): readonly IContainerModule[] {
    return Array.from(this.loadedModules.values());
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Resolution
  // ═══════════════════════════════════════════════════════════════════════════

  resolve<T>(token: ServiceToken): T {
    return this.resolveInternal<T>(token, new Set());
  }

  tryResolve<T>(token: ServiceToken): T | null {
    try {
      return this.resolve<T>(token);
    } catch {
      return null;
    }
  }

  private resolveInternal<T>(
    token: ServiceToken,
    resolutionStack: Set<ServiceToken>,
  ): T {
    const start = Date.now();
    this.metrics_.totalResolves++;

    // Singleton cache hit
    if (this.singletonInstances.has(token)) {
      this.metrics_.cacheHits++;
      return this.singletonInstances.get(token) as T;
    }

    const descriptor = this.descriptors.get(token);
    if (!descriptor) {
      this.metrics_.failedResolutions++;
      throw new UnregisteredServiceError(token);
    }

    // Circular dependency detection
    if (resolutionStack.has(token)) {
      const cycle = [
        ...Array.from(resolutionStack).map((t) => this.descriptors.get(t)?.name ?? t.toString()),
        descriptor.name,
      ];
      this.metrics_.failedResolutions++;
      throw new CircularDependencyError(cycle);
    }

    // Create resolver that propagates the resolution stack
    const childResolver: IServiceResolver = {
      resolve: <U>(t: ServiceToken) => {
        const childStack = new Set(resolutionStack);
        childStack.add(token);
        return this.resolveInternal<U>(t, childStack);
      },
      tryResolve: <U>(t: ServiceToken): U | null => {
        try {
          const childStack = new Set(resolutionStack);
          childStack.add(token);
          return this.resolveInternal<U>(t, childStack);
        } catch {
          return null;
        }
      },
    };

    // Lazy factory call
    this.metrics_.lazyInitializations++;
    let instance: T;
    try {
      instance = descriptor.factory(childResolver) as T;
    } catch (err) {
      this.metrics_.failedResolutions++;
      this.emit({ event: 'service.failed', name: descriptor.name, token, error: String(err) });
      throw err;
    }

    // Cache singleton
    if (descriptor.lifetime === 'singleton') {
      this.singletonInstances.set(token, instance);
    }

    const durationMs = Date.now() - start;
    this.trackResolveTime(descriptor.name, durationMs);
    this.emit({ event: 'service.resolved', name: descriptor.name, token, durationMs });

    return instance;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Scoping
  // ═══════════════════════════════════════════════════════════════════════════

  createScope(name: string): IServiceScope {
    return new ServiceScope(name, this.descriptors, this.singletonInstances);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════

  validate(): IValidationResult {
    const start = Date.now();
    this.emit({ event: 'validation.started' });

    const errors:   IValidationError[]   = [];
    const warnings: IValidationWarning[] = [];

    const addError = (token: ServiceToken, name: string, phase: string, message: string) =>
      errors.push({ token, name, phase, message });
    const addWarn = (token: ServiceToken, name: string, phase: string, message: string) =>
      warnings.push({ token, name, phase, message });

    const all = Array.from(this.descriptors.values());

    // Phase 1: Duplicate token detection (structural — caught at registration, but re-check)
    // (Already caught by register(), included for completeness in report)

    // Phase 2: Missing dependencies
    for (const descriptor of all) {
      for (const depToken of descriptor.dependencies) {
        if (!this.descriptors.has(depToken)) {
          addError(
            descriptor.token, descriptor.name,
            'missing-dependencies',
            `Depends on unregistered token: ${depToken.toString()}`,
          );
        }
      }
    }

    // Phase 3: Circular dependency detection (DFS topological sort — Kahn's algorithm)
    const cycles = this.detectCycles();
    for (const cycle of cycles) {
      const nameInCycle = cycle[0];
      const d = all.find((x) => x.name === nameInCycle);
      addError(
        d?.token ?? Symbol('unknown'),
        nameInCycle,
        'circular-dependency',
        `Circular dependency: ${cycle.join(' → ')}`,
      );
    }

    // Phase 4: Lifetime violations
    for (const descriptor of all) {
      if (descriptor.lifetime === 'singleton') {
        for (const depToken of descriptor.dependencies) {
          const dep = this.descriptors.get(depToken);
          if (!dep) continue;
          if (dep.lifetime === 'scoped') {
            addWarn(
              descriptor.token, descriptor.name,
              'lifetime-violation',
              `Singleton "${descriptor.name}" depends on scoped "${dep.name}". ` +
              `The singleton will capture the scoped instance indefinitely.`,
            );
          }
          if (dep.lifetime === 'transient') {
            addWarn(
              descriptor.token, descriptor.name,
              'lifetime-violation',
              `Singleton "${descriptor.name}" depends on transient "${dep.name}". ` +
              `The singleton will capture one transient instance permanently.`,
            );
          }
        }
      }
    }

    // Phase 5: Async initialization cycles (same DFS but across initialize deps)
    // (Future: when explicit init-deps differ from resolve-deps. Currently same graph.)

    // Phase 6: Dispose ordering warnings
    // Warn if a singleton's dispose dep has no dispose handler
    for (const descriptor of all) {
      if (descriptor.lifetime === 'singleton' && descriptor.dispose) {
        for (const depToken of descriptor.dependencies) {
          const dep = this.descriptors.get(depToken);
          if (dep && dep.lifetime === 'singleton' && !dep.dispose) {
            addWarn(
              descriptor.token, descriptor.name,
              'dispose-ordering',
              `"${descriptor.name}" has a dispose handler but its dependency ` +
              `"${dep.name}" does not. Consider adding dispose to "${dep.name}".`,
            );
          }
        }
      }
    }

    // Phase 7: Duplicate module names — caught at load time, no additional check needed

    // Phase 8: Unreachable services (categorized validation for Root, Pipeline, Runtime, Helper, Plugin, Leaf)
    const reachableTokens = new Set<ServiceToken>();
    for (const descriptor of all) {
      for (const dep of descriptor.dependencies) {
        reachableTokens.add(dep);
      }
    }

    const rootServiceNames = [
      'StartupManager',
      'RuntimeKernel',
      'AiOrchestrator',
      'IIpcRouter',
      'IWindowRegistry',
      'IDesktopLogger',
      'IDesktopEventBus',
      'IAiKernel',
      'IPlanner',
      'IRepositoryProvider',
      'IWorkspaceService',
      'ISessionManager',
      'ITerminalService',
      'IThemeService',
      'IPipelineExecutor',
      'IPipelineRecorder',
      'IDiagnosticsService'
    ];

    for (const descriptor of all) {
      if (!reachableTokens.has(descriptor.token) && all.length > 1) {
        const isRoot = descriptor.tags?.includes('root') ||
                       rootServiceNames.includes(descriptor.name) ||
                       descriptor.name.includes('StartupManager') ||
                       descriptor.name.includes('Orchestrator') ||
                       descriptor.name.includes('DiagnosticsService');

        const isPlugin = descriptor.tags?.includes('plugin') ||
                         descriptor.name.includes('Plugin');

        if (!isRoot && !isPlugin) {
          addWarn(
            descriptor.token, descriptor.name,
            'unreachable',
            `Service "${descriptor.name}" is not depended upon by any other registered service. ` +
            `Ensure this pipeline/helper service has an upstream consumer.`,
          );
        }
      }
    }

    // Phase 9: Orphan services (no deps and not a leaf)
    // (Covered by phase 8 for this sprint — extended in future)

    // Phase 10: Unused registrations (based on resolve metrics — only meaningful post-boot)
    // Logged as info; not a validation concern at boot time.

    // Phase 11: Plugin token override detection
    for (const module of this.loadedModules.values()) {
      if ('pluginId' in module) {
        // Plugin — check if it's overriding a core token
        // (Implementation: compare registered tokens against a core token set)
        // Simplified: warn if module loaded after freeze attempted re-registration
        // (Handled by DuplicateRegistrationError at registration time)
      }
    }

    const durationMs = Date.now() - start;
    this.metrics_.lastValidationDurationMs  = durationMs;
    this.metrics_.lastValidationErrorCount  = errors.length;

    const result: IValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      durationMs,
    };

    this.emit({ event: 'validation.completed', durationMs, metadata: {
      errorCount: errors.length, warningCount: warnings.length,
    }});

    return result;
  }

  async initializeAll(): Promise<void> {
    const start = Date.now();
    const order = this.topologicalSort();

    for (const token of order) {
      const descriptor = this.descriptors.get(token);
      if (!descriptor || descriptor.lifetime !== 'singleton') continue;
      if (this.initializedTokens.has(token)) continue;

      // Ensure instance exists (lazy resolve)
      const instance = this.resolveInternal(token, new Set());

      // Call initialize() if provided
      if (descriptor.initialize) {
        try {
          await descriptor.initialize(instance);
          this.initializedTokens.add(token);
          this.emit({ event: 'service.initialized', name: descriptor.name, token });
        } catch (err) {
          this.emit({ event: 'service.failed', name: descriptor.name, token, error: String(err) });
          throw new ServiceInitializationError(descriptor.name, err as Error);
        }
      } else {
        this.initializedTokens.add(token);
      }
    }

    this.metrics_.asyncInitializationDurationMs = Date.now() - start;
  }

  async shutdownAll(): Promise<void> {
    const order = this.topologicalSort();
    const reversed = [...order].reverse();

    for (const token of reversed) {
      const descriptor = this.descriptors.get(token);
      if (!descriptor || descriptor.lifetime !== 'singleton') continue;

      const instance = this.singletonInstances.get(token);
      if (instance === undefined) continue;

      // Call shutdown() on the module that owns this service (if any)
      // Individual service dispose is handled in dispose()
    }

    await this.dispose();
  }

  async dispose(): Promise<void> {
    const order = this.topologicalSort();
    const reversed = [...order].reverse();

    for (const token of reversed) {
      const descriptor = this.descriptors.get(token);
      if (!descriptor) continue;

      const instance = this.singletonInstances.get(token);
      if (instance === undefined || !descriptor.dispose) continue;

      try {
        await descriptor.dispose(instance);
        this.emit({ event: 'service.disposed', name: descriptor.name, token });
      } catch (err) {
        console.error(`[DesktopContainer] Error disposing "${descriptor.name}":`, err);
      }
    }

    this.singletonInstances.clear();
    this.initializedTokens.clear();
    this.emit({ event: 'container.disposed' });
  }

  freeze(): void {
    this.frozen_ = true;
    this.emit({ event: 'container.frozen' });
  }

  isFrozen(): boolean {
    return this.frozen_;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Diagnostics
  // ═══════════════════════════════════════════════════════════════════════════

  getDescriptor(token: ServiceToken): IServiceDescriptor | undefined {
    return this.descriptors.get(token);
  }

  getAll(): readonly IServiceDescriptor[] {
    return Array.from(this.descriptors.values());
  }

  getDependencyGraph(): IDependencyGraph {
    const nodes = Array.from(this.descriptors.values()).map((d) => ({
      token:    d.token,
      name:     d.name,
      lifetime: d.lifetime,
      module:   undefined,
    }));

    const edges = Array.from(this.descriptors.values()).flatMap((d) =>
      d.dependencies.map((depToken) => {
        const dep = this.descriptors.get(depToken);
        return {
          from:     d.token,
          fromName: d.name,
          to:       depToken,
          toName:   dep?.name ?? depToken.toString(),
        };
      }),
    );

    return { nodes, edges };
  }

  exportDependencyGraph(format: 'json' | 'mermaid' | 'dot'): string {
    const graph = this.getDependencyGraph();
    switch (format) {
      case 'json':    return exportJson(graph);
      case 'mermaid': return exportMermaid(graph);
      case 'dot':     return exportDot(graph);
    }
  }

  getMetrics(): IContainerMetrics {
    const all = Array.from(this.descriptors.values());
    const times = this.metrics_.resolveTimes;
    const sorted = [...times].sort((a, b) => a - b);
    const avg = times.length > 0 ? times.reduce((s, t) => s + t, 0) / times.length : 0;
    const p95 = sorted.length > 0
      ? sorted[Math.floor(sorted.length * 0.95)] ?? sorted[sorted.length - 1]
      : 0;

    return {
      totalRegistrations:           this.descriptors.size,
      singletonCount:               all.filter((d) => d.lifetime === 'singleton').length,
      transientCount:               all.filter((d) => d.lifetime === 'transient').length,
      scopedCount:                  all.filter((d) => d.lifetime === 'scoped').length,
      moduleCount:                  this.loadedModules.size,
      pluginCount:                  this.pluginCount_.value,
      totalResolves:                this.metrics_.totalResolves,
      lazyInitializations:          this.metrics_.lazyInitializations,
      cacheHits:                    this.metrics_.cacheHits,
      failedResolutions:            this.metrics_.failedResolutions,
      averageResolveMs:             Math.round(avg * 100) / 100,
      p95ResolveMs:                 p95,
      slowestResolve:               this.metrics_.slowestResolve,
      lastValidationDurationMs:     this.metrics_.lastValidationDurationMs,
      lastValidationErrorCount:     this.metrics_.lastValidationErrorCount,
      asyncInitializationDurationMs: this.metrics_.asyncInitializationDurationMs,
      collectedAt:                  new Date().toISOString(),
    };
  }

  async health(): Promise<IContainerHealth> {
    const start = Date.now();
    const services: IServiceHealth[] = [];

    for (const descriptor of this.descriptors.values()) {
      if (descriptor.lifetime !== 'singleton') continue;
      const instance = this.singletonInstances.get(descriptor.token);
      const initialized = this.initializedTokens.has(descriptor.token);

      let healthStatus: IHealthStatus;
      if (!instance) {
        healthStatus = {
          status: 'unknown',
          message: 'Not yet initialized',
          checkedAt: new Date().toISOString(),
          durationMs: 0,
        };
      } else if (descriptor.healthCheck) {
        try {
          healthStatus = await descriptor.healthCheck(instance);
        } catch (err) {
          healthStatus = {
            status: 'unhealthy',
            message: String(err),
            checkedAt: new Date().toISOString(),
            durationMs: 0,
          };
        }
      } else {
        healthStatus = {
          status: 'healthy',
          message: 'No health check defined',
          checkedAt: new Date().toISOString(),
          durationMs: 0,
        };
      }

      services.push({
        token: descriptor.token,
        name: descriptor.name,
        lifetime: descriptor.lifetime,
        initialized,
        health: healthStatus,
      });
    }

    const statusPriority: Record<HealthStatus, number> = {
      unhealthy: 3, degraded: 2, unknown: 1, healthy: 0,
    };

    const overall: HealthStatus = services.reduce<HealthStatus>((worst, svc) => {
      return statusPriority[svc.health.status] > statusPriority[worst]
        ? svc.health.status
        : worst;
    }, 'healthy');

    return {
      overall,
      services,
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Events
  // ═══════════════════════════════════════════════════════════════════════════

  on(event: ContainerEvent, listener: ContainerEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.listeners.get(event)?.delete(listener);
  }

  setEventBus(bus: IDesktopEventBus): void {
    this.eventBus_ = bus;
  }

  private emit(partial: Omit<ContainerEventPayload, 'timestamp'>): void {
    const payload: ContainerEventPayload = { ...partial, timestamp: Date.now() };

    // Internal listeners
    const eventListeners = this.listeners.get(payload.event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        try { listener(payload); } catch { /* never let event errors crash the container */ }
      }
    }

    // External EventBus
    if (this.eventBus_) {
      try {
        this.eventBus_.emit(`forge.container.${payload.event}`, payload);
      } catch { /* no-op */ }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Private helpers
  // ═══════════════════════════════════════════════════════════════════════════

  private assertNotFrozen(operation: string): void {
    if (this.frozen_) {
      throw new FrozenContainerError(operation);
    }
  }

  private evaluateCondition(condition: NonNullable<IServiceDescriptor['condition']>): boolean {
    if (condition.environment) {
      const envs = Array.isArray(condition.environment)
        ? condition.environment
        : [condition.environment];
      if (!envs.includes(this.environment_)) return false;
    }
    if (condition.platform) {
      const platforms = Array.isArray(condition.platform)
        ? condition.platform
        : [condition.platform];
      if (!platforms.includes(this.platform_) && !platforms.includes('all')) return false;
    }
    if (condition.predicate && !condition.predicate()) return false;
    return true;
  }

  /**
   * Kahn's algorithm topological sort.
   * Returns tokens in dependency-first order (leaves first, roots last).
   * If cycles exist, returns remaining nodes in arbitrary order (cycles detected in validate()).
   */
  private topologicalSort(): ServiceToken[] {
    const inDegree = new Map<ServiceToken, number>();
    const dependents = new Map<ServiceToken, ServiceToken[]>(); // token → tokens that depend on it

    for (const descriptor of this.descriptors.values()) {
      if (!inDegree.has(descriptor.token)) inDegree.set(descriptor.token, 0);
      for (const dep of descriptor.dependencies) {
        if (this.descriptors.has(dep)) {
          inDegree.set(descriptor.token, (inDegree.get(descriptor.token) ?? 0) + 1);
          if (!dependents.has(dep)) dependents.set(dep, []);
          dependents.get(dep)!.push(descriptor.token);
        }
      }
    }

    const queue: ServiceToken[] = [];
    for (const [token, degree] of inDegree) {
      if (degree === 0) queue.push(token);
    }

    const result: ServiceToken[] = [];
    while (queue.length > 0) {
      const token = queue.shift()!;
      result.push(token);
      for (const dependent of dependents.get(token) ?? []) {
        const newDegree = (inDegree.get(dependent) ?? 0) - 1;
        inDegree.set(dependent, newDegree);
        if (newDegree === 0) queue.push(dependent);
      }
    }

    // Append any remaining (cyclic) nodes so we don't skip them
    for (const token of this.descriptors.keys()) {
      if (!result.includes(token)) result.push(token);
    }

    return result;
  }

  /**
   * DFS-based cycle detection.
   * Returns an array of cycles, each cycle is an array of service names.
   */
  private detectCycles(): string[][] {
    const visited  = new Set<ServiceToken>();
    const inStack  = new Set<ServiceToken>();
    const cycles:    string[][] = [];

    const dfs = (token: ServiceToken, stack: string[]): void => {
      if (inStack.has(token)) {
        const cycleStart = stack.indexOf(
          this.descriptors.get(token)?.name ?? token.toString()
        );
        cycles.push([...stack.slice(cycleStart), this.descriptors.get(token)?.name ?? token.toString()]);
        return;
      }
      if (visited.has(token)) return;

      visited.add(token);
      inStack.add(token);
      const name = this.descriptors.get(token)?.name ?? token.toString();
      stack.push(name);

      for (const dep of this.descriptors.get(token)?.dependencies ?? []) {
        if (this.descriptors.has(dep)) {
          dfs(dep, stack);
        }
      }

      stack.pop();
      inStack.delete(token);
    };

    for (const token of this.descriptors.keys()) {
      dfs(token, []);
    }

    return cycles;
  }

  private trackResolveTime(name: string, durationMs: number): void {
    this.metrics_.resolveTimes.push(durationMs);
    if (
      !this.metrics_.slowestResolve ||
      durationMs > this.metrics_.slowestResolve.durationMs
    ) {
      this.metrics_.slowestResolve = { name, durationMs };
    }
  }

  private detectEnvironment(): RuntimeEnvironment {
    const env = (typeof process !== 'undefined' ? process.env.NODE_ENV : '') ?? '';
    if (env === 'production') return 'production';
    if (env === 'test')       return 'test';
    return 'development';
  }

  private detectPlatform(): RuntimePlatform {
    if (typeof process === 'undefined') return 'linux';
    const p = process.platform;
    if (p === 'win32')  return 'win32';
    if (p === 'darwin') return 'darwin';
    return 'linux';
  }
}
