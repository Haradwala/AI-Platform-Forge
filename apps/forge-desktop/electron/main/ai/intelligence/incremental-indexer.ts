/**
 * incremental-indexer.ts — Phase 25-28 Incremental Workspace Indexer
 *
 * Listens to file changes to update intelligence caches incrementally.
 */

export class IncrementalIndexer {
  private dirtyFiles: Set<string> = new Set();
  private isIndexing = false;

  notifyFileChanged(filePath: string): void {
    this.dirtyFiles.add(filePath);
  }

  notifyFileDeleted(filePath: string): void {
    this.dirtyFiles.add(filePath);
  }

  async processDirtyQueue(onUpdate: (files: string[]) => Promise<void>): Promise<void> {
    if (this.isIndexing || this.dirtyFiles.size === 0) return;
    this.isIndexing = true;
    const batch = Array.from(this.dirtyFiles);
    this.dirtyFiles.clear();

    try {
      await onUpdate(batch);
    } catch (err) {
      console.error('[IncrementalIndexer] Error processing incremental batch:', err);
    } finally {
      this.isIndexing = false;
    }
  }
}
