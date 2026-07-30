import { RepositorySnapshot, HealthReport, Finding, HealthScanOptions } from '../contracts/health-types';
import type { IDesktopEventBus } from '../../container/service-interfaces';
export declare class RepositoryHealthOrchestrator {
    private snapshotBuilder;
    private registry;
    private findingStore;
    private metricsCalculator;
    private reportGenerator;
    private timelinePublisher;
    private latestSnapshot;
    private latestReport;
    constructor(eventBus?: IDesktopEventBus);
    runFullScan(rootPath: string, options?: HealthScanOptions): Promise<HealthReport>;
    getLatestSnapshot(): RepositorySnapshot | null;
    getLatestReport(): HealthReport | null;
    getFindings(): Finding[];
}
