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
export const NON_RETRIABLE_CODES = new Set([
  'PLANNING_ERROR',
  'TOOL_NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFIGURATION_ERROR',
] as const);

export type ErrorCode =
  | 'PLANNING_ERROR'
  | 'TOOL_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'NETWORK'
  | 'TOOL_ERROR'
  | 'UNKNOWN';

export function isNonRetriable(err: unknown): boolean {
  if (err instanceof ForgeError) {
    return NON_RETRIABLE_CODES.has(err.code as any);
  }
  if (err && typeof err === 'object') {
    const code = (err as any).code;
    const msg = String((err as any).message || '');
    if (code === 'ENOENT' || msg.includes('ENOENT') || msg.includes('no such file or directory') || msg.includes('does not exist')) {
      return true;
    }
  }
  return false;
}

// ── Base Error ─────────────────────────────────────────────────────────────────

export class ForgeError extends Error {
  readonly code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

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
export class PlanningError extends ForgeError {
  readonly taskId?: string;

  constructor(message: string, taskId?: string) {
    super(message, 'PLANNING_ERROR');
    this.taskId = taskId;
  }
}

export class ValidationError extends ForgeError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class ConfigurationError extends ForgeError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR');
  }
}
