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
export declare class EntityStore implements IEntityStore {
    private readonly entities;
    private readonly entityHistory;
    set(kind: ExecutionResultKind, entity: ExtractedEntity): void;
    getLatest(kind: ExecutionResultKind): ExtractedEntity | undefined;
    getHistory(kind: ExecutionResultKind): ExtractedEntity[];
    getAll(): ExtractedEntity[];
    clear(): void;
}
