/**
 * intent-analyzer.ts — Phase 25-28 Rich Intent Analysis Engine
 *
 * Converts natural language user prompts and task metadata into structured
 * ExecutionRequest schemas containing required capabilities, priority, complexity,
 * estimated tokens, and context size.
 */
import { ExecutionRequest } from '../contracts/execution-contracts';
export declare class IntentAnalyzer {
    /**
     * Analyzes natural language input and context to produce a structured ExecutionRequest.
     */
    analyze(intentText: string, workspaceRoot: string): ExecutionRequest;
}
