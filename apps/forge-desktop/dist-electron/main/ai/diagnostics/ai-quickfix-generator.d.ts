/**
 * ai-quickfix-generator.ts
 *
 * Sprint 86 Phase 6 — AI Quick Fix Generator
 *
 * Generates rule-based or AI-assisted quick fix suggestions for code diagnostics.
 */
import type { DiagnosticItem } from './diagnostics-aggregator';
export interface TextEdit {
    readonly filePath: string;
    readonly startLine: number;
    readonly startColumn: number;
    readonly endLine: number;
    readonly endColumn: number;
    readonly newText: string;
}
export interface WorkspaceEdit {
    readonly id: string;
    readonly description: string;
    readonly edits: readonly TextEdit[];
    readonly createdAt: string;
}
export interface QuickFixSuggestion {
    readonly id: string;
    readonly diagnosticId: string;
    readonly title: string;
    readonly description: string;
    readonly edit: WorkspaceEdit;
    readonly confidence: number;
    readonly source: 'ai' | 'rule-based';
    readonly isPreferred: boolean;
}
export declare class AiQuickFixGenerator {
    /**
     * Generate quick fix suggestions for a diagnostic item.
     */
    generateFix(diagnostic: DiagnosticItem): Promise<QuickFixSuggestion[]>;
}
