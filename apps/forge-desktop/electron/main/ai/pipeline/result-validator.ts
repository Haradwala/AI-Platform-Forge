/**
 * result-validator.ts — Result Contract Validator
 *
 * Validates normalized ExecutionResult envelopes against ExecutionResultKind schemas.
 * Returns detailed ValidationResult objects for runtime assertions and debugging.
 */

import { ExecutionResult, ValidationResult } from '../contracts/execution-envelope';
import { ExecutionResultKind } from '../contracts/execution-result-kind';

export class ResultValidator {
  validate<T>(result: ExecutionResult<T>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!result) {
      errors.push('ExecutionResult envelope is null or undefined');
      return { valid: false, errors, warnings };
    }

    if (result.version !== 1 && !result.kind) {
      // Plain tool result without envelope wrapping (e.g. noop tool)
      return { valid: true, errors: [], warnings: [] };
    }

    if (!result.success) {
      errors.push(`Tool execution failed: ${result.error || 'Unknown error'}`);
      return { valid: false, errors, warnings };
    }

    const payload = (result.payload ?? result) as Record<string, any>;
    if (!payload || typeof payload !== 'object') {
      errors.push('ExecutionResult payload is missing or not an object');
      return { valid: false, errors, warnings };
    }

    switch (result.kind) {
      case ExecutionResultKind.FILE_LIST: {
        if (!Array.isArray(payload.files)) {
          errors.push('FILE_LIST payload missing required "files" string array');
        } else if (payload.files.includes('workspace')) {
          warnings.push('FILE_LIST contains placeholder entry "workspace"');
        }
        break;
      }

      case ExecutionResultKind.WORKSPACE_STATS: {
        if (typeof payload.filesCount !== 'number') {
          errors.push('WORKSPACE_STATS payload missing required "filesCount" number');
        }
        break;
      }

      case ExecutionResultKind.FILE_CONTENT: {
        if (typeof payload.content !== 'string') {
          errors.push('FILE_CONTENT payload missing required "content" string');
        }
        if (typeof payload.filePath !== 'string') {
          errors.push('FILE_CONTENT payload missing required "filePath" string');
        }
        break;
      }

      case ExecutionResultKind.SEARCH_RESULTS: {
        if (!Array.isArray(payload.results)) {
          errors.push('SEARCH_RESULTS payload missing required "results" array');
        }
        break;
      }

      case ExecutionResultKind.TERMINAL_OUTPUT: {
        if (typeof payload.pid !== 'number' && typeof payload.command !== 'string') {
          warnings.push('TERMINAL_OUTPUT missing command/pid metadata');
        }
        break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
