/**
 * engineering-intelligence-engine.ts — Phase 17 Engineering Intelligence Layer
 *
 * Answers engineering questions without calling an LLM whenever possible.
 * Uses pure static analysis by composing existing backend engines (CodeIntelligenceEngine,
 * WorkspaceEngine, ContextEngine, MemoryEngine, VerificationEngine).
 */
import { CodeIntelligenceEngine } from '../code-intelligence/code-intelligence-engine';
export interface ArchitectureSummary {
    layers: Array<{
        name: string;
        description: string;
        moduleCount: number;
        files: string[];
    }>;
    entryPoints: string[];
    moduleGraphNodes: Array<{
        id: string;
        name: string;
        type: string;
        connections: string[];
    }>;
    frameworks: string[];
}
export interface ImpactAnalysisResult {
    target: string;
    affectedFiles: string[];
    affectedSymbols: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    impactedComponents: string[];
}
export interface DeadCodeReport {
    unusedFiles: string[];
    unusedExports: Array<{
        symbol: string;
        filePath: string;
        line: number;
    }>;
    orphanFunctions: string[];
}
export interface DependencyTreeResult {
    internalDependencies: Array<{
        source: string;
        target: string;
        isCircular?: boolean;
    }>;
    externalPackages: Array<{
        name: string;
        version: string;
        isDev?: boolean;
    }>;
    circularDependencies: Array<{
        cycle: string[];
    }>;
}
export interface CallHierarchyResult {
    symbol: string;
    callers: Array<{
        callerName: string;
        filePath: string;
        line: number;
    }>;
    callees: Array<{
        calleeName: string;
        filePath: string;
        line: number;
    }>;
    depth: number;
}
export interface HotspotItem {
    filePath: string;
    complexityScore: number;
    lineCount: number;
    importCount: number;
    exportCount: number;
}
export interface RepositoryHealthReport {
    score: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'F';
    issuesCount: number;
    warnings: string[];
    recommendations: string[];
}
export interface WorkspaceStatsReport {
    totalFiles: number;
    totalLinesOfCode: number;
    languages: Record<string, number>;
    packageCount: number;
    largestFiles: Array<{
        filePath: string;
        lineCount: number;
        sizeBytes: number;
    }>;
    testCoveragePercent: number;
}
export interface FullRepositoryAnalysis {
    health: RepositoryHealthReport;
    stats: WorkspaceStatsReport;
    architecture: ArchitectureSummary;
    entryPoints: string[];
    hotspots: HotspotItem[];
    deadCode: DeadCodeReport;
    dependencies: DependencyTreeResult;
}
import { SymbolProvider } from './providers/symbol-provider';
import { DependencyProvider } from './providers/dependency-provider';
import { ArchitectureProvider } from './providers/architecture-provider';
import { TodoProvider, TodoItem } from './providers/todo-provider';
import { DeadCodeProvider } from './providers/deadcode-provider';
import { GitProvider, GitMetadata } from './providers/git-provider';
import { TestProvider, TestSuiteStats } from './providers/test-provider';
import { IncrementalIndexer } from './incremental-indexer';
export interface FullRepositoryAnalysis {
    health: RepositoryHealthReport;
    stats: WorkspaceStatsReport;
    architecture: ArchitectureSummary;
    entryPoints: string[];
    hotspots: HotspotItem[];
    deadCode: DeadCodeReport;
    dependencies: DependencyTreeResult;
    todos?: TodoItem[];
    git?: GitMetadata;
    testStats?: TestSuiteStats;
}
export declare class EngineeringIntelligenceEngine {
    private readonly codeIntel;
    readonly symbolProvider: SymbolProvider;
    readonly dependencyProvider: DependencyProvider;
    readonly architectureProvider: ArchitectureProvider;
    readonly todoProvider: TodoProvider;
    readonly deadCodeProvider: DeadCodeProvider;
    readonly gitProvider: GitProvider;
    readonly testProvider: TestProvider;
    readonly indexer: IncrementalIndexer;
    constructor(codeIntelEngine?: CodeIntelligenceEngine);
    /**
     * Performs a comprehensive static analysis scan of the repository.
     */
    analyzeRepository(workspaceRoot?: string): Promise<FullRepositoryAnalysis>;
    /**
     * Generates a high-level architectural summary of the application.
     */
    summarizeArchitecture(): ArchitectureSummary;
    /**
     * Detects main entry points in the project.
     */
    findEntryPoints(): string[];
    /**
     * Computes downstream dependencies, callers, and change risk score for a target file or symbol.
     */
    impactAnalysis(target?: string): ImpactAnalysisResult;
    /**
     * Returns internal import dependencies and external package tree.
     */
    dependencyTree(): DependencyTreeResult;
    /**
     * Returns call hierarchy (callers and callees) for a target symbol.
     */
    callHierarchy(symbolName?: string): CallHierarchyResult;
    /**
     * Finds unused files, unreferenced exported symbols, and orphan functions.
     */
    findDeadCode(): DeadCodeReport;
    /**
     * Returns overall workspace statistics.
     */
    workspaceStatistics(): WorkspaceStatsReport;
    /**
     * Finds high complexity files, files with high import counts, and hotspots.
     */
    findHotspots(): HotspotItem[];
    /**
     * Evaluates aggregate repository health.
     */
    repositoryHealth(): RepositoryHealthReport;
}
