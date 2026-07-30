/**
 * built-in-agents.ts — Phase 30 Generic Role-Based Built-in Agents
 *
 * Implements 8 role-based agents (Planner, Architect, Coder, Reviewer, Tester,
 * Debugger, Refactorer, Documenter) completely decoupled from AI provider logic.
 */
import { AgentRole, AgentTask, AgentResult, IAgent } from './agent-types';
export declare class BaseAgent implements IAgent {
    readonly role: AgentRole;
    readonly name: string;
    readonly description: string;
    readonly capabilities: string[];
    constructor(role: AgentRole, name: string, description: string, capabilities: string[]);
    execute(task: AgentTask, context?: any): Promise<AgentResult>;
}
export declare class PlannerAgent extends BaseAgent {
    constructor();
}
export declare class ArchitectAgent extends BaseAgent {
    constructor();
}
export declare class CoderAgent extends BaseAgent {
    constructor();
}
export declare class ReviewerAgent extends BaseAgent {
    constructor();
}
export declare class TesterAgent extends BaseAgent {
    constructor();
}
export declare class DebuggerAgent extends BaseAgent {
    constructor();
}
export declare class RefactorerAgent extends BaseAgent {
    constructor();
}
export declare class DocumenterAgent extends BaseAgent {
    constructor();
}
