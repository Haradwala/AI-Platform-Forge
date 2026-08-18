"use strict";
/**
 * background-analyzer.ts
 *
 * Sprint 86 Phase 6 — Background Analyzer
 *
 * Schedules debounced background re-indexing and diagnostic collection
 * on file changes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundAnalyzer = void 0;
class BackgroundAnalyzer {
    indexer;
    aggregator;
    debounceMs;
    timer = null;
    pendingFiles = new Set();
    constructor(indexer, aggregator, debounceMs = 200) {
        this.indexer = indexer;
        this.aggregator = aggregator;
        this.debounceMs = debounceMs;
    }
    /**
     * Schedule debounced analysis for a modified file.
     */
    scheduleAnalysis(filePath) {
        this.pendingFiles.add(filePath);
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.runAnalysis();
        }, this.debounceMs);
    }
    /**
     * Run background analysis on all pending files immediately.
     */
    async runAnalysis() {
        const files = Array.from(this.pendingFiles);
        this.pendingFiles.clear();
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        for (const filePath of files) {
            if (this.indexer) {
                await this.indexer.updateFile(filePath);
            }
        }
        return { processedFiles: files };
    }
    /**
     * Cancel pending analysis.
     */
    cancel() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.pendingFiles.clear();
    }
    getPendingCount() {
        return this.pendingFiles.size;
    }
}
exports.BackgroundAnalyzer = BackgroundAnalyzer;
//# sourceMappingURL=background-analyzer.js.map