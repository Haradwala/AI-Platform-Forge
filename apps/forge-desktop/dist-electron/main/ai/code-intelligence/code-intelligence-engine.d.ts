/**
 * code-intelligence-engine.ts
 *
 * Phase 9 — Code Intelligence Engine Facade.
 *
 * Unified facade integrating RepositoryScanner, ASTParser, SymbolIndex,
 * DependencyGraph, CallGraph, and SemanticSearch.
 * Supports incremental updates, AbortSignal cancellation, and zero LLM calls.
 */
import { type SymbolDeclaration } from './symbol-index';
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
    scanWorkspace(files: Array<{
        path: string;
        content?: string;
        size?: number;
        mtime?: number;
    }>, signal?: AbortSignal): Promise<RepositoryStats>;
    updateFile(filePath: string, content: string): void;
    removeFile(filePath: string): void;
    search(): SemanticSearch;
    symbol(name: string): SymbolDeclaration[];
    callGraph(): CallGraph;
    dependencyGraph(): DependencyGraph;
    repositoryStats(): RepositoryStats;
}
export declare class CodeIntelligenceEngine implements ICodeIntelligenceEngine {
    private readonly scanner;
    private readonly parser;
    private readonly symbolIndex;
    private readonly depGraph;
    private readonly cGraph;
    private readonly semanticSearchEngine;
    constructor();
    scanWorkspace(files: Array<{
        path: string;
        content?: string;
        size?: number;
        mtime?: number;
    }>, signal?: AbortSignal): Promise<RepositoryStats>;
    updateFile(filePath: string, content: string): void;
    removeFile(filePath: string): void;
    search(): SemanticSearch;
    symbol(name: string): SymbolDeclaration[];
    callGraph(): CallGraph;
    dependencyGraph(): DependencyGraph;
    repositoryStats(): RepositoryStats;
    private indexFileContent;
    private buildStats;
}
