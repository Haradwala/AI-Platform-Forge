import { describe, it, expect } from 'vitest';
import { ExecutionGraphEngine } from '../electron/main/ai/execution/execution-graph-engine';
import type { IPlan } from '../electron/main/container/service-interfaces';

describe('ExecutionGraphEngine', () => {
  it('builds nodes from plan tasks and topological sorts correctly', () => {
    const engine = new ExecutionGraphEngine();
    const plan: IPlan = {
      id: 'p1',
      goal: 'test topo sort',
      tasks: [
        { id: 't2', title: 'Task 2', description: 'desc', status: 'pending', dependencies: ['t1'], toolCall: { toolId: 'read_file', input: {} } },
        { id: 't1', title: 'Task 1', description: 'desc', status: 'pending', dependencies: [], toolCall: { toolId: 'read_file', input: {} } },
      ],
    };

    engine.build(plan);
    const validation = engine.validate();
    expect(validation.valid).toBe(true);

    const sorted = engine.topologicalSort();
    expect(sorted).toEqual(['t1', 't2']);
  });

  it('detects circular dependencies', () => {
    const engine = new ExecutionGraphEngine();
    const plan: IPlan = {
      id: 'p1',
      goal: 'test cycle detection',
      tasks: [
        { id: 't1', title: 'Task 1', description: 'desc', status: 'pending', dependencies: ['t2'], toolCall: { toolId: 'read_file', input: {} } },
        { id: 't2', title: 'Task 2', description: 'desc', status: 'pending', dependencies: ['t1'], toolCall: { toolId: 'read_file', input: {} } },
      ],
    };

    engine.build(plan);
    const validation = engine.validate();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Circular dependency');
  });

  it('identifies ready tasks based on completed set', () => {
    const engine = new ExecutionGraphEngine();
    const plan: IPlan = {
      id: 'p1',
      goal: 'ready tasks test',
      tasks: [
        { id: 't1', title: 'Task 1', description: 'desc', status: 'pending', dependencies: [], toolCall: { toolId: 'read_file', input: {} } },
        { id: 't2', title: 'Task 2', description: 'desc', status: 'pending', dependencies: ['t1'], toolCall: { toolId: 'read_file', input: {} } },
      ],
    };

    engine.build(plan);
    const initialReady = engine.findReadyTasks([]);
    expect(initialReady.map((t) => t.id)).toEqual(['t1']);

    const afterT1Ready = engine.findReadyTasks(['t1']);
    expect(afterT1Ready.map((t) => t.id)).toEqual(['t2']);
  });
});
