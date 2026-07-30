"use strict";
/**
 * external-process.ts — Phase 18 External Runtime Foundation
 *
 * Low-level child process wrapper managing spawn, stdio, signals, cwd, env, and exit codes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalProcess = void 0;
const child_process_1 = require("child_process");
const events_1 = require("events");
class ExternalProcess extends events_1.EventEmitter {
    options;
    child = null;
    isRunningState = false;
    exitCode = null;
    constructor(options) {
        super();
        this.options = options;
    }
    /**
     * Spawns the underlying process.
     */
    spawnProcess() {
        if (this.child) {
            throw new Error('[ExternalProcess] Process is already spawned.');
        }
        const { command, args, cwd, env } = this.options;
        this.child = (0, child_process_1.spawn)(command, args, {
            cwd,
            env,
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true,
        });
        this.isRunningState = true;
        this.child.stdout?.on('data', (data) => {
            this.emit('stdout', data.toString('utf-8'));
        });
        this.child.stderr?.on('data', (data) => {
            this.emit('stderr', data.toString('utf-8'));
        });
        this.child.on('error', (err) => {
            this.isRunningState = false;
            this.emit('error', err);
        });
        this.child.on('exit', (code, signal) => {
            this.isRunningState = false;
            this.exitCode = code;
            this.emit('exit', { code: code ?? 0, signal });
        });
    }
    /**
     * Writes payload data to process stdin.
     */
    writeStdin(data) {
        if (!this.child || !this.child.stdin || !this.isRunningState) {
            return false;
        }
        return this.child.stdin.write(data);
    }
    /**
     * Sends a POSIX or Windows signal to the process.
     */
    kill(signal = 'SIGTERM') {
        if (this.child && this.isRunningState) {
            this.child.kill(signal);
        }
    }
    isRunning() {
        return this.isRunningState;
    }
    getPid() {
        return this.child?.pid;
    }
    getExitCode() {
        return this.exitCode;
    }
    dispose() {
        if (this.isRunningState) {
            this.kill('SIGKILL');
        }
        this.child = null;
        this.removeAllListeners();
    }
}
exports.ExternalProcess = ExternalProcess;
//# sourceMappingURL=external-process.js.map