/**
 * action-snapshot-manager.ts
 *
 * Sprint 86 Phase 5 — Action Snapshot Manager
 *
 * Captures in-memory snapshots of file contents before applying edits,
 * enabling atomic rollback if an edit application fails.
 */

import * as fs from 'fs';

export class ActionSnapshotManager {
  /**
   * Capture file content snapshots for a set of file paths.
   */
  async captureSnapshots(filePaths: string[]): Promise<Map<string, string>> {
    const snapshots = new Map<string, string>();
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          snapshots.set(filePath, content);
        }
      } catch {
        // If unreadable or non-existent, snapshot won't store a content string
      }
    }
    return snapshots;
  }

  /**
   * Restore file contents from a set of snapshots.
   */
  async restoreSnapshots(snapshots: Map<string, string>): Promise<void> {
    for (const [filePath, content] of snapshots.entries()) {
      try {
        fs.writeFileSync(filePath, content, 'utf8');
      } catch (err) {
        throw new Error(`Failed to restore snapshot for "${filePath}": ${(err as Error).message}`);
      }
    }
  }
}
