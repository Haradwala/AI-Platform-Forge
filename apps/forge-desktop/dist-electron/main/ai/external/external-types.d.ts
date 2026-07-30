/**
 * external-types.ts — Phase 18 External Runtime Foundation
 *
 * Type definitions for generic external runtimes (CLI, daemon, container, SSH, MCP).
 */
export type ExternalRuntimeMode = 'cli' | 'daemon' | 'container' | 'ssh' | 'mcp';
export type ExternalTransportType = 'stdio' | 'pty' | 'http' | 'websocket';
export type ExternalRuntimeState = 'uninitialized' | 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
export interface ExternalRuntimeConfig {
    id: string;
    name: string;
    command: string;
    args?: string[];
    mode: ExternalRuntimeMode;
    transport: ExternalTransportType;
    cwd?: string;
    env?: Record<string, string>;
    timeoutMs?: number;
    usePty?: boolean;
}
export type StreamEventType = 'token' | 'message' | 'tool_call' | 'status' | 'error' | 'progress' | 'complete';
export interface NormalizedStreamEvent {
    type: StreamEventType;
    payload: {
        text?: string;
        message?: string;
        toolName?: string;
        toolArgs?: Record<string, unknown>;
        status?: string;
        progress?: number;
        error?: string;
        code?: number;
    };
    timestamp: number;
}
export interface ExternalProcessOptions {
    command: string;
    args: string[];
    cwd: string;
    env: Record<string, string>;
    usePty?: boolean;
}
export interface ExternalSessionOptions {
    sessionId: string;
    workspaceRoot: string;
    runtimeId: string;
}
