/**
 * runtime-session-state.ts — Phase 24 Runtime Session State Machine
 */
export type RuntimeSessionState = 'DISCOVERED' | 'READY' | 'STARTING' | 'RUNNING' | 'STREAMING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED' | 'STOPPED';
export declare class RuntimeSessionStateMachine {
    private currentState;
    constructor(initialState?: RuntimeSessionState);
    get state(): RuntimeSessionState;
    canTransitionTo(nextState: RuntimeSessionState): boolean;
    transitionTo(nextState: RuntimeSessionState): boolean;
}
