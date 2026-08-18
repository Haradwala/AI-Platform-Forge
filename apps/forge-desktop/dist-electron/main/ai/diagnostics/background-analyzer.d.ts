/**
 * background-analyzer.ts
 *
 * Sprint 86 Phase 6 — Background Analyzer
 *
 * Schedules debounced background re-indexing and diagnostic collection
 * on file changes.
 */
import type { WorkspaceSymbolIndexer } from '../workspace/symbol-indexer';
import type { DiagnosticsAggregator } from './diagnostics-aggregator';
export declare class BackgroundAnalyzer {
    private readonly indexer?;
    private readonly aggregator?;
    private readonly debounceMs;
    private timer;
    private pendingFiles;
    constructor(indexer?: WorkspaceSymbolIndexer | undefined, aggregator?: DiagnosticsAggregator | undefined, debounceMs?: number);
    /**
     * Schedule debounced analysis for a modified file.
     */
    scheduleAnalysis(filePath: string): void;
    /**
     * Run background analysis on all pending files immediately.
     */
    runAnalysis(): Promise<{
        processedFiles: string[];
    }>;
    /**
     * Cancel pending analysis.
     */
    cancel(): void;
    getPendingCount(): number;
}
