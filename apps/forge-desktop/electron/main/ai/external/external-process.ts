/**
 * external-process.ts — Phase 18 External Runtime Foundation
 *
 * Low-level child process wrapper managing spawn, stdio, signals, cwd, env, and exit codes.
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import type { ExternalProcessOptions } from './external-types';

export class ExternalProcess extends EventEmitter {
  private child: ChildProcess | null = null;
  private isRunningState: boolean = false;
  private exitCode: number | null = null;

  constructor(private readonly options: ExternalProcessOptions) {
    super();
  }

  /**
   * Spawns the underlying process.
   */
  spawnProcess(): void {
    if (this.child) {
      throw new Error('[ExternalProcess] Process is already spawned.');
    }

    const { command, args, cwd, env } = this.options;

    this.child = spawn(command, args, {
      cwd,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    this.isRunningState = true;

    this.child.stdout?.on('data', (data: Buffer) => {
      this.emit('stdout', data.toString('utf-8'));
    });

    this.child.stderr?.on('data', (data: Buffer) => {
      this.emit('stderr', data.toString('utf-8'));
    });

    this.child.on('error', (err: Error) => {
      this.isRunningState = false;
      this.emit('error', err);
    });

    this.child.on('exit', (code: number | null, signal: string | null) => {
      this.isRunningState = false;
      this.exitCode = code;
      this.emit('exit', { code: code ?? 0, signal });
    });
  }

  /**
   * Writes payload data to process stdin.
   */
  writeStdin(data: string): boolean {
    if (!this.child || !this.child.stdin || !this.isRunningState) {
      return false;
    }
    return this.child.stdin.write(data);
  }

  /**
   * Sends a POSIX or Windows signal to the process.
   */
  kill(signal: NodeJS.Signals = 'SIGTERM'): void {
    if (this.child && this.isRunningState) {
      this.child.kill(signal);
    }
  }

  isRunning(): boolean {
    return this.isRunningState;
  }

  getPid(): number | undefined {
    return this.child?.pid;
  }

  getExitCode(): number | null {
    return this.exitCode;
  }

  dispose(): void {
    if (this.isRunningState) {
      this.kill('SIGKILL');
    }
    this.child = null;
    this.removeAllListeners();
  }
}
