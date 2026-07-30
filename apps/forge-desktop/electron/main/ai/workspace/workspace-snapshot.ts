/**
 * workspace-snapshot.ts
 *
 * Captures workspace state snapshots and manages temporary checkpoints for rollback & state restoration.
 */

import type { FileOperations } from './file-operations';

export interface SnapshotState {
  id: string;
  timestamp: number;
  files: Map<string, string>;
}

export class WorkspaceSnapshot {
  private readonly snapshots = new Map<string, SnapshotState>();

  constructor(private readonly fileOps: FileOperations) {}

  async createSnapshot(
    id: string,
    filePaths: string[],
    signal?: AbortSignal
  ): Promise<SnapshotState> {
    if (signal?.aborted) throw new Error('Snapshot creation cancelled by AbortSignal.');

    const files = new Map<string, string>();
    for (const p of filePaths) {
      if (signal?.aborted) throw new Error('Snapshot creation cancelled by AbortSignal.');
      if (await this.fileOps.exists(p, signal)) {
        const content = await this.fileOps.readFile(p, signal);
        files.set(p, content);
      }
    }

    const state: SnapshotState = {
      id,
      timestamp: Date.now(),
      files,
    };

    this.snapshots.set(id, state);
    return state;
  }

  async restoreSnapshot(id: string, signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) throw new Error('Snapshot restoration cancelled by AbortSignal.');

    const snapshot = this.snapshots.get(id);
    if (!snapshot) {
      throw new Error(`Snapshot "${id}" not found.`);
    }

    for (const [filePath, content] of snapshot.files.entries()) {
      if (signal?.aborted) throw new Error('Snapshot restoration cancelled by AbortSignal.');
      await this.fileOps.writeFile(filePath, content, signal);
    }
  }

  getSnapshot(id: string): SnapshotState | null {
    return this.snapshots.get(id) || null;
  }

  deleteSnapshot(id: string): void {
    this.snapshots.delete(id);
  }

  clear(): void {
    this.snapshots.clear();
  }
}
