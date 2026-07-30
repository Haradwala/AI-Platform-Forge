/**
 * runtimes.module.ts — Composition Module for Multi-Runtime Intelligence Engine
 *
 * Registers RuntimeProviderRegistry, RuntimeProfileRegistry, RuntimeTimelinePublisher,
 * RuntimeManager, RuntimePerformanceEngine, IntelligentRoutingEngine, SessionStore,
 * MultiRuntimeSessionManager, and MultiRuntimeApplicationService in DesktopContainer.
 */

import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import { T } from '../container/tokens';
import { RuntimeProviderRegistry } from '../runtimes/providers/runtime-provider-registry';
import { RuntimeProfileRegistry } from '../runtimes/profiles/runtime-profile-registry';
import { RuntimeTimelinePublisher } from '../runtimes/timeline/runtime-timeline-publisher';
import { RuntimeManager } from '../runtimes/manager/runtime-manager';
import { RuntimePerformanceEngine } from '../runtimes/performance/runtime-performance-engine';
import { IntelligentRoutingEngine } from '../runtimes/routing/intelligent-routing-engine';
import { SessionStore } from '../runtimes/sessions/session-store';
import { MultiRuntimeSessionManager } from '../runtimes/sessions/multi-runtime-session-manager';
import { MultiRuntimeApplicationService } from '../application/runtime/multi-runtime-application-service';
import type { IDesktopEventBus } from '../container/service-interfaces';

export class RuntimesModule implements IContainerModule {
  readonly name = 'RuntimesModule';

  register(container: IDesktopContainer): void {
    if (container.isModuleLoaded(this.name)) return;

    // 1. Provider Registry
    container.registerSingleton<RuntimeProviderRegistry>({
      token: T.IRuntimeProviderRegistry,
      name: 'IRuntimeProviderRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RuntimeProviderRegistry(),
    });

    // 2. Profile Catalog Registry
    container.registerSingleton<RuntimeProfileRegistry>({
      token: T.IRuntimeProfileRegistry,
      name: 'IRuntimeProfileRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RuntimeProfileRegistry(),
    });

    // 3. Timeline Publisher
    container.registerSingleton<RuntimeTimelinePublisher>({
      token: T.IRuntimeTimelinePublisher,
      name: 'IRuntimeTimelinePublisher',
      lifetime: 'singleton',
      dependencies: [],
      factory: (r) => new RuntimeTimelinePublisher(
        r.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined
      ),
    });

    // 4. Runtime Manager
    container.registerSingleton<RuntimeManager>({
      token: T.IMultiRuntimeManager,
      name: 'IMultiRuntimeManager',
      lifetime: 'singleton',
      dependencies: [T.IRuntimeProviderRegistry, T.IRuntimeTimelinePublisher],
      factory: (r) => new RuntimeManager(
        r.resolve<RuntimeProviderRegistry>(T.IRuntimeProviderRegistry),
        r.resolve<RuntimeTimelinePublisher>(T.IRuntimeTimelinePublisher)
      ),
    });

    // 5. Performance Engine
    container.registerSingleton<RuntimePerformanceEngine>({
      token: T.IRuntimePerformanceEngine,
      name: 'IRuntimePerformanceEngine',
      lifetime: 'singleton',
      dependencies: [T.IRuntimeTimelinePublisher],
      factory: (r) => new RuntimePerformanceEngine(
        r.resolve<RuntimeTimelinePublisher>(T.IRuntimeTimelinePublisher)
      ),
    });

    // 6. Intelligent Routing Engine
    container.registerSingleton<IntelligentRoutingEngine>({
      token: T.IIntelligentRoutingEngine,
      name: 'IIntelligentRoutingEngine',
      lifetime: 'singleton',
      dependencies: [
        T.IRuntimeProfileRegistry,
        T.IRuntimePerformanceEngine,
        T.IMultiRuntimeManager,
        T.IRuntimeTimelinePublisher,
      ],
      factory: (r) => new IntelligentRoutingEngine(
        r.resolve<RuntimeProfileRegistry>(T.IRuntimeProfileRegistry),
        r.resolve<RuntimePerformanceEngine>(T.IRuntimePerformanceEngine),
        r.resolve<RuntimeManager>(T.IMultiRuntimeManager),
        r.resolve<RuntimeTimelinePublisher>(T.IRuntimeTimelinePublisher)
      ),
    });

    // 7. Multi-Runtime Session Manager
    container.registerSingleton<MultiRuntimeSessionManager>({
      token: T.IMultiRuntimeSessionManager,
      name: 'IMultiRuntimeSessionManager',
      lifetime: 'singleton',
      dependencies: [T.IRuntimeProfileRegistry],
      factory: (r) => new MultiRuntimeSessionManager(
        new SessionStore(),
        r.resolve<RuntimeProfileRegistry>(T.IRuntimeProfileRegistry)
      ),
    });

    // 8. Multi-Runtime Application Service Facade
    container.registerSingleton<MultiRuntimeApplicationService>({
      token: T.IMultiRuntimeApplicationService,
      name: 'IMultiRuntimeApplicationService',
      lifetime: 'singleton',
      dependencies: [
        T.IMultiRuntimeManager,
        T.IRuntimeProfileRegistry,
        T.IIntelligentRoutingEngine,
        T.IMultiRuntimeSessionManager,
        T.IRuntimePerformanceEngine,
      ],
      factory: (r) => new MultiRuntimeApplicationService(
        r.resolve<RuntimeManager>(T.IMultiRuntimeManager),
        r.resolve<RuntimeProfileRegistry>(T.IRuntimeProfileRegistry),
        r.resolve<IntelligentRoutingEngine>(T.IIntelligentRoutingEngine),
        r.resolve<MultiRuntimeSessionManager>(T.IMultiRuntimeSessionManager),
        r.resolve<RuntimePerformanceEngine>(T.IRuntimePerformanceEngine)
      ),
    });
  }

  static register(container: IDesktopContainer): void {
    if (!container.isModuleLoaded('RuntimesModule')) {
      container.loadModule(new RuntimesModule());
    }
  }
}
