import { RepositorySnapshot } from '../contracts/health-types';
export interface CalculatedMetrics {
    totalFiles: number;
    totalLOC: number;
    totalClasses: number;
    totalInterfaces: number;
    totalDiTokens: number;
    totalIpcRoutes: number;
    totalEventTopics: number;
}
export declare class RepositoryMetricsCalculator {
    calculate(snapshot: RepositorySnapshot): CalculatedMetrics;
}
