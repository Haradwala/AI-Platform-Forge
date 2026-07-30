/**
 * environment-doctor.ts — Phase 23 Environment Diagnostics & Doctor
 */
export interface EnvironmentIssue {
    id: string;
    severity: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    recommendation: string;
    affectedRuntimeId?: string;
}
export interface EnvironmentVariableStatus {
    key: string;
    status: 'set' | 'missing';
    isSecret: boolean;
    value?: string;
}
export interface EnvironmentDiagnostics {
    systemInfo: {
        platform: string;
        arch: string;
        nodeVersion: string;
        pathDirsCount: number;
        pathDirs: string[];
    };
    issues: EnvironmentIssue[];
    missingDependencies: string[];
    environmentVariables: EnvironmentVariableStatus[];
    timestamp: number;
}
export declare class EnvironmentDoctor {
    /**
     * Evaluates system dependencies, environment variables, PATH configuration, and runtime requirements.
     */
    runDiagnostics(): Promise<EnvironmentDiagnostics>;
    private checkDependency;
}
