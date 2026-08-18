/**
 * sprint86_phase4.test.ts
 *
 * Sprint 86 Phase 4 — Semantic Context Retrieval Engine Unit Tests
 *
 * Verifies:
 *  - Symbol-boundary chunking (chunkFile)
 *  - 5-factor relevance scoring (scoreChunk)
 *  - Token budget enforcement and candidate ranking (retrieve)
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WorkspaceSymbolIndexer } from '../electron/main/ai/workspace/symbol-indexer';
import { DependencyGraphEngine } from '../electron/main/ai/workspace/dependency-graph-engine';
import { SemanticContextRetriever } from '../electron/main/ai/context/semantic-retriever';

// ─── Test Fixture Setup ────────────────────────────────────────────────────────

const TEST_WORKSPACE = path.join(os.tmpdir(), `forge_test_phase4_${Date.now()}`);
const FIXTURE_SRC = path.join(TEST_WORKSPACE, 'src');

const FILE_A = `import { Helper } from './fileB';

export class PrimaryEngine {
  start(): void {}
}

export function executePrimary(): void {}
`;

const FILE_B = `export class Helper {
  help(): void {}
}
`;

function writeFixtures(): void {
  fs.mkdirSync(FIXTURE_SRC, { recursive: true });
  fs.writeFileSync(path.join(FIXTURE_SRC, 'fileA.ts'), FILE_A, 'utf8');
  fs.writeFileSync(path.join(FIXTURE_SRC, 'fileB.ts'), FILE_B, 'utf8');
}

function cleanFixtures(): void {
  try {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  } catch { /* ignore */ }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Sprint 86 Phase 4 — Semantic Context Retrieval Engine', () => {
  let indexer: WorkspaceSymbolIndexer;
  let graphEngine: DependencyGraphEngine;
  let retriever: SemanticContextRetriever;

  beforeEach(async () => {
    writeFixtures();
    indexer = new WorkspaceSymbolIndexer();
    await indexer.rebuildIndex(TEST_WORKSPACE);
    graphEngine = new DependencyGraphEngine(indexer);
    graphEngine.buildFileGraph();
    retriever = new SemanticContextRetriever(indexer, graphEngine);
  });

  afterAll(() => {
    cleanFixtures();
  });

  // ── 1. Symbol-Boundary Chunking ───────────────────────────────────────────

  describe('1. chunkFile()', () => {
    it('chunks source file into header and symbol blocks', () => {
      const fileAPath = path.join(FIXTURE_SRC, 'fileA.ts');
      const chunks = retriever.chunkFile(fileAPath, FILE_A);

      expect(chunks.length).toBeGreaterThanOrEqual(2);
      const symbolNames = chunks.map((c) => c.symbolName).filter(Boolean);
      expect(symbolNames).toContain('PrimaryEngine');
      expect(symbolNames).toContain('executePrimary');
    });

    it('estimates token count for each chunk', () => {
      const fileAPath = path.join(FIXTURE_SRC, 'fileA.ts');
      const chunks = retriever.chunkFile(fileAPath, FILE_A);

      for (const c of chunks) {
        expect(c.tokenEstimate).toBeGreaterThan(0);
      }
    });
  });

  // ── 2. 5-Factor Relevance Scoring ─────────────────────────────────────────

  describe('2. scoreChunk()', () => {
    it('boosts chunks matching query terms', () => {
      const fileAPath = path.join(FIXTURE_SRC, 'fileA.ts');
      const chunks = retriever.chunkFile(fileAPath, FILE_A);
      const primaryChunk = chunks.find((c) => c.symbolName === 'PrimaryEngine')!;

      const candMatch = retriever.scoreChunk(primaryChunk, {
        query: 'Explain PrimaryEngine',
        maxTokens: 4096,
      });

      const candNoMatch = retriever.scoreChunk(primaryChunk, {
        query: 'Something unrelated',
        maxTokens: 4096,
      });

      expect(candMatch.score).toBeGreaterThan(candNoMatch.score);
    });

    it('boosts active editor file chunks', () => {
      const fileAPath = path.join(FIXTURE_SRC, 'fileA.ts');
      const fileBPath = path.join(FIXTURE_SRC, 'fileB.ts');

      const chunkA = retriever.chunkFile(fileAPath, FILE_A)[0];
      const chunkB = retriever.chunkFile(fileBPath, FILE_B)[0];

      const scoreActiveA = retriever.scoreChunk(chunkA, {
        query: 'check',
        activeFilePath: fileAPath,
        maxTokens: 4096,
      });

      const scoreActiveB = retriever.scoreChunk(chunkB, {
        query: 'check',
        activeFilePath: fileAPath,
        maxTokens: 4096,
      });

      expect(scoreActiveA.scoring.activeEditorBoost).toBe(1.0);
      expect(scoreActiveB.scoring.activeEditorBoost).toBe(0.0);
    });
  });

  // ── 3. Token-Budget-Aware Retrieval ──────────────────────────────────────

  describe('3. retrieve()', () => {
    it('retrieves relevant candidates ranked by score within token budget', async () => {
      const fileAPath = path.join(FIXTURE_SRC, 'fileA.ts');

      const result = await retriever.retrieve({
        query: 'PrimaryEngine execution',
        activeFilePath: fileAPath,
        maxTokens: 4096,
      });

      expect(result.candidates.length).toBeGreaterThan(0);
      expect(result.totalTokensUsed).toBeLessThanOrEqual(4096);

      // Verify candidates are sorted by score descending
      for (let i = 1; i < result.candidates.length; i++) {
        expect(result.candidates[i - 1].score).toBeGreaterThanOrEqual(
          result.candidates[i].score
        );
      }
    });

    it('enforces small maxTokens budget', async () => {
      const result = await retriever.retrieve({
        query: 'PrimaryEngine Helper',
        maxTokens: 20, // very restrictive token budget
      });

      expect(result.totalTokensUsed).toBeLessThanOrEqual(20);
    });
  });
});
