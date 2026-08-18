/**
 * result-validator.ts — Result Contract Validator
 *
 * Validates normalized ExecutionResult envelopes against ExecutionResultKind schemas.
 * Returns detailed ValidationResult objects for runtime assertions and debugging.
 */
import { ExecutionResult, ValidationResult } from '../contracts/execution-envelope';
export declare class ResultValidator {
    validate<T>(result: ExecutionResult<T>): ValidationResult;
}
