"use strict";
/**
 * runtime-application-service.ts — Application Service for AI Runtime Management & Routing
 *
 * Provides application layer methods to query, score, and execute sessions across
 * AI runtimes (Claude, Gemini, Ollama, Codex, Aider, Goose).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeApplicationService = void 0;
class RuntimeApplicationService {
    runtimeRouter;
    executionManager;
    multiRuntime;
    constructor(runtimeRouter, executionManager, multiRuntime) {
        this.runtimeRouter = runtimeRouter;
        this.executionManager = executionManager;
        this.multiRuntime = multiRuntime;
    }
    async routeIntent(intent, workspaceRoot) {
        if (this.runtimeRouter) {
            const candidates = [
                { id: 'claude', name: 'Claude CLI', type: 'cli', isAvailable: true, capabilities: { streaming: true, tools: true }, health: 'healthy', latencyMs: 150 },
                { id: 'ollama', name: 'Ollama Local', type: 'cli', isAvailable: true, capabilities: { streaming: true, tools: true }, health: 'healthy', latencyMs: 50 },
            ];
            return this.runtimeRouter.rankRuntimes({
                taskId: `req_${Date.now()}`,
                intent,
                capabilities: ['streaming', 'tools'],
                priority: 'normal',
                complexity: 'moderate',
                estimatedTokens: 1000,
                contextSize: 8000,
                workspaceRoot,
            }, candidates);
        }
        return [];
    }
    async getActiveSessions() {
        if (this.executionManager) {
            return this.executionManager.getAllSessions();
        }
        return [];
    }
    async cancelSession(sessionId) {
        if (this.executionManager) {
            await this.executionManager.stopSession(sessionId);
            return true;
        }
        return false;
    }
}
exports.RuntimeApplicationService = RuntimeApplicationService;
//# sourceMappingURL=runtime-application-service.js.map