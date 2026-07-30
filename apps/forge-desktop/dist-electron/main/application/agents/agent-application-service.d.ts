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
    runWorkflow(req: {
        id: string;
        goal: string;
        workspaceRoot: string;
    }): Promise<any>;
    cancelTask(taskId: string): Promise<boolean>;
    listAgents(): any[];
    getMemory(workspaceRoot: string): Promise<any[]>;
}
export declare class AgentApplicationService implements IAgentApplicationService {
    private readonly orchestrator?;
    private readonly registry?;
    private readonly memory?;
    constructor(orchestrator?: AgentOrchestrator | undefined, registry?: AgentRegistry | undefined, memory?: AgentMemory | undefined);
    runWorkflow(req: {
        id: string;
        goal: string;
        workspaceRoot: string;
    }): Promise<any>;
    cancelTask(taskId: string): Promise<boolean>;
    listAgents(): any[];
    getMemory(workspaceRoot: string): Promise<any[]>;
}
