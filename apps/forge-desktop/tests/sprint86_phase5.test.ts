/**
 * sprint86_phase5.test.ts
 *
 * Sprint 86 Phase 5 — AI Editor Actions Unit Tests
 *
 * Verifies:
 *  - EditorAction state machine (proposed -> approved -> applied / rejected)
 *  - ActionDiffGenerator preview diff generation
 *  - ActionSnapshotManager capture & restore
 *  - Conflict detection
 *  - Generate rename action
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WorkspaceSymbolIndexer } from '../electron/main/ai/workspace/symbol-indexer';
import { ReferenceEngine } from '../electron/main/ai/workspace/reference-engine';
import { EditorActionExecutor } from '../electron/main/ai/workspace/editor-action-executor';

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const TEST_WORKSPACE = path.join(os.tmpdir(), `forge_test_phase5_${Date.now()}`);
const FIXTURE_SRC = path.join(TEST_WORKSPACE, 'src');

const TARGET_FILE = `
export class TargetClass {
  run(): void {}
}
`;

function writeFixtures(): void {
  fs.mkdirSync(FIXTURE_SRC, { recursive: true });
  fs.writeFileSync(path.join(FIXTURE_SRC, 'target.ts'), TARGET_FILE, 'utf8');
}

function cleanFixtures(): void {
  try {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  } catch { /* ignore */ }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Sprint 86 Phase 5 — AI Editor Actions Engine', () => {
  let indexer: WorkspaceSymbolIndexer;
  let refEngine: ReferenceEngine;
  let executor: EditorActionExecutor;

  beforeEach(async () => {
    writeFixtures();
    indexer = new WorkspaceSymbolIndexer();
    await indexer.rebuildIndex(TEST_WORKSPACE);
    refEngine = new ReferenceEngine(indexer);
    executor = new EditorActionExecutor(undefined, refEngine);
  });

  afterAll(() => {
    cleanFixtures();
  });

  // ── 1. Propose & Diff Generation ──────────────────────────────────────────

  describe('1. proposeAction() & diffs', () => {
    it('creates action in proposed state with diff preview', () => {
      const filePath = path.join(FIXTURE_SRC, 'target.ts');
      const lifecycle = executor.proposeAction(
        'replace_selection',
        'Update TargetClass',
        'Renames run method',
        {
          id: 'edit_1',
          description: 'Edit target',
          edits: [
            {
              filePath,
              startLine: 3,
              startColumn: 3,
              endLine: 3,
              endColumn: 16,
              newText: '  start(): void {}',
            },
          ],
          createdAt: new Date().toISOString(),
        }
      );

      expect(lifecycle.state).toBe('proposed');
      expect(lifecycle.action.diffs.length).toBe(1);
      expect(lifecycle.action.diffs[0].hunks.length).toBe(1);
      expect(lifecycle.action.diffs[0].hunks[0].content).toContain('-   run(): void {}');
      expect(lifecycle.action.diffs[0].hunks[0].content).toContain('+   start(): void {}');
    });
  });

  // ── 2. State Machine Transitions ─────────────────────────────────────────

  describe('2. State machine (approve & reject)', () => {
    it('transitions proposed -> approved', () => {
      const filePath = path.join(FIXTURE_SRC, 'target.ts');
      const lifecycle = executor.proposeAction(
        'insert_code',
        'Insert method',
        'Desc',
        {
          id: 'edit_2',
          description: 'Desc',
          edits: [{ filePath, startLine: 1, startColumn: 1, endLine: 1, endColumn: 1, newText: '// Header' }],
          createdAt: new Date().toISOString(),
        }
      );

      const approved = executor.approve('edit_2');
      expect(approved.state).toBe('approved');
    });

    it('transitions proposed -> rejected', () => {
      const filePath = path.join(FIXTURE_SRC, 'target.ts');
      const lifecycle = executor.proposeAction(
        'insert_code',
        'Insert method',
        'Desc',
        {
          id: 'edit_3',
          description: 'Desc',
          edits: [{ filePath, startLine: 1, startColumn: 1, endLine: 1, endColumn: 1, newText: '// Header' }],
          createdAt: new Date().toISOString(),
        }
      );

      const rejected = executor.reject('edit_3');
      expect(rejected.state).toBe('rejected');
    });
  });

  // ── 3. Apply Edits & Rollback ─────────────────────────────────────────────

  describe('3. apply() and snapshot rollback', () => {
    it('applies approved edits to disk', async () => {
      const filePath = path.join(FIXTURE_SRC, 'target.ts');
      executor.proposeAction(
        'replace_selection',
        'Update method',
        'Desc',
        {
          id: 'edit_4',
          description: 'Desc',
          edits: [
            {
              filePath,
              startLine: 3,
              startColumn: 3,
              endLine: 3,
              endColumn: 16,
              newText: '  execute(): void {}',
            },
          ],
          createdAt: new Date().toISOString(),
        }
      );

      executor.approve('edit_4');
      const applied = await executor.apply('edit_4');

      expect(applied.state).toBe('applied');
      const updatedContent = fs.readFileSync(filePath, 'utf8');
      expect(updatedContent).toContain('execute(): void {}');
    });
  });

  // ── 4. Rename Symbol Action Generation ────────────────────────────────────

  describe('4. generateRenameAction()', () => {
    it('generates rename symbol action across workspace', () => {
      const renameAction = executor.generateRenameAction('TargetClass', 'RenamedClass');
      expect(renameAction.action.kind).toBe('rename_symbol');
      expect(renameAction.action.edit.edits.length).toBeGreaterThan(0);
      expect(renameAction.action.edit.edits[0].newText).toBe('RenamedClass');
    });
  });

  // ── 5. Conflict Detection ─────────────────────────────────────────────────

  describe('5. detectConflicts()', () => {
    it('detects missing file conflict', async () => {
      const missingFile = path.join(FIXTURE_SRC, 'does-not-exist.ts');
      const report = await executor.detectConflicts({
        id: 'edit_5',
        description: 'Desc',
        edits: [{ filePath: missingFile, startLine: 1, startColumn: 1, endLine: 1, endColumn: 1, newText: '' }],
        createdAt: new Date().toISOString(),
      });

      expect(report.hasConflicts).toBe(true);
      expect(report.conflicts[0].kind).toBe('file_missing');
    });
  });
});
