/**
 * symbol-indexer.ts
 *
 * Sprint 86 Phase 1 — Workspace Symbol Index
 *
 * Builds and maintains a persistent in-memory index of all TypeScript/JavaScript
 * symbols across a workspace. Supports fast semantic queries:
 *
 *   findSymbol('ResponseGenerationEngine')        → symbol definitions
 *   findReferences('ResponseGenerationEngine')    → all usage sites
 *   findImports('@forge/shared')                  → all imports of a module
 *   listExports('response-generation-engine.ts')  → all exports from a file
 *
 * Uses regex-based extraction with TypeScript-safe patterns. No AST dependency.
 */
export type SymbolKind = 'function' | 'class' | 'interface' | 'type' | 'const' | 'enum' | 'import';
export interface WorkspaceSymbol {
    readonly name: string;
    readonly kind: SymbolKind;
    readonly filePath: string;
    readonly line: number;
    readonly column: number;
    readonly exported: boolean;
}
export interface ImportReference {
    readonly moduleName: string;
    readonly importedName?: string;
    readonly filePath: string;
    readonly line: number;
}
export interface ExportReference {
    readonly name: string;
    readonly filePath: string;
    readonly line: number;
}
export declare class WorkspaceSymbolIndexer {
    private symbolIndex;
    private importIndex;
    private exportIndex;
    private fileCache;
    /** Rebuild the entire index from the given workspace root. */
    rebuildIndex(workspaceRoot: string): Promise<void>;
    /** Incrementally update the index for a single file. */
    updateFile(filePath: string): Promise<void>;
    /**
     * Find all symbol definitions matching the given name (exact match).
     */
    findSymbol(name: string): WorkspaceSymbol[];
    /**
     * Find all usage sites of a symbol (includes definitions and import references).
     */
    findReferences(name: string): WorkspaceSymbol[];
    /**
     * Find all import statements that import from the given module name.
     * Matches exact module name or suffix (e.g., '@forge/shared' matches '@forge/shared').
     */
    findImports(moduleName: string): ImportReference[];
    /**
     * List all exported symbols from a given file path (basename or full path).
     */
    listExports(filePath: string): ExportReference[];
    /** Return a snapshot of index stats. */
    getStats(): {
        fileCount: number;
        symbolCount: number;
        importCount: number;
    };
    private _mergeFileIndex;
    private _removeFileIndex;
}
