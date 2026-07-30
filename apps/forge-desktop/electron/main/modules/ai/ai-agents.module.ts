/**
 * ai-agents.module.ts — Sub-module for Agent Framework & Multi-Agent Orchestration
 *
 * Registers AgentRegistry, AgentMemory, AgentScheduler, and AgentOrchestrator.
 */

import type { IDesktopContainer, IServiceResolver } from '../../container/interfaces';
import { T } from '../../container/tokens';
import { AgentRegistry } from '../../ai/agents/agent-registry';
import { AgentMemory } from '../../ai/agents/agent-memory';
import { AgentScheduler } from '../../ai/agents/agent-scheduler';
import { AgentOrchestrator } from '../../ai/agents/agent-orchestrator';
import { PlannerAgent, ArchitectAgent, CoderAgent, ReviewerAgent, TesterAgent, DebuggerAgent, RefactorerAgent, DocumenterAgent } from '../../ai/agents/built-in-agents';
import type { ActionExecutor } from '../../ai/actions/action-executor';
import type { RuntimeRouter } from '../../ai/routing/runtime-router';
import type { RuntimeExecutionManager } from '../../ai/runtime/runtime-execution-manager';

export class AiAgentsModule {
  static register(container: IDesktopContainer): void {
    // Agent Registry
    container.registerSingleton<AgentRegistry>({
      token: T.IAgentRegistry,
      name: 'IAgentRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => {
        const registry = new AgentRegistry();
        registry.register(new PlannerAgent());
        registry.register(new ArchitectAgent());
        registry.register(new CoderAgent());
        registry.register(new ReviewerAgent());
        registry.register(new TesterAgent());
        registry.register(new DebuggerAgent());
        registry.register(new RefactorerAgent());
        registry.register(new DocumenterAgent());
        return registry;
      }
    });

    // Agent Memory
    container.registerSingleton<AgentMemory>({
      token: T.IAgentMemory,
      name: 'IAgentMemory',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new AgentMemory()
    });

    // Agent Scheduler
    container.registerSingleton<AgentScheduler>({
      token: T.IAgentScheduler,
      name: 'IAgentScheduler',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new AgentScheduler()
    });

    // Agent Orchestrator (with lazy router resolver)
    container.registerSingleton<AgentOrchestrator>({
      token: T.IAgentOrchestrator,
      name: 'IAgentOrchestrator',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new AgentOrchestrator(
        resolver.tryResolve<AgentRegistry>(T.IAgentRegistry) ?? new AgentRegistry(),
        resolver.tryResolve<AgentScheduler>(T.IAgentScheduler) ?? new AgentScheduler(),
        resolver.tryResolve<AgentMemory>(T.IAgentMemory) ?? new AgentMemory(),
        undefined,
        () => resolver.tryResolve<RuntimeRouter>(T.IRuntimeRouter) ?? undefined,
        () => resolver.tryResolve<RuntimeExecutionManager>(T.IRuntimeExecutionManager) ?? undefined,
        resolver.tryResolve<ActionExecutor>(T.IActionExecutor) ?? undefined
      )
    });
  }
}
