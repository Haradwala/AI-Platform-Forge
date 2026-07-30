/**
 * incremental-indexer.ts — Phase 25-28 Incremental Workspace Indexer
 *
 * Listens to file changes to update intelligence caches incrementally.
 */
export declare class IncrementalIndexer {
    private dirtyFiles;
    private isIndexing;
    notifyFileChanged(filePath: string): void;
    notifyFileDeleted(filePath: string): void;
    processDirtyQueue(onUpdate: (files: string[]) => Promise<void>): Promise<void>;
}
