"use strict";
/**
 * ai-agents.module.ts — Sub-module for Agent Framework & Multi-Agent Orchestration
 *
 * Registers AgentRegistry, AgentMemory, AgentScheduler, and AgentOrchestrator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentsModule = void 0;
const tokens_1 = require("../../container/tokens");
const agent_registry_1 = require("../../ai/agents/agent-registry");
const agent_memory_1 = require("../../ai/agents/agent-memory");
const agent_scheduler_1 = require("../../ai/agents/agent-scheduler");
const agent_orchestrator_1 = require("../../ai/agents/agent-orchestrator");
const built_in_agents_1 = require("../../ai/agents/built-in-agents");
class AiAgentsModule {
    static register(container) {
        // Agent Registry
        container.registerSingleton({
            token: tokens_1.T.IAgentRegistry,
            name: 'IAgentRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => {
                const registry = new agent_registry_1.AgentRegistry();
                registry.register(new built_in_agents_1.PlannerAgent());
                registry.register(new built_in_agents_1.ArchitectAgent());
                registry.register(new built_in_agents_1.CoderAgent());
                registry.register(new built_in_agents_1.ReviewerAgent());
                registry.register(new built_in_agents_1.TesterAgent());
                registry.register(new built_in_agents_1.DebuggerAgent());
                registry.register(new built_in_agents_1.RefactorerAgent());
                registry.register(new built_in_agents_1.DocumenterAgent());
                return registry;
            }
        });
        // Agent Memory
        container.registerSingleton({
            token: tokens_1.T.IAgentMemory,
            name: 'IAgentMemory',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new agent_memory_1.AgentMemory()
        });
        // Agent Scheduler
        container.registerSingleton({
            token: tokens_1.T.IAgentScheduler,
            name: 'IAgentScheduler',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new agent_scheduler_1.AgentScheduler()
        });
        // Agent Orchestrator (with lazy router resolver)
        container.registerSingleton({
            token: tokens_1.T.IAgentOrchestrator,
            name: 'IAgentOrchestrator',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new agent_orchestrator_1.AgentOrchestrator(resolver.tryResolve(tokens_1.T.IAgentRegistry) ?? new agent_registry_1.AgentRegistry(), resolver.tryResolve(tokens_1.T.IAgentScheduler) ?? new agent_scheduler_1.AgentScheduler(), resolver.tryResolve(tokens_1.T.IAgentMemory) ?? new agent_memory_1.AgentMemory(), undefined, () => resolver.tryResolve(tokens_1.T.IRuntimeRouter) ?? undefined, () => resolver.tryResolve(tokens_1.T.IRuntimeExecutionManager) ?? undefined, resolver.tryResolve(tokens_1.T.IActionExecutor) ?? undefined)
        });
    }
}
exports.AiAgentsModule = AiAgentsModule;
//# sourceMappingURL=ai-agents.module.js.map