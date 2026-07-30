"use strict";
/**
 * cli-process.ts
 *
 * Child process wrapper managing spawn, stdin writing, termination, restarts, timeouts,
 * and graceful process kill logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIProcess = void 0;
const child_process_1 = require("child_process");
const cli_stream_1 = require("./cli-stream");
class CLIProcess {
    command;
    args;
    options;
    childProcess = null;
    currentStatus = 'idle';
    timeoutTimer = null;
    stream = new cli_stream_1.CLIStream();
    constructor(command, args = [], options) {
        this.command = command;
        this.args = args;
        this.options = options;
    }
    spawn() {
        if (this.childProcess) {
            throw new Error(`CLI Process for "${this.command}" is already running.`);
        }
        if (this.options.signal?.aborted) {
            throw new Error('Process spawn cancelled by AbortSignal.');
        }
        const env = { ...process.env, ...(this.options.env || {}) };
        const cwd = this.options.cwd || process.cwd();
        this.childProcess = (0, child_process_1.spawn)(this.command, this.args, {
            cwd,
            env,
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: process.platform === 'win32',
        });
        this.currentStatus = 'running';
        if (this.childProcess.stdout) {
            this.stream.attachStdout(this.childProcess.stdout);
        }
        if (this.childProcess.stderr) {
            this.stream.attachStderr(this.childProcess.stderr);
        }
        this.childProcess.on('exit', (code, signal) => {
            this.clearTimeoutTimer();
            this.stream.flush();
            if (this.currentStatus !== 'terminated') {
                this.currentStatus = code === 0 ? 'idle' : 'failed';
            }
            this.childProcess = null;
        });
        this.childProcess.on('error', (err) => {
            this.clearTimeoutTimer();
            this.currentStatus = 'failed';
            this.stream.emit('stderr', `Process error: ${err.message}`);
        });
        // AbortSignal listener
        if (this.options.signal) {
            const onAbort = () => {
                this.kill();
            };
            this.options.signal.addEventListener('abort', onAbort, { once: true });
        }
        // Timeout option setup
        if (this.options.timeoutMs && this.options.timeoutMs > 0) {
            this.timeoutTimer = setTimeout(() => {
                this.stream.emit('stderr', `Process timed out after ${this.options.timeoutMs}ms.`);
                this.kill();
            }, this.options.timeoutMs);
        }
    }
    write(input) {
        if (!this.childProcess || !this.childProcess.stdin) {
            throw new Error(`Cannot write to process: process "${this.command}" is not running.`);
        }
        this.childProcess.stdin.write(input);
    }
    terminate() {
        if (!this.childProcess)
            return;
        this.currentStatus = 'terminated';
        this.clearTimeoutTimer();
        this.childProcess.kill('SIGTERM');
        // Force SIGKILL fallback if not exited within 2s
        const proc = this.childProcess;
        setTimeout(() => {
            if (proc && !proc.killed) {
                try {
                    proc.kill('SIGKILL');
                }
                catch (_) { }
            }
        }, 2000);
    }
    kill() {
        if (!this.childProcess)
            return;
        this.currentStatus = 'terminated';
        this.clearTimeoutTimer();
        try {
            this.childProcess.kill('SIGKILL');
        }
        catch (_) { }
        this.childProcess = null;
    }
    restart() {
        this.kill();
        this.spawn();
    }
    status() {
        return this.currentStatus;
    }
    getPid() {
        return this.childProcess?.pid;
    }
    clearTimeoutTimer() {
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }
    }
}
exports.CLIProcess = CLIProcess;
//# sourceMappingURL=cli-process.js.map