import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('electron', () => {
  return {
    app: {
      isPackaged: true,
      getPath: () => '/mock/path',
      whenReady: () => Promise.resolve(),
    },
    BrowserWindow: class {},
    shell: {
      openExternal: vi.fn(),
    },
  };
});

import { DesktopContainer } from '../electron/main/container/desktop-container';
import { T } from '../electron/main/container/tokens';
import type { IDesktopContainer, IContainerModule, IPluginModule, ServiceToken } from '../electron/main/container/interfaces';
import {
  CircularDependencyError,
  DuplicateRegistrationError,
  FrozenContainerError,
  DuplicateModuleError,
  UnregisteredServiceError,
  ModuleDependencyError,
} from '../electron/main/container/errors';
import { CoreModule } from '../electron/main/modules/core.module';
import { WorkspaceModule } from '../electron/main/modules/workspace.module';
import { WindowModule } from '../electron/main/modules/window.module';
import { ThemeModule } from '../electron/main/modules/theme.module';
import { TerminalModule } from '../electron/main/modules/terminal.module';
import { SessionModule } from '../electron/main/modules/session.module';
// IpcModule, PerformanceModule, StartupModule import the real IpcRouter (Electron-dependent).
// Their container integration is tested in ipc-router.test.ts and the E2E boot test in Epic 6.
// Here we register stub equivalents so the container tests remain Electron-free.


// ─── Test token factory ────────────────────────────────────────────────────────

const tok = (name: string): ServiceToken => Symbol(name);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeContainer(options?: { environment?: 'development' | 'production' | 'test' }) {
  return new DesktopContainer(options);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SINGLETON LIFETIME
// ═══════════════════════════════════════════════════════════════════════════════

describe('1. Singleton lifetime', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('returns the same instance on every resolve', () => {
    const token = tok('ISingleton');
    container.registerSingleton({ token, name: 'ISingleton', lifetime: 'singleton', dependencies: [], factory: () => ({ id: Math.random() }) });
    const a = container.resolve(token);
    const b = container.resolve(token);
    expect(a).toBe(b);
  });

  it('calls factory exactly once', () => {
    const factory = vi.fn().mockReturnValue({ value: 1 });
    const token = tok('IOnce');
    container.registerSingleton({ token, name: 'IOnce', lifetime: 'singleton', dependencies: [], factory });
    container.resolve(token);
    container.resolve(token);
    container.resolve(token);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('increments singleton count in metrics', () => {
    const token = tok('ISingM');
    container.registerSingleton({ token, name: 'ISingM', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    expect(container.getMetrics().singletonCount).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TRANSIENT LIFETIME
// ═══════════════════════════════════════════════════════════════════════════════

describe('2. Transient lifetime', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('returns a new instance on every resolve', () => {
    const token = tok('ITransient');
    container.registerTransient({ token, name: 'ITransient', lifetime: 'transient', dependencies: [], factory: () => ({ id: Math.random() }) });
    const a = container.resolve(token);
    const b = container.resolve(token);
    expect(a).not.toBe(b);
  });

  it('calls factory on every resolve', () => {
    const factory = vi.fn().mockImplementation(() => ({ v: Math.random() }));
    const token = tok('ITrans2');
    container.registerTransient({ token, name: 'ITrans2', lifetime: 'transient', dependencies: [], factory });
    container.resolve(token);
    container.resolve(token);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('increments transient count in metrics', () => {
    const token = tok('ITransM');
    container.registerTransient({ token, name: 'ITransM', lifetime: 'transient', dependencies: [], factory: () => ({}) });
    expect(container.getMetrics().transientCount).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SCOPED LIFETIME
// ═══════════════════════════════════════════════════════════════════════════════

describe('3. Scoped lifetime', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('returns the same instance within a scope', () => {
    const token = tok('IScoped');
    container.registerScoped({ token, name: 'IScoped', lifetime: 'scoped', dependencies: [], factory: () => ({ id: Math.random() }) });
    const scope = container.createScope('test-scope');
    const a = scope.resolve(token);
    const b = scope.resolve(token);
    expect(a).toBe(b);
  });

  it('returns different instances across scopes', () => {
    const token = tok('IScoped2');
    container.registerScoped({ token, name: 'IScoped2', lifetime: 'scoped', dependencies: [], factory: () => ({ id: Math.random() }) });
    const scope1 = container.createScope('scope-1');
    const scope2 = container.createScope('scope-2');
    const a = scope1.resolve(token);
    const b = scope2.resolve(token);
    expect(a).not.toBe(b);
  });

  it('calls dispose on scope instances when scope is disposed', async () => {
    const disposeFn = vi.fn();
    const token = tok('IScoped3');
    container.registerScoped({ token, name: 'IScoped3', lifetime: 'scoped', dependencies: [], factory: () => ({}), dispose: disposeFn });
    const scope = container.createScope('dispose-scope');
    scope.resolve(token);
    await scope.dispose();
    expect(disposeFn).toHaveBeenCalledOnce();
  });

  it('throws after scope is disposed', async () => {
    const token = tok('IScoped4');
    container.registerScoped({ token, name: 'IScoped4', lifetime: 'scoped', dependencies: [], factory: () => ({}) });
    const scope = container.createScope('dead-scope');
    await scope.dispose();
    expect(() => scope.resolve(token)).toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. LAZY INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('4. Lazy initialization', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('does NOT call factory at registration time', () => {
    const factory = vi.fn().mockReturnValue({});
    const token = tok('ILazy');
    container.registerSingleton({ token, name: 'ILazy', lifetime: 'singleton', dependencies: [], factory });
    expect(factory).not.toHaveBeenCalled();
  });

  it('calls factory on first resolve only', () => {
    const factory = vi.fn().mockReturnValue({});
    const token = tok('ILazy2');
    container.registerSingleton({ token, name: 'ILazy2', lifetime: 'singleton', dependencies: [], factory });
    container.resolve(token);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('tracks lazy initialization count in metrics', () => {
    const token = tok('ILazy3');
    container.registerSingleton({ token, name: 'ILazy3', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    expect(container.getMetrics().lazyInitializations).toBe(0);
    container.resolve(token);
    expect(container.getMetrics().lazyInitializations).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. FACTORY REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('5. Factory registration', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('registerFactory() creates a new instance each call (transient)', () => {
    const token = tok('IFact');
    container.registerFactory(token, 'IFact', () => ({ v: Math.random() }));
    const a = container.resolve(token);
    const b = container.resolve(token);
    expect(a).not.toBe(b);
  });

  it('factory receives resolver for dependency resolution', () => {
    const depToken = tok('IDep');
    const mainToken = tok('IMain');
    container.registerSingleton({ token: depToken, name: 'IDep', lifetime: 'singleton', dependencies: [], factory: () => ({ dep: true }) });
    container.registerFactory(mainToken, 'IMain', (r) => ({ dep: r.resolve(depToken) }));
    const instance = container.resolve<{ dep: { dep: boolean } }>(mainToken);
    expect(instance.dep.dep).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MODULE LOADING
// ═══════════════════════════════════════════════════════════════════════════════

describe('6. Module loading', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('loadModule() triggers register() and makes services available', () => {
    container.loadModule(new CoreModule());
    expect(container.tryResolve(T.IDesktopLogger)).not.toBeNull();
  });

  it('isModuleLoaded() returns true after loading', () => {
    container.loadModule(new CoreModule());
    expect(container.isModuleLoaded('CoreModule')).toBe(true);
  });

  it('getLoadedModules() lists all loaded modules', () => {
    container.loadModule(new CoreModule());
    container.loadModule(new WindowModule());
    container.loadModule(new WorkspaceModule());
    const names = container.getLoadedModules().map((m) => m.name);
    expect(names).toContain('CoreModule');
    expect(names).toContain('WindowModule');
    expect(names).toContain('WorkspaceModule');
  });

  it('throws DuplicateModuleError when loading the same module twice', () => {
    container.loadModule(new CoreModule());
    expect(() => container.loadModule(new CoreModule())).toThrow(DuplicateModuleError);
  });

  it('throws ModuleDependencyError when module deps are missing', () => {
    // IpcModule depends on CoreModule which is not loaded yet
    // Use WorkspaceModule which depends on CoreModule (not loaded yet)
    expect(() => container.loadModule(new WorkspaceModule())).toThrow(ModuleDependencyError);

  });

  it('emits module.loaded event on successful load', () => {
    const listener = vi.fn();
    container.on('module.loaded', listener);
    container.loadModule(new CoreModule());
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ event: 'module.loaded', name: 'CoreModule' }));
  });

  it('loads all Electron-free modules in correct dependency order', () => {
    container.loadModule(new CoreModule());
    container.loadModule(new WindowModule());
    container.loadModule(new WorkspaceModule());
    container.loadModule(new ThemeModule());
    container.loadModule(new TerminalModule());
    // SessionModule depends on WorkspaceModule which is loaded above
    container.loadModule(new SessionModule());
    expect(container.getLoadedModules()).toHaveLength(6);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. CONDITIONAL REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('7. Conditional registration', () => {
  it('registers service when environment matches', () => {
    const container = makeContainer({ environment: 'development' });
    const token = tok('IDevOnly');
    container.registerSingleton({ token, name: 'IDevOnly', lifetime: 'singleton', dependencies: [], factory: () => ({ dev: true }), condition: { environment: 'development' } });
    expect(container.tryResolve(token)).not.toBeNull();
  });

  it('skips service when environment does not match', () => {
    const container = makeContainer({ environment: 'production' });
    const token = tok('IDevOnly2');
    container.registerSingleton({ token, name: 'IDevOnly2', lifetime: 'singleton', dependencies: [], factory: () => ({ dev: true }), condition: { environment: 'development' } });
    expect(container.tryResolve(token)).toBeNull();
  });

  it('registers service when predicate returns true', () => {
    const container = makeContainer();
    const token = tok('IPred');
    container.registerSingleton({ token, name: 'IPred', lifetime: 'singleton', dependencies: [], factory: () => ({}), condition: { predicate: () => true } });
    expect(container.tryResolve(token)).not.toBeNull();
  });

  it('skips service when predicate returns false', () => {
    const container = makeContainer();
    const token = tok('IPred2');
    container.registerSingleton({ token, name: 'IPred2', lifetime: 'singleton', dependencies: [], factory: () => ({}), condition: { predicate: () => false } });
    expect(container.tryResolve(token)).toBeNull();
  });

  it('emits module.skipped event when condition fails', () => {
    const container = makeContainer({ environment: 'production' });
    const listener = vi.fn();
    container.on('module.skipped', listener);
    const token = tok('ISkipped');
    container.registerSingleton({ token, name: 'ISkipped', lifetime: 'singleton', dependencies: [], factory: () => ({}), condition: { environment: 'development' } });
    expect(listener).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. MISSING DEPENDENCY + CIRCULAR DEPENDENCY
// ═══════════════════════════════════════════════════════════════════════════════

describe('8. Missing & circular dependency detection', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('validate() reports error for missing dependency', () => {
    const missing = tok('IMissing');
    const dependant = tok('IDependant');
    container.registerSingleton({ token: dependant, name: 'IDependant', lifetime: 'singleton', dependencies: [missing], factory: () => ({}) });
    const result = container.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.phase === 'missing-dependencies')).toBe(true);
  });

  it('throws CircularDependencyError at resolve time for A → B → A', () => {
    const tA = tok('A');
    const tB = tok('B');
    container.registerSingleton({ token: tA, name: 'A', lifetime: 'singleton', dependencies: [tB], factory: (r) => ({ b: r.resolve(tB) }) });
    container.registerSingleton({ token: tB, name: 'B', lifetime: 'singleton', dependencies: [tA], factory: (r) => ({ a: r.resolve(tA) }) });
    expect(() => container.resolve(tA)).toThrow(CircularDependencyError);
  });

  it('circular error message contains the full chain', () => {
    const tA = tok('CA');
    const tB = tok('CB');
    container.registerSingleton({ token: tA, name: 'CA', lifetime: 'singleton', dependencies: [tB], factory: (r) => ({ b: r.resolve(tB) }) });
    container.registerSingleton({ token: tB, name: 'CB', lifetime: 'singleton', dependencies: [tA], factory: (r) => ({ a: r.resolve(tA) }) });
    try { container.resolve(tA); } catch (e) {
      expect((e as CircularDependencyError).message).toContain('→');
      expect((e as CircularDependencyError).cycle.length).toBeGreaterThan(1);
    }
  });

  it('validate() detects circular dep in the graph', () => {
    const tA = tok('DA');
    const tB = tok('DB');
    container.registerSingleton({ token: tA, name: 'DA', lifetime: 'singleton', dependencies: [tB], factory: () => ({}) });
    container.registerSingleton({ token: tB, name: 'DB', lifetime: 'singleton', dependencies: [tA], factory: () => ({}) });
    const result = container.validate();
    expect(result.errors.some((e) => e.phase === 'circular-dependency')).toBe(true);
  });

  it('throws DuplicateRegistrationError for the same token', () => {
    const token = tok('IDup');
    container.registerSingleton({ token, name: 'IDup', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    expect(() => container.registerSingleton({ token, name: 'IDup2', lifetime: 'singleton', dependencies: [], factory: () => ({}) }))
      .toThrow(DuplicateRegistrationError);
  });

  it('tryResolve() returns null for unregistered token', () => {
    expect(container.tryResolve(tok('IGhost'))).toBeNull();
  });

  it('resolve() throws UnregisteredServiceError for missing token', () => {
    expect(() => container.resolve(tok('IAbsent'))).toThrow(UnregisteredServiceError);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. EXTENDED VALIDATION (11 PHASES)
// ═══════════════════════════════════════════════════════════════════════════════

describe('9. Extended validation', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('returns valid:true when all deps are registered and no cycles', () => {
    container.loadModule(new CoreModule());
    const result = container.validate();
    expect(result.valid).toBe(true);
  });

  it('warns about singleton → scoped lifetime violation', () => {
    const scopedToken = tok('IScoped');
    const singletonToken = tok('ISingleton');
    container.registerScoped({ token: scopedToken, name: 'IScoped', lifetime: 'scoped', dependencies: [], factory: () => ({}) });
    container.registerSingleton({ token: singletonToken, name: 'ISingleton', lifetime: 'singleton', dependencies: [scopedToken], factory: () => ({}) });
    const result = container.validate();
    expect(result.warnings.some((w) => w.phase === 'lifetime-violation')).toBe(true);
  });

  it('warns about singleton → transient lifetime violation', () => {
    const transientToken = tok('ITransV');
    const singletonToken = tok('ISingV');
    container.registerTransient({ token: transientToken, name: 'ITransV', lifetime: 'transient', dependencies: [], factory: () => ({}) });
    container.registerSingleton({ token: singletonToken, name: 'ISingV', lifetime: 'singleton', dependencies: [transientToken], factory: () => ({}) });
    const result = container.validate();
    expect(result.warnings.some((w) => w.phase === 'lifetime-violation')).toBe(true);
  });

  it('validation result has durationMs', () => {
    const result = container.validate();
    expect(typeof result.durationMs).toBe('number');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('validate() emits validation.started and validation.completed events', () => {
    const started   = vi.fn();
    const completed = vi.fn();
    container.on('validation.started',   started);
    container.on('validation.completed', completed);
    container.validate();
    expect(started).toHaveBeenCalled();
    expect(completed).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. HEALTH CHECKS
// ═══════════════════════════════════════════════════════════════════════════════

describe('10. Health checks', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('returns healthy status for service with no healthCheck', async () => {
    const token = tok('IHealthy');
    container.registerSingleton({ token, name: 'IHealthy', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    container.resolve(token);
    const result = await container.health();
    const svc = result.services.find((s) => s.name === 'IHealthy');
    expect(svc?.health.status).toBe('healthy');
  });

  it('returns unknown for uninitialized service', async () => {
    const token = tok('IUnknown');
    container.registerSingleton({ token, name: 'IUnknown', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    // NOT resolved — instance is absent
    const result = await container.health();
    const svc = result.services.find((s) => s.name === 'IUnknown');
    expect(svc?.health.status).toBe('unknown');
  });

  it('returns unhealthy when healthCheck throws', async () => {
    const token = tok('IUnhealthy');
    container.registerSingleton({
      token, name: 'IUnhealthy', lifetime: 'singleton', dependencies: [],
      factory: () => ({}),
      healthCheck: async () => { throw new Error('disk full'); },
    });
    container.resolve(token);
    const result = await container.health();
    const svc = result.services.find((s) => s.name === 'IUnhealthy');
    expect(svc?.health.status).toBe('unhealthy');
  });

  it('overall health is worst of all services', async () => {
    const t1 = tok('H1'); const t2 = tok('H2');
    container.registerSingleton({
      token: t1, name: 'H1', lifetime: 'singleton', dependencies: [], factory: () => ({}),
      healthCheck: async () => ({ status: 'healthy', checkedAt: '', durationMs: 0 }),
    });
    container.registerSingleton({
      token: t2, name: 'H2', lifetime: 'singleton', dependencies: [], factory: () => ({}),
      healthCheck: async () => ({ status: 'degraded', checkedAt: '', durationMs: 0 }),
    });
    container.resolve(t1); container.resolve(t2);
    const result = await container.health();
    expect(result.overall).toBe('degraded');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. ASYNC INITIALIZATION + SHUTDOWN
// ═══════════════════════════════════════════════════════════════════════════════

describe('11. Async initialization & shutdown', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('initializeAll() calls initialize() on all singletons', async () => {
    const initFn = vi.fn().mockResolvedValue(undefined);
    const token = tok('IAsync');
    container.registerSingleton({ token, name: 'IAsync', lifetime: 'singleton', dependencies: [], factory: () => ({}), initialize: initFn });
    await container.initializeAll();
    expect(initFn).toHaveBeenCalled();
  });

  it('initializeAll() does not call initialize() twice', async () => {
    const initFn = vi.fn().mockResolvedValue(undefined);
    const token = tok('IAsync2');
    container.registerSingleton({ token, name: 'IAsync2', lifetime: 'singleton', dependencies: [], factory: () => ({}), initialize: initFn });
    await container.initializeAll();
    await container.initializeAll();
    expect(initFn).toHaveBeenCalledOnce();
  });

  it('dispose() calls dispose handler on singletons', async () => {
    const disposeFn = vi.fn().mockResolvedValue(undefined);
    const token = tok('IDisp');
    container.registerSingleton({ token, name: 'IDisp', lifetime: 'singleton', dependencies: [], factory: () => ({}), dispose: disposeFn });
    container.resolve(token);
    await container.dispose();
    expect(disposeFn).toHaveBeenCalled();
  });

  it('dispose() emits service.disposed event', async () => {
    const listener = vi.fn();
    container.on('service.disposed', listener);
    const token = tok('IDisp2');
    container.registerSingleton({ token, name: 'IDisp2', lifetime: 'singleton', dependencies: [], factory: () => ({}), dispose: async () => {} });
    container.resolve(token);
    await container.dispose();
    expect(listener).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 12. FREEZE
// ═══════════════════════════════════════════════════════════════════════════════

describe('12. Freeze (immutable registrations)', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('isFrozen() returns false before freeze()', () => {
    expect(container.isFrozen()).toBe(false);
  });

  it('isFrozen() returns true after freeze()', () => {
    container.freeze();
    expect(container.isFrozen()).toBe(true);
  });

  it('registerSingleton() throws FrozenContainerError after freeze', () => {
    container.freeze();
    const token = tok('IFrozen');
    expect(() => container.registerSingleton({ token, name: 'IFrozen', lifetime: 'singleton', dependencies: [], factory: () => ({}) }))
      .toThrow(FrozenContainerError);
  });

  it('loadModule() throws FrozenContainerError after freeze', () => {
    container.freeze();
    expect(() => container.loadModule(new CoreModule())).toThrow(FrozenContainerError);
  });

  it('loadPlugin() is allowed after freeze', () => {
    container.freeze();
    const plugin: IPluginModule = {
      name: 'TestPlugin', pluginId: 'test-plugin', version: '1.0.0',
      register: () => {},
    };
    expect(() => container.loadPlugin(plugin)).not.toThrow();
  });

  it('freeze() emits container.frozen event', () => {
    const listener = vi.fn();
    container.on('container.frozen', listener);
    container.freeze();
    expect(listener).toHaveBeenCalled();
  });

  it('resolve() still works after freeze', () => {
    const token = tok('IAfterFreeze');
    container.registerSingleton({ token, name: 'IAfterFreeze', lifetime: 'singleton', dependencies: [], factory: () => ({ ok: true }) });
    container.freeze();
    expect(container.resolve<{ ok: boolean }>(token).ok).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 13. METRICS + DEPENDENCY GRAPH EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

describe('13. Metrics & dependency graph export', () => {
  let container: DesktopContainer;

  beforeEach(() => { container = makeContainer(); });

  it('totalResolves increments on each resolve', () => {
    const token = tok('IM');
    container.registerSingleton({ token, name: 'IM', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    container.resolve(token); container.resolve(token);
    expect(container.getMetrics().totalResolves).toBe(2);
  });

  it('cacheHits increments on singleton cache hit', () => {
    const token = tok('IM2');
    container.registerSingleton({ token, name: 'IM2', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    container.resolve(token); // miss (lazy init)
    container.resolve(token); // hit
    expect(container.getMetrics().cacheHits).toBeGreaterThanOrEqual(1);
  });

  it('failedResolutions increments on resolve error', () => {
    expect(() => container.resolve(tok('INone'))).toThrow();
    expect(container.getMetrics().failedResolutions).toBe(1);
  });

  it('totalRegistrations matches number of registered services', () => {
    const t1 = tok('I1'); const t2 = tok('I2');
    container.registerSingleton({ token: t1, name: 'I1', lifetime: 'singleton', dependencies: [], factory: () => ({}) });
    container.registerTransient({ token: t2, name: 'I2', lifetime: 'transient', dependencies: [], factory: () => ({}) });
    expect(container.getMetrics().totalRegistrations).toBe(2);
  });

  it('exportDependencyGraph("json") returns valid JSON', () => {
    container.loadModule(new CoreModule());
    const json = container.exportDependencyGraph('json');
    expect(() => JSON.parse(json)).not.toThrow();
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('nodes');
    expect(parsed).toHaveProperty('edges');
  });

  it('exportDependencyGraph("mermaid") contains graph TD', () => {
    container.loadModule(new CoreModule());
    const mermaid = container.exportDependencyGraph('mermaid');
    expect(mermaid).toContain('graph TD');
  });

  it('exportDependencyGraph("dot") contains digraph', () => {
    container.loadModule(new CoreModule());
    const dot = container.exportDependencyGraph('dot');
    expect(dot).toContain('digraph DesktopContainer');
  });

  it('getDependencyGraph() has correct node and edge counts', () => {
    container.loadModule(new CoreModule());
    container.loadModule(new WindowModule());
    container.loadModule(new WorkspaceModule());
    const graph = container.getDependencyGraph();
    expect(graph.nodes.length).toBeGreaterThanOrEqual(4); // Logger, EventBus, WindowService, WorkspaceService
    // IWorkspaceService → IDesktopLogger
    expect(graph.edges.some((e) => e.toName === 'IDesktopLogger')).toBe(true);
  });

  it('getMetrics().collectedAt is an ISO date string', () => {
    const metrics = container.getMetrics();
    expect(() => new Date(metrics.collectedAt)).not.toThrow();
    expect(metrics.collectedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
