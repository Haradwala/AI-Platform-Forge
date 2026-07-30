import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';
import { ISymbol } from './repository-types';
export declare class RepositorySearchService {
    private readonly symbolsIndex;
    private readonly graph;
    constructor(symbolsIndex: SymbolIndexService, graph: DependencyGraphService);
    findSymbol(query: string): ISymbol[];
    findReferences(symbolName: string): string[];
    findImplementations(interfaceName: string): ISymbol[];
    findCallers(functionName: string): string[];
    findFile(query: string): string[];
}
