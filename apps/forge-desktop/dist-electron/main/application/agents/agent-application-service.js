"use strict";
/**
 * agent-application-service.ts — Application Service for Multi-Agent Workflow Management
 *
 * Provides application layer methods to launch multi-agent autonomous workflows,
 * query role agents, and retrieve shared memory.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentApplicationService = void 0;
class AgentApplicationService {
    orchestrator;
    registry;
    memory;
    constructor(orchestrator, registry, memory) {
        this.orchestrator = orchestrator;
        this.registry = registry;
        this.memory = memory;
    }
    async runWorkflow(req) {
        if (this.orchestrator) {
            return this.orchestrator.runWorkflow(req);
        }
        return { status: 'FAILED', error: 'AgentOrchestrator unavailable' };
    }
    async cancelTask(taskId) {
        if (this.orchestrator) {
            this.orchestrator.scheduler.cancelTask(taskId);
            return true;
        }
        return false;
    }
    listAgents() {
        if (this.registry) {
            return this.registry.list();
        }
        return [];
    }
    async getMemory(workspaceRoot) {
        if (this.memory) {
            return this.memory.getAll(workspaceRoot);
        }
        return [];
    }
}
exports.AgentApplicationService = AgentApplicationService;
//# sourceMappingURL=agent-application-service.js.map