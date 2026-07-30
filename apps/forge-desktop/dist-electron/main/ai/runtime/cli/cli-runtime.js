"use strict";
/**
 * cli-runtime.ts
 *
 * Base abstract class for CLI Runtimes (Claude Code, Gemini CLI, Codex CLI, Aider, Goose).
 * Bridges external CLI tools managed by CLIManager to Forge's IAiRuntime layer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCLIRuntime = void 0;
class BaseCLIRuntime {
    cliManager;
    runtimeType = 'cli';
    activeSession = null;
    constructor(cliManager) {
        this.cliManager = cliManager;
    }
    async healthCheck() {
        const start = Date.now();
        try {
            const isWin = process.platform === 'win32';
            const cmd = isWin ? 'where' : 'which';
            const session = await this.cliManager.createSession({
                command: cmd,
                args: [this.defaultExecutable],
                timeoutMs: 3000,
            });
            const latency = Date.now() - start;
            const healthy = session.status() !== 'failed';
            await this.cliManager.destroySession(session.sessionId);
            return {
                healthy,
                latencyMs: latency,
                error: healthy ? undefined : `Executable "${this.defaultExecutable}" not found on system PATH.`,
            };
        }
        catch (err) {
            return {
                healthy: false,
                latencyMs: Date.now() - start,
                error: `CLI executable check failed: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    }
    async generateStream(prompt, options = {}, signal) {
        if (signal?.aborted) {
            throw new Error('CLI execution cancelled by AbortSignal.');
        }
        const command = options.executable || this.defaultExecutable;
        const args = options.args || [...this.defaultArgs, prompt];
        const cwd = options.cwd || process.cwd();
        const env = options.env || {};
        let onTokenCb;
        let onCompleteCb;
        let onErrorCb;
        const stream = {
            onToken: (cb) => { onTokenCb = cb; return stream; },
            onComplete: (cb) => { onCompleteCb = cb; return stream; },
            onError: (cb) => { onErrorCb = cb; return stream; },
            cancel: () => {
                if (this.activeSession) {
                    this.cliManager.destroySession(this.activeSession.sessionId);
                    this.activeSession = null;
                }
            },
        };
        try {
            const session = await this.cliManager.createSession({
                command,
                args,
                cwd,
                env,
                timeoutMs: options.timeoutMs || 60000,
                signal,
            });
            this.activeSession = session;
            let fullText = '';
            session.process.stream.on('line', (line) => {
                if (signal?.aborted)
                    return;
                onTokenCb?.(line + '\n');
                fullText += line + '\n';
            });
            session.process.stream.on('stderr', (errText) => {
                if (signal?.aborted)
                    return;
                onTokenCb?.(`[stderr] ${errText}`);
                fullText += `[stderr] ${errText}`;
            });
            const checkInterval = setInterval(() => {
                if (signal?.aborted) {
                    clearInterval(checkInterval);
                    this.cliManager.destroySession(session.sessionId);
                    onErrorCb?.(new Error('CLI process execution cancelled by AbortSignal.'));
                    return;
                }
                const status = session.status();
                if (status === 'idle' || status === 'terminated' || status === 'failed') {
                    clearInterval(checkInterval);
                    this.activeSession = null;
                    if (status === 'failed') {
                        onErrorCb?.(new Error(`CLI process "${command}" exited with status "${status}".`));
                    }
                    else {
                        onCompleteCb?.(fullText.trim() || `[${this.name} execution completed]`);
                    }
                }
            }, 100);
        }
        catch (err) {
            setTimeout(() => {
                onErrorCb?.(err instanceof Error ? err : new Error(String(err)));
            }, 10);
        }
        return stream;
    }
    async listAvailableModels() {
        return [`${this.id}-default`];
    }
}
exports.BaseCLIRuntime = BaseCLIRuntime;
//# sourceMappingURL=cli-runtime.js.map