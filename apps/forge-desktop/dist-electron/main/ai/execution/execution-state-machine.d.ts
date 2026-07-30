import type { ExecutionState } from './execution-types';
export declare class ExecutionStateMachine {
    private currentState;
    constructor(initialState?: ExecutionState);
    getState(): ExecutionState;
    transitionTo(nextState: ExecutionState): void;
    isValidTransition(from: ExecutionState, to: ExecutionState): boolean;
}
