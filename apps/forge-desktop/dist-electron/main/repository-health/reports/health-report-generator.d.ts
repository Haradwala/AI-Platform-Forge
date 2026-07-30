import { RepositorySnapshot, Finding, HealthReport } from '../contracts/health-types';
import { CalculatedMetrics } from '../metrics/repository-metrics-calculator';
export declare class HealthReportGenerator {
    private lastReportScore;
    generateReport(snapshot: RepositorySnapshot, findings: Finding[], metrics: CalculatedMetrics): HealthReport;
}
