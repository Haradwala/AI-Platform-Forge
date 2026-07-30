"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEngine = void 0;
const repository_indexer_1 = require("./repository-indexer");
const context_sources_1 = require("./context-sources");
const context_selector_1 = require("./context-selector");
const context_budget_1 = require("./context-budget");
class ContextEngine {
    workspaceService;
    themeService;
    indexer;
    selector;
    budget;
    sources;
    constructor(workspaceService, themeService, indexer, selector, budget, sources) {
        this.workspaceService = workspaceService;
        this.themeService = themeService;
        this.indexer = indexer || new repository_indexer_1.RepositoryIndexer();
        this.selector = selector || new context_selector_1.ContextSelector();
        this.budget = budget || new context_budget_1.ContextBudget();
        this.sources = sources || (0, context_sources_1.getAllContextSources)();
    }
    /**
     * Backwards-compatible context collection method.
     */
    async collectContext(editorState) {
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
    async gatherSnapshot(options) {
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
exports.ContextEngine = ContextEngine;
//# sourceMappingURL=context-engine.js.map