/**
 * repository-indexer.ts
 *
 * Incremental AST / regex indexer for workspace files.
 * Indexes files, folders, symbols, imports, exports, classes, and functions.
 */
export interface IndexedSymbol {
    name: string;
    kind: 'class' | 'function' | 'import' | 'export' | 'variable';
    filePath: string;
    line: number;
}
export interface IndexedFile {
    path: string;
    folder: string;
    imports: string[];
    exports: string[];
    symbols: IndexedSymbol[];
    mtime: number;
}
export declare class RepositoryIndexer {
    private readonly files;
    clear(): void;
    indexWorkspace(files: Array<{
        path: string;
        content: string;
        mtime?: number;
    }>, signal?: AbortSignal): Promise<void>;
    updateFile(filePath: string, content: string, mtime?: number): void;
    removeFile(filePath: string): void;
    getFile(filePath: string): IndexedFile | null;
    getAllFiles(): IndexedFile[];
    getImports(filePath: string): string[];
    searchSymbols(query: string): IndexedSymbol[];
}
