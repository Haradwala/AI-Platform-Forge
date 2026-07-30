"use strict";
/**
 * runtimes.module.ts — Composition Module for Multi-Runtime Intelligence Engine
 *
 * Registers RuntimeProviderRegistry, RuntimeProfileRegistry, RuntimeTimelinePublisher,
 * RuntimeManager, RuntimePerformanceEngine, IntelligentRoutingEngine, SessionStore,
 * MultiRuntimeSessionManager, and MultiRuntimeApplicationService in DesktopContainer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimesModule = void 0;
const tokens_1 = require("../container/tokens");
const runtime_provider_registry_1 = require("../runtimes/providers/runtime-provider-registry");
const runtime_profile_registry_1 = require("../runtimes/profiles/runtime-profile-registry");
const runtime_timeline_publisher_1 = require("../runtimes/timeline/runtime-timeline-publisher");
const runtime_manager_1 = require("../runtimes/manager/runtime-manager");
const runtime_performance_engine_1 = require("../runtimes/performance/runtime-performance-engine");
const intelligent_routing_engine_1 = require("../runtimes/routing/intelligent-routing-engine");
const session_store_1 = require("../runtimes/sessions/session-store");
const multi_runtime_session_manager_1 = require("../runtimes/sessions/multi-runtime-session-manager");
const multi_runtime_application_service_1 = require("../application/runtime/multi-runtime-application-service");
class RuntimesModule {
    name = 'RuntimesModule';
    register(container) {
        if (container.isModuleLoaded(this.name))
            return;
        // 1. Provider Registry
        container.registerSingleton({
            token: tokens_1.T.IRuntimeProviderRegistry,
            name: 'IRuntimeProviderRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new runtime_provider_registry_1.RuntimeProviderRegistry(),
        });
        // 2. Profile Catalog Registry
        container.registerSingleton({
            token: tokens_1.T.IRuntimeProfileRegistry,
            name: 'IRuntimeProfileRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new runtime_profile_registry_1.RuntimeProfileRegistry(),
        });
        // 3. Timeline Publisher
        container.registerSingleton({
            token: tokens_1.T.IRuntimeTimelinePublisher,
            name: 'IRuntimeTimelinePublisher',
            lifetime: 'singleton',
            dependencies: [],
            factory: (r) => new runtime_timeline_publisher_1.RuntimeTimelinePublisher(r.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined),
        });
        // 4. Runtime Manager
        container.registerSingleton({
            token: tokens_1.T.IMultiRuntimeManager,
            name: 'IMultiRuntimeManager',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRuntimeProviderRegistry, tokens_1.T.IRuntimeTimelinePublisher],
            factory: (r) => new runtime_manager_1.RuntimeManager(r.resolve(tokens_1.T.IRuntimeProviderRegistry), r.resolve(tokens_1.T.IRuntimeTimelinePublisher)),
        });
        // 5. Performance Engine
        container.registerSingleton({
            token: tokens_1.T.IRuntimePerformanceEngine,
            name: 'IRuntimePerformanceEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRuntimeTimelinePublisher],
            factory: (r) => new runtime_performance_engine_1.RuntimePerformanceEngine(r.resolve(tokens_1.T.IRuntimeTimelinePublisher)),
        });
        // 6. Intelligent Routing Engine
        container.registerSingleton({
            token: tokens_1.T.IIntelligentRoutingEngine,
            name: 'IIntelligentRoutingEngine',
            lifetime: 'singleton',
            dependencies: [
                tokens_1.T.IRuntimeProfileRegistry,
                tokens_1.T.IRuntimePerformanceEngine,
                tokens_1.T.IMultiRuntimeManager,
                tokens_1.T.IRuntimeTimelinePublisher,
            ],
            factory: (r) => new intelligent_routing_engine_1.IntelligentRoutingEngine(r.resolve(tokens_1.T.IRuntimeProfileRegistry), r.resolve(tokens_1.T.IRuntimePerformanceEngine), r.resolve(tokens_1.T.IMultiRuntimeManager), r.resolve(tokens_1.T.IRuntimeTimelinePublisher)),
        });
        // 7. Multi-Runtime Session Manager
        container.registerSingleton({
            token: tokens_1.T.IMultiRuntimeSessionManager,
            name: 'IMultiRuntimeSessionManager',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRuntimeProfileRegistry],
            factory: (r) => new multi_runtime_session_manager_1.MultiRuntimeSessionManager(new session_store_1.SessionStore(), r.resolve(tokens_1.T.IRuntimeProfileRegistry)),
        });
        // 8. Multi-Runtime Application Service Facade
        container.registerSingleton({
            token: tokens_1.T.IMultiRuntimeApplicationService,
            name: 'IMultiRuntimeApplicationService',
            lifetime: 'singleton',
            dependencies: [
                tokens_1.T.IMultiRuntimeManager,
                tokens_1.T.IRuntimeProfileRegistry,
                tokens_1.T.IIntelligentRoutingEngine,
                tokens_1.T.IMultiRuntimeSessionManager,
                tokens_1.T.IRuntimePerformanceEngine,
            ],
            factory: (r) => new multi_runtime_application_service_1.MultiRuntimeApplicationService(r.resolve(tokens_1.T.IMultiRuntimeManager), r.resolve(tokens_1.T.IRuntimeProfileRegistry), r.resolve(tokens_1.T.IIntelligentRoutingEngine), r.resolve(tokens_1.T.IMultiRuntimeSessionManager), r.resolve(tokens_1.T.IRuntimePerformanceEngine)),
        });
    }
    static register(container) {
        if (!container.isModuleLoaded('RuntimesModule')) {
            container.loadModule(new RuntimesModule());
        }
    }
}
exports.RuntimesModule = RuntimesModule;
//# sourceMappingURL=runtimes.module.js.map