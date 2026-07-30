"use strict";
/**
 * intelligence-timeline-publisher.ts — Timeline Event Publisher for Engineering Intelligence Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceTimelinePublisher = void 0;
class IntelligenceTimelinePublisher {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    publishIndexingStarted(job) {
        this.emit('intelligence.indexing.started', {
            workspaceRoot: job.workspaceRoot,
            timestamp: job.startedAt,
            jobStatus: job,
            message: `Started repository indexing job [${job.id}]`,
        });
    }
    publishIndexingCompleted(job) {
        this.emit('intelligence.indexing.completed', {
            workspaceRoot: job.workspaceRoot,
            timestamp: job.finishedAt || Date.now(),
            jobStatus: job,
            message: `Completed repository indexing: ${job.filesIndexed} files indexed in ${job.durationMs}ms`,
        });
    }
    publishImpactAnalysis(workspaceRoot, report) {
        this.emit('intelligence.analysis.impact_calculated', {
            workspaceRoot,
            timestamp: Date.now(),
            impactReport: report,
            message: `Impact analysis completed for ${report.changedFiles.length} files. Risk score: ${report.riskScore}`,
        });
    }
    publishDeadCodeDetected(workspaceRoot, report) {
        this.emit('intelligence.analysis.dead_code_detected', {
            workspaceRoot,
            timestamp: report.scannedAt,
            deadCodeReport: report,
            message: `Dead code analysis found ${report.unusedExports.length} unused exports`,
        });
    }
    publishContextAssembled(workspaceRoot, contextUsage) {
        this.emit('intelligence.context.assembled', {
            workspaceRoot,
            timestamp: Date.now(),
            contextUsage,
            message: `Assembled prompt context: ${contextUsage.contextTokens} tokens`,
        });
    }
    emit(eventType, payload) {
        if (this.eventBus) {
            this.eventBus.emit('engineering.timeline', {
                type: eventType,
                payload,
            });
        }
    }
}
exports.IntelligenceTimelinePublisher = IntelligenceTimelinePublisher;
//# sourceMappingURL=intelligence-timeline-publisher.js.map