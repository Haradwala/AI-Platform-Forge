/**
 * execution-graph-engine.ts
 *
 * Execution graph engine leveraging Phase 8 PlanningGraph for DAG validation,
 * cycle detection, topological sorting, and parallel ready-task resolution.
 */

import type { IPlan } from '../../container/service-interfaces';
import type { IExecutionTask } from './execution-types';
import { PlanningGraph } from '../planner/planning-graph';
import { PlanningError } from '../errors/planning-errors';

export interface IRunnableNode {
  readonly task: IExecutionTask;
  readonly dependencies: string[];
}

export class ExecutionGraphEngine {
  private readonly graph = new PlanningGraph<IExecutionTask>();

  build(plan: IPlan): void {
    this.graph.clear();
    for (const task of plan.tasks) {
      // Fail fast: every task MUST declare a toolCall.
      // If the planner emitted undefined here, it is a planner bug — surface it
      // immediately instead of silently masking it with a no-op substitution.
      if (!task.toolCall?.toolId) {
        throw new PlanningError(
          `Planner produced task "${task.id}" (${task.title}) without a toolCall.toolId. ` +
          `This is a planner defect — fix the plan generator instead of adding a fallback.`,
          task.id
        );
      }

      const runnableTask: IExecutionTask = {
        id: task.id,
        toolId: task.toolCall.toolId,
        dependencies: [...task.dependencies],
        priority: 'normal',
        retryLimit: 3,
        timeout: 30000,
        estimatedCost: 0.0,
        executionPolicy: 'auto',
        input: task.toolCall.input || {},
      };

      this.graph.addNode(task.id, runnableTask, task.dependencies);
    }
  }


  validate(): { valid: boolean; reason?: string } {
    return this.graph.validate();
  }

  serialize(): string {
    const list = this.graph.getAllNodes().map((n) => ({
      task: n.payload,
      dependencies: n.dependencies,
    }));
    return JSON.stringify(list);
  }

  deserialize(serialized: string): void {
    this.graph.clear();
    const list = JSON.parse(serialized) as Array<{ task: IExecutionTask; dependencies: string[] }>;
    for (const item of list) {
      this.graph.addNode(item.task.id, item.task, item.dependencies);
    }
  }

  topologicalSort(): string[] {
    return this.graph.topologicalSort();
  }

  findReadyTasks(completedTaskIds: string[]): IExecutionTask[] {
    const readyNodes = this.graph.getReadyNodes(completedTaskIds);
    return readyNodes.map((n) => n.payload);
  }

  getTask(taskId: string): IExecutionTask | null {
    const node = this.graph.getNode(taskId);
    return node ? node.payload : null;
  }

  getAllTasks(): IExecutionTask[] {
    return this.graph.getAllNodes().map((n) => n.payload);
  }
}
