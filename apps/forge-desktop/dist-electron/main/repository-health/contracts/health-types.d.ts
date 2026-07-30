/**
 * Forge Repository Health Engine Data Models & Contracts
 */
export type FindingSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FindingCategory = 'dead-code' | 'duplicate' | 'dependency' | 'architecture' | 'complexity';
export type FixStrategy = 'delete-file' | 'merge-helper' | 'move-service' | 'split-class' | 'extract-interface' | 'none';
export interface FindingEvidence {
    matchedRules: string[];
    relatedFiles: string[];
    metrics: Record<string, number>;
}
export interface Finding {
    id: string;
    title: string;
    severity: FindingSeverity;
    category: FindingCategory;
    confidence: number;
    file: string;
    line?: number;
    description: string;
    suggestion: string;
    fixStrategy: FixStrategy;
    evidence: FindingEvidence;
    autoFixAvailable: boolean;
    estimatedImpact: 'low' | 'medium' | 'high';
    timestamp: number;
}
export interface FileMetadata {
    relativePath: string;
    absolutePath: string;
    sizeBytes: number;
    lineCount: number;
    hash: string;
    extension: string;
    isTestFile: boolean;
}
export interface ASTNodeInfo {
    exportedClasses: string[];
    exportedInterfaces: string[];
    exportedFunctions: string[];
    importedModules: string[];
    diTokenDeclarations: string[];
    ipcChannelRegistrations: string[];
    eventBusTopicSubscriptions: string[];
    methodCount: number;
    cyclomaticComplexity: number;
    maxNestingDepth: number;
}
export interface RepositorySnapshot {
    id: string;
    timestamp: number;
    rootPath: string;
    totalFiles: number;
    totalLOC: number;
    files: Map<string, FileMetadata>;
    astNodes: Map<string, ASTNodeInfo>;
    dependencyGraph: Map<string, Set<string>>;
    reverseDependencyGraph: Map<string, Set<string>>;
}
export interface AnalyzerResult {
    analyzerName: string;
    executionTimeMs: number;
    findings: Finding[];
}
export interface CategoryScore {
    category: FindingCategory;
    score: number;
    weight: number;
    findingsCount: number;
}
export interface HealthReport {
    id: string;
    timestamp: number;
    overallScore: number;
    categoryScores: CategoryScore[];
    totalLOC: number;
    totalFiles: number;
    totalClasses: number;
    totalInterfaces: number;
    totalDiTokens: number;
    totalIpcRoutes: number;
    totalEventTopics: number;
    findings: Finding[];
    historicalDelta: number;
    scannedAtISO: string;
}
export interface HealthScanOptions {
    forceRefresh?: boolean;
    customRules?: Partial<HealthRuleThresholds>;
}
export interface HealthRuleThresholds {
    maxFileLOC: number;
    maxClassMethods: number;
    maxDependencies: number;
    maxCyclomaticComplexity: number;
    maxNestingDepth: number;
}
export declare const DEFAULT_HEALTH_THRESHOLDS: HealthRuleThresholds;
