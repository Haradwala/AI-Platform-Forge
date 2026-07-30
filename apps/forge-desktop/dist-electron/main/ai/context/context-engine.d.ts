/**
 * context-engine.ts
 *
 * Phase 6 — Workspace Context Engine.
 *
 * Provider-agnostic workspace context gathering pipeline:
 * Workspace -> Repository Index -> Context Selection -> Token Budget -> ContextSnapshot
 *
 * Fully supports AbortSignal, 10 independent context sources, AST/symbol indexing,
 * multi-signal scoring, deduplication, and token budget enforcement.
 */
import type { IContextEngine, IStructuredContext, IEditorContext, IWorkspaceService, IThemeService } from '../../container/service-interfaces';
import { RepositoryIndexer } from './repository-indexer';
import { type IContextSource, type GatherOptions } from './context-sources';
import { ContextSelector, type ScoredContextItem } from './context-selector';
import { ContextBudget } from './context-budget';
export interface ContextEngineGatherOptions extends GatherOptions {
    maxTokens?: number;
}
export interface ContextSnapshot {
    timestamp: string;
    userGoal: string;
    items: ScoredContextItem[];
    totalTokens: number;
    maxTokenBudget: number;
    truncated: boolean;
    indexedFileCount: number;
    durationMs: number;
}
export declare class ContextEngine implements IContextEngine {
    private readonly workspaceService?;
    private readonly themeService?;
    readonly indexer: RepositoryIndexer;
    private readonly selector;
    private readonly budget;
    private readonly sources;
    constructor(workspaceService?: IWorkspaceService | undefined, themeService?: IThemeService | undefined, indexer?: RepositoryIndexer, selector?: ContextSelector, budget?: ContextBudget, sources?: IContextSource[]);
    /**
     * Backwards-compatible context collection method.
     */
    collectContext(editorState: IEditorContext): Promise<IStructuredContext>;
    /**
     * Phase 6 workspace context snapshot pipeline.
     */
    gatherSnapshot(options: ContextEngineGatherOptions): Promise<ContextSnapshot>;
}
