"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionStateMachine = void 0;
class ExecutionStateMachine {
    currentState = 'pending';
    constructor(initialState) {
        if (initialState) {
            this.currentState = initialState;
        }
    }
    getState() {
        return this.currentState;
    }
    transitionTo(nextState) {
        if (!this.isValidTransition(this.currentState, nextState)) {
            throw new Error(`Illegal execution state transition: "${this.currentState}" -> "${nextState}"`);
        }
        this.currentState = nextState;
    }
    isValidTransition(from, to) {
        if (from === to)
            return true;
        // Terminal states cannot transition out
        if (from === 'completed' || from === 'failed' || from === 'cancelled') {
            return false;
        }
        const transitions = {
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
exports.ExecutionStateMachine = ExecutionStateMachine;
//# sourceMappingURL=execution-state-machine.js.map