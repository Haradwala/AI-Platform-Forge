/**
 * memory-store.ts
 *
 * In-memory storage layer for MemoryItems with TTL expiration handling for temporary items.
 */

import type { MemoryItem, MemoryType } from './memory-types';

export class MemoryStore {
  private readonly items = new Map<string, MemoryItem>();

  addItem(item: MemoryItem): void {
    this.items.set(item.id, item);
  }

  getItem(id: string): MemoryItem | null {
    const item = this.items.get(id);
    if (!item) return null;
    if (this.isExpired(item)) {
      this.items.delete(id);
      return null;
    }
    return item;
  }

  deleteItem(id: string): boolean {
    return this.items.delete(id);
  }

  clear(): void {
    this.items.clear();
  }

  getAllItems(): MemoryItem[] {
    this.purgeExpired();
    return Array.from(this.items.values());
  }

  getByType(type: MemoryType): MemoryItem[] {
    return this.getAllItems().filter((item) => item.type === type);
  }

  /** Purges expired temporary memory items and returns total purged count. */
  purgeExpired(): number {
    let purged = 0;
    const now = Date.now();
    for (const [id, item] of this.items.entries()) {
      if (this.isExpired(item, now)) {
        this.items.delete(id);
        purged++;
      }
    }
    return purged;
  }

  private isExpired(item: MemoryItem, now = Date.now()): boolean {
    if (item.type === 'temporary' && item.ttlMs && item.ttlMs > 0) {
      return now - item.timestamp >= item.ttlMs;
    }
    return false;
  }
}
