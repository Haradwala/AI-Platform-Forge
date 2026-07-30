/**
 * automation-coordinator.ts — Domain Coordinator for Execution Lifecycle & State Snapshots
 *
 * Owns workflow execution lifecycle, queue state, execution registry, cancellation APIs,
 * and persistence of execution snapshots to `.forge/executions/<executionId>.json`.
 */

import * as fs from 'fs';
import * as path from 'path';
import { AutomationWorkflowDefinition, PipelineExecution } from '../contracts/automation-types';
import { AutomationPipelineRunner } from '../execution/automation-pipeline-runner';
import { AutomationResourceScheduler } from '../scheduler/automation-resource-scheduler';
import { AutomationArtifactStore } from '../artifacts/automation-artifact-store';

export class AutomationCoordinator {
  private activeExecutions = new Map<string, PipelineExecution>();

  constructor(
    private readonly pipelineRunner: AutomationPipelineRunner,
    private readonly resourceScheduler: AutomationResourceScheduler = new AutomationResourceScheduler(),
    private readonly artifactStore: AutomationArtifactStore = new AutomationArtifactStore()
  ) {}

  /**
   * Enqueues and coordinates the execution of a workflow pipeline.
   */
  async executeWorkflow(
    definition: AutomationWorkflowDefinition,
    inputs: Record<string, any> = {}
  ): Promise<PipelineExecution> {
    const executionPromise = this.pipelineRunner.executePipeline(definition, inputs);
    
    // Track in active executions memory map
    executionPromise.then((exec) => {
      this.activeExecutions.set(exec.id, exec);
      this.persistExecution(exec);
    });

    const result = await executionPromise;
    this.activeExecutions.set(result.id, result);
    this.persistExecution(result);
    return result;
  }

  /**
   * Cancels a running workflow pipeline execution.
   */
  async cancelExecution(executionId: string): Promise<boolean> {
    const active = this.activeExecutions.get(executionId);
    if (active) {
      active.status = 'CANCELLED';
      this.resourceScheduler.cancelExecutionSlots(executionId);
      this.persistExecution(active);
      return true;
    }
    return false;
  }

  /**
   * Gets an execution by ID from active memory or snapshot storage.
   */
  async getExecution(workspaceRoot: string, executionId: string): Promise<PipelineExecution | null> {
    if (this.activeExecutions.has(executionId)) {
      return this.activeExecutions.get(executionId)!;
    }

    const filePath = path.join(workspaceRoot, '.forge', 'executions', `${executionId}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw) as PipelineExecution;
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  /**
   * Lists all execution snapshots stored in `.forge/executions/`.
   */
  async listExecutions(workspaceRoot: string): Promise<PipelineExecution[]> {
    const dir = path.join(workspaceRoot, '.forge', 'executions');
    if (!fs.existsSync(dir)) {
      return Array.from(this.activeExecutions.values());
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const stored: PipelineExecution[] = [];

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
        stored.push(JSON.parse(raw));
      } catch (err) {
        // Skip unparseable files
      }
    }

    // Merge memory and stored executions
    const map = new Map<string, PipelineExecution>();
    stored.forEach((e) => map.set(e.id, e));
    this.activeExecutions.forEach((e) => map.set(e.id, e));

    return Array.from(map.values()).sort((a, b) => b.startTime - a.startTime);
  }

  private persistExecution(execution: PipelineExecution): void {
    try {
      const dir = path.join(execution.workspaceRoot, '.forge', 'executions');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, `${execution.id}.json`), JSON.stringify(execution, null, 2));
    } catch (err) {
      // Non-blocking write error
    }
  }
}
