/**
 * memory-engine.test.ts
 *
 * Unit test suite for Phase 7 MemoryEngine.
 * Covers:
 *  - Storage across 6 memory types
 *  - Hybrid keyword + semantic retrieval & relevance ranking
 *  - Duplicate detection & merging consolidation
 *  - Temporary memory TTL expiration
 *  - AbortSignal cancellation
 *  - Empty state & snapshot reporting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryEngine } from '../electron/main/ai/memory/memory-engine';

describe('MemoryEngine', () => {
  let memoryEngine: MemoryEngine;

  beforeEach(() => {
    memoryEngine = new MemoryEngine();
  });

  it('stores and retrieves memory items across all 6 memory types', async () => {
    memoryEngine.store({ type: 'conversation', content: 'User requested dark mode' });
    memoryEngine.store({ type: 'workspace', content: 'Monorepo uses pnpm workspaces' });
    memoryEngine.store({ type: 'semantic', content: 'Dependency Injection container pattern' });
    memoryEngine.store({ type: 'project', content: 'Project name is Forge' });
    memoryEngine.store({ type: 'user', content: 'User prefers TypeScript' });
    memoryEngine.store({ type: 'temporary', content: 'Temp cache token', ttlMs: 5000 });

    const snapshot = memoryEngine.getSnapshot();
    expect(snapshot.totalItems).toBe(6);
    expect(snapshot.itemsByType.conversation).toBe(1);
    expect(snapshot.itemsByType.user).toBe(1);
    expect(snapshot.itemsByType.temporary).toBe(1);
  });

  it('ranks retrieved items by hybrid keyword match, importance, and type weights', async () => {
    memoryEngine.store({
      type: 'conversation',
      content: 'General conversation log about build process',
      importance: 3,
    });

    memoryEngine.store({
      type: 'user',
      content: 'Critical user preference: build strictly with pnpm',
      importance: 9,
      keywords: ['build', 'pnpm'],
    });

    const results = await memoryEngine.retrieve({ query: 'build' });
    expect(results.length).toBe(2);
    expect(results[0].type).toBe('user'); // User preference with high importance & keyword match should rank #1
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('purges expired temporary memories automatically on retrieval / consolidation', async () => {
    memoryEngine.store({
      type: 'temporary',
      content: 'Expired token',
      ttlMs: 10, // 10ms TTL
      timestamp: Date.now() - 50, // 50ms ago -> expired!
    });

    memoryEngine.store({
      type: 'project',
      content: 'Persistent project setting',
    });

    const snapshotBefore = memoryEngine.getSnapshot();
    expect(snapshotBefore.totalItems).toBe(1); // Expired item purged during snapshot scan
    expect(snapshotBefore.itemsByType.temporary).toBe(0);
  });

  it('consolidates duplicate memory items by merging keywords and keeping primary item', async () => {
    memoryEngine.store({
      type: 'conversation',
      content: 'Database connection retry policy',
      keywords: ['db', 'retry'],
      importance: 8,
    });

    memoryEngine.store({
      type: 'conversation',
      content: 'Database connection retry policy',
      keywords: ['sql', 'reconnect'],
      importance: 5,
    });

    const consolidateResult = await memoryEngine.consolidate();
    expect(consolidateResult.mergedCount).toBe(1);

    const snapshot = memoryEngine.getSnapshot();
    expect(snapshot.totalItems).toBe(1);
    expect(snapshot.items[0].importance).toBe(8);
    expect(snapshot.items[0].keywords).toEqual(expect.arrayContaining(['db', 'retry', 'sql', 'reconnect']));
  });

  it('cancels retrieval when AbortSignal is pre-aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      memoryEngine.retrieve({ query: 'test', signal: controller.signal })
    ).rejects.toThrow('cancelled by AbortSignal');
  });

  it('handles empty memory state and deletion cleanly', async () => {
    const emptySnapshot = memoryEngine.getSnapshot();
    expect(emptySnapshot.totalItems).toBe(0);

    const item = memoryEngine.store({ type: 'user', content: 'Temporary item to delete' });
    expect(memoryEngine.getSnapshot().totalItems).toBe(1);

    memoryEngine.deleteItem(item.id);
    expect(memoryEngine.getSnapshot().totalItems).toBe(0);
  });
});
