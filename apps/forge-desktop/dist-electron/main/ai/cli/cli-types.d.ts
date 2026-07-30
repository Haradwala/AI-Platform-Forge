/**
 * cli-types.ts
 *
 * Type definitions for the Forge CLI Process Engine.
 */
export type CLISessionStatus = 'idle' | 'running' | 'terminated' | 'failed';
export interface CLISessionOptions {
    command?: string;
    args?: string[];
    cwd?: string;
    env?: Record<string, string>;
    timeoutMs?: number;
    signal?: AbortSignal;
}
export interface CLISessionInfo {
    id: string;
    command: string;
    args: string[];
    pid?: number;
    status: CLISessionStatus;
    startTime: number;
    workingDirectory: string;
    environment: Record<string, string>;
}
