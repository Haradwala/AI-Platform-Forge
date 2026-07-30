import type { IVerificationReport, VerificationPolicy } from './verification-types';
import type { VerificationPipeline } from './verification-pipeline';
import type { VerificationMetrics } from './verification-metrics';
import type { IDesktopLogger } from '../../container/service-interfaces';

export class VerificationEngine {
  constructor(
    private readonly pipeline: VerificationPipeline,
    private readonly metricsTracker: VerificationMetrics,
    private readonly logger: IDesktopLogger
  ) {}

  async verify(policy: VerificationPolicy, workspaceRoot: string | null): Promise<IVerificationReport> {
    this.logger.info(`[VerificationEngine] Initiating verification flow under policy: "${policy}"`);
    const report = await this.pipeline.run(policy, workspaceRoot);

    this.metricsTracker.addMetrics({
      compileTimeMs: Math.floor(report.durationMs * 0.25),
      lintTimeMs: Math.floor(report.durationMs * 0.25),
      testTimeMs: Math.floor(report.durationMs * 0.25),
      scanTimeMs: Math.floor(report.durationMs * 0.25),
    });

    return report;
  }
}
