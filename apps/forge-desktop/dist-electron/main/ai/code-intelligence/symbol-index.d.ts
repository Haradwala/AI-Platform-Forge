/**
 * symbol-index.ts
 *
 * Global symbol table providing O(1) lookup by name for declarations and references.
 * Tracks symbol kinds, file locations, line numbers, and export visibility.
 */
export type SymbolKind = 'class' | 'interface' | 'enum' | 'function' | 'method' | 'variable' | 'jsx_component';
export interface SymbolDeclaration {
    id: string;
    name: string;
    kind: SymbolKind;
    filePath: string;
    line: number;
    isExported: boolean;
    details?: Record<string, any>;
}
export interface SymbolReference {
    symbolId: string;
    symbolName: string;
    filePath: string;
    line: number;
}
export declare class SymbolIndex {
    private readonly declarationsByName;
    private readonly declarationsById;
    private readonly referencesBySymbolName;
    private readonly fileToSymbolIds;
    clear(): void;
    addDeclaration(decl: SymbolDeclaration): void;
    addReference(ref: SymbolReference): void;
    findByName(name: string): SymbolDeclaration[];
    getById(id: string): SymbolDeclaration | null;
    getReferences(symbolName: string): SymbolReference[];
    removeFileSymbols(filePath: string): void;
    getAllDeclarations(): SymbolDeclaration[];
}
