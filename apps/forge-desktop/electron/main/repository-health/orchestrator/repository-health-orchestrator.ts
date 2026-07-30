import { SnapshotBuilder } from '../snapshot/repository-snapshot';
import { AnalyzerRegistry } from '../registry/analyzer-registry';
import { DeadCodeAnalyzer } from '../analyzers/dead-code-analyzer';
import { DuplicateCodeAnalyzer } from '../analyzers/duplicate-code-analyzer';
import { DependencyAnalyzer } from '../analyzers/dependency-analyzer';
import { ArchitectureAnalyzer } from '../analyzers/architecture-analyzer';
import { ComplexityAnalyzer } from '../analyzers/complexity-analyzer';
import { FindingStore } from '../findings/finding-store';
import { RepositoryMetricsCalculator } from '../metrics/repository-metrics-calculator';
import { HealthReportGenerator } from '../reports/health-report-generator';
import { HealthTimelinePublisher } from '../timeline/health-timeline-publisher';
import { RepositorySnapshot, HealthReport, Finding, HealthScanOptions } from '../contracts/health-types';
import type { IDesktopEventBus } from '../../container/service-interfaces';

export class RepositoryHealthOrchestrator {
  private snapshotBuilder = new SnapshotBuilder();
  private registry = new AnalyzerRegistry();
  private findingStore = new FindingStore();
  private metricsCalculator = new RepositoryMetricsCalculator();
  private reportGenerator = new HealthReportGenerator();
  private timelinePublisher: HealthTimelinePublisher;

  private latestSnapshot: RepositorySnapshot | null = null;
  private latestReport: HealthReport | null = null;

  constructor(eventBus?: IDesktopEventBus) {
    this.timelinePublisher = new HealthTimelinePublisher(eventBus);

    // Register all 5 analyzer plugins
    this.registry.register(new DeadCodeAnalyzer());
    this.registry.register(new DuplicateCodeAnalyzer());
    this.registry.register(new DependencyAnalyzer());
    this.registry.register(new ArchitectureAnalyzer());
    this.registry.register(new ComplexityAnalyzer());
  }

  async runFullScan(rootPath: string, options?: HealthScanOptions): Promise<HealthReport> {
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

    const allFindings: Finding[] = [];
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

  getLatestSnapshot(): RepositorySnapshot | null {
    return this.latestSnapshot;
  }

  getLatestReport(): HealthReport | null {
    return this.latestReport;
  }

  getFindings(): Finding[] {
    return this.findingStore.getFindings();
  }
}
