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

export class AutomationStepExecutor {
  constructor(
    private readonly actionExecutor?: ActionExecutor,
    private readonly agentOrchestrator?: AgentOrchestrator,
    private readonly artifactStore: AutomationArtifactStore = new AutomationArtifactStore()
  ) {}

  /**
   * Executes a single pipeline step and returns its result.
   */
  async executeStep(
    step: AutomationStepDefinition,
    jobId: string,
    execution: PipelineExecution
  ): Promise<AutomationStepResult> {
    const startTime = Date.now();
    const logs: string[] = [];

    try {
      // 1. Resolve Input Artifact if specified
      let inputContext = '';
      if (step.inputArtifact) {
        const artifacts = await this.artifactStore.listArtifacts(execution.workspaceRoot, execution.id);
        const target = artifacts.find((a) => a.name === step.inputArtifact);
        if (target) {
          inputContext = await this.artifactStore.readArtifact(target.path);
          logs.push(`[Artifact] Read input artifact "${step.inputArtifact}"`);
        }
      }

      let stepData: any = null;

      // 2. Route Step by Type
      if (step.agent) {
        // Agent Pipeline Step
        if (!this.agentOrchestrator) {
          throw new Error(`AgentOrchestrator unavailable for agent step "${step.name}" (${step.agent})`);
        }

        const prompt = inputContext
          ? `${step.prompt || ''}\n\n=== INPUT ARTIFACT CONTEXT ===\n${inputContext}`
          : step.prompt || step.name;

        logs.push(`[Agent:${step.agent}] Executing prompt...`);
        const agentResult = await this.agentOrchestrator.runWorkflow({
          id: `agwf_${step.id}`,
          goal: prompt,
          workspaceRoot: execution.workspaceRoot,
          tasks: [
            {
              id: `agtask_${step.id}`,
              agentRole: step.agent as any,
              title: step.name,
              prompt,
              dependencies: [],
              priority: 1,
            }
          ]
        });

        if (agentResult.status === 'FAILED') {
          throw new Error(agentResult.outputs?.error || `Agent ${step.agent} failed`);
        }

        stepData = agentResult;
        logs.push(`[Agent:${step.agent}] Completed successfully`);
      } else if (step.action) {
        // Action System Step
        if (!this.actionExecutor) {
          throw new Error(`ActionExecutor unavailable for action step "${step.name}" (${step.action})`);
        }

        logs.push(`[Action:${step.action}] Executing action...`);
        const actionResult = await this.actionExecutor.executeAction({
          id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          actionId: step.action,
          runtimeId: 'automation_engine',
          workspaceRoot: execution.workspaceRoot,
          params: step.params || {},
          timestamp: Date.now(),
        });

        if (actionResult.status === 'FAILED') {
          throw new Error(actionResult.error || `Action ${step.action} failed`);
        }

        stepData = actionResult.data;
        if (actionResult.logs) logs.push(...actionResult.logs);
        logs.push(`[Action:${step.action}] Completed successfully`);
      } else {
        // Default Script / Echo step
        logs.push(`[Script:${step.name}] Executed successfully`);
        stepData = { message: `Step ${step.name} completed` };
      }

      // 3. Save Output Artifact if specified
      const outputArtifacts: any[] = [];
      if (step.outputArtifact && stepData) {
        const content = typeof stepData === 'string' ? stepData : JSON.stringify(stepData, null, 2);
        const art = await this.artifactStore.saveArtifact(
          execution.workspaceRoot,
          execution.id,
          step.id,
          step.outputArtifact,
          content
        );
        outputArtifacts.push(art);
        logs.push(`[Artifact] Saved output artifact "${step.outputArtifact}"`);
      }

      return {
        stepId: step.id,
        jobId,
        status: 'COMPLETED',
        startTime,
        endTime: Date.now(),
        durationMs: Date.now() - startTime,
        data: stepData,
        outputArtifacts,
        logs,
      };
    } catch (err: any) {
      return {
        stepId: step.id,
        jobId,
        status: 'FAILED',
        startTime,
        endTime: Date.now(),
        durationMs: Date.now() - startTime,
        error: err.message || String(err),
        logs,
      };
    }
  }
}
