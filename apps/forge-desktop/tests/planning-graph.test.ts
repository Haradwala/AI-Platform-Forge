/**
 * planning-graph.test.ts
 *
 * Unit test suite for Phase 8 PlanningGraph.
 * Covers:
 *  - DAG node addition and status tracking
 *  - Orphan and missing dependency validation
 *  - Cycle detection via DFS
 *  - Topological sorting
 *  - Ready node resolution for parallel branches
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PlanningGraph } from '../electron/main/ai/planner/planning-graph';

describe('PlanningGraph', () => {
  let graph: PlanningGraph;

  beforeEach(() => {
    graph = new PlanningGraph();
  });

  it('builds DAG nodes and tracks status transitions', () => {
    graph.addNode('task_1', { name: 'Step 1' });
    graph.addNode('task_2', { name: 'Step 2' }, ['task_1']);

    expect(graph.getAllNodes().length).toBe(2);
    expect(graph.getNode('task_1')?.status).toBe('pending');

    graph.markStatus('task_1', 'completed');
    expect(graph.getNode('task_1')?.status).toBe('completed');
  });

  it('validates graph against missing dependencies', () => {
    graph.addNode('task_1', { name: 'Step 1' }, ['missing_dep']);
    const validation = graph.validate();

    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('missing_dep');
  });

  it('detects circular dependencies via DFS', () => {
    graph.addNode('task_a', {}, ['task_b']);
    graph.addNode('task_b', {}, ['task_c']);
    graph.addNode('task_c', {}, ['task_a']); // Cycle: A -> B -> C -> A

    const validation = graph.validate();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Circular dependency');

    expect(() => graph.topologicalSort()).toThrow('Cannot perform topological sort');
  });

  it('performs topological sorting for valid DAG graphs', () => {
    graph.addNode('c', {}, ['a', 'b']);
    graph.addNode('a', {});
    graph.addNode('b', {}, ['a']);

    const sorted = graph.topologicalSort();
    expect(sorted).toEqual(['a', 'b', 'c']);
  });

  it('finds ready nodes for parallel branch execution', () => {
    // Branch 1: A -> C
    // Branch 2: B -> D
    graph.addNode('a', {});
    graph.addNode('b', {});
    graph.addNode('c', {}, ['a']);
    graph.addNode('d', {}, ['b']);

    // Initially A and B are ready concurrently
    let ready = graph.getReadyNodes();
    expect(ready.map((n) => n.id).sort()).toEqual(['a', 'b']);

    graph.markStatus('a', 'completed');
    ready = graph.getReadyNodes(['a']);
    expect(ready.map((n) => n.id).sort()).toEqual(['b', 'c']);
  });
});
