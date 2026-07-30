/**
 * symbol-provider.ts — Phase 25-28 Symbol Provider
 *
 * Extracts AST symbols, declarations, and call hierarchy snippets across files.
 */
export interface SymbolEntry {
    name: string;
    kind: 'function' | 'class' | 'interface' | 'variable' | 'type';
    filePath: string;
    line: number;
}
export declare class SymbolProvider {
    getSymbols(workspaceRoot: string): SymbolEntry[];
}
