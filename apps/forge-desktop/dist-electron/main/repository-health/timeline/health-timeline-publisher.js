"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthTimelinePublisher = void 0;
class HealthTimelinePublisher {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    publishScanStarted(scanId, rootPath) {
        this.emit('repository.scan.started', { scanId, rootPath });
    }
    publishScanProgress(scanId, stage, progressPercent, message) {
        this.emit('repository.scan.progress', { scanId, stage, progressPercent, message });
    }
    publishFindingDetected(scanId, finding) {
        this.emit('repository.deadcode.detected', {
            scanId,
            findingId: finding.id,
            title: finding.title,
            severity: finding.severity,
            category: finding.category,
            file: finding.file
        });
    }
    publishScanCompleted(scanId, report, durationMs) {
        this.emit('repository.scan.completed', {
            scanId,
            overallScore: report.overallScore,
            totalFindings: report.findings.length,
            durationMs,
            historicalDelta: report.historicalDelta
        });
    }
    emit(eventType, payload) {
        if (this.eventBus) {
            this.eventBus.emit('engineering.timeline', {
                type: eventType,
                timestamp: Date.now(),
                payload
            });
        }
    }
}
exports.HealthTimelinePublisher = HealthTimelinePublisher;
//# sourceMappingURL=health-timeline-publisher.js.map