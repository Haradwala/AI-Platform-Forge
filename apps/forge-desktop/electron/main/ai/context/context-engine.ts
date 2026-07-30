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

import type {
  IContextEngine,
  IStructuredContext,
  IEditorContext,
  IWorkspaceService,
  IThemeService,
} from '../../container/service-interfaces';
import { RepositoryIndexer } from './repository-indexer';
import {
  getAllContextSources,
  type IContextSource,
  type GatherOptions,
} from './context-sources';
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

export class ContextEngine implements IContextEngine {
  readonly indexer: RepositoryIndexer;
  private readonly selector: ContextSelector;
  private readonly budget: ContextBudget;
  private readonly sources: IContextSource[];

  constructor(
    private readonly workspaceService?: IWorkspaceService,
    private readonly themeService?: IThemeService,
    indexer?: RepositoryIndexer,
    selector?: ContextSelector,
    budget?: ContextBudget,
    sources?: IContextSource[]
  ) {
    this.indexer = indexer || new RepositoryIndexer();
    this.selector = selector || new ContextSelector();
    this.budget = budget || new ContextBudget();
    this.sources = sources || getAllContextSources();
  }

  /**
   * Backwards-compatible context collection method.
   */
  async collectContext(editorState: IEditorContext): Promise<IStructuredContext> {
    const rootPath = this.workspaceService ? this.workspaceService.getRootPath() : null;
    const activeThemeId = this.themeService ? this.themeService.getActiveTheme() : 'dark';

    return {
      timestamp: new Date().toISOString(),
      editor: {
        activeFilePath: editorState.activeFilePath || null,
        openFilePaths: editorState.openFilePaths || [],
        currentSelection: editorState.currentSelection || null,
        cursorPosition: editorState.cursorPosition || null,
      },
      workspace: {
        rootPath,
        recentCommands: [],
        activeThemeId,
        gitBranchPlaceholder: 'main',
      },
    };
  }

  /**
   * Phase 6 workspace context snapshot pipeline.
   */
  async gatherSnapshot(options: ContextEngineGatherOptions): Promise<ContextSnapshot> {
    const start = Date.now();

    // 1. AbortSignal check
    if (options.signal?.aborted) {
      throw new Error('Context gathering was cancelled by AbortSignal.');
    }

    // 2. Incremental Indexing
    if (options.workspaceFiles && options.workspaceFiles.length > 0) {
      await this.indexer.indexWorkspace(options.workspaceFiles, options.signal);
    }

    // Symbol lookup for user goal
    if (options.userGoal && (!options.symbols || options.symbols.length === 0)) {
      const foundSymbols = this.indexer.searchSymbols(options.userGoal);
      if (foundSymbols.length > 0) {
        options.symbols = foundSymbols;
      }
    }

    if (options.signal?.aborted) {
      throw new Error('Context gathering was cancelled by AbortSignal.');
    }

    // 3. Gather from all 10 independent context sources asynchronously
    const gatherPromises = this.sources.map((src) => src.gather(options));
    const rawResults = await Promise.all(gatherPromises);
    const allRawItems = rawResults.flat();

    if (options.signal?.aborted) {
      throw new Error('Context gathering was cancelled by AbortSignal.');
    }

    // 4. Context Selection & Ranking
    const rankedItems = this.selector.selectAndRank(allRawItems, {
      userGoal: options.userGoal,
      activeFilePath: options.activeFilePath,
      indexer: this.indexer,
    });

    // 5. Token Budget Enforcement
    const maxTokens = options.maxTokens ?? 4096;
    const budgetResult = this.budget.enforceBudget(rankedItems, maxTokens);

    return {
      timestamp: new Date().toISOString(),
      userGoal: options.userGoal,
      items: budgetResult.accepted,
      totalTokens: budgetResult.totalTokens,
      maxTokenBudget: maxTokens,
      truncated: budgetResult.truncated,
      indexedFileCount: this.indexer.getAllFiles().length,
      durationMs: Date.now() - start,
    };
  }
}
