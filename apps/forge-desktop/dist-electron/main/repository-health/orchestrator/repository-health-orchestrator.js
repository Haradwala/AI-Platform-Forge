"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryHealthOrchestrator = void 0;
const repository_snapshot_1 = require("../snapshot/repository-snapshot");
const analyzer_registry_1 = require("../registry/analyzer-registry");
const dead_code_analyzer_1 = require("../analyzers/dead-code-analyzer");
const duplicate_code_analyzer_1 = require("../analyzers/duplicate-code-analyzer");
const dependency_analyzer_1 = require("../analyzers/dependency-analyzer");
const architecture_analyzer_1 = require("../analyzers/architecture-analyzer");
const complexity_analyzer_1 = require("../analyzers/complexity-analyzer");
const finding_store_1 = require("../findings/finding-store");
const repository_metrics_calculator_1 = require("../metrics/repository-metrics-calculator");
const health_report_generator_1 = require("../reports/health-report-generator");
const health_timeline_publisher_1 = require("../timeline/health-timeline-publisher");
class RepositoryHealthOrchestrator {
    snapshotBuilder = new repository_snapshot_1.SnapshotBuilder();
    registry = new analyzer_registry_1.AnalyzerRegistry();
    findingStore = new finding_store_1.FindingStore();
    metricsCalculator = new repository_metrics_calculator_1.RepositoryMetricsCalculator();
    reportGenerator = new health_report_generator_1.HealthReportGenerator();
    timelinePublisher;
    latestSnapshot = null;
    latestReport = null;
    constructor(eventBus) {
        this.timelinePublisher = new health_timeline_publisher_1.HealthTimelinePublisher(eventBus);
        // Register all 5 analyzer plugins
        this.registry.register(new dead_code_analyzer_1.DeadCodeAnalyzer());
        this.registry.register(new duplicate_code_analyzer_1.DuplicateCodeAnalyzer());
        this.registry.register(new dependency_analyzer_1.DependencyAnalyzer());
        this.registry.register(new architecture_analyzer_1.ArchitectureAnalyzer());
        this.registry.register(new complexity_analyzer_1.ComplexityAnalyzer());
    }
    async runFullScan(rootPath, options) {
        const startTime = Date.now();
        const scanId = `scan-${startTime}`;
        this.timelinePublisher.publishScanStarted(scanId, rootPath);
        // Stage 1: Build Snapshot
        this.timelinePublisher.publishScanProgress(scanId, 'workspace_scan', 25, 'Building repository AST snapshot...');
        const snapshot = await this.snapshotBuilder.buildSnapshot(rootPath);
        this.latestSnapshot = snapshot;
        // Stage 2: Parallel Analyzers Execution (Promise.all)
        this.timelinePublisher.publishScanProgress(scanId, 'analyzers_execution', 50, 'Executing parallel health analyzers...');
        const results = await this.registry.runAllParallel(snapshot);
        const allFindings = [];
        for (const res of results) {
            allFindings.push(...res.findings);
        }
        this.findingStore.setFindings(allFindings);
        // Stage 3: Calculate Metrics & Generate Report
        this.timelinePublisher.publishScanProgress(scanId, 'report_generation', 85, 'Calculating repository health scores...');
        const metrics = this.metricsCalculator.calculate(snapshot);
        const report = this.reportGenerator.generateReport(snapshot, allFindings, metrics);
        this.latestReport = report;
        // Stage 4: Publish Scan Completed
        const durationMs = Date.now() - startTime;
        this.timelinePublisher.publishScanCompleted(scanId, report, durationMs);
        return report;
    }
    getLatestSnapshot() {
        return this.latestSnapshot;
    }
    getLatestReport() {
        return this.latestReport;
    }
    getFindings() {
        return this.findingStore.getFindings();
    }
}
exports.RepositoryHealthOrchestrator = RepositoryHealthOrchestrator;
//# sourceMappingURL=repository-health-orchestrator.js.map