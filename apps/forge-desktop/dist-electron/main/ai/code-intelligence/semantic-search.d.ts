/**
 * semantic-search.ts
 *
 * Semantic search engine performing pure static query operations over
 * SymbolIndex, DependencyGraph, CallGraph, and parsed AST structures.
 */
import type { SymbolIndex, SymbolDeclaration } from './symbol-index';
import type { DependencyGraph } from './dependency-graph';
import type { CallGraph, CallEdge } from './call-graph';
export declare class SemanticSearch {
    private readonly symbolIndex;
    private readonly dependencyGraph;
    private readonly callGraph;
    constructor(symbolIndex: SymbolIndex, dependencyGraph: DependencyGraph, callGraph: CallGraph);
    findClass(name: string): SymbolDeclaration[];
    findFunction(name: string): SymbolDeclaration[];
    implementations(interfaceName: string): SymbolDeclaration[];
    references(symbolName: string): string[];
    callers(symbolName: string): CallEdge[];
    callees(symbolName: string): CallEdge[];
    services(): SymbolDeclaration[];
    reactComponents(): SymbolDeclaration[];
    hooks(): SymbolDeclaration[];
    asyncFunctions(): SymbolDeclaration[];
}
