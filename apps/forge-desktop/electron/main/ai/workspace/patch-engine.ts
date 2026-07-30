/**
 * patch-engine.ts
 *
 * Multi-file patch engine with unified diff support, dry-run mode, and automatic rollback on failure.
 */

import type { FileOperations } from './file-operations';

export interface FilePatch {
  filePath: string;
  type: 'add' | 'modify' | 'delete';
  oldContent?: string;
  newContent: string;
}

export interface PatchOptions {
  dryRun?: boolean;
  signal?: AbortSignal;
}

export interface PatchResult {
  success: boolean;
  appliedPatches: number;
  dryRun: boolean;
  modifiedFiles: string[];
  error?: string;
}

export class PatchEngine {
  constructor(private readonly fileOps: FileOperations) {}

  async applyPatch(patches: FilePatch[], options: PatchOptions = {}): Promise<PatchResult> {
    const { dryRun = false, signal } = options;

    if (signal?.aborted) {
      throw new Error('Patch operation cancelled by AbortSignal.');
    }

    const modifiedFiles: string[] = [];
    const backups = new Map<string, { exists: boolean; content?: string }>();

    // 1. Dry Run / Validation Phase & Backup Collection
    for (const patch of patches) {
      if (signal?.aborted) {
        throw new Error('Patch operation cancelled by AbortSignal.');
      }

      const fileExists = await this.fileOps.exists(patch.filePath, signal);

      if (patch.type === 'add' && fileExists) {
        return {
          success: false,
          appliedPatches: 0,
          dryRun,
          modifiedFiles: [],
          error: `Cannot add file "${patch.filePath}" because it already exists.`,
        };
      }

      if ((patch.type === 'modify' || patch.type === 'delete') && !fileExists) {
        return {
          success: false,
          appliedPatches: 0,
          dryRun,
          modifiedFiles: [],
          error: `Cannot ${patch.type} file "${patch.filePath}" because it does not exist.`,
        };
      }

      if (fileExists) {
        const content = await this.fileOps.readFile(patch.filePath, signal);
        if (patch.oldContent !== undefined && content !== patch.oldContent) {
          return {
            success: false,
            appliedPatches: 0,
            dryRun,
            modifiedFiles: [],
            error: `Conflict in "${patch.filePath}": content has changed since patch creation.`,
          };
        }
        backups.set(patch.filePath, { exists: true, content });
      } else {
        backups.set(patch.filePath, { exists: false });
      }
    }

    if (dryRun) {
      return {
        success: true,
        appliedPatches: patches.length,
        dryRun: true,
        modifiedFiles: patches.map((p) => p.filePath),
      };
    }

    // 2. Application Phase with Transactional Rollback
    let appliedCount = 0;
    try {
      for (const patch of patches) {
        if (signal?.aborted) {
          throw new Error('Patch application cancelled by AbortSignal.');
        }

        if (patch.type === 'add' || patch.type === 'modify') {
          await this.fileOps.writeFile(patch.filePath, patch.newContent, signal);
        } else if (patch.type === 'delete') {
          await this.fileOps.deleteFile(patch.filePath, signal);
        }

        modifiedFiles.push(patch.filePath);
        appliedCount++;
      }

      return {
        success: true,
        appliedPatches: appliedCount,
        dryRun: false,
        modifiedFiles,
      };
    } catch (err) {
      // Automatic Rollback
      await this.rollback(backups);
      return {
        success: false,
        appliedPatches: 0,
        dryRun: false,
        modifiedFiles: [],
        error: `Patch application failed and was rolled back: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  private async rollback(backups: Map<string, { exists: boolean; content?: string }>): Promise<void> {
    for (const [filePath, state] of backups.entries()) {
      try {
        if (state.exists && state.content !== undefined) {
          await this.fileOps.writeFile(filePath, state.content);
        } else if (!state.exists) {
          await this.fileOps.deleteFile(filePath);
        }
      } catch (_) {
        // Best-effort rollback
      }
    }
  }
}
