/**
 * execution-envelope.ts — Versioned Execution Result Envelope & Validation Types
 */
import { ExecutionGoal } from './execution-goal';
import { ExecutionResultKind } from './execution-result-kind';
export interface ExecutionMetadata {
    readonly toolId: string;
    readonly durationMs: number;
    readonly cached: boolean;
    readonly source: string;
    readonly timestamp: string;
    readonly warnings?: string[];
}
export interface ExecutionResult<T = any> {
    readonly version: 1;
    readonly success: boolean;
    readonly goal: ExecutionGoal;
    readonly kind: ExecutionResultKind;
    readonly payload: T;
    readonly metadata: ExecutionMetadata;
    readonly error?: string;
}
export interface ValidationResult {
    readonly valid: boolean;
    readonly errors: string[];
    readonly warnings: string[];
}
