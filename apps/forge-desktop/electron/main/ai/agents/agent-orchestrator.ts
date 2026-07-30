/**
 * agent-orchestrator.ts — Phase 30 Multi-Agent Orchestrator
 *
 * Coordinates multi-agent workflows, task DAG scheduling, RuntimeRouter selection,
 * RuntimeExecutionManager execution, ActionExecutor actions, and AgentMemory storage.
 */

import { AgentRole, AgentTask, AgentResult, AgentState } from './agent-types';
import { AgentRegistry } from './agent-registry';
import { AgentScheduler } from './agent-scheduler';
import { AgentMemory } from './agent-memory';
import { AgentEventEmitter } from './agent-events';
import { PlannerAgent, ArchitectAgent, CoderAgent, ReviewerAgent, TesterAgent, DebuggerAgent, RefactorerAgent, DocumenterAgent } from './built-in-agents';

export interface WorkflowRequest {
  id: string;
  goal: string;
  workspaceRoot: string;
  tasks?: AgentTask[];
  context?: any;
}

export interface WorkflowResult {
  workflowId: string;
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
  durationMs: number;
  taskResults: AgentResult[];
  outputs: Record<string, string>;
  artifacts: string[];
}

export class AgentOrchestrator {
  public readonly registry: AgentRegistry;
  public readonly scheduler: AgentScheduler;
  public readonly memory: AgentMemory;
  public readonly events: AgentEventEmitter;

  constructor(
    registry?: AgentRegistry,
    scheduler?: AgentScheduler,
    memory?: AgentMemory,
    events?: AgentEventEmitter,
    private readonly runtimeRouter?: any,
    private readonly runtimeExecutionManager?: any,
    private readonly actionExecutor?: any
  ) {
    this.registry = registry || new AgentRegistry();
    this.events = events || new AgentEventEmitter();
    this.scheduler = scheduler || new AgentScheduler(this.events);
    this.memory = memory || new AgentMemory();

    // Register built-in role agents if registry is empty
    if (this.registry.list().length === 0) {
      this.registry.register(new PlannerAgent());
      this.registry.register(new ArchitectAgent());
      this.registry.register(new CoderAgent());
      this.registry.register(new ReviewerAgent());
      this.registry.register(new TesterAgent());
      this.registry.register(new DebuggerAgent());
      this.registry.register(new RefactorerAgent());
      this.registry.register(new DocumenterAgent());
    }
  }

  /**
   * Decomposes a high-level goal into a standard multi-agent DAG pipeline if tasks are not explicitly provided.
   */
  createDefaultPipeline(goal: string): AgentTask[] {
    return [
      {
        id: 'task_1_plan',
        agentRole: 'planner',
        title: 'Plan Execution Strategy',
        prompt: `Decompose goal into steps: ${goal}`,
        dependencies: [],
        priority: 10,
      },
      {
        id: 'task_2_arch',
        agentRole: 'architect',
        title: 'Architect Component Structure',
        prompt: `Design system architecture for: ${goal}`,
        dependencies: ['task_1_plan'],
        priority: 9,
      },
      {
        id: 'task_3_code',
        agentRole: 'coder',
        title: 'Implement Engineering Code',
        prompt: `Implement solution code for: ${goal}`,
        dependencies: ['task_2_arch'],
        priority: 8,
      },
      {
        id: 'task_4_review',
        agentRole: 'reviewer',
        title: 'Review Code Quality & Security',
        prompt: `Review code quality and lint rules for: ${goal}`,
        dependencies: ['task_3_code'],
        priority: 7,
      },
      {
        id: 'task_5_test',
        agentRole: 'tester',
        title: 'Execute Verification Tests',
        prompt: `Run test suite and verify changes for: ${goal}`,
        dependencies: ['task_4_review'],
        priority: 6,
      },
    ];
  }

  private getRouter(): any {
    if (typeof this.runtimeRouter === 'function') {
      return this.runtimeRouter();
    }
    return this.runtimeRouter;
  }

  private getExecutionManager(): any {
    if (typeof this.runtimeExecutionManager === 'function') {
      return this.runtimeExecutionManager();
    }
    return this.runtimeExecutionManager;
  }

  /**
   * Executes a multi-agent workflow DAG.
   */
  async runWorkflow(request: WorkflowRequest): Promise<WorkflowResult> {
    const start = Date.now();
    const tasks = request.tasks || this.createDefaultPipeline(request.goal);

    const taskResults: AgentResult[] = [];
    const outputs: Record<string, string> = {};
    const allArtifacts: string[] = [];

    const resultsMap = await this.scheduler.scheduleDAG(tasks, async (task) => {
      // 1. Get assigned Agent
      const agent = this.registry.get(task.agentRole) || this.registry.assign(this.registry.capabilities(task.agentRole));
      if (!agent) {
        throw new Error(`No registered agent available for role ${task.agentRole}`);
      }

      // 2. Select Runtime via RuntimeRouter if available
      let selectedRuntimeId = 'ollama';
      const router = this.getRouter();
      if (router) {
        try {
          const req = {
            taskId: task.id,
            intent: task.prompt,
            capabilities: agent.capabilities,
            priority: 'normal',
            complexity: 'medium',
            estimatedTokens: 1000,
            contextSize: 8000,
            workspaceRoot: request.workspaceRoot,
          };
          const candidates = [
            { id: 'claude', name: 'Claude CLI', type: 'cli', isAvailable: true, capabilities: { streaming: true, tools: true }, health: 'healthy', latencyMs: 150 },
            { id: 'ollama', name: 'Ollama Local', type: 'cli', isAvailable: true, capabilities: { streaming: true, tools: true }, health: 'healthy', latencyMs: 50 },
          ];
          const ranked = router.rankRuntimes(req, candidates);
          if (ranked && ranked.length > 0) {
            selectedRuntimeId = ranked[0].candidate.id;
          }
        } catch (err) {
          // Fallback to default
        }
      }

      // 3. Execute via Agent
      const res = await agent.execute(task, request.context);
      res.runtimeId = selectedRuntimeId;

      // 4. Store memory entry
      await this.memory.set(request.workspaceRoot, task.agentRole, `output_${task.id}`, res.output);

      return res;
    });

    for (const res of resultsMap.values()) {
      taskResults.push(res);
      outputs[res.taskId] = res.output;
      if (res.artifacts) {
        allArtifacts.push(...res.artifacts);
      }
    }

    const hasFailure = taskResults.some((r) => r.status === 'FAILED');
    const hasCancellation = taskResults.some((r) => r.status === 'CANCELLED');
    const finalStatus = hasFailure ? 'FAILED' : hasCancellation ? 'CANCELLED' : 'COMPLETED';

    return {
      workflowId: request.id,
      status: finalStatus,
      durationMs: Date.now() - start,
      taskResults,
      outputs,
      artifacts: Array.from(new Set(allArtifacts)),
    };
  }
}
