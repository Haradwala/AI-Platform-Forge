/**
 * external-session.ts — Phase 18 External Runtime Foundation
 *
 * Tracks active process session metadata, state transitions, execution logs, and token metrics.
 */
import type { ExternalSessionOptions, ExternalRuntimeState } from './external-types';
export declare class ExternalSession {
    readonly sessionId: string;
    readonly workspaceRoot: string;
    readonly runtimeId: string;
    readonly startTime: number;
    private state;
    private processId?;
    private logs;
    private accumulatedTokens;
    constructor(options: ExternalSessionOptions);
    getState(): ExternalRuntimeState;
    setState(state: ExternalRuntimeState): void;
    setProcessId(pid: number): void;
    getProcessId(): number | undefined;
    appendLog(line: string): void;
    getLogs(): string[];
    addTokens(count: number): void;
    getTokens(): number;
    getDurationMs(): number;
}
