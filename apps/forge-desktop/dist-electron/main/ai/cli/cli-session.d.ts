/**
 * cli-session.ts — Phase 19 Generic CLI Runtime & Session Management
 *
 * Contains both legacy CLISession (for backward compatibility with existing CLI runtimes)
 * and CLIGenericSession for the Phase 19 generic CLI adapter foundation.
 */
import { CLIProcess } from './cli-process';
import type { CLISessionInfo, CLISessionOptions, CLISessionStatus } from './cli-types';
import type { ExternalRuntimeState } from '../external/external-types';
export declare class CLISession {
    readonly sessionId: string;
    readonly command: string;
    readonly args: string[];
    readonly options: CLISessionOptions;
    readonly process: CLIProcess;
    readonly startTime: number;
    constructor(sessionId: string, command: string, args?: string[], options?: CLISessionOptions);
    start(): void;
    restart(): void;
    destroy(): void;
    status(): CLISessionStatus;
    getInfo(): CLISessionInfo;
}
export interface CLIToolCallRecord {
    id: string;
    toolName: string;
    args: Record<string, unknown>;
    timestamp: number;
}
export declare class CLIGenericSession {
    readonly sessionId: string;
    readonly runtimeId: string;
    readonly adapterId: string;
    readonly workspace: string;
    readonly cwd: string;
    readonly startTime: number;
    private state;
    private logs;
    private accumulatedTokens;
    private toolCalls;
    constructor(options: {
        sessionId: string;
        runtimeId: string;
        adapterId: string;
        workspace: string;
        cwd?: string;
    });
    getState(): ExternalRuntimeState;
    setState(state: ExternalRuntimeState): void;
    appendLog(line: string): void;
    getLogs(): string[];
    addTokens(count: number): void;
    getTokens(): number;
    recordToolCall(toolName: string, args: Record<string, unknown>): void;
    getToolCalls(): CLIToolCallRecord[];
}
