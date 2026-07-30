/**
 * cli-session.ts — Phase 19 Generic CLI Runtime & Session Management
 *
 * Contains both legacy CLISession (for backward compatibility with existing CLI runtimes)
 * and CLIGenericSession for the Phase 19 generic CLI adapter foundation.
 */

import { CLIProcess } from './cli-process';
import type { CLISessionInfo, CLISessionOptions, CLISessionStatus } from './cli-types';
import type { ExternalRuntimeState } from '../external/external-types';

// ─── Legacy CLISession (Backward Compatibility) ───────────────────────────────

export class CLISession {
  readonly process: CLIProcess;
  readonly startTime: number;

  constructor(
    readonly sessionId: string,
    readonly command: string,
    readonly args: string[] = [],
    readonly options: CLISessionOptions = {}
  ) {
    this.process = new CLIProcess(command, args, options);
    this.startTime = Date.now();
  }

  start(): void {
    this.process.spawn();
  }

  restart(): void {
    this.process.restart();
  }

  destroy(): void {
    this.process.terminate();
  }

  status(): CLISessionStatus {
    return this.process.status();
  }

  getInfo(): CLISessionInfo {
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

// ─── Phase 19 Generic CLI Session ─────────────────────────────────────────────

export interface CLIToolCallRecord {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  timestamp: number;
}

export class CLIGenericSession {
  readonly sessionId: string;
  readonly runtimeId: string;
  readonly adapterId: string;
  readonly workspace: string;
  readonly cwd: string;
  readonly startTime: number;

  private state: ExternalRuntimeState = 'uninitialized';
  private logs: string[] = [];
  private accumulatedTokens: number = 0;
  private toolCalls: CLIToolCallRecord[] = [];

  constructor(options: {
    sessionId: string;
    runtimeId: string;
    adapterId: string;
    workspace: string;
    cwd?: string;
  }) {
    this.sessionId = options.sessionId;
    this.runtimeId = options.runtimeId;
    this.adapterId = options.adapterId;
    this.workspace = options.workspace;
    this.cwd = options.cwd || options.workspace;
    this.startTime = Date.now();
  }

  getState(): ExternalRuntimeState {
    return this.state;
  }

  setState(state: ExternalRuntimeState): void {
    this.state = state;
  }

  appendLog(line: string): void {
    this.logs.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    if (this.logs.length > 1000) {
      this.logs.shift();
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

  recordToolCall(toolName: string, args: Record<string, unknown>): void {
    this.toolCalls.push({
      id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      toolName,
      args,
      timestamp: Date.now(),
    });
  }

  getToolCalls(): CLIToolCallRecord[] {
    return [...this.toolCalls];
  }
}
