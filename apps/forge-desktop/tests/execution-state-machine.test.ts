import { describe, it, expect } from 'vitest';
import { ExecutionStateMachine } from '../electron/main/ai/execution/execution-state-machine';

describe('ExecutionStateMachine', () => {
  it('starts in pending and transitions to queued and running correctly', () => {
    const fsm = new ExecutionStateMachine();
    expect(fsm.getState()).toBe('pending');

    fsm.transitionTo('queued');
    expect(fsm.getState()).toBe('queued');

    fsm.transitionTo('running');
    expect(fsm.getState()).toBe('running');

    fsm.transitionTo('completed');
    expect(fsm.getState()).toBe('completed');
  });

  it('rejects illegal transitions', () => {
    const fsm = new ExecutionStateMachine('completed');
    expect(() => fsm.transitionTo('running')).toThrow('Illegal execution state transition');
  });

  it('validates transition checks correctly', () => {
    const fsm = new ExecutionStateMachine('pending');
    expect(fsm.isValidTransition('pending', 'queued')).toBe(true);
    expect(fsm.isValidTransition('pending', 'completed')).toBe(false);
  });
});
