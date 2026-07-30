/**
 * cli-runtime.ts
 *
 * Base abstract class for CLI Runtimes (Claude Code, Gemini CLI, Codex CLI, Aider, Goose).
 * Bridges external CLI tools managed by CLIManager to Forge's IAiRuntime layer.
 */

import type { IAiRuntime, RuntimeHealth } from '../runtime-types';
import type { IAiTokenStream, ICLIManager } from '../../../container/service-interfaces';
import type { CLISession } from '../../cli/cli-session';

export abstract class BaseCLIRuntime implements IAiRuntime {
  abstract readonly id: string;
  abstract readonly name: string;
  readonly runtimeType = 'cli';
  abstract readonly defaultExecutable: string;
  abstract readonly defaultArgs: string[];

  private activeSession: CLISession | null = null;

  constructor(protected readonly cliManager: ICLIManager) {}

  async healthCheck(): Promise<RuntimeHealth> {
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
    } catch (err) {
      return {
        healthy: false,
        latencyMs: Date.now() - start,
        error: `CLI executable check failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  async generateStream(
    prompt: string,
    options: Record<string, any> = {},
    signal?: AbortSignal
  ): Promise<IAiTokenStream> {
    if (signal?.aborted) {
      throw new Error('CLI execution cancelled by AbortSignal.');
    }

    const command = options.executable || this.defaultExecutable;
    const args = options.args || [...this.defaultArgs, prompt];
    const cwd = options.cwd || process.cwd();
    const env = options.env || {};

    let onTokenCb: ((token: string) => void) | undefined;
    let onCompleteCb: ((fullText: string) => void) | undefined;
    let onErrorCb: ((err: Error) => void) | undefined;

    const stream: IAiTokenStream = {
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

      session.process.stream.on('line', (line: string) => {
        if (signal?.aborted) return;
        onTokenCb?.(line + '\n');
        fullText += line + '\n';
      });

      session.process.stream.on('stderr', (errText: string) => {
        if (signal?.aborted) return;
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
          } else {
            onCompleteCb?.(fullText.trim() || `[${this.name} execution completed]`);
          }
        }
      }, 100);
    } catch (err) {
      setTimeout(() => {
        onErrorCb?.(err instanceof Error ? err : new Error(String(err)));
      }, 10);
    }

    return stream;
  }

  async listAvailableModels(): Promise<string[]> {
    return [`${this.id}-default`];
  }
}
