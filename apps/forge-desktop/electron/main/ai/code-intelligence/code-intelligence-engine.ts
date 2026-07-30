/**
 * code-intelligence-engine.ts
 *
 * Phase 9 — Code Intelligence Engine Facade.
 *
 * Unified facade integrating RepositoryScanner, ASTParser, SymbolIndex,
 * DependencyGraph, CallGraph, and SemanticSearch.
 * Supports incremental updates, AbortSignal cancellation, and zero LLM calls.
 */

import { RepositoryScanner, type ScannedFile, type ScannedPackage } from './repository-scanner';
import { ASTParser, type ASTParseResult } from './ast-parser';
import { SymbolIndex, type SymbolDeclaration } from './symbol-index';
import { DependencyGraph } from './dependency-graph';
import { CallGraph } from './call-graph';
import { SemanticSearch } from './semantic-search';

export interface RepositoryStats {
  totalFiles: number;
  totalPackages: number;
  totalDeclarations: number;
  totalReferences: number;
  totalCallEdges: number;
  classesCount: number;
  functionsCount: number;
  jsxComponentsCount: number;
  scanDurationMs: number;
}

export interface ICodeIntelligenceEngine {
  scanWorkspace(
    files: Array<{ path: string; content?: string; size?: number; mtime?: number }>,
    signal?: AbortSignal
  ): Promise<RepositoryStats>;
  updateFile(filePath: string, content: string): void;
  removeFile(filePath: string): void;
  search(): SemanticSearch;
  symbol(name: string): SymbolDeclaration[];
  callGraph(): CallGraph;
  dependencyGraph(): DependencyGraph;
  repositoryStats(): RepositoryStats;
}

export class CodeIntelligenceEngine implements ICodeIntelligenceEngine {
  private readonly scanner = new RepositoryScanner();
  private readonly parser = new ASTParser();
  private readonly symbolIndex = new SymbolIndex();
  private readonly depGraph = new DependencyGraph();
  private readonly cGraph = new CallGraph();
  private readonly semanticSearchEngine: SemanticSearch;

  constructor() {
    this.semanticSearchEngine = new SemanticSearch(
      this.symbolIndex,
      this.depGraph,
      this.cGraph
    );
  }

  async scanWorkspace(
    files: Array<{ path: string; content?: string; size?: number; mtime?: number }>,
    signal?: AbortSignal
  ): Promise<RepositoryStats> {
    const start = Date.now();

    this.scanner.clear();
    this.symbolIndex.clear();
    this.depGraph.clear();
    this.cGraph.clear();

    const { files: scannedFiles, packages } = await this.scanner.scanWorkspace(files, signal);

    for (const pkg of packages) {
      this.depGraph.addPackageDependencies(pkg.name, {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      });
    }

    for (const f of files) {
      if (signal?.aborted) {
        throw new Error('Code intelligence scan cancelled by AbortSignal.');
      }
      if (f.content && (f.path.endsWith('.ts') || f.path.endsWith('.tsx') || f.path.endsWith('.js') || f.path.endsWith('.jsx'))) {
        this.indexFileContent(f.path, f.content);
      }
    }

    return this.buildStats(Date.now() - start);
  }

  updateFile(filePath: string, content: string): void {
    this.removeFile(filePath);
    this.scanner.addFile(filePath, content);
    this.indexFileContent(filePath, content);
  }

  removeFile(filePath: string): void {
    this.scanner.removeFile(filePath);
    this.symbolIndex.removeFileSymbols(filePath);
    this.depGraph.removeFile(filePath);
    this.cGraph.removeFileCalls(filePath);
  }

  search(): SemanticSearch {
    return this.semanticSearchEngine;
  }

  symbol(name: string): SymbolDeclaration[] {
    return this.symbolIndex.findByName(name);
  }

  callGraph(): CallGraph {
    return this.cGraph;
  }

  dependencyGraph(): DependencyGraph {
    return this.depGraph;
  }

  repositoryStats(): RepositoryStats {
    return this.buildStats(0);
  }

  private indexFileContent(filePath: string, content: string): void {
    const ast = this.parser.parse(filePath, content);

    // Index Imports
    for (const imp of ast.imports) {
      this.depGraph.addFileImport(filePath, imp.moduleSpecifier);
      for (const name of imp.namedImports) {
        this.depGraph.addSymbolReference(name, filePath);
      }
    }

    // Index Classes
    for (const cls of ast.classes) {
      const id = `${filePath}::class::${cls.name}::${cls.line}`;
      this.symbolIndex.addDeclaration({
        id,
        name: cls.name,
        kind: 'class',
        filePath,
        line: cls.line,
        isExported: cls.isExported,
        details: { extends: cls.extends, implements: cls.implements },
      });
      if (cls.name.endsWith('Service') || cls.name.endsWith('Engine')) {
        this.depGraph.addServiceConsumer(cls.name, filePath);
      }
    }

    // Index Interfaces
    for (const iface of ast.interfaces) {
      const id = `${filePath}::interface::${iface.name}::${iface.line}`;
      this.symbolIndex.addDeclaration({
        id,
        name: iface.name,
        kind: 'interface',
        filePath,
        line: iface.line,
        isExported: iface.isExported,
        details: { extends: iface.extends },
      });
    }

    // Index Functions
    for (const fn of ast.functions) {
      const id = `${filePath}::function::${fn.name}::${fn.line}`;
      this.symbolIndex.addDeclaration({
        id,
        name: fn.name,
        kind: 'function',
        filePath,
        line: fn.line,
        isExported: fn.isExported,
        details: { isAsync: fn.isAsync },
      });
    }

    // Index JSX Components
    for (const jsx of ast.jsxComponents) {
      const id = `${filePath}::jsx::${jsx.name}::${jsx.line}`;
      this.symbolIndex.addDeclaration({
        id,
        name: jsx.name,
        kind: 'jsx_component',
        filePath,
        line: jsx.line,
        isExported: true,
      });
    }

    // Index Calls
    for (const call of ast.calls) {
      if (call.callerName) {
        this.cGraph.addCall({
          caller: call.callerName,
          callee: call.calleeName,
          isAsync: call.isAsync,
          filePath,
          line: call.line,
        });
      }
      this.depGraph.addSymbolReference(call.calleeName, filePath);
    }
  }

  private buildStats(durationMs: number): RepositoryStats {
    const declarations = this.symbolIndex.getAllDeclarations();
    return {
      totalFiles: this.scanner.getFiles().length,
      totalPackages: this.scanner.getPackages().length,
      totalDeclarations: declarations.length,
      totalReferences: 0,
      totalCallEdges: this.cGraph.getAllEdges().length,
      classesCount: declarations.filter((d) => d.kind === 'class').length,
      functionsCount: declarations.filter((d) => d.kind === 'function').length,
      jsxComponentsCount: declarations.filter((d) => d.kind === 'jsx_component').length,
      scanDurationMs: durationMs,
    };
  }
}
