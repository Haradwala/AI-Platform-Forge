import { describe, it, expect } from 'vitest';
import type { ExecutionEvent } from '../electron/main/ai/execution/execution-events';

describe('ExecutionEvents Contracts', () => {
  it('instantiates strongly typed execution progress events', () => {
    const event: ExecutionEvent = {
      eventId: 'evt-100',
      type: 'execution:progress',
      executionId: 'exec-1',
      timestamp: new Date().toISOString(),
      taskId: 't1',
      state: 'running',
      progressPercentage: 50,
      elapsedMs: 120,
    };

    expect(event.type).toBe('execution:progress');
    expect(event.taskId).toBe('t1');
    expect(event.state).toBe('running');
  });
});
