"use strict";
/**
 * cli-runtime.ts — Phase 19 Generic CLI Runtime
 *
 * Generic CLI Runtime executing ANY CLI-based AI agent via pluggable CLIAdapters.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericCLIRuntime = void 0;
const events_1 = require("events");
const external_runtime_1 = require("../external/external-runtime");
const cli_session_1 = require("./cli-session");
const cli_discovery_1 = require("./cli-discovery");
const cli_errors_1 = require("./cli-errors");
class CLITokenStream {
    tokenCallbacks = [];
    completeCallbacks = [];
    errorCallbacks = [];
    isCancelled = false;
    onToken(callback) {
        this.tokenCallbacks.push(callback);
        return this;
    }
    onComplete(callback) {
        this.completeCallbacks.push(callback);
        return this;
    }
    onError(callback) {
        this.errorCallbacks.push(callback);
        return this;
    }
    cancel() {
        this.isCancelled = true;
    }
    emitToken(token) {
        if (this.isCancelled)
            return;
        for (const cb of this.tokenCallbacks) {
            cb(token);
        }
    }
    emitComplete(fullText) {
        if (this.isCancelled)
            return;
        for (const cb of this.completeCallbacks) {
            cb(fullText);
        }
    }
    emitError(err) {
        if (this.isCancelled)
            return;
        for (const cb of this.errorCallbacks) {
            cb(err);
        }
    }
}
class GenericCLIRuntime extends events_1.EventEmitter {
    id;
    name;
    runtimeType = 'cli';
    adapter;
    externalRuntime = null;
    currentSession = null;
    discovery;
    constructor(adapter) {
        super();
        this.adapter = adapter;
        this.id = adapter.id;
        this.name = adapter.name;
        this.discovery = new cli_discovery_1.CLIDiscovery();
    }
    // ─── IAiProvider Interface ──────────────────────────────────────────────────
    async generateStream(prompt, context, signal) {
        const stream = new CLITokenStream();
        let accumulatedText = '';
        if (signal) {
            signal.addEventListener('abort', () => {
                stream.cancel();
                this.cancel();
            });
        }
        if (!this.externalRuntime) {
            await this.start(context);
        }
        const onStreamEvent = (evt) => {
            if (evt.type === 'token' && evt.payload?.text) {
                accumulatedText += evt.payload.text;
                stream.emitToken(evt.payload.text);
            }
        };
        this.externalRuntime?.on('stream-event', onStreamEvent);
        this.send(prompt, context)
            .then(() => {
            stream.emitComplete(accumulatedText);
        })
            .catch((err) => {
            stream.emitError(err instanceof Error ? err : new Error(String(err)));
        });
        return stream;
    }
    async listAvailableModels() {
        return [`${this.id}-default`];
    }
    // ─── Lifecycle APIs ────────────────────────────────────────────────────────
    async initialize() {
        const isInstalled = await this.adapter.detect();
        if (!isInstalled) {
            throw new cli_errors_1.LaunchError(`CLI Agent "${this.name}" is not installed on system.`);
        }
        this.currentSession = new cli_session_1.CLIGenericSession({
            sessionId: `cli_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            runtimeId: this.id,
            adapterId: this.adapter.id,
            workspace: process.cwd(),
        });
        this.currentSession.setState('starting');
    }
    async start(options) {
        if (!this.currentSession) {
            await this.initialize();
        }
        const cmd = this.adapter.command();
        const args = this.adapter.arguments('', options);
        const env = this.adapter.environment(options);
        const cwd = this.adapter.workingDirectory(options);
        this.externalRuntime = new external_runtime_1.ExternalRuntime({
            id: this.id,
            name: this.name,
            command: cmd,
            args,
            mode: 'cli',
            transport: 'stdio',
            cwd,
            env,
        });
        await this.externalRuntime.start();
        this.currentSession?.setState('running');
    }
    async stop() {
        if (this.externalRuntime) {
            await this.externalRuntime.stop();
            this.externalRuntime = null;
        }
        this.currentSession?.setState('stopped');
    }
    async restart(options) {
        await this.stop();
        await this.start(options);
    }
    async send(prompt, options) {
        if (!this.externalRuntime) {
            await this.start(options);
        }
        const args = this.adapter.arguments(prompt, options);
        const promptText = args.join(' ') || prompt;
        await this.externalRuntime?.send(promptText);
    }
    cancel() {
        if (this.externalRuntime) {
            this.externalRuntime.cancel();
        }
    }
    async resume(sessionId) {
        if (this.adapter.supportsResume()) {
            await this.start({ resumeSessionId: sessionId });
        }
    }
    async healthCheck() {
        const isHealthy = await this.adapter.detect();
        return {
            healthy: isHealthy,
            latencyMs: isHealthy ? 15 : -1,
            error: isHealthy ? undefined : `CLI Agent "${this.name}" binary not detected.`,
        };
    }
    async discover() {
        return this.discovery.discoverAgent(this.id, this.adapter.command());
    }
    getAdapter() {
        return this.adapter;
    }
    getCurrentSession() {
        return this.currentSession;
    }
}
exports.GenericCLIRuntime = GenericCLIRuntime;
//# sourceMappingURL=cli-runtime.js.map