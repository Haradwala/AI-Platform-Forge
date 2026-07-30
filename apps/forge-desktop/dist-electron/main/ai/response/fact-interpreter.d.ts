/**
 * fact-interpreter.ts
 *
 * FactInterpreter — interprets raw IExecutionResult[] items into
 * structured GroundedContext facts (RepositoryFact, TerminalFact).
 *
 * Responsibilities:
 *  - Separate interpretation logic from ResponseContextBuilder
 *  - Match tool execution results by toolId in a type-safe manner
 *  - Construct immutable RepositoryFact and TerminalFact discriminated unions
 *  - Preserve raw executionResults alongside interpreted facts
 *
 * Canonical Architecture Rule:
 *  Execution layers never produce prompts. Response layers never inspect tools.
 *  GroundedContext is the only contract crossing that boundary.
 */
import type { IExecutionResult } from '../execution/execution-types';
import type { GroundedContext } from './response-types';
export declare class FactInterpreter {
    /**
     * Interprets raw IExecutionResult[] items into a structured, immutable GroundedContext.
     */
    interpret(executionResults: readonly IExecutionResult[]): GroundedContext;
}
