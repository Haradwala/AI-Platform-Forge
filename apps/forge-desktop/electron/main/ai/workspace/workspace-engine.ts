/**
 * workspace-engine.ts
 *
 * Phase 10 — Workspace Operations Engine Facade.
 *
 * Canonical facade for all repository modifications.
 * Coordinates FileOperations, PatchEngine, WorkspaceDiff, and WorkspaceSnapshot.
 * Enforces atomic writes, transactional rollbacks, AbortSignal support, and zero direct fs calls.
 */

import { FileOperations } from './file-operations';
import { PatchEngine, type FilePatch, type PatchOptions, type PatchResult } from './patch-engine';
import { WorkspaceDiff, type FileDiffItem, type WorkspaceDiffReport } from './workspace-diff';
import { WorkspaceSnapshot, type SnapshotState } from './workspace-snapshot';

export interface IWorkspaceEngine {
  readFile(filePath: string, signal?: AbortSignal): Promise<string>;
  writeFile(filePath: string, content: string, signal?: AbortSignal): Promise<void>;
  createFile(filePath: string, content?: string, signal?: AbortSignal): Promise<void>;
  deleteFile(filePath: string, signal?: AbortSignal): Promise<void>;
  rename(oldPath: string, newPath: string, signal?: AbortSignal): Promise<void>;
  mkdir(dirPath: string, signal?: AbortSignal): Promise<void>;
  exists(filePath: string, signal?: AbortSignal): Promise<boolean>;
  list(dirPath: string, signal?: AbortSignal): Promise<string[]>;

  applyPatch(patches: FilePatch[], options?: PatchOptions): Promise<PatchResult>;
  createSnapshot(id: string, filePaths: string[], signal?: AbortSignal): Promise<SnapshotState>;
  restoreSnapshot(id: string, signal?: AbortSignal): Promise<void>;
  diff(oldContent?: string, newContent?: string, filePath?: string): FileDiffItem;
  generateDiffReport(items: FileDiffItem[]): WorkspaceDiffReport;
}

export class WorkspaceEngine implements IWorkspaceEngine {
  private readonly fileOps = new FileOperations();
  private readonly patchEngine: PatchEngine;
  private readonly diffEngine: WorkspaceDiff;
  private readonly snapshotEngine: WorkspaceSnapshot;

  constructor() {
    this.patchEngine = new PatchEngine(this.fileOps);
    this.diffEngine = new WorkspaceDiff(this.fileOps);
    this.snapshotEngine = new WorkspaceSnapshot(this.fileOps);
  }

  async readFile(filePath: string, signal?: AbortSignal): Promise<string> {
    return this.fileOps.readFile(filePath, signal);
  }

  async writeFile(filePath: string, content: string, signal?: AbortSignal): Promise<void> {
    return this.fileOps.writeFile(filePath, content, signal);
  }

  async createFile(filePath: string, content = '', signal?: AbortSignal): Promise<void> {
    return this.fileOps.createFile(filePath, content, signal);
  }

  async deleteFile(filePath: string, signal?: AbortSignal): Promise<void> {
    return this.fileOps.deleteFile(filePath, signal);
  }

  async rename(oldPath: string, newPath: string, signal?: AbortSignal): Promise<void> {
    return this.fileOps.rename(oldPath, newPath, signal);
  }

  async mkdir(dirPath: string, signal?: AbortSignal): Promise<void> {
    return this.fileOps.mkdir(dirPath, signal);
  }

  async exists(filePath: string, signal?: AbortSignal): Promise<boolean> {
    return this.fileOps.exists(filePath, signal);
  }

  async list(dirPath: string, signal?: AbortSignal): Promise<string[]> {
    return this.fileOps.list(dirPath, signal);
  }

  async applyPatch(patches: FilePatch[], options: PatchOptions = {}): Promise<PatchResult> {
    return this.patchEngine.applyPatch(patches, options);
  }

  async createSnapshot(id: string, filePaths: string[], signal?: AbortSignal): Promise<SnapshotState> {
    return this.snapshotEngine.createSnapshot(id, filePaths, signal);
  }

  async restoreSnapshot(id: string, signal?: AbortSignal): Promise<void> {
    return this.snapshotEngine.restoreSnapshot(id, signal);
  }

  diff(oldContent?: string, newContent?: string, filePath = ''): FileDiffItem {
    return this.diffEngine.diffContent(oldContent, newContent, filePath);
  }

  generateDiffReport(items: FileDiffItem[]): WorkspaceDiffReport {
    return this.diffEngine.generateReport(items);
  }
}
