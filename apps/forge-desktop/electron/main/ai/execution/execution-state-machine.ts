import type { ExecutionState } from './execution-types';

export class ExecutionStateMachine {
  private currentState: ExecutionState = 'pending';

  constructor(initialState?: ExecutionState) {
    if (initialState) {
      this.currentState = initialState;
    }
  }

  getState(): ExecutionState {
    return this.currentState;
  }

  transitionTo(nextState: ExecutionState): void {
    if (!this.isValidTransition(this.currentState, nextState)) {
      throw new Error(`Illegal execution state transition: "${this.currentState}" -> "${nextState}"`);
    }
    this.currentState = nextState;
  }

  isValidTransition(from: ExecutionState, to: ExecutionState): boolean {
    if (from === to) return true;

    // Terminal states cannot transition out
    if (from === 'completed' || from === 'failed' || from === 'cancelled') {
      return false;
    }

    const transitions: Record<ExecutionState, ExecutionState[]> = {
      pending: ['queued', 'cancelled'],
      queued: ['running', 'waiting', 'cancelled'],
      waiting: ['running', 'cancelled'],
      running: ['completed', 'failed', 'paused', 'retrying', 'cancelled'],
      paused: ['running', 'cancelled'],
      retrying: ['running', 'failed', 'cancelled'],
      rollingback: ['failed', 'completed'],
      completed: [],
      failed: [],
      cancelled: [],
    };

    return (transitions[from] || []).includes(to);
  }
}
