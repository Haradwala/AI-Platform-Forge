/**
 * reference-engine.ts
 *
 * Sprint 86 Phase 2 — True Find References Engine
 *
 * Scans workspace files for all occurrences of a symbol name, classifies each
 * occurrence (definition, usage, import, re-export, type-reference), extracts
 * trimmed line previews, deduplicates entries, and provides ordinal access.
 */
import type { WorkspaceSymbolIndexer } from './symbol-indexer';
export type ReferenceKind = 'definition' | 'usage' | 'import' | 're-export' | 'type-reference';
export interface ReferenceLocation {
    readonly symbol: string;
    readonly filePath: string;
    readonly line: number;
    readonly column: number;
    readonly preview: string;
    readonly kind: ReferenceKind;
    readonly scope?: string;
}
export interface ReferenceResult {
    readonly symbol: string;
    readonly definitions: readonly ReferenceLocation[];
    readonly usages: readonly ReferenceLocation[];
    readonly totalCount: number;
    readonly ordered: readonly ReferenceLocation[];
}
/** Helper to check if match index is inside single-line comment or string literal. */
export declare function isInCommentOrString(line: string, index: number): boolean;
/** Classifies usage based on line patterns. */
export declare function classifyUsage(line: string, symbolName: string): ReferenceKind;
export declare class ReferenceEngine {
    private readonly indexer;
    private cache;
    constructor(indexer: WorkspaceSymbolIndexer);
    /**
     * Find all occurrences of a symbol across the workspace.
     */
    findUsages(symbolName: string): ReferenceResult;
    /**
     * Return the N-th reference (0-indexed) for ordinal navigation.
     */
    getByOrdinal(symbolName: string, ordinal: number): ReferenceLocation | null;
    /**
     * Invalidate cached reference results for a file (or clear all).
     */
    invalidateFile(_filePath?: string): void;
}
