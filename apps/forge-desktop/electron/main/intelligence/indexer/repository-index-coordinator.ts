/**
 * repository-index-coordinator.ts — Central Indexing Coordinator & Live Event Watcher
 *
 * Coordinates full workspace scans, file hashing, batch parsing, and live incremental
 * re-indexing upon `workspace.file_changed` DesktopEventBus events.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { IDesktopEventBus } from '../../container/service-interfaces';
import { IntelligenceDatabase } from '../storage/intelligence-database';
import { LanguageParserRegistry } from '../parser/language-parser-registry';
import { IntelligenceTimelinePublisher } from '../timeline/intelligence-timeline-publisher';
import { IndexJobStatus, FileMetadata } from '../contracts/intelligence-types';

export class RepositoryIndexCoordinator {
  private activeJobs = new Map<string, IndexJobStatus>();
  private isPaused = false;

  constructor(
    private readonly db: IntelligenceDatabase,
    private readonly parserRegistry: LanguageParserRegistry = new LanguageParserRegistry(),
    private readonly timelinePublisher?: IntelligenceTimelinePublisher,
    private readonly eventBus?: IDesktopEventBus
  ) {
    this.setupLiveWatcher();
  }

  /**
   * Starts a full or incremental repository indexing job across 1M+ LOC codebases.
   */
  async startIndexing(workspaceRoot: string): Promise<IndexJobStatus> {
    await this.db.initialize(workspaceRoot);
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const startTime = Date.now();

    const job: IndexJobStatus = {
      id: jobId,
      workspaceRoot,
      status: 'running',
      startedAt: startTime,
      filesScanned: 0,
      filesIndexed: 0,
      errorsCount: 0,
    };

    this.activeJobs.set(jobId, job);
    await this.db.saveIndexJob(job);
    if (this.timelinePublisher) this.timelinePublisher.publishIndexingStarted(job);

    try {
      const filesToProcess = this.collectFiles(workspaceRoot);
      job.filesScanned = filesToProcess.length;

      for (const filePath of filesToProcess) {
        if (this.isPaused) break;
        await this.indexSingleFile(workspaceRoot, filePath);
        job.filesIndexed++;
      }

      job.status = 'completed';
      job.finishedAt = Date.now();
      job.durationMs = job.finishedAt - startTime;
    } catch (err: any) {
      job.status = 'failed';
      job.errorsCount++;
      job.details = { error: err.message || String(err) };
    } finally {
      await this.db.saveIndexJob(job);
      if (this.timelinePublisher) this.timelinePublisher.publishIndexingCompleted(job);
    }

    return job;
  }

  /**
   * Indexes a single file incrementally. Computes hash to skip unchanged files.
   */
  async indexSingleFile(workspaceRoot: string, filePath: string): Promise<void> {
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    const stat = fs.statSync(filePath);

    const existingFile = await this.db.getFileByPath(filePath);
    if (existingFile && existingFile.hash === hash) {
      // Skip indexing if hash is unchanged
      return;
    }

    const fileId = `file_${crypto.createHash('md5').update(filePath).digest('hex')}`;
    const fileMeta: FileMetadata = {
      id: fileId,
      path: filePath,
      hash,
      language: path.extname(filePath).replace('.', '') || 'unknown',
      sizeBytes: stat.size,
      lastIndexedAt: Date.now(),
    };

    await this.db.saveFile(fileMeta);

    // Parse symbols and relationship edges
    const parseResult = await this.parserRegistry.parseFile(filePath, content, fileId);
    if (parseResult.nodes.length > 0) {
      await this.db.saveNodes(parseResult.nodes);
    }
    if (parseResult.edges.length > 0) {
      await this.db.saveEdges(parseResult.edges);
    }
  }

  pauseIndexing(): void {
    this.isPaused = true;
  }

  resumeIndexing(): void {
    this.isPaused = false;
  }

  async getIndexJob(jobId: string): Promise<IndexJobStatus | null> {
    return this.db.getIndexJob(jobId);
  }

  private setupLiveWatcher(): void {
    if (!this.eventBus) return;

    this.eventBus.on('workspace.file_changed', (payload: any) => {
      if (payload && payload.filePath && payload.workspaceRoot) {
        this.indexSingleFile(payload.workspaceRoot, payload.filePath).catch(() => {});
      }
    });
  }

  private collectFiles(dir: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', '.forge', 'release', 'build'].includes(entry.name)) {
          results.push(...this.collectFiles(fullPath));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.py', '.go', '.rs'].includes(ext)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }
}
