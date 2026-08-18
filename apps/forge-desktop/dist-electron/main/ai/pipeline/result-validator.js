"use strict";
/**
 * result-validator.ts — Result Contract Validator
 *
 * Validates normalized ExecutionResult envelopes against ExecutionResultKind schemas.
 * Returns detailed ValidationResult objects for runtime assertions and debugging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultValidator = void 0;
const execution_result_kind_1 = require("../contracts/execution-result-kind");
class ResultValidator {
    validate(result) {
        const errors = [];
        const warnings = [];
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
        const payload = (result.payload ?? result);
        if (!payload || typeof payload !== 'object') {
            errors.push('ExecutionResult payload is missing or not an object');
            return { valid: false, errors, warnings };
        }
        switch (result.kind) {
            case execution_result_kind_1.ExecutionResultKind.FILE_LIST: {
                if (!Array.isArray(payload.files)) {
                    errors.push('FILE_LIST payload missing required "files" string array');
                }
                else if (payload.files.includes('workspace')) {
                    warnings.push('FILE_LIST contains placeholder entry "workspace"');
                }
                break;
            }
            case execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS: {
                if (typeof payload.filesCount !== 'number') {
                    errors.push('WORKSPACE_STATS payload missing required "filesCount" number');
                }
                break;
            }
            case execution_result_kind_1.ExecutionResultKind.FILE_CONTENT: {
                if (typeof payload.content !== 'string') {
                    errors.push('FILE_CONTENT payload missing required "content" string');
                }
                if (typeof payload.filePath !== 'string') {
                    errors.push('FILE_CONTENT payload missing required "filePath" string');
                }
                break;
            }
            case execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS: {
                if (!Array.isArray(payload.results)) {
                    errors.push('SEARCH_RESULTS payload missing required "results" array');
                }
                break;
            }
            case execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT: {
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
exports.ResultValidator = ResultValidator;
//# sourceMappingURL=result-validator.js.map