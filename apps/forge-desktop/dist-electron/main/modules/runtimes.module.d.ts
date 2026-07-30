/**
 * runtimes.module.ts — Composition Module for Multi-Runtime Intelligence Engine
 *
 * Registers RuntimeProviderRegistry, RuntimeProfileRegistry, RuntimeTimelinePublisher,
 * RuntimeManager, RuntimePerformanceEngine, IntelligentRoutingEngine, SessionStore,
 * MultiRuntimeSessionManager, and MultiRuntimeApplicationService in DesktopContainer.
 */
import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class RuntimesModule implements IContainerModule {
    readonly name = "RuntimesModule";
    register(container: IDesktopContainer): void;
    static register(container: IDesktopContainer): void;
}
