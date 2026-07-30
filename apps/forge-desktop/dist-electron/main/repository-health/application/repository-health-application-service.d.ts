import { HealthReport, RepositorySnapshot, Finding, HealthScanOptions, FindingSeverity, FindingCategory } from '../contracts/health-types';
import type { IDesktopEventBus } from '../../container/service-interfaces';
export declare class RepositoryHealthApplicationService {
    private orchestrator;
    constructor(eventBus?: IDesktopEventBus);
    scanRepository(rootPath: string, options?: HealthScanOptions): Promise<HealthReport>;
    getHealthReport(): Promise<HealthReport | null>;
    getSnapshot(): Promise<RepositorySnapshot | null>;
    getFindings(severity?: FindingSeverity, category?: FindingCategory): Promise<Finding[]>;
}
