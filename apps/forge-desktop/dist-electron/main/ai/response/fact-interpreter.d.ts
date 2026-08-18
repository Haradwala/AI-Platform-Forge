/**
 * fact-interpreter.ts
 *
 * FactInterpreter / KnowledgeInterpreter — delegates execution result
 * interpretation to KnowledgeInterpreterRegistry strategy handlers.
 */
import type { IExecutionResult } from '../execution/execution-types';
import type { GroundedContext } from './response-types';
import { KnowledgeInterpreterRegistry } from './interpreters/knowledge-interpreter-registry';
export declare class FactInterpreter {
    private readonly registry;
    constructor(registry?: KnowledgeInterpreterRegistry);
    /**
     * Interprets normalized ExecutionResult envelopes into GroundedContext facts.
     */
    interpret(executionResults: readonly IExecutionResult[]): GroundedContext;
}
