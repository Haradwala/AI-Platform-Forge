/**
 * automation-step-executor.ts — Step Router & Execution Dispatcher
 *
 * Routes step execution:
 * - Action steps ('term.run_tests', 'fs.write_file', 'git.commit') -> ActionExecutor
 * - Agent steps ('Planner', 'Architect', 'Coder', 'Reviewer', 'Tester') -> AgentOrchestrator
 *
 * Integrates with AutomationArtifactStore for input/output artifact passing between steps.
 */
import { AutomationStepDefinition, AutomationStepResult, PipelineExecution } from '../contracts/automation-types';
import { AutomationArtifactStore } from '../artifacts/automation-artifact-store';
import type { ActionExecutor } from '../../ai/actions/action-executor';
import type { AgentOrchestrator } from '../../ai/agents/agent-orchestrator';
export declare class AutomationStepExecutor {
    private readonly actionExecutor?;
    private readonly agentOrchestrator?;
    private readonly artifactStore;
    constructor(actionExecutor?: ActionExecutor | undefined, agentOrchestrator?: AgentOrchestrator | undefined, artifactStore?: AutomationArtifactStore);
    /**
     * Executes a single pipeline step and returns its result.
     */
    executeStep(step: AutomationStepDefinition, jobId: string, execution: PipelineExecution): Promise<AutomationStepResult>;
}
