/**
 * tool-execution-engine.ts
 *
 * Phase 4 — Unified Tool Execution Engine.
 *
 * Single, canonical execution engine shared across all AI runtimes and kernel.
 * Resolves tools from ToolRegistry, enforces AbortSignal and timeout limits,
 * normalizes all errors into structured ExecutionError hierarchy, and returns ToolResult.
 */

import type { IToolRegistry, ITool } from '../../container/service-interfaces';

// ─── Data Contracts ───────────────────────────────────────────────────────────

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

// ─── Error Hierarchy ──────────────────────────────────────────────────────────

export class ExecutionError extends Error {
  readonly code: string;

  constructor(message: string, code = 'EXECUTION_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ToolNotFoundError extends ExecutionError {
  constructor(toolId: string) {
    super(`Tool with ID "${toolId}" is not registered in ToolRegistry.`, 'TOOL_NOT_FOUND');
  }
}

export class ToolError extends ExecutionError {
  readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message, 'TOOL_ERROR');
    this.originalError = originalError;
  }
}

export class TimeoutError extends ExecutionError {
  constructor(timeoutMs: number) {
    super(`Tool execution timed out after ${timeoutMs}ms.`, 'TIMEOUT');
  }
}

export class CancelledError extends ExecutionError {
  constructor() {
    super('Tool execution was cancelled by AbortSignal.', 'CANCELLED');
  }
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IToolExecutionEngine {
  executeTool<TInput = any, TOutput = any>(
    invocation: ToolInvocation,
    context?: ExecutionContext
  ): Promise<ToolResult<TOutput>>;
}

// ─── Engine Implementation ────────────────────────────────────────────────────

export class ToolExecutionEngine implements IToolExecutionEngine {
  constructor(private readonly toolRegistry: IToolRegistry) {}

  async executeTool<TInput = any, TOutput = any>(
    invocation: ToolInvocation,
    context?: ExecutionContext
  ): Promise<ToolResult<TOutput>> {
    const start = Date.now();

    // 1. Resolve tool from registry
    const tool = this.toolRegistry.getById(invocation.id);
    if (!tool) {
      return {
        success: false,
        durationMs: Date.now() - start,
        error: new ToolNotFoundError(invocation.id),
      };
    }

    // 2. Check early cancellation
    if (context?.signal?.aborted) {
      return {
        success: false,
        durationMs: Date.now() - start,
        error: new CancelledError(),
      };
    }

    const timeoutMs = invocation.timeoutMs || context?.timeoutMs || 0;

    try {
      const result = await this.runWithTimeoutAndAbort<TOutput>(
        () => tool.execute(invocation.params),
        timeoutMs,
        context?.signal
      );

      return {
        success: true,
        data: result,
        durationMs: Date.now() - start,
      };
    } catch (err) {
      const durationMs = Date.now() - start;
      const normalizedError = this.normalizeError(err);
      return {
        success: false,
        durationMs,
        error: normalizedError,
      };
    }
  }

  private async runWithTimeoutAndAbort<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let timer: NodeJS.Timeout | null = null;
      let onAbort: (() => void) | null = null;

      const cleanup = () => {
        if (timer) clearTimeout(timer);
        if (signal && onAbort) {
          signal.removeEventListener('abort', onAbort);
        }
      };

      if (signal) {
        onAbort = () => {
          cleanup();
          reject(new CancelledError());
        };
        signal.addEventListener('abort', onAbort);
      }

      if (timeoutMs > 0) {
        timer = setTimeout(() => {
          cleanup();
          reject(new TimeoutError(timeoutMs));
        }, timeoutMs);
      }

      fn()
        .then((res) => {
          cleanup();
          resolve(res);
        })
        .catch((err) => {
          cleanup();
          reject(err);
        });
    });
  }

  private normalizeError(err: unknown): ExecutionError {
    if (err instanceof ExecutionError) {
      return err;
    }
    const message = err instanceof Error ? err.message : String(err);
    return new ToolError(message, err);
  }
}
