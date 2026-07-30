/**
 * repository-analyzer.ts — Phase 25-28 Comprehensive Repository Stack Analyzer
 *
 * Scans workspace directories to detect languages, frameworks, package managers,
 * build systems, CI, Docker, databases, and AI libraries. Generates categorized runtime recommendations.
 */
import { WorkspaceProfile } from '../ai/contracts/execution-contracts';
export interface ComprehensiveProjectAnalysis {
    projectType: string;
    languages: string[];
    frameworks: string[];
    packageManager: string;
    isMonorepo: boolean;
    testFramework?: string;
    ciProvider?: string;
    hasDocker: boolean;
    hasKubernetes: boolean;
    database?: string;
    cloudProvider?: string;
    aiLibraries: string[];
    entryPoints: string[];
    recommendations: WorkspaceProfile['analysis']['runtimeRecommendations'];
}
export declare class RepositoryAnalyzer {
    /**
     * Scans repository root directory to detect full project stack and runtime recommendations.
     */
    analyze(repoPath: string): ComprehensiveProjectAnalysis;
}
