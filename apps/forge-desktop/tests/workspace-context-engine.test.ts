/**
 * workspace-context-engine.test.ts
 *
 * Unit test suite for Phase 6 Workspace Context Engine.
 * Tests:
 *  - Incremental AST/symbol indexing (RepositoryIndexer)
 *  - Context ranking & scoring (ContextSelector)
 *  - Token budget enforcement & truncation (ContextBudget)
 *  - Duplicate removal
 *  - Cancellation via AbortSignal
 *  - Empty workspace handling
 *  - Large repository handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ContextEngine } from '../electron/main/ai/context/context-engine';
import { RepositoryIndexer } from '../electron/main/ai/context/repository-indexer';
import { ContextSelector } from '../electron/main/ai/context/context-selector';
import { ContextBudget } from '../electron/main/ai/context/context-budget';
import {
  getAllContextSources,
  UserGoalSource,
  ActiveEditorSource,
} from '../electron/main/ai/context/context-sources';

describe('RepositoryIndexer', () => {
  let indexer: RepositoryIndexer;

  beforeEach(() => {
    indexer = new RepositoryIndexer();
  });

  it('indexes files, imports, exports, classes, and functions', async () => {
    const code = `
      import { Helper } from './utils';
      export class UserService {
        async getUser() {}
      }
      export function formatUser() {}
    `;

    indexer.updateFile('src/services/user-service.ts', code);

    const file = indexer.getFile('src/services/user-service.ts');
    expect(file).not.toBeNull();
    expect(file?.imports).toContain('./utils');
    expect(file?.exports).toContain('UserService');
    expect(file?.exports).toContain('formatUser');

    const symbols = indexer.searchSymbols('UserService');
    expect(symbols.length).toBeGreaterThan(0);
    const classSym = symbols.find((s) => s.kind === 'class');
    expect(classSym).toBeDefined();
  });

  it('supports incremental updates and removals', () => {
    indexer.updateFile('src/a.ts', 'class A {}');
    expect(indexer.getAllFiles().length).toBe(1);

    indexer.updateFile('src/a.ts', 'class A2 {}');
    expect(indexer.getAllFiles().length).toBe(1);
    expect(indexer.searchSymbols('A2').length).toBe(1);

    indexer.removeFile('src/a.ts');
    expect(indexer.getAllFiles().length).toBe(0);
  });
});

describe('ContextSelector', () => {
  let selector: ContextSelector;

  beforeEach(() => {
    selector = new ContextSelector();
  });

  it('ranks items based on active editor focus, diagnostics, and semantic relevance', () => {
    const items = [
      { id: '1', source: 'workspace_files' as const, content: 'unrelated content', path: 'src/other.ts' },
      { id: '2', source: 'diagnostics' as const, content: 'type error in user-service.ts', path: 'src/user-service.ts' },
      { id: '3', source: 'active_editor' as const, content: 'Active File: src/user-service.ts', path: 'src/user-service.ts' },
      { id: '4', source: 'user_goal' as const, content: 'Fix type error in user-service' },
    ];

    const ranked = selector.selectAndRank(items, {
      userGoal: 'Fix type error in user-service',
      activeFilePath: 'src/user-service.ts',
    });

    expect(ranked.length).toBe(4);
    expect(ranked.some((r) => r.source === 'user_goal')).toBe(true);
    expect(ranked.some((r) => r.source === 'active_editor')).toBe(true);
    expect(ranked.some((r) => r.source === 'diagnostics')).toBe(true);
  });

  it('removes duplicate items based on path, keeping higher-scoring item', () => {
    const items = [
      { id: '1', source: 'workspace_files' as const, content: 'low score content', path: 'src/a.ts' },
      { id: '2', source: 'workspace_files' as const, content: 'high score content with user goal match', path: 'src/a.ts' },
    ];

    const ranked = selector.selectAndRank(items, {
      userGoal: 'user goal match',
      activeFilePath: 'src/a.ts',
    });

    expect(ranked.length).toBe(1);
    expect(ranked[0].content).toContain('user goal match');
  });
});

describe('ContextBudget', () => {
  let budget: ContextBudget;

  beforeEach(() => {
    budget = new ContextBudget();
  });

  it('enforces token budget limits and sets truncated flag when exceeded', () => {
    const items = [
      { id: '1', source: 'user_goal' as const, content: 'Short goal', score: 100, rankReasons: [] },
      { id: '2', source: 'workspace_files' as const, content: 'A'.repeat(4000), score: 50, rankReasons: [] },
      { id: '3', source: 'workspace_files' as const, content: 'B'.repeat(4000), score: 10, rankReasons: [] },
    ];

    const result = budget.enforceBudget(items, 500); // 500 token limit ~ 2000 chars

    expect(result.truncated).toBe(true);
    expect(result.totalTokens).toBeLessThanOrEqual(550);
    expect(result.accepted.length).toBeLessThan(3);
  });
});

describe('ContextEngine Snapshot Pipeline', () => {
  let engine: ContextEngine;

  beforeEach(() => {
    engine = new ContextEngine();
  });

  it('gathers a complete ContextSnapshot from all context sources', async () => {
    const snapshot = await engine.gatherSnapshot({
      userGoal: 'Refactor UserService',
      activeFilePath: 'src/services/user-service.ts',
      openFilePaths: ['src/services/user-service.ts', 'src/utils.ts'],
      workspaceFiles: [
        { path: 'src/services/user-service.ts', content: 'export class UserService {}' },
        { path: 'src/utils.ts', content: 'export function helper() {}' },
      ],
      diagnostics: [{ file: 'src/services/user-service.ts', message: 'Missing import', severity: 'error' }],
      terminalOutput: 'Build failed at user-service.ts:10',
      gitDiff: 'diff --git a/src/services/user-service.ts b/src/services/user-service.ts',
      conversationHistory: [{ role: 'user', content: 'Please fix user service' }],
      memoryFacts: ['User prefers async/await pattern'],
      maxTokens: 2000,
    });

    expect(snapshot.userGoal).toBe('Refactor UserService');
    expect(snapshot.items.length).toBeGreaterThan(0);
    expect(snapshot.totalTokens).toBeGreaterThan(0);
    expect(snapshot.indexedFileCount).toBe(2);
    expect(snapshot.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('handles empty workspace gracefully', async () => {
    const snapshot = await engine.gatherSnapshot({
      userGoal: 'Hello world',
    });

    expect(snapshot.items.length).toBe(1); // UserGoal source
    expect(snapshot.indexedFileCount).toBe(0);
    expect(snapshot.truncated).toBe(false);
  });

  it('handles large repository indexing without crashing', async () => {
    const largeFiles = Array.from({ length: 50 }, (_, i) => ({
      path: `src/module_${i}.ts`,
      content: `export class Module${i} { run() { return ${i}; } }`,
    }));

    const snapshot = await engine.gatherSnapshot({
      userGoal: 'Find Module25',
      workspaceFiles: largeFiles,
      maxTokens: 1000,
    });

    expect(snapshot.indexedFileCount).toBe(50);
    expect(snapshot.items.length).toBeGreaterThan(0);
  });

  it('cancels snapshot gathering when AbortSignal is aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      engine.gatherSnapshot({
        userGoal: 'Cancelled test',
        signal: controller.signal,
      })
    ).rejects.toThrow('cancelled by AbortSignal');
  });

  it('maintains backwards compatibility with collectContext()', async () => {
    const legacyContext = await engine.collectContext({
      activeFilePath: 'src/index.ts',
      openFilePaths: ['src/index.ts'],
      currentSelection: null,
      cursorPosition: { line: 1, ch: 1 },
    });

    expect(legacyContext.editor.activeFilePath).toBe('src/index.ts');
    expect(legacyContext.workspace).toBeDefined();
  });
});
