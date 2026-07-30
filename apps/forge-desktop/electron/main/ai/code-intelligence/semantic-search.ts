/**
 * semantic-search.ts
 *
 * Semantic search engine performing pure static query operations over
 * SymbolIndex, DependencyGraph, CallGraph, and parsed AST structures.
 */

import type { SymbolIndex, SymbolDeclaration } from './symbol-index';
import type { DependencyGraph } from './dependency-graph';
import type { CallGraph, CallEdge } from './call-graph';

export class SemanticSearch {
  constructor(
    private readonly symbolIndex: SymbolIndex,
    private readonly dependencyGraph: DependencyGraph,
    private readonly callGraph: CallGraph
  ) {}

  findClass(name: string): SymbolDeclaration[] {
    return this.symbolIndex.findByName(name).filter((s) => s.kind === 'class');
  }

  findFunction(name: string): SymbolDeclaration[] {
    return this.symbolIndex.findByName(name).filter((s) => s.kind === 'function' || s.kind === 'method');
  }

  implementations(interfaceName: string): SymbolDeclaration[] {
    return this.symbolIndex
      .getAllDeclarations()
      .filter((s) => s.kind === 'class' && s.details?.implements?.includes(interfaceName));
  }

  references(symbolName: string): string[] {
    return this.dependencyGraph.getSymbolReferences(symbolName);
  }

  callers(symbolName: string): CallEdge[] {
    return this.callGraph.getCallers(symbolName);
  }

  callees(symbolName: string): CallEdge[] {
    return this.callGraph.getCallees(symbolName);
  }

  services(): SymbolDeclaration[] {
    return this.symbolIndex
      .getAllDeclarations()
      .filter((s) => s.name.endsWith('Service') || s.name.endsWith('Engine') || s.name.endsWith('Manager'));
  }

  reactComponents(): SymbolDeclaration[] {
    return this.symbolIndex.getAllDeclarations().filter((s) => s.kind === 'jsx_component');
  }

  hooks(): SymbolDeclaration[] {
    return this.symbolIndex
      .getAllDeclarations()
      .filter((s) => s.name.startsWith('use') && s.kind === 'function');
  }

  asyncFunctions(): SymbolDeclaration[] {
    return this.symbolIndex
      .getAllDeclarations()
      .filter((s) => (s.kind === 'function' || s.kind === 'method') && s.details?.isAsync);
  }
}
