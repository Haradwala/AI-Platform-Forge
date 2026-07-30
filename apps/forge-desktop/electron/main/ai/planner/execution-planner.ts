import { ITaskGraph } from './task-planner';

export type ExecutionStrategyType =
  | 'sequential'
  | 'parallel'
  | 'batch'
  | 'speculative'
  | 'conditional'
  | 'recovery'
  | 'rollback';

export interface IExecutionStrategy {
  readonly strategy: ExecutionStrategyType;
  readonly concurrencyLimit: number;
  readonly retriesAllowed: number;
  readonly rollbackEnabled: boolean;
}

export class ExecutionPlanner {
  determineStrategy(graph: ITaskGraph): IExecutionStrategy {
    const hasParallelPotential = graph.nodes.filter((n) => n.dependencies.length === 0).length > 1;
    const hasHighRisk = graph.nodes.some((n) => n.risk === 'high');

    let strategy: ExecutionStrategyType = 'sequential';
    let concurrencyLimit = 1;
    let retriesAllowed = 2;
    let rollbackEnabled = true;

    if (hasHighRisk) {
      strategy = 'conditional'; // Require checks between steps
      concurrencyLimit = 1;
      retriesAllowed = 1;
      rollbackEnabled = true;
    } else if (hasParallelPotential) {
      strategy = 'parallel';
      concurrencyLimit = 3;
      retriesAllowed = 3;
      rollbackEnabled = false;
    }

    return {
      strategy,
      concurrencyLimit,
      retriesAllowed,
      rollbackEnabled,
    };
  }
}
