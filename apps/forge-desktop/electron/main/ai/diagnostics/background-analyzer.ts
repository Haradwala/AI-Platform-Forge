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

export class BackgroundAnalyzer {
  private timer: NodeJS.Timeout | null = null;
  private pendingFiles = new Set<string>();

  constructor(
    private readonly indexer?: WorkspaceSymbolIndexer,
    private readonly aggregator?: DiagnosticsAggregator,
    private readonly debounceMs = 200
  ) {}

  /**
   * Schedule debounced analysis for a modified file.
   */
  scheduleAnalysis(filePath: string): void {
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
  async runAnalysis(): Promise<{ processedFiles: string[] }> {
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
  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pendingFiles.clear();
  }

  getPendingCount(): number {
    return this.pendingFiles.size;
  }
}
