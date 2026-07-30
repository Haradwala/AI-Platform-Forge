import { ISymbol } from './repository-types';
export declare class SymbolIndexService {
    private readonly symbols;
    addSymbols(fileSymbols: ISymbol[]): void;
    removeSymbolsForFile(filePath: string): void;
    getSymbol(id: string): ISymbol | undefined;
    getAll(): ISymbol[];
    clear(): void;
    private resolveParentChildRelations;
}
