"use strict";
/**
 * cli-session.ts — Phase 19 Generic CLI Runtime & Session Management
 *
 * Contains both legacy CLISession (for backward compatibility with existing CLI runtimes)
 * and CLIGenericSession for the Phase 19 generic CLI adapter foundation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIGenericSession = exports.CLISession = void 0;
const cli_process_1 = require("./cli-process");
// ─── Legacy CLISession (Backward Compatibility) ───────────────────────────────
class CLISession {
    sessionId;
    command;
    args;
    options;
    process;
    startTime;
    constructor(sessionId, command, args = [], options = {}) {
        this.sessionId = sessionId;
        this.command = command;
        this.args = args;
        this.options = options;
        this.process = new cli_process_1.CLIProcess(command, args, options);
        this.startTime = Date.now();
    }
    start() {
        this.process.spawn();
    }
    restart() {
        this.process.restart();
    }
    destroy() {
        this.process.terminate();
    }
    status() {
        return this.process.status();
    }
    getInfo() {
        return {
            id: this.sessionId,
            command: this.command,
            args: this.args,
            pid: this.process.getPid(),
            status: this.status(),
            startTime: this.startTime,
            workingDirectory: this.options.cwd || process.cwd(),
            environment: this.options.env || {},
        };
    }
}
exports.CLISession = CLISession;
class CLIGenericSession {
    sessionId;
    runtimeId;
    adapterId;
    workspace;
    cwd;
    startTime;
    state = 'uninitialized';
    logs = [];
    accumulatedTokens = 0;
    toolCalls = [];
    constructor(options) {
        this.sessionId = options.sessionId;
        this.runtimeId = options.runtimeId;
        this.adapterId = options.adapterId;
        this.workspace = options.workspace;
        this.cwd = options.cwd || options.workspace;
        this.startTime = Date.now();
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    appendLog(line) {
        this.logs.push(`[${new Date().toLocaleTimeString()}] ${line}`);
        if (this.logs.length > 1000) {
            this.logs.shift();
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
    recordToolCall(toolName, args) {
        this.toolCalls.push({
            id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            toolName,
            args,
            timestamp: Date.now(),
        });
    }
    getToolCalls() {
        return [...this.toolCalls];
    }
}
exports.CLIGenericSession = CLIGenericSession;
//# sourceMappingURL=cli-session.js.map