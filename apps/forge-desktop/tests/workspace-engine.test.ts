/**
 * workspace-engine.test.ts
 *
 * Unit test suite for Phase 10 Workspace Operations Engine.
 * Covers:
 *  - Atomic file reads/writes, createFile, deleteFile, rename, mkdir, exists, list
 *  - Multi-file patch application & dry-run mode
 *  - Rollback on patch application failure
 *  - Snapshot creation & state restoration
 *  - Workspace diffing & binary detection
 *  - AbortSignal cancellation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceEngine } from '../electron/main/ai/workspace/workspace-engine';

describe('WorkspaceEngine', () => {
  let engine: WorkspaceEngine;
  const tempDir = path.join(__dirname, 'temp_workspace_test');

  beforeEach(() => {
    engine = new WorkspaceEngine();
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('performs atomic reads, writes, renames, and deletions', async () => {
    const filePath = path.join(tempDir, 'file1.txt');
    const renamedPath = path.join(tempDir, 'file1_renamed.txt');

    await engine.createFile(filePath, 'Initial Content');
    expect(await engine.exists(filePath)).toBe(true);
    expect(await engine.readFile(filePath)).toBe('Initial Content');

    await engine.writeFile(filePath, 'Updated Content');
    expect(await engine.readFile(filePath)).toBe('Updated Content');

    await engine.rename(filePath, renamedPath);
    expect(await engine.exists(filePath)).toBe(false);
    expect(await engine.exists(renamedPath)).toBe(true);

    await engine.deleteFile(renamedPath);
    expect(await engine.exists(renamedPath)).toBe(false);
  });

  it('applies multi-file patches with dry-run and rollback on conflict', async () => {
    const f1 = path.join(tempDir, 'p1.txt');
    const f2 = path.join(tempDir, 'p2.txt');

    await engine.writeFile(f1, 'Original 1');

    // Dry run patch
    const patchResultDry = await engine.applyPatch(
      [
        { filePath: f1, type: 'modify', oldContent: 'Original 1', newContent: 'Modified 1' },
        { filePath: f2, type: 'add', newContent: 'Added 2' },
      ],
      { dryRun: true }
    );

    expect(patchResultDry.success).toBe(true);
    expect(patchResultDry.dryRun).toBe(true);
    expect(await engine.readFile(f1)).toBe('Original 1'); // Content unchanged in dry run

    // Real patch application
    const patchResultReal = await engine.applyPatch([
      { filePath: f1, type: 'modify', oldContent: 'Original 1', newContent: 'Modified 1' },
      { filePath: f2, type: 'add', newContent: 'Added 2' },
    ]);

    expect(patchResultReal.success).toBe(true);
    expect(await engine.readFile(f1)).toBe('Modified 1');
    expect(await engine.readFile(f2)).toBe('Added 2');

    // Patch conflict triggering rollback
    const patchConflict = await engine.applyPatch([
      { filePath: f1, type: 'modify', oldContent: 'Wrong Old Content', newContent: 'Broken' },
    ]);

    expect(patchConflict.success).toBe(false);
    expect(patchConflict.error).toContain('Conflict');
    expect(await engine.readFile(f1)).toBe('Modified 1'); // Unchanged due to rollback
  });

  it('creates and restores workspace snapshots', async () => {
    const f1 = path.join(tempDir, 's1.txt');
    await engine.writeFile(f1, 'State 1');

    const snapshot = await engine.createSnapshot('snap_1', [f1]);
    expect(snapshot.files.get(f1)).toBe('State 1');

    await engine.writeFile(f1, 'State 2');
    expect(await engine.readFile(f1)).toBe('State 2');

    await engine.restoreSnapshot('snap_1');
    expect(await engine.readFile(f1)).toBe('State 1');
  });

  it('computes diffs and detects binary files', async () => {
    const diffAdd = engine.diff(undefined, 'line 1\nline 2', 'new.txt');
    expect(diffAdd.type).toBe('added');
    expect(diffAdd.additions).toBe(2);

    const binaryContent = `Header\x00BinaryData`;
    const diffBin = engine.diff(undefined, binaryContent, 'image.png');
    expect(diffBin.isBinary).toBe(true);
  });

  it('cancels file operations when AbortSignal is pre-aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(engine.readFile(path.join(tempDir, 'any.txt'), controller.signal)).rejects.toThrow(
      'cancelled by AbortSignal'
    );
    await expect(engine.writeFile(path.join(tempDir, 'any.txt'), 'data', controller.signal)).rejects.toThrow(
      'cancelled by AbortSignal'
    );
  });
});
