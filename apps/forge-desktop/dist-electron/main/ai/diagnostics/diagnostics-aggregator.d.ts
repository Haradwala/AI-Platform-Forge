/**
 * diagnostics-aggregator.ts
 *
 * Sprint 86 Phase 6 — Diagnostics Aggregator
 *
 * Collects, normalizes, and aggregates diagnostic items from multiple sources
 * (Monaco markers, TypeScript compiler output, AI rules).
 */
export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';
export interface DiagnosticRelatedInfo {
    readonly filePath: string;
    readonly line: number;
    readonly column: number;
    readonly message: string;
}
export interface DiagnosticItem {
    readonly id: string;
    readonly filePath: string;
    readonly line: number;
    readonly column: number;
    readonly endLine?: number;
    readonly endColumn?: number;
    readonly severity: DiagnosticSeverity;
    readonly message: string;
    readonly source: 'typescript' | 'eslint' | 'forge-ai' | 'custom';
    readonly code?: string | number;
    readonly relatedInfo?: readonly DiagnosticRelatedInfo[];
}
export declare class DiagnosticsAggregator {
    private diagnosticsMap;
    /**
     * Add or replace diagnostics for a specific file.
     */
    setFileDiagnostics(filePath: string, items: DiagnosticItem[]): void;
    /**
     * Add a single diagnostic item.
     */
    addDiagnostic(item: DiagnosticItem): void;
    /**
     * Get all diagnostics across workspace, optionally filtered by severity.
     */
    getAll(severityFilter?: DiagnosticSeverity[]): DiagnosticItem[];
    /**
     * Get diagnostics for a specific file.
     */
    getForFile(filePath: string): DiagnosticItem[];
    /**
     * Clear diagnostics for a file or clear all.
     */
    clear(filePath?: string): void;
    /**
     * Get total diagnostic count breakdown.
     */
    getStats(): {
        errors: number;
        warnings: number;
        info: number;
        hints: number;
    };
}
