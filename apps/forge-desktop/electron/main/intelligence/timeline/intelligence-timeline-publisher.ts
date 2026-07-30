/**
 * intelligence-timeline-publisher.ts — Timeline Event Publisher for Engineering Intelligence Engine
 */

import type { IDesktopEventBus } from '../../container/service-interfaces';
import { IndexJobStatus, ImpactAnalysisReport, DeadCodeReport, AssembledContext } from '../contracts/intelligence-types';
import { IntelligenceTimelineEventPayload } from '../contracts/intelligence-events';

export class IntelligenceTimelinePublisher {
  constructor(private readonly eventBus?: IDesktopEventBus) {}

  publishIndexingStarted(job: IndexJobStatus): void {
    this.emit('intelligence.indexing.started', {
      workspaceRoot: job.workspaceRoot,
      timestamp: job.startedAt,
      jobStatus: job,
      message: `Started repository indexing job [${job.id}]`,
    });
  }

  publishIndexingCompleted(job: IndexJobStatus): void {
    this.emit('intelligence.indexing.completed', {
      workspaceRoot: job.workspaceRoot,
      timestamp: job.finishedAt || Date.now(),
      jobStatus: job,
      message: `Completed repository indexing: ${job.filesIndexed} files indexed in ${job.durationMs}ms`,
    });
  }

  publishImpactAnalysis(workspaceRoot: string, report: ImpactAnalysisReport): void {
    this.emit('intelligence.analysis.impact_calculated', {
      workspaceRoot,
      timestamp: Date.now(),
      impactReport: report,
      message: `Impact analysis completed for ${report.changedFiles.length} files. Risk score: ${report.riskScore}`,
    });
  }

  publishDeadCodeDetected(workspaceRoot: string, report: DeadCodeReport): void {
    this.emit('intelligence.analysis.dead_code_detected', {
      workspaceRoot,
      timestamp: report.scannedAt,
      deadCodeReport: report,
      message: `Dead code analysis found ${report.unusedExports.length} unused exports`,
    });
  }

  publishContextAssembled(workspaceRoot: string, contextUsage: AssembledContext['tokenUsage']): void {
    this.emit('intelligence.context.assembled', {
      workspaceRoot,
      timestamp: Date.now(),
      contextUsage,
      message: `Assembled prompt context: ${contextUsage.contextTokens} tokens`,
    });
  }

  private emit(eventType: string, payload: IntelligenceTimelineEventPayload): void {
    if (this.eventBus) {
      this.eventBus.emit('engineering.timeline', {
        type: eventType,
        payload,
      });
    }
  }
}
