import type { IDesktopEventBus } from '../../container/service-interfaces';
import { HealthReport, Finding } from '../contracts/health-types';

export class HealthTimelinePublisher {
  constructor(private readonly eventBus?: IDesktopEventBus) {}

  publishScanStarted(scanId: string, rootPath: string): void {
    this.emit('repository.scan.started', { scanId, rootPath });
  }

  publishScanProgress(scanId: string, stage: string, progressPercent: number, message: string): void {
    this.emit('repository.scan.progress', { scanId, stage, progressPercent, message });
  }

  publishFindingDetected(scanId: string, finding: Finding): void {
    this.emit('repository.deadcode.detected', {
      scanId,
      findingId: finding.id,
      title: finding.title,
      severity: finding.severity,
      category: finding.category,
      file: finding.file
    });
  }

  publishScanCompleted(scanId: string, report: HealthReport, durationMs: number): void {
    this.emit('repository.scan.completed', {
      scanId,
      overallScore: report.overallScore,
      totalFindings: report.findings.length,
      durationMs,
      historicalDelta: report.historicalDelta
    });
  }

  private emit(eventType: string, payload: Record<string, any>): void {
    if (this.eventBus) {
      this.eventBus.emit('engineering.timeline', {
        type: eventType,
        timestamp: Date.now(),
        payload
      });
    }
  }
}
