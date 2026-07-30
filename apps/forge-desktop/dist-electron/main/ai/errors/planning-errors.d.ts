/**
 * planning-errors.ts
 *
 * Typed error hierarchy for planning and execution failures.
 *
 * The ExecutionScheduler uses these error codes to classify whether a
 * failed task should be retried:
 *
 *   RETRIABLE errors:       TIMEOUT, NETWORK, RATE_LIMIT
 *   NON-RETRIABLE errors:   PLANNING_ERROR, TOOL_NOT_FOUND, VALIDATION_ERROR, CONFIGURATION_ERROR
 *
 * Non-retriable errors represent deterministic configuration or planning
 * failures. Retrying them wastes time and obscures the true cause.
 */
/** Codes that the ExecutionScheduler must NEVER retry. */
export declare const NON_RETRIABLE_CODES: Set<"TOOL_NOT_FOUND" | "PLANNING_ERROR" | "VALIDATION_ERROR" | "CONFIGURATION_ERROR">;
export type ErrorCode = 'PLANNING_ERROR' | 'TOOL_NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFIGURATION_ERROR' | 'TIMEOUT' | 'RATE_LIMIT' | 'NETWORK' | 'TOOL_ERROR' | 'UNKNOWN';
export declare function isNonRetriable(err: unknown): boolean;
export declare class ForgeError extends Error {
    readonly code: ErrorCode;
    constructor(message: string, code: ErrorCode);
}
/**
 * PlanningError — thrown when the planner produces an invalid plan.
 *
 * Examples:
 *   - A task is missing its toolCall property
 *   - The planner emitted an undefined toolId
 *   - The execution graph contains a cycle
 *
 * These are deterministic configuration failures. The scheduler must
 * surface them immediately without retry so the UI can display the
 * real cause rather than masking it behind multiple failed attempts.
 */
export declare class PlanningError extends ForgeError {
    readonly taskId?: string;
    constructor(message: string, taskId?: string);
}
export declare class ValidationError extends ForgeError {
    constructor(message: string);
}
export declare class ConfigurationError extends ForgeError {
    constructor(message: string);
}
