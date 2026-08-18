/**
 * entity-store.ts — Dedicated State Entity Store
 *
 * Maintains current state entities (file_list, workspace_stats, file_content, search_results)
 * with a bounded history stack (max 10 items per kind) for multi-turn conversational resolution.
 */

import { ExecutionResultKind } from '../../contracts/execution-result-kind';
import type { ExtractedEntity } from '../extraction/execution-entity-extractor';

export interface IEntityStore {
  set(kind: ExecutionResultKind, entity: ExtractedEntity): void;
  getLatest(kind: ExecutionResultKind): ExtractedEntity | undefined;
  getHistory?(kind: ExecutionResultKind): ExtractedEntity[];
  getAll(): ExtractedEntity[];
  clear(): void;
}

export class EntityStore implements IEntityStore {
  private readonly entities = new Map<ExecutionResultKind, ExtractedEntity>();
  private readonly entityHistory = new Map<ExecutionResultKind, ExtractedEntity[]>();

  set(kind: ExecutionResultKind, entity: ExtractedEntity): void {
    this.entities.set(kind, entity);

    let list = this.entityHistory.get(kind);
    if (!list) {
      list = [];
      this.entityHistory.set(kind, list);
    }
    list.push(entity);
    if (list.length > 10) {
      list.shift();
    }
  }

  getLatest(kind: ExecutionResultKind): ExtractedEntity | undefined {
    return this.entities.get(kind);
  }

  getHistory(kind: ExecutionResultKind): ExtractedEntity[] {
    return this.entityHistory.get(kind) || [];
  }

  getAll(): ExtractedEntity[] {
    return Array.from(this.entities.values());
  }

  clear(): void {
    this.entities.clear();
    this.entityHistory.clear();
  }
}
