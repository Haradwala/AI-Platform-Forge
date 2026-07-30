"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationError = exports.ValidationError = exports.PlanningError = exports.ForgeError = exports.NON_RETRIABLE_CODES = void 0;
exports.isNonRetriable = isNonRetriable;
/** Codes that the ExecutionScheduler must NEVER retry. */
exports.NON_RETRIABLE_CODES = new Set([
    'PLANNING_ERROR',
    'TOOL_NOT_FOUND',
    'VALIDATION_ERROR',
    'CONFIGURATION_ERROR',
]);
function isNonRetriable(err) {
    if (err instanceof ForgeError) {
        return exports.NON_RETRIABLE_CODES.has(err.code);
    }
    return false;
}
// ── Base Error ─────────────────────────────────────────────────────────────────
class ForgeError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ForgeError = ForgeError;
// ── Planning & Validation Errors (non-retriable) ──────────────────────────────
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
class PlanningError extends ForgeError {
    taskId;
    constructor(message, taskId) {
        super(message, 'PLANNING_ERROR');
        this.taskId = taskId;
    }
}
exports.PlanningError = PlanningError;
class ValidationError extends ForgeError {
    constructor(message) {
        super(message, 'VALIDATION_ERROR');
    }
}
exports.ValidationError = ValidationError;
class ConfigurationError extends ForgeError {
    constructor(message) {
        super(message, 'CONFIGURATION_ERROR');
    }
}
exports.ConfigurationError = ConfigurationError;
//# sourceMappingURL=planning-errors.js.map