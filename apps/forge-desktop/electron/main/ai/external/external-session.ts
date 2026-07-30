/**
 * external-session.ts — Phase 18 External Runtime Foundation
 *
 * Tracks active process session metadata, state transitions, execution logs, and token metrics.
 */

import type { ExternalSessionOptions, ExternalRuntimeState } from './external-types';

export class ExternalSession {
  readonly sessionId: string;
  readonly workspaceRoot: string;
  readonly runtimeId: string;
  readonly startTime: number;

  private state: ExternalRuntimeState = 'uninitialized';
  private processId?: number;
  private logs: string[] = [];
  private accumulatedTokens: number = 0;

  constructor(options: ExternalSessionOptions) {
    this.sessionId = options.sessionId;
    this.workspaceRoot = options.workspaceRoot;
    this.runtimeId = options.runtimeId;
    this.startTime = Date.now();
  }

  getState(): ExternalRuntimeState {
    return this.state;
  }

  setState(state: ExternalRuntimeState): void {
    this.state = state;
  }

  setProcessId(pid: number): void {
    this.processId = pid;
  }

  getProcessId(): number | undefined {
    return this.processId;
  }

  appendLog(line: string): void {
    this.logs.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    if (this.logs.length > 500) {
      this.logs.shift(); // Bound max log history
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  addTokens(count: number): void {
    this.accumulatedTokens += count;
  }

  getTokens(): number {
    return this.accumulatedTokens;
  }

  getDurationMs(): number {
    return Date.now() - this.startTime;
  }
}
