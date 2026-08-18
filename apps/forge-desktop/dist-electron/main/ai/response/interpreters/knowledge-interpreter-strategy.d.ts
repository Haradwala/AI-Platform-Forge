/**
 * knowledge-interpreter-strategy.ts
 *
 * Modular strategy implementations converting normalized ExecutionResult<T>
 * envelopes into decoupled KnowledgeFact objects.
 */
import { ExecutionResultKind } from '../../contracts/execution-result-kind';
import type { ExecutionResult } from '../../contracts/execution-envelope';
import type { KnowledgeFact } from '../response-types';
export interface IKnowledgeInterpreter {
    readonly kind: ExecutionResultKind;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class WorkspaceStatsKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.WORKSPACE_STATS;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class FileListKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.FILE_LIST;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class SearchResultsKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.SEARCH_RESULTS;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class FileContentKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.FILE_CONTENT;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class TerminalOutputKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.TERMINAL_OUTPUT;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class GitDiffKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.GIT_DIFF;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
export declare class ErrorTraceKnowledgeInterpreter implements IKnowledgeInterpreter {
    readonly kind = ExecutionResultKind.ERROR_TRACE;
    interpret(result: ExecutionResult<any>): KnowledgeFact[];
}
