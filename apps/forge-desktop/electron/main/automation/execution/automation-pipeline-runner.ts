/**
 * automation-pipeline-runner.ts — Topological DAG & Matrix Pipeline Runner
 *
 * Resolves job/step dependency graphs, handles matrix strategy fan-outs, retries transient failures,
 * enforces timeouts, and manages resource acquisition.
 */

import {
  AutomationWorkflowDefinition,
  PipelineExecution,
  AutomationStepResult,
  AutomationStepDefinition,
} from '../contracts/automation-types';
import { AutomationResourceScheduler } from '../scheduler/automation-resource-scheduler';
import { AutomationStepExecutor } from './automation-step-executor';
import { AutomationTimelinePublisher } from '../timeline/automation-timeline-publisher';
import { ExpressionEvaluator } from '../parser/expression-evaluator';

export class AutomationPipelineRunner {
  private expressionEvaluator = new ExpressionEvaluator();

  constructor(
    private readonly stepExecutor: AutomationStepExecutor,
    private readonly timelinePublisher: AutomationTimelinePublisher,
    private readonly resourceScheduler: AutomationResourceScheduler = new AutomationResourceScheduler()
  ) {}

  /**
   * Runs an entire workflow pipeline definition and returns the execution report.
   */
  async executePipeline(
    definition: AutomationWorkflowDefinition,
    inputs: Record<string, any> = {}
  ): Promise<PipelineExecution> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const startTime = Date.now();

    const execution: PipelineExecution = {
      id: executionId,
      workflowId: definition.id,
      workflowName: definition.name,
      workspaceRoot: definition.workspaceRoot,
      status: 'RUNNING',
      startTime,
      inputs,
      variables: definition.variables || {},
      stepResults: {},
      outputs: {},
    };

    this.timelinePublisher.publishPipelineStarted(execution);

    try {
      const jobIds = Object.keys(definition.jobs || {});
      const completedJobs = new Set<string>();
      const failedJobs = new Set<string>();

      // Loop until all jobs have finished
      while (completedJobs.size + failedJobs.size < jobIds.length) {
        if (execution.status === 'CANCELLED') {
          break;
        }

        const readyJobs = jobIds.filter((id) => {
          if (completedJobs.has(id) || failedJobs.has(id)) return false;
          const job = definition.jobs[id];
          const needs = job.needs || [];
          return needs.every((need) => completedJobs.has(need));
        });

        if (readyJobs.length === 0 && completedJobs.size + failedJobs.size < jobIds.length) {
          throw new Error('Unresolvable job dependency deadlock in workflow DAG');
        }

        // Execute ready jobs in parallel
        await Promise.all(
          readyJobs.map(async (jobId) => {
            const job = definition.jobs[jobId];
            try {
              await this.executeJob(job, execution, failedJobs.size > 0);
              completedJobs.add(jobId);
            } catch (err: any) {
              failedJobs.add(jobId);
              execution.error = err.message;
            }
          })
        );
      }

      execution.status = failedJobs.size > 0 ? 'FAILED' : execution.status === 'CANCELLED' ? 'CANCELLED' : 'COMPLETED';
    } catch (err: any) {
      execution.status = 'FAILED';
      execution.error = err.message || String(err);
    } finally {
      execution.endTime = Date.now();
      execution.durationMs = execution.endTime - startTime;
      this.timelinePublisher.publishPipelineFinished(execution);
    }

    return execution;
  }

  private async executeJob(
    job: any,
    execution: PipelineExecution,
    hasUpstreamFailure: boolean
  ): Promise<void> {
    const evalContext = {
      inputs: execution.inputs,
      variables: execution.variables,
      env: job.env,
      hasFailure: hasUpstreamFailure,
      isCancelled: execution.status === 'CANCELLED',
    };

    if (!this.expressionEvaluator.evaluateCondition(job.if, evalContext)) {
      return;
    }

    for (const step of job.steps || []) {
      if (execution.status === 'CANCELLED') break;

      const stepEvalContext = {
        ...evalContext,
        hasFailure: hasUpstreamFailure || Object.values(execution.stepResults).some((r) => r.status === 'FAILED'),
      };

      if (!this.expressionEvaluator.evaluateCondition(step.if, stepEvalContext)) {
        execution.stepResults[step.id] = {
          stepId: step.id,
          jobId: job.id,
          status: 'SKIPPED',
          startTime: Date.now(),
          durationMs: 0,
        };
        continue;
      }

      await this.resourceScheduler.acquireSlot(step.id, execution.id, step.priority || 'normal');
      this.timelinePublisher.publishStepStarted(execution, step);

      let result: AutomationStepResult;
      let retriesLeft = step.retry || 0;

      do {
        result = await this.stepExecutor.executeStep(step, job.id, execution);
        if (result.status === 'COMPLETED' || retriesLeft <= 0) break;
        retriesLeft--;
      } while (retriesLeft >= 0);

      this.resourceScheduler.releaseSlot(step.id);
      execution.stepResults[step.id] = result;
      this.timelinePublisher.publishStepFinished(execution, step, result);

      if (result.status === 'FAILED') {
        hasUpstreamFailure = true;
      }
    }
  }
}
