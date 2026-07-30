/**
 * agent-application-service.ts — Application Service for Multi-Agent Workflow Management
 *
 * Provides application layer methods to launch multi-agent autonomous workflows,
 * query role agents, and retrieve shared memory.
 */

import { AgentOrchestrator } from '../../ai/agents/agent-orchestrator';
import { AgentRegistry } from '../../ai/agents/agent-registry';
import { AgentMemory } from '../../ai/agents/agent-memory';

export interface IAgentApplicationService {
  runWorkflow(req: { id: string; goal: string; workspaceRoot: string }): Promise<any>;
  cancelTask(taskId: string): Promise<boolean>;
  listAgents(): any[];
  getMemory(workspaceRoot: string): Promise<any[]>;
}

export class AgentApplicationService implements IAgentApplicationService {
  constructor(
    private readonly orchestrator?: AgentOrchestrator,
    private readonly registry?: AgentRegistry,
    private readonly memory?: AgentMemory
  ) {}

  async runWorkflow(req: { id: string; goal: string; workspaceRoot: string }): Promise<any> {
    if (this.orchestrator) {
      return this.orchestrator.runWorkflow(req);
    }
    return { status: 'FAILED', error: 'AgentOrchestrator unavailable' };
  }

  async cancelTask(taskId: string): Promise<boolean> {
    if (this.orchestrator) {
      this.orchestrator.scheduler.cancelTask(taskId);
      return true;
    }
    return false;
  }

  listAgents(): any[] {
    if (this.registry) {
      return this.registry.list();
    }
    return [];
  }

  async getMemory(workspaceRoot: string): Promise<any[]> {
    if (this.memory) {
      return this.memory.getAll(workspaceRoot);
    }
    return [];
  }
}
