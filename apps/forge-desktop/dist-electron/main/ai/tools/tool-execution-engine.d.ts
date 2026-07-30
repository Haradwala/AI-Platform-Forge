/**
 * tool-execution-engine.ts
 *
 * Phase 4 — Unified Tool Execution Engine.
 *
 * Single, canonical execution engine shared across all AI runtimes and kernel.
 * Resolves tools from ToolRegistry, enforces AbortSignal and timeout limits,
 * normalizes all errors into structured ExecutionError hierarchy, and returns ToolResult.
 */
import type { IToolRegistry } from '../../container/service-interfaces';
export interface ToolInvocation {
    /** Target tool ID (e.g. 'read_file', 'write_file'). */
    id: string;
    /** Parameters to pass to the tool. */
    params: any;
    /** Timeout threshold in milliseconds. Optional. */
    timeoutMs?: number;
}
export interface ExecutionContext {
    /** Unique execution call identifier. */
    callId?: string;
    /** Optional parent call identifier for nested invocations. */
    parentId?: string;
    /** Optional AbortSignal to trigger cancellation. */
    signal?: AbortSignal;
    /** Default timeout in milliseconds for this execution context. */
    timeoutMs?: number;
    /** Arbitrary execution metadata. */
    metadata?: Record<string, any>;
}
export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: ExecutionError;
    durationMs: number;
}
export declare class ExecutionError extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class ToolNotFoundError extends ExecutionError {
    constructor(toolId: string);
}
export declare class ToolError extends ExecutionError {
    readonly originalError?: unknown;
    constructor(message: string, originalError?: unknown);
}
export declare class TimeoutError extends ExecutionError {
    constructor(timeoutMs: number);
}
export declare class CancelledError extends ExecutionError {
    constructor();
}
export interface IToolExecutionEngine {
    executeTool<TInput = any, TOutput = any>(invocation: ToolInvocation, context?: ExecutionContext): Promise<ToolResult<TOutput>>;
}
export declare class ToolExecutionEngine implements IToolExecutionEngine {
    private readonly toolRegistry;
    constructor(toolRegistry: IToolRegistry);
    executeTool<TInput = any, TOutput = any>(invocation: ToolInvocation, context?: ExecutionContext): Promise<ToolResult<TOutput>>;
    private runWithTimeoutAndAbort;
    private normalizeError;
}
