"use strict";
/**
 * runtime-session-state.ts — Phase 24 Runtime Session State Machine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeSessionStateMachine = void 0;
const VALID_TRANSITIONS = {
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
class RuntimeSessionStateMachine {
    currentState;
    constructor(initialState = 'DISCOVERED') {
        this.currentState = initialState;
    }
    get state() {
        return this.currentState;
    }
    canTransitionTo(nextState) {
        return VALID_TRANSITIONS[this.currentState].includes(nextState);
    }
    transitionTo(nextState) {
        if (!this.canTransitionTo(nextState)) {
            console.warn(`[RuntimeSessionStateMachine] Invalid state transition: ${this.currentState} -> ${nextState}`);
            return false;
        }
        this.currentState = nextState;
        return true;
    }
}
exports.RuntimeSessionStateMachine = RuntimeSessionStateMachine;
//# sourceMappingURL=runtime-session-state.js.map