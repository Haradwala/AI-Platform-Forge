/**
 * Event payload contracts for engineering.timeline repository scan stream
 */
export interface RepositoryScanStartedPayload {
    scanId: string;
    rootPath: string;
    timestamp: number;
}
export interface RepositoryScanProgressPayload {
    scanId: string;
    stage: 'workspace_scan' | 'ast_builder' | 'analyzers_execution' | 'report_generation';
    progressPercent: number;
    message: string;
}
export interface RepositoryFindingDetectedPayload {
    scanId: string;
    findingId: string;
    title: string;
    severity: string;
    category: string;
    file: string;
}
export interface RepositoryScanCompletedPayload {
    scanId: string;
    overallScore: number;
    totalFindings: number;
    durationMs: number;
    historicalDelta: number;
}
