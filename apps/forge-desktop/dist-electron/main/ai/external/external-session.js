"use strict";
/**
 * external-session.ts — Phase 18 External Runtime Foundation
 *
 * Tracks active process session metadata, state transitions, execution logs, and token metrics.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalSession = void 0;
class ExternalSession {
    sessionId;
    workspaceRoot;
    runtimeId;
    startTime;
    state = 'uninitialized';
    processId;
    logs = [];
    accumulatedTokens = 0;
    constructor(options) {
        this.sessionId = options.sessionId;
        this.workspaceRoot = options.workspaceRoot;
        this.runtimeId = options.runtimeId;
        this.startTime = Date.now();
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    setProcessId(pid) {
        this.processId = pid;
    }
    getProcessId() {
        return this.processId;
    }
    appendLog(line) {
        this.logs.push(`[${new Date().toLocaleTimeString()}] ${line}`);
        if (this.logs.length > 500) {
            this.logs.shift(); // Bound max log history
        }
    }
    getLogs() {
        return [...this.logs];
    }
    addTokens(count) {
        this.accumulatedTokens += count;
    }
    getTokens() {
        return this.accumulatedTokens;
    }
    getDurationMs() {
        return Date.now() - this.startTime;
    }
}
exports.ExternalSession = ExternalSession;
//# sourceMappingURL=external-session.js.map