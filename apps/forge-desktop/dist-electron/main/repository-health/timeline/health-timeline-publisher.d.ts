import type { IDesktopEventBus } from '../../container/service-interfaces';
import { HealthReport, Finding } from '../contracts/health-types';
export declare class HealthTimelinePublisher {
    private readonly eventBus?;
    constructor(eventBus?: IDesktopEventBus | undefined);
    publishScanStarted(scanId: string, rootPath: string): void;
    publishScanProgress(scanId: string, stage: string, progressPercent: number, message: string): void;
    publishFindingDetected(scanId: string, finding: Finding): void;
    publishScanCompleted(scanId: string, report: HealthReport, durationMs: number): void;
    private emit;
}
