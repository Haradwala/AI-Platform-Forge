/**
 * cli-process.ts
 *
 * Child process wrapper managing spawn, stdin writing, termination, restarts, timeouts,
 * and graceful process kill logic.
 */

import { spawn, type ChildProcess } from 'child_process';
import type { CLISessionOptions, CLISessionStatus } from './cli-types';
import { CLIStream } from './cli-stream';

export class CLIProcess {
  private childProcess: ChildProcess | null = null;
  private currentStatus: CLISessionStatus = 'idle';
  private timeoutTimer: NodeJS.Timeout | null = null;
  readonly stream = new CLIStream();

  constructor(
    private readonly command: string,
    private readonly args: string[] = [],
    private readonly options: CLISessionOptions
  ) {}

  spawn(): void {
    if (this.childProcess) {
      throw new Error(`CLI Process for "${this.command}" is already running.`);
    }

    if (this.options.signal?.aborted) {
      throw new Error('Process spawn cancelled by AbortSignal.');
    }

    const env = { ...process.env, ...(this.options.env || {}) };
    const cwd = this.options.cwd || process.cwd();

    this.childProcess = spawn(this.command, this.args, {
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

  write(input: string): void {
    if (!this.childProcess || !this.childProcess.stdin) {
      throw new Error(`Cannot write to process: process "${this.command}" is not running.`);
    }
    this.childProcess.stdin.write(input);
  }

  terminate(): void {
    if (!this.childProcess) return;
    this.currentStatus = 'terminated';
    this.clearTimeoutTimer();
    this.childProcess.kill('SIGTERM');

    // Force SIGKILL fallback if not exited within 2s
    const proc = this.childProcess;
    setTimeout(() => {
      if (proc && !proc.killed) {
        try { proc.kill('SIGKILL'); } catch (_) {}
      }
    }, 2000);
  }

  kill(): void {
    if (!this.childProcess) return;
    this.currentStatus = 'terminated';
    this.clearTimeoutTimer();
    try {
      this.childProcess.kill('SIGKILL');
    } catch (_) {}
    this.childProcess = null;
  }

  restart(): void {
    this.kill();
    this.spawn();
  }

  status(): CLISessionStatus {
    return this.currentStatus;
  }

  getPid(): number | undefined {
    return this.childProcess?.pid;
  }

  private clearTimeoutTimer(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }
}
