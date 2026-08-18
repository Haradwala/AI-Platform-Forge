/**
 * sprint86_phase1.test.ts
 *
 * Sprint 86 Phase 1 — Workspace Symbol Index Unit Tests
 *
 * Verifies:
 *  - findSymbol
 *  - findReferences
 *  - findImports
 *  - listExports
 *  - Ignored directories are not indexed
 *  - Incremental update replaces old symbols
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WorkspaceSymbolIndexer } from '../electron/main/ai/workspace/symbol-indexer';

// ─── Test Fixture Setup ────────────────────────────────────────────────────────

const TEST_WORKSPACE = path.join(os.tmpdir(), `forge_test_workspace_${Date.now()}`);
const FIXTURE_SRC = path.join(TEST_WORKSPACE, 'src');
const FIXTURE_NODE_MODULES = path.join(TEST_WORKSPACE, 'node_modules', 'some-lib');

// Fixture: exported class, exported function, imported symbol, interface, type alias, enum
const FIXTURE_A = `
import { EventEmitter } from 'events';
import type { ILogger } from '@forge/shared';
import React from 'react';

export interface IWorkerConfig {
  timeout: number;
  retries: number;
}

export type WorkerStatus = 'idle' | 'running' | 'failed';

export enum WorkerState {
  Idle,
  Running,
  Failed,
}

export class WorkerManager {
  private logger: ILogger;
  
  constructor(config: IWorkerConfig) {}
  
  start(): void {}
  stop(): void {}
}

export async function createWorker(config: IWorkerConfig): Promise<WorkerManager> {
  return new WorkerManager(config);
}

export const DEFAULT_TIMEOUT = 5000;
`;

// Fixture B: another file that imports from A and from @forge/shared
const FIXTURE_B = `
import { WorkerManager, DEFAULT_TIMEOUT } from './worker-manager';
import { ILogger, createWorker } from '@forge/shared';

export function runWorkers(): void {
  const manager = new WorkerManager({ timeout: DEFAULT_TIMEOUT, retries: 3 });
  manager.start();
}

export class WorkerPool {
  private managers: WorkerManager[] = [];
}
`;

// node_modules fixture — should be ignored
const FIXTURE_NODE_MODULES_FILE = `
export class ShouldBeIgnored {}
export function shouldIgnoreThis() {}
`;

function writeFixtures(): void {
  fs.mkdirSync(FIXTURE_SRC, { recursive: true });
  fs.mkdirSync(FIXTURE_NODE_MODULES, { recursive: true });

  fs.writeFileSync(path.join(FIXTURE_SRC, 'worker-manager.ts'), FIXTURE_A, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'worker-pool.ts'), FIXTURE_B, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_NODE_MODULES, 'index.ts'), FIXTURE_NODE_MODULES_FILE, 'utf8');
}

function cleanFixtures(): void {
  try {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  } catch { /* ignore */ }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Sprint 86 Phase 1 — Workspace Symbol Index', () => {
  let indexer: WorkspaceSymbolIndexer;

  beforeEach(async () => {
    writeFixtures();
    indexer = new WorkspaceSymbolIndexer();
    await indexer.rebuildIndex(TEST_WORKSPACE);
  });

  afterAll(() => {
    cleanFixtures();
  });

  // ── 1. findSymbol ─────────────────────────────────────────────────────────

  describe('1. findSymbol()', () => {
    it('finds an exported class', () => {
      const results = indexer.findSymbol('WorkerManager');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.kind === 'class' && s.exported === true)).toBe(true);
    });

    it('finds an exported function', () => {
      const results = indexer.findSymbol('createWorker');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.kind === 'function' && s.exported === true)).toBe(true);
    });

    it('finds an interface', () => {
      const results = indexer.findSymbol('IWorkerConfig');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.kind === 'interface')).toBe(true);
    });

    it('finds a type alias', () => {
      const results = indexer.findSymbol('WorkerStatus');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.kind === 'type')).toBe(true);
    });

    it('finds an enum', () => {
      const results = indexer.findSymbol('WorkerState');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.kind === 'enum')).toBe(true);
    });

    it('finds an exported const', () => {
      const results = indexer.findSymbol('DEFAULT_TIMEOUT');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.kind === 'const')).toBe(true);
    });

    it('returns empty array for unknown symbol', () => {
      expect(indexer.findSymbol('NonExistentSymbol_XYZ')).toEqual([]);
    });

    it('includes correct line numbers (line > 0)', () => {
      const results = indexer.findSymbol('WorkerManager');
      expect(results.every((s) => s.line > 0)).toBe(true);
    });
  });

  // ── 2. findReferences ─────────────────────────────────────────────────────

  describe('2. findReferences()', () => {
    it('finds definitions and import usages of WorkerManager', () => {
      const refs = indexer.findReferences('WorkerManager');
      expect(refs.length).toBeGreaterThanOrEqual(2); // defined in A, imported in B
      const filePaths = refs.map((r) => r.filePath);
      // Should appear in both files
      const inA = filePaths.some((p) => p.includes('worker-manager'));
      const inB = filePaths.some((p) => p.includes('worker-pool'));
      expect(inA).toBe(true);
      expect(inB).toBe(true);
    });

    it('deduplicates references by (filePath, line)', () => {
      const refs = indexer.findReferences('WorkerManager');
      const keys = refs.map((r) => `${r.filePath}:${r.line}`);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('returns empty for untracked symbol', () => {
      expect(indexer.findReferences('CompletelyUnknown_ABC')).toEqual([]);
    });
  });

  // ── 3. findImports ────────────────────────────────────────────────────────

  describe('3. findImports()', () => {
    it('finds all imports from @forge/shared', () => {
      const refs = indexer.findImports('@forge/shared');
      expect(refs.length).toBeGreaterThan(0);
      expect(refs.every((r) => r.moduleName === '@forge/shared')).toBe(true);
    });

    it('finds all imports from events', () => {
      const refs = indexer.findImports('events');
      expect(refs.length).toBeGreaterThan(0);
    });

    it('returns empty for non-imported module', () => {
      expect(indexer.findImports('non-existent-module-xyz')).toEqual([]);
    });

    it('includes the importedName field for named imports', () => {
      const refs = indexer.findImports('@forge/shared');
      const namedImports = refs.filter((r) => r.importedName != null);
      expect(namedImports.length).toBeGreaterThan(0);
    });
  });

  // ── 4. listExports ────────────────────────────────────────────────────────

  describe('4. listExports()', () => {
    it('lists exports from worker-manager.ts by basename', () => {
      const exps = indexer.listExports('worker-manager.ts');
      const names = exps.map((e) => e.name);
      expect(names).toContain('WorkerManager');
      expect(names).toContain('createWorker');
      expect(names).toContain('DEFAULT_TIMEOUT');
      expect(names).toContain('IWorkerConfig');
      expect(names).toContain('WorkerStatus');
      expect(names).toContain('WorkerState');
    });

    it('lists exports from worker-pool.ts by basename', () => {
      const exps = indexer.listExports('worker-pool.ts');
      const names = exps.map((e) => e.name);
      expect(names).toContain('runWorkers');
      expect(names).toContain('WorkerPool');
    });

    it('returns empty for unknown file', () => {
      expect(indexer.listExports('does-not-exist.ts')).toEqual([]);
    });
  });

  // ── 5. Ignored directories ────────────────────────────────────────────────

  describe('5. Ignored directories', () => {
    it('does not index files inside node_modules', () => {
      const ignored = indexer.findSymbol('ShouldBeIgnored');
      expect(ignored.length).toBe(0);
    });

    it('does not index functions inside node_modules', () => {
      const ignored = indexer.findSymbol('shouldIgnoreThis');
      expect(ignored.length).toBe(0);
    });
  });

  // ── 6. Incremental update ─────────────────────────────────────────────────

  describe('6. Incremental update via updateFile()', () => {
    it('replaces old symbols when file is updated', async () => {
      const filePath = path.join(FIXTURE_SRC, 'worker-manager.ts');

      // Verify old symbol exists
      expect(indexer.findSymbol('WorkerManager').length).toBeGreaterThan(0);

      // Overwrite with completely different content
      fs.writeFileSync(filePath, `
export class ReplacedClass {}
export function replacedFunction(): void {}
`, 'utf8');

      await indexer.updateFile(filePath);

      // Old symbols gone
      const oldSymbols = indexer.findSymbol('WorkerManager');
      const fromSameFile = oldSymbols.filter((s) => s.filePath === filePath);
      expect(fromSameFile.length).toBe(0);

      // New symbols present
      expect(indexer.findSymbol('ReplacedClass').length).toBeGreaterThan(0);
      expect(indexer.findSymbol('replacedFunction').length).toBeGreaterThan(0);
    });

    it('removes file from index when deleted and updateFile called', async () => {
      const filePath = path.join(FIXTURE_SRC, 'worker-pool.ts');
      fs.unlinkSync(filePath);

      await indexer.updateFile(filePath);

      // Symbols that were ONLY in worker-pool.ts should not include it anymore
      const workerPoolRefs = indexer.findSymbol('WorkerPool');
      expect(workerPoolRefs.some((s) => s.filePath === filePath)).toBe(false);
    });
  });

  // ── 7. Stats ─────────────────────────────────────────────────────────────

  describe('7. getStats()', () => {
    it('reports non-zero indexed files and symbols', () => {
      const stats = indexer.getStats();
      expect(stats.fileCount).toBeGreaterThan(0);
      expect(stats.symbolCount).toBeGreaterThan(0);
    });

    it('does not count node_modules files', () => {
      const stats = indexer.getStats();
      // We only wrote 2 source files
      expect(stats.fileCount).toBeLessThanOrEqual(2);
    });
  });
});
