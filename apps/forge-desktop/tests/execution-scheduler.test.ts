import { describe, it, expect, vi } from 'vitest';
import { ExecutionScheduler, LinearRetry } from '../electron/main/ai/execution/execution-scheduler';
import { ExecutionGraphEngine } from '../electron/main/ai/execution/execution-graph-engine';
import { ExecutionBudgetTracker } from '../electron/main/ai/execution/execution-budget';
import { ExecutionObserver } from '../electron/main/ai/execution/execution-observer';
import type { TaskDispatcher } from '../electron/main/ai/execution/task-dispatcher';
import type { IPlan } from '../electron/main/container/service-interfaces';

describe('ExecutionScheduler', () => {
  it('schedules tasks in topological order and executes them', async () => {
    const mockDispatcher = {
      dispatch: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as TaskDispatcher;

    const observer = new ExecutionObserver();
    const scheduler = new ExecutionScheduler(mockDispatcher, observer, new LinearRetry());
    const graph = new ExecutionGraphEngine();

    const plan: IPlan = {
      id: 'p1',
      goal: 'test scheduling',
      tasks: [
        { id: 't2', title: 'Task 2', description: 'desc', status: 'pending', dependencies: ['t1'], toolCall: { toolId: 'read_file', input: {} } },
        { id: 't1', title: 'Task 1', description: 'desc', status: 'pending', dependencies: [], toolCall: { toolId: 'read_file', input: {} } },
      ],
    };

    graph.build(plan);

    const budgetTracker = new ExecutionBudgetTracker({
      tokenBudget: 1000,
      timeBudget: 100,
      costBudget: 0.1,
      fileBudget: 5,
      retryBudget: 3,
    });

    const controller = new AbortController();
    await scheduler.schedule(graph, budgetTracker, controller.signal, 'exec-1', 'p1');

    expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 't1' }), expect.any(Object), 'exec-1');
    expect(mockDispatcher.dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: 't2' }), expect.any(Object), 'exec-1');
  });

  it('triggers task retries on dispatch failure', async () => {
    let callCount = 0;
    const mockDispatcher = {
      dispatch: vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('temporary failure');
        }
        return Promise.resolve({ success: true });
      }),
    } as unknown as TaskDispatcher;

    const observer = new ExecutionObserver();
    const scheduler = new ExecutionScheduler(mockDispatcher, observer, new LinearRetry());
    const graph = new ExecutionGraphEngine();

    const plan: IPlan = {
      id: 'p1',
      goal: 'test retries',
      tasks: [
        { id: 't1', title: 'Task 1', description: 'desc', status: 'pending', dependencies: [], toolCall: { toolId: 'read_file', input: {} } },
      ],
    };

    graph.build(plan);
    const budgetTracker = new ExecutionBudgetTracker({
      tokenBudget: 1000,
      timeBudget: 100,
      costBudget: 0.1,
      fileBudget: 5,
      retryBudget: 3,
    });

    const controller = new AbortController();
    await scheduler.schedule(graph, budgetTracker, controller.signal, 'exec-1', 'p1');

    expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(2);
    expect(budgetTracker.getMetrics().retriesCount).toBe(1);
  });
});
