/**
 * repository-index-coordinator.ts — Central Indexing Coordinator & Live Event Watcher
 *
 * Coordinates full workspace scans, file hashing, batch parsing, and live incremental
 * re-indexing upon `workspace.file_changed` DesktopEventBus events.
 */
import type { IDesktopEventBus } from '../../container/service-interfaces';
import { IntelligenceDatabase } from '../storage/intelligence-database';
import { LanguageParserRegistry } from '../parser/language-parser-registry';
import { IntelligenceTimelinePublisher } from '../timeline/intelligence-timeline-publisher';
import { IndexJobStatus } from '../contracts/intelligence-types';
export declare class RepositoryIndexCoordinator {
    private readonly db;
    private readonly parserRegistry;
    private readonly timelinePublisher?;
    private readonly eventBus?;
    private activeJobs;
    private isPaused;
    constructor(db: IntelligenceDatabase, parserRegistry?: LanguageParserRegistry, timelinePublisher?: IntelligenceTimelinePublisher | undefined, eventBus?: IDesktopEventBus | undefined);
    /**
     * Starts a full or incremental repository indexing job across 1M+ LOC codebases.
     */
    startIndexing(workspaceRoot: string): Promise<IndexJobStatus>;
    /**
     * Indexes a single file incrementally. Computes hash to skip unchanged files.
     */
    indexSingleFile(workspaceRoot: string, filePath: string): Promise<void>;
    pauseIndexing(): void;
    resumeIndexing(): void;
    getIndexJob(jobId: string): Promise<IndexJobStatus | null>;
    private setupLiveWatcher;
    private collectFiles;
}
