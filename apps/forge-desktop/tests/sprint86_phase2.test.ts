/**
 * sprint86_phase2.test.ts
 *
 * Sprint 86 Phase 2 — True Find References Engine Unit Tests
 *
 * Verifies:
 *  - findUsages() classifies definitions vs usages vs imports vs type references
 *  - Comments and strings are excluded from usages
 *  - Ordinal navigation via getByOrdinal()
 *  - Invalidation of cache
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WorkspaceSymbolIndexer } from '../electron/main/ai/workspace/symbol-indexer';
import { ReferenceEngine, isInCommentOrString, classifyUsage } from '../electron/main/ai/workspace/reference-engine';

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const TEST_WORKSPACE = path.join(os.tmpdir(), `forge_test_phase2_${Date.now()}`);
const FIXTURE_SRC = path.join(TEST_WORKSPACE, 'src');

const FIXTURE_DEF = `
export interface ITaskConfig {
  id: string;
}

// Comments should ignore ITaskConfig
export class TaskManager {
  private config: ITaskConfig; // type-reference
  
  constructor(cfg: ITaskConfig) {
    this.config = cfg;
    const msg = "ITaskConfig in string";
  }
}

export function executeTask(cfg: ITaskConfig): TaskManager {
  return new TaskManager(cfg);
}
`;

const FIXTURE_USAGE = `
import { TaskManager, ITaskConfig } from './task-def';

export function run(): void {
  const manager = new TaskManager({ id: 't1' });
  const cfg: ITaskConfig = { id: 't2' };
}
`;

function writeFixtures(): void {
  fs.mkdirSync(FIXTURE_SRC, { recursive: true });
  fs.writeFileSync(path.join(FIXTURE_SRC, 'task-def.ts'), FIXTURE_DEF, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'task-runner.ts'), FIXTURE_USAGE, 'utf8');
}

function cleanFixtures(): void {
  try {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  } catch { /* ignore */ }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Sprint 86 Phase 2 — True Find References Engine', () => {
  let indexer: WorkspaceSymbolIndexer;
  let engine: ReferenceEngine;

  beforeEach(async () => {
    writeFixtures();
    indexer = new WorkspaceSymbolIndexer();
    await indexer.rebuildIndex(TEST_WORKSPACE);
    engine = new ReferenceEngine(indexer);
  });

  afterAll(() => {
    cleanFixtures();
  });

  // ── 1. Helper Functions ───────────────────────────────────────────────────

  describe('1. Helpers: isInCommentOrString & classifyUsage', () => {
    it('detects single-line comments', () => {
      const line = 'const x = 1; // TaskManager is here';
      const matchIdx = line.indexOf('TaskManager');
      expect(isInCommentOrString(line, matchIdx)).toBe(true);
    });

    it('detects string literals', () => {
      const line = 'const str = "TaskManager instance";';
      const matchIdx = line.indexOf('TaskManager');
      expect(isInCommentOrString(line, matchIdx)).toBe(true);
    });

    it('returns false for normal code occurrences', () => {
      const line = 'const manager = new TaskManager();';
      const matchIdx = line.indexOf('TaskManager');
      expect(isInCommentOrString(line, matchIdx)).toBe(false);
    });

    it('classifies import statements', () => {
      expect(classifyUsage("import { TaskManager } from './task-def';", 'TaskManager')).toBe('import');
    });

    it('classifies class definition', () => {
      expect(classifyUsage('export class TaskManager {', 'TaskManager')).toBe('definition');
    });

    it('classifies type reference', () => {
      expect(classifyUsage('private config: ITaskConfig;', 'ITaskConfig')).toBe('type-reference');
    });

    it('classifies expression usage', () => {
      expect(classifyUsage('const mgr = new TaskManager();', 'TaskManager')).toBe('usage');
    });
  });

  // ── 2. findUsages ─────────────────────────────────────────────────────────

  describe('2. findUsages()', () => {
    it('finds definitions and usages for TaskManager', () => {
      const res = engine.findUsages('TaskManager');
      expect(res.symbol).toBe('TaskManager');
      expect(res.definitions.length).toBeGreaterThan(0);
      expect(res.definitions[0].kind).toBe('definition');
      expect(res.usages.length).toBeGreaterThan(0);
      expect(res.totalCount).toBe(res.ordered.length);
    });

    it('excludes comments and strings from usages', () => {
      const res = engine.findUsages('ITaskConfig');
      // Line containing comment "Comments should ignore ITaskConfig" should not be included
      const inComments = res.ordered.some((r) => r.preview.includes('Comments should ignore'));
      expect(inComments).toBe(false);

      // Line containing "ITaskConfig in string" should not be included
      const inStrings = res.ordered.some((r) => r.preview.includes('ITaskConfig in string'));
      expect(inStrings).toBe(false);
    });

    it('places definitions first in the ordered list', () => {
      const res = engine.findUsages('TaskManager');
      expect(res.ordered[0].kind).toBe('definition');
    });

    it('handles empty query gracefully', () => {
      const res = engine.findUsages('');
      expect(res.totalCount).toBe(0);
      expect(res.ordered).toEqual([]);
    });

    it('handles non-existent symbol', () => {
      const res = engine.findUsages('NonExistentSymbol_Phase2');
      expect(res.totalCount).toBe(0);
    });
  });

  // ── 3. Ordinal Navigation ─────────────────────────────────────────────────

  describe('3. getByOrdinal()', () => {
    it('retrieves reference by 0-indexed ordinal position', () => {
      const first = engine.getByOrdinal('TaskManager', 0);
      expect(first).not.toBeNull();
      expect(first?.kind).toBe('definition');

      const second = engine.getByOrdinal('TaskManager', 1);
      expect(second).not.toBeNull();
    });

    it('returns null for out-of-bound ordinal index', () => {
      expect(engine.getByOrdinal('TaskManager', 999)).toBeNull();
      expect(engine.getByOrdinal('TaskManager', -1)).toBeNull();
    });
  });

  // ── 4. Cache Invalidation ─────────────────────────────────────────────────

  describe('4. Invalidation', () => {
    it('clears cache when invalidateFile is called', () => {
      const res1 = engine.findUsages('TaskManager');
      engine.invalidateFile();
      const res2 = engine.findUsages('TaskManager');
      expect(res1).not.toBe(res2); // distinct object references
      expect(res1.totalCount).toBe(res2.totalCount);
    });
  });
});
