/**
 * execution-router.ts — Semantic Goal Router & Execution Sources
 *
 * Routes semantic ExecutionGoal intents across execution sources (MemoryExecutionSource, WorkspaceExecutionSource).
 * MemoryExecutionSource queries session.entities (IEntityStore) directly without prompt parsing.
 */
import type { ISessionServices } from '../session/session-context-manager';
import { ExecutionGoal } from '../contracts/execution-goal';
import { ExecutionEntityExtractor } from '../memory/extraction/execution-entity-extractor';
export { ExecutionGoal } from '../contracts/execution-goal';
export { ExecutionResultKind } from '../contracts/execution-result-kind';
export interface IExecutionSourceResult {
    success: boolean;
    data: any;
    formattedResponse?: string;
    source: string;
}
export interface IExecutionSource {
    readonly id: string;
    readonly priority: number;
    canResolve(goal: ExecutionGoal, session?: ISessionServices): boolean;
    resolve(goal: ExecutionGoal, session?: ISessionServices): Promise<IExecutionSourceResult | null>;
}
export declare class MemoryExecutionSource implements IExecutionSource {
    private readonly extractor;
    readonly id = "memory_execution_source";
    readonly priority = 1;
    constructor(extractor?: ExecutionEntityExtractor);
    canResolve(goal: ExecutionGoal, session?: ISessionServices): boolean;
    resolve(goal: ExecutionGoal, session?: ISessionServices): Promise<IExecutionSourceResult | null>;
}
export declare class WorkspaceExecutionSource implements IExecutionSource {
    readonly id = "workspace_execution_source";
    readonly priority = 10;
    canResolve(): boolean;
    resolve(): Promise<IExecutionSourceResult | null>;
}
export declare class ExecutionRouter {
    readonly sources: IExecutionSource[];
    registerSource(source: IExecutionSource): void;
    resolveGoal(goal: ExecutionGoal, session?: ISessionServices): Promise<IExecutionSourceResult | null>;
}
