/**
 * dependency-graph-engine.ts
 *
 * Sprint 86 Phase 3 — Dependency & Import Graph Engine
 *
 * Constructs and queries workspace-wide import graphs for files and packages.
 * Supports path resolution, direct/transitive dependency queries, neighborhood subgraphs,
 * and Tarjan's strongly connected components algorithm for cycle detection.
 */
import type { WorkspaceSymbolIndexer } from './symbol-indexer';
export interface DependencyNode {
    readonly id: string;
    readonly label: string;
    readonly dependencies: readonly string[];
    readonly dependents: readonly string[];
    readonly inCycle: boolean;
    readonly depth: number;
}
export interface DependencyEdge {
    readonly from: string;
    readonly to: string;
    readonly importedSymbols: readonly string[];
}
export interface DependencyGraph {
    readonly nodes: readonly DependencyNode[];
    readonly edges: readonly DependencyEdge[];
    readonly cycles: readonly string[][];
    readonly entryPoints: readonly string[];
    readonly stats: {
        readonly nodeCount: number;
        readonly edgeCount: number;
        readonly cycleCount: number;
        readonly maxDepth: number;
    };
}
export declare class DependencyGraphEngine {
    private readonly indexer;
    private fileGraph;
    private reverseGraph;
    private edgeMap;
    constructor(indexer: WorkspaceSymbolIndexer);
    /**
     * Rebuild the file import graph from the WorkspaceSymbolIndexer importIndex.
     */
    buildFileGraph(): void;
    /**
     * Resolves a relative or aliased import path relative to the referencing file.
     */
    resolveImportPath(fromFile: string, importSpec: string): string | null;
    /**
     * Get direct dependencies of a file (what it imports).
     */
    getFileDependencies(filePath: string): string[];
    /**
     * Get direct dependents of a file (files that import it).
     */
    getFileDependents(filePath: string): string[];
    /**
     * Get transitive dependencies up to maxDepth (BFS).
     */
    getTransitiveDeps(filePath: string, maxDepth?: number): string[];
    /**
     * Detect strongly connected components with >1 node using Tarjan's Algorithm.
     */
    detectCycles(): string[][];
    /**
     * Return a neighborhood subgraph around a center file.
     */
    getSubgraph(centerPath: string, radius?: number): DependencyGraph;
    /**
     * Export complete DependencyGraph object.
     */
    toGraph(): DependencyGraph;
    /** Invalidate the graph cache. */
    invalidate(): void;
    private _ensureGraphBuilt;
    private _exportGraphForNodes;
}
