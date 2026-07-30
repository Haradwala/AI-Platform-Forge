/**
 * memory-types.ts
 *
 * Data types and interfaces for Phase 7 Memory Engine.
 * Supports memory types: conversation, workspace, semantic, project, user, temporary.
 */

export type MemoryType =
  | 'conversation'
  | 'workspace'
  | 'semantic'
  | 'project'
  | 'user'
  | 'temporary';

export interface MemoryItem {
  id: string;
  type: MemoryType;
  content: string;
  keywords?: string[];
  importance?: number; // Scale 1 - 10 (default: 5)
  timestamp: number;
  ttlMs?: number; // Expiration duration in ms for temporary memory
  metadata?: Record<string, any>;
}

export interface ScoredMemoryItem extends MemoryItem {
  score: number;
  matchReasons: string[];
}

export interface MemoryQueryOptions {
  query?: string;
  types?: MemoryType[];
  minImportance?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface MemorySnapshot {
  timestamp: string;
  totalItems: number;
  itemsByType: Record<MemoryType, number>;
  items: MemoryItem[];
}

export interface IMemoryEngine {
  store(item: Partial<MemoryItem> & { type: MemoryType; content: string }): MemoryItem;
  retrieve(options?: MemoryQueryOptions): Promise<ScoredMemoryItem[]>;
  consolidate(): Promise<{ mergedCount: number; purgedCount: number }>;
  getSnapshot(): MemorySnapshot;
  deleteItem(id: string): void;
  clear(): void;
}
