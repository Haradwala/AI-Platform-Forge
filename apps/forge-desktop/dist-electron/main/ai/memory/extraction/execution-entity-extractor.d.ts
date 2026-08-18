/**
 * execution-entity-extractor.ts
 *
 * Execution Entity Extractor — extracts domain entities using payload.kind discriminator.
 */
import type { ExecutionEvent } from '../events/execution-event';
import { ExecutionResultKind } from '../../contracts/execution-result-kind';
export type EntityCategory = 'file_list' | 'file_count' | 'search_results' | 'file_content' | 'code_symbol' | 'terminal_output' | 'error_trace' | 'file_mutation';
export interface ExtractedEntity {
    readonly entityId: string;
    readonly category: EntityCategory;
    readonly kind: ExecutionResultKind;
    readonly key: string;
    readonly value: unknown;
    readonly turnId: string;
    readonly timestamp: string;
}
export declare class ExecutionEntityExtractor {
    /**
     * Extracts typed entities from an array of ExecutionEvent items using payload.kind discriminator.
     */
    extractEntities(events: readonly ExecutionEvent[]): ExtractedEntity[];
    getLatestEntity(events: readonly ExecutionEvent[], category: EntityCategory): ExtractedEntity | undefined;
}
