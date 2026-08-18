/**
 * sprint86_phase3.test.ts
 *
 * Sprint 86 Phase 3 — Dependency & Import Graph Engine Unit Tests
 *
 * Verifies:
 *  - Import path resolution
 *  - Direct file dependencies & dependents
 *  - Transitive dependency traversal (BFS)
 *  - Cycle detection via Tarjan's algorithm
 *  - Subgraph extraction & graph export
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WorkspaceSymbolIndexer } from '../electron/main/ai/workspace/symbol-indexer';
import { DependencyGraphEngine } from '../electron/main/ai/workspace/dependency-graph-engine';

// ─── Test Fixture Setup ────────────────────────────────────────────────────────

const TEST_WORKSPACE = path.join(os.tmpdir(), `forge_test_phase3_${Date.now()}`);
const FIXTURE_SRC = path.join(TEST_WORKSPACE, 'src');

// Multi-file dependency hierarchy with a cycle:
// entry.ts -> service.ts -> utils.ts -> helper.ts
// cyclicA.ts -> cyclicB.ts -> cyclicA.ts (Cycle!)

const ENTRY_FILE = `
import { Service } from './service';
export class Entry {
  private s = new Service();
}
`;

const SERVICE_FILE = `
import { formatUtil } from './utils';
export class Service {
  run() { return formatUtil(); }
}
`;

const UTILS_FILE = `
import { helperFn } from './helper';
export function formatUtil() { return helperFn(); }
`;

const HELPER_FILE = `
export function helperFn() { return "ok"; }
`;

const CYCLIC_A = `
import { fnB } from './cyclicB';
export function fnA() { return fnB(); }
`;

const CYCLIC_B = `
import { fnA } from './cyclicA';
export function fnB() { return fnA(); }
`;

function writeFixtures(): void {
  fs.mkdirSync(FIXTURE_SRC, { recursive: true });
  fs.writeFileSync(path.join(FIXTURE_SRC, 'entry.ts'), ENTRY_FILE, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'service.ts'), SERVICE_FILE, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'utils.ts'), UTILS_FILE, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'helper.ts'), HELPER_FILE, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'cyclicA.ts'), CYCLIC_A, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'cyclicB.ts'), CYCLIC_B, 'utf8');
}

function cleanFixtures(): void {
  try {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  } catch { /* ignore */ }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Sprint 86 Phase 3 — Dependency & Import Graph Engine', () => {
  let indexer: WorkspaceSymbolIndexer;
  let graphEngine: DependencyGraphEngine;

  beforeEach(async () => {
    writeFixtures();
    indexer = new WorkspaceSymbolIndexer();
    await indexer.rebuildIndex(TEST_WORKSPACE);
    graphEngine = new DependencyGraphEngine(indexer);
    graphEngine.buildFileGraph();
  });

  afterAll(() => {
    cleanFixtures();
  });

  // ── 1. Import Path Resolution ─────────────────────────────────────────────

  describe('1. resolveImportPath()', () => {
    it('resolves relative file paths correctly', () => {
      const fromFile = path.join(FIXTURE_SRC, 'entry.ts');
      const resolved = graphEngine.resolveImportPath(fromFile, './service');
      expect(resolved).not.toBeNull();
      expect(resolved?.endsWith('service.ts')).toBe(true);
    });

    it('returns null for bare specifiers (node_modules)', () => {
      const fromFile = path.join(FIXTURE_SRC, 'entry.ts');
      expect(graphEngine.resolveImportPath(fromFile, 'react')).toBeNull();
    });
  });

  // ── 2. Direct Dependencies & Dependents ───────────────────────────────────

  describe('2. Direct dependencies & dependents', () => {
    it('finds direct dependencies of entry.ts', () => {
      const entryFile = path.join(FIXTURE_SRC, 'entry.ts');
      const deps = graphEngine.getFileDependencies(entryFile);
      expect(deps.length).toBe(1);
      expect(deps[0].endsWith('service.ts')).toBe(true);
    });

    it('finds direct dependents of service.ts', () => {
      const serviceFile = path.join(FIXTURE_SRC, 'service.ts');
      const dependents = graphEngine.getFileDependents(serviceFile);
      expect(dependents.length).toBe(1);
      expect(dependents[0].endsWith('entry.ts')).toBe(true);
    });
  });

  // ── 3. Transitive Dependencies ────────────────────────────────────────────

  describe('3. getTransitiveDeps()', () => {
    it('finds all multi-level dependencies of entry.ts', () => {
      const entryFile = path.join(FIXTURE_SRC, 'entry.ts');
      const transitive = graphEngine.getTransitiveDeps(entryFile, 5);
      const basenames = transitive.map((p) => path.basename(p));
      expect(basenames).toContain('service.ts');
      expect(basenames).toContain('utils.ts');
      expect(basenames).toContain('helper.ts');
    });

    it('respects maxDepth parameter', () => {
      const entryFile = path.join(FIXTURE_SRC, 'entry.ts');
      const shallow = graphEngine.getTransitiveDeps(entryFile, 1);
      const basenames = shallow.map((p) => path.basename(p));
      expect(basenames).toContain('service.ts');
      expect(basenames).not.toContain('helper.ts');
    });
  });

  // ── 4. Cycle Detection ────────────────────────────────────────────────────

  describe('4. detectCycles()', () => {
    it('detects circular dependency between cyclicA.ts and cyclicB.ts', () => {
      const cycles = graphEngine.detectCycles();
      expect(cycles.length).toBeGreaterThan(0);

      const cycleBasenames = cycles.map((c) => c.map((p) => path.basename(p)));
      const hasCyclicPair = cycleBasenames.some(
        (c) => c.includes('cyclicA.ts') && c.includes('cyclicB.ts')
      );
      expect(hasCyclicPair).toBe(true);
    });
  });

  // ── 5. Subgraph & Graph Export ────────────────────────────────────────────

  describe('5. getSubgraph() & toGraph()', () => {
    it('returns neighborhood subgraph around service.ts', () => {
      const serviceFile = path.join(FIXTURE_SRC, 'service.ts');
      const sub = graphEngine.getSubgraph(serviceFile, 1);
      expect(sub.nodes.length).toBeGreaterThan(0);
      const ids = sub.nodes.map((n) => path.basename(n.id));
      expect(ids).toContain('service.ts');
      expect(ids).toContain('entry.ts');
      expect(ids).toContain('utils.ts');
    });

    it('exports complete DependencyGraph structure', () => {
      const graph = graphEngine.toGraph();
      expect(graph.nodes.length).toBe(6);
      expect(graph.stats.nodeCount).toBe(6);
      expect(graph.stats.edgeCount).toBeGreaterThan(0);
      expect(graph.stats.cycleCount).toBeGreaterThan(0);
    });
  });
});
