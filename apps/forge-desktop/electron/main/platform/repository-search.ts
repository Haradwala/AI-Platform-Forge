import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';
import { ISymbol } from './repository-types';

export class RepositorySearchService {
  constructor(
    private readonly symbolsIndex: SymbolIndexService,
    private readonly graph: DependencyGraphService
  ) {}

  findSymbol(query: string): ISymbol[] {
    const q = query.toLowerCase();
    return this.symbolsIndex.getAll().filter((s) => s.name.toLowerCase().includes(q));
  }

  findReferences(symbolName: string): string[] {
    return this.graph.getReferences(symbolName);
  }

  findImplementations(interfaceName: string): ISymbol[] {
    return this.symbolsIndex.getAll().filter((s) => s.parent === interfaceName);
  }

  findCallers(functionName: string): string[] {
    return this.graph.getReferences(functionName);
  }

  findFile(query: string): string[] {
    const files = new Set<string>();
    for (const sym of this.symbolsIndex.getAll()) {
      if (sym.file.toLowerCase().includes(query.toLowerCase())) {
        files.add(sym.file);
      }
    }
    return Array.from(files);
  }
}
