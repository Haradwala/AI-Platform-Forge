/**
 * workflow-engine.ts — Phase 25-28 Engineering Workflow Engine
 *
 * Converts high-level engineering goals into structured multi-step task workflows.
 * Operates above Intent Analyzer and Runtime Router.
 */
import { ExecutionRequest } from '../contracts/execution-contracts';
export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    request: ExecutionRequest;
    dependsOn?: string[];
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
}
export interface EngineeringWorkflow {
    id: string;
    goal: string;
    workspaceRoot: string;
    createdAt: number;
    steps: WorkflowStep[];
    status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}
export declare class WorkflowEngine {
    /**
     * Decomposes a user goal into a multi-step workflow pipeline.
     */
    createWorkflow(goal: string, workspaceRoot: string): EngineeringWorkflow;
}
