"use strict";
/**
 * external-runtime.ts — Phase 18 External Runtime Foundation
 *
 * Base ExternalRuntime implementing lifecycle management and satisfying IAiRuntime / IAiProvider.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalRuntime = void 0;
const events_1 = require("events");
const external_environment_1 = require("./external-environment");
const external_process_1 = require("./external-process");
const external_session_1 = require("./external-session");
const external_stream_parser_1 = require("./external-stream-parser");
class ExternalRuntime extends events_1.EventEmitter {
    id;
    name;
    runtimeType;
    config;
    state = 'uninitialized';
    env;
    process = null;
    currentSession = null;
    parser;
    constructor(config) {
        super();
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.runtimeType = config.mode === 'cli' ? 'cli' : config.mode === 'mcp' ? 'mcp' : 'local';
        this.env = new external_environment_1.ExternalEnvironment(config.cwd, config.env);
        this.parser = new external_stream_parser_1.ExternalStreamParser();
        this.parser.on('event', (evt) => {
            if (this.currentSession && evt.payload.text) {
                this.currentSession.appendLog(evt.payload.text);
            }
            this.emit('stream-event', evt);
        });
    }
    // ─── IAiProvider Interface ──────────────────────────────────────────────────
    async generateStream(prompt) {
        const tokenCbs = [];
        const completeCbs = [];
        const errorCbs = [];
        let fullOutput = '';
        let cancelled = false;
        const stream = {
            onToken: (cb) => { tokenCbs.push(cb); return stream; },
            onComplete: (cb) => { completeCbs.push(cb); return stream; },
            onError: (cb) => { errorCbs.push(cb); return stream; },
            cancel: () => {
                cancelled = true;
                this.cancel();
            },
        };
        if (this.state !== 'running') {
            await this.start();
        }
        const onToken = (evt) => {
            if (cancelled)
                return;
            if (evt.type === 'token' && evt.payload.text) {
                fullOutput += evt.payload.text;
                tokenCbs.forEach((cb) => cb(evt.payload.text));
            }
        };
        const onComplete = () => {
            if (cancelled)
                return;
            this.parser.off('token', onToken);
            this.parser.off('complete', onComplete);
            completeCbs.forEach((cb) => cb(fullOutput));
        };
        this.parser.on('token', onToken);
        this.parser.on('complete', onComplete);
        this.send(prompt).catch((err) => {
            errorCbs.forEach((cb) => cb(err instanceof Error ? err : new Error(String(err))));
        });
        return stream;
    }
    async listAvailableModels() {
        return [`${this.id}-default`];
    }
    // ─── Lifecycle APIs ────────────────────────────────────────────────────────
    async initialize() {
        this.state = 'starting';
        this.currentSession = new external_session_1.ExternalSession({
            sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            workspaceRoot: this.env.getWorkingDirectory(),
            runtimeId: this.id,
        });
        this.currentSession.setState('starting');
    }
    async start() {
        if (this.state === 'uninitialized') {
            await this.initialize();
        }
        if (this.process && this.process.isRunning()) {
            return; // Already running
        }
        this.process = new external_process_1.ExternalProcess({
            command: this.config.command,
            args: this.config.args || [],
            cwd: this.env.getWorkingDirectory(),
            env: this.env.getMergedEnvironment(),
            usePty: this.config.usePty,
        });
        this.process.on('stdout', (data) => {
            this.parser.writeChunk(data);
        });
        this.process.on('stderr', (data) => {
            this.parser.writeChunk(data);
        });
        this.process.on('exit', ({ code }) => {
            this.state = code === 0 ? 'stopped' : 'error';
            if (this.currentSession) {
                this.currentSession.setState(this.state);
            }
            this.parser.flush();
            this.emit('state-changed', this.state);
        });
        this.process.spawnProcess();
        const pid = this.process.getPid();
        if (pid && this.currentSession) {
            this.currentSession.setProcessId(pid);
        }
        this.state = 'running';
        if (this.currentSession) {
            this.currentSession.setState('running');
        }
        this.emit('state-changed', this.state);
    }
    async stop() {
        this.state = 'stopping';
        if (this.process) {
            this.process.kill('SIGTERM');
        }
        this.state = 'stopped';
        if (this.currentSession) {
            this.currentSession.setState('stopped');
        }
        this.emit('state-changed', this.state);
    }
    async restart() {
        await this.stop();
        await this.start();
    }
    async dispose() {
        await this.stop();
        if (this.process) {
            this.process.dispose();
            this.process = null;
        }
        this.env.dispose();
        this.state = 'stopped';
        this.removeAllListeners();
    }
    async healthCheck() {
        const isRunning = this.process !== null && this.process.isRunning();
        return {
            healthy: isRunning || this.state !== 'error',
            latencyMs: isRunning ? 12 : -1,
            error: this.state === 'error' ? 'External process error exit' : undefined,
        };
    }
    supportsStreaming() {
        return true;
    }
    async send(prompt) {
        if (!this.process || !this.process.isRunning()) {
            await this.start();
        }
        this.process?.writeStdin(prompt + '\n');
    }
    cancel() {
        if (this.process && this.process.isRunning()) {
            this.process.kill('SIGINT');
        }
    }
    getState() {
        return this.state;
    }
    getCurrentSession() {
        return this.currentSession;
    }
}
exports.ExternalRuntime = ExternalRuntime;
//# sourceMappingURL=external-runtime.js.map