"use strict";
/**
 * tool-execution-engine.ts
 *
 * Phase 4 — Unified Tool Execution Engine.
 *
 * Single, canonical execution engine shared across all AI runtimes and kernel.
 * Resolves tools from ToolRegistry, enforces AbortSignal and timeout limits,
 * normalizes all errors into structured ExecutionError hierarchy, and returns ToolResult.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutionEngine = exports.CancelledError = exports.TimeoutError = exports.ToolError = exports.ToolNotFoundError = exports.ExecutionError = void 0;
// ─── Error Hierarchy ──────────────────────────────────────────────────────────
class ExecutionError extends Error {
    code;
    constructor(message, code = 'EXECUTION_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ExecutionError = ExecutionError;
class ToolNotFoundError extends ExecutionError {
    constructor(toolId) {
        super(`Tool with ID "${toolId}" is not registered in ToolRegistry.`, 'TOOL_NOT_FOUND');
    }
}
exports.ToolNotFoundError = ToolNotFoundError;
class ToolError extends ExecutionError {
    originalError;
    constructor(message, originalError) {
        super(message, 'TOOL_ERROR');
        this.originalError = originalError;
    }
}
exports.ToolError = ToolError;
class TimeoutError extends ExecutionError {
    constructor(timeoutMs) {
        super(`Tool execution timed out after ${timeoutMs}ms.`, 'TIMEOUT');
    }
}
exports.TimeoutError = TimeoutError;
class CancelledError extends ExecutionError {
    constructor() {
        super('Tool execution was cancelled by AbortSignal.', 'CANCELLED');
    }
}
exports.CancelledError = CancelledError;
// ─── Engine Implementation ────────────────────────────────────────────────────
class ToolExecutionEngine {
    toolRegistry;
    constructor(toolRegistry) {
        this.toolRegistry = toolRegistry;
    }
    async executeTool(invocation, context) {
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
            const result = await this.runWithTimeoutAndAbort(() => tool.execute(invocation.params), timeoutMs, context?.signal);
            return {
                success: true,
                data: result,
                durationMs: Date.now() - start,
            };
        }
        catch (err) {
            const durationMs = Date.now() - start;
            const normalizedError = this.normalizeError(err);
            return {
                success: false,
                durationMs,
                error: normalizedError,
            };
        }
    }
    async runWithTimeoutAndAbort(fn, timeoutMs, signal) {
        return new Promise((resolve, reject) => {
            let timer = null;
            let onAbort = null;
            const cleanup = () => {
                if (timer)
                    clearTimeout(timer);
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
    normalizeError(err) {
        if (err instanceof ExecutionError) {
            return err;
        }
        const message = err instanceof Error ? err.message : String(err);
        return new ToolError(message, err);
    }
}
exports.ToolExecutionEngine = ToolExecutionEngine;
//# sourceMappingURL=tool-execution-engine.js.map