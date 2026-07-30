"use strict";
/**
 * multi-runtime-application-service.ts — Application Service Facade for Multi-Runtime Subsystem
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiRuntimeApplicationService = void 0;
class MultiRuntimeApplicationService {
    runtimeManager;
    profileRegistry;
    routingEngine;
    sessionManager;
    performanceEngine;
    constructor(runtimeManager, profileRegistry, routingEngine, sessionManager, performanceEngine) {
        this.runtimeManager = runtimeManager;
        this.profileRegistry = profileRegistry;
        this.routingEngine = routingEngine;
        this.sessionManager = sessionManager;
        this.performanceEngine = performanceEngine;
    }
    async listProfiles(filter) {
        if (!this.profileRegistry)
            return [];
        return this.profileRegistry.listProfiles(filter);
    }
    async getActiveRuntimes() {
        if (!this.runtimeManager)
            return [];
        return this.runtimeManager.getActiveRuntimes();
    }
    async routeRequest(request) {
        if (!this.routingEngine)
            throw new Error('IntelligentRoutingEngine unavailable');
        return this.routingEngine.routeRequest(request);
    }
    async createSession(workspaceRoot, initialModelId) {
        if (!this.sessionManager)
            throw new Error('MultiRuntimeSessionManager unavailable');
        return this.sessionManager.createSession(workspaceRoot, initialModelId);
    }
    async switchRuntime(sessionId, newModelId) {
        if (!this.sessionManager)
            throw new Error('MultiRuntimeSessionManager unavailable');
        return this.sessionManager.switchRuntime(sessionId, newModelId);
    }
    async addSessionMessage(sessionId, message) {
        if (this.sessionManager) {
            await this.sessionManager.addMessage(sessionId, message);
        }
    }
    async getSession(sessionId) {
        if (!this.sessionManager)
            return null;
        return this.sessionManager.getSession(sessionId);
    }
    async listSessions(workspaceRoot) {
        if (!this.sessionManager)
            return [];
        return this.sessionManager.listSessions(workspaceRoot);
    }
    async getMetrics(modelId) {
        if (!this.performanceEngine)
            throw new Error('RuntimePerformanceEngine unavailable');
        return this.performanceEngine.getMetrics(modelId);
    }
    async runBenchmark(modelId) {
        if (!this.performanceEngine)
            throw new Error('RuntimePerformanceEngine unavailable');
        return this.performanceEngine.runBenchmark(modelId);
    }
}
exports.MultiRuntimeApplicationService = MultiRuntimeApplicationService;
//# sourceMappingURL=multi-runtime-application-service.js.map