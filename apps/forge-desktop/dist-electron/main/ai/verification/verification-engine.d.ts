import type { IVerificationReport, VerificationPolicy } from './verification-types';
import type { VerificationPipeline } from './verification-pipeline';
import type { VerificationMetrics } from './verification-metrics';
import type { IDesktopLogger } from '../../container/service-interfaces';
export declare class VerificationEngine {
    private readonly pipeline;
    private readonly metricsTracker;
    private readonly logger;
    constructor(pipeline: VerificationPipeline, metricsTracker: VerificationMetrics, logger: IDesktopLogger);
    verify(policy: VerificationPolicy, workspaceRoot: string | null): Promise<IVerificationReport>;
}
