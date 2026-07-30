/**
 * runtime-session-state.ts — Phase 24 Runtime Session State Machine
 */

export type RuntimeSessionState =
  | 'DISCOVERED'
  | 'READY'
  | 'STARTING'
  | 'RUNNING'
  | 'STREAMING'
  | 'WAITING_APPROVAL'
  | 'COMPLETED'
  | 'FAILED'
  | 'STOPPED';

const VALID_TRANSITIONS: Record<RuntimeSessionState, RuntimeSessionState[]> = {
  DISCOVERED: ['READY', 'FAILED'],
  READY: ['STARTING', 'STOPPED', 'FAILED'],
  STARTING: ['RUNNING', 'FAILED', 'STOPPED'],
  RUNNING: ['STREAMING', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED', 'STOPPED'],
  STREAMING: ['RUNNING', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED', 'STOPPED'],
  WAITING_APPROVAL: ['STREAMING', 'RUNNING', 'COMPLETED', 'FAILED', 'STOPPED'],
  COMPLETED: ['READY', 'STARTING'],
  FAILED: ['READY', 'STARTING'],
  STOPPED: ['READY', 'STARTING'],
};

export class RuntimeSessionStateMachine {
  private currentState: RuntimeSessionState;

  constructor(initialState: RuntimeSessionState = 'DISCOVERED') {
    this.currentState = initialState;
  }

  get state(): RuntimeSessionState {
    return this.currentState;
  }

  canTransitionTo(nextState: RuntimeSessionState): boolean {
    return VALID_TRANSITIONS[this.currentState].includes(nextState);
  }

  transitionTo(nextState: RuntimeSessionState): boolean {
    if (!this.canTransitionTo(nextState)) {
      console.warn(`[RuntimeSessionStateMachine] Invalid state transition: ${this.currentState} -> ${nextState}`);
      return false;
    }
    this.currentState = nextState;
    return true;
  }
}
