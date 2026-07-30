import { describe, it, expect, vi } from 'vitest';
import * as path from 'path';
import { SnapshotBuilder } from '../electron/main/repository-health/snapshot/repository-snapshot';
import { AnalyzerRegistry } from '../electron/main/repository-health/registry/analyzer-registry';
import { DeadCodeAnalyzer } from '../electron/main/repository-health/analyzers/dead-code-analyzer';
import { DuplicateCodeAnalyzer } from '../electron/main/repository-health/analyzers/duplicate-code-analyzer';
import { DependencyAnalyzer } from '../electron/main/repository-health/analyzers/dependency-analyzer';
import { ArchitectureAnalyzer } from '../electron/main/repository-health/analyzers/architecture-analyzer';
import { ComplexityAnalyzer } from '../electron/main/repository-health/analyzers/complexity-analyzer';
import { FindingStore } from '../electron/main/repository-health/findings/finding-store';
import { RepositoryMetricsCalculator } from '../electron/main/repository-health/metrics/repository-metrics-calculator';
import { HealthReportGenerator } from '../electron/main/repository-health/reports/health-report-generator';
import { HealthTimelinePublisher } from '../electron/main/repository-health/timeline/health-timeline-publisher';
import { RepositoryHealthOrchestrator } from '../electron/main/repository-health/orchestrator/repository-health-orchestrator';
import { RepositoryHealthApplicationService } from '../electron/main/repository-health/application/repository-health-application-service';

describe('Phase 35 — Repository Health Engine Subsystem', () => {
  const sampleRoot = path.resolve(__dirname, '../electron/main/repository-health');

  it('1. SnapshotBuilder completes 4 stages and returns valid snapshot', async () => {
    const builder = new SnapshotBuilder();
    const snapshot = await builder.buildSnapshot(sampleRoot);

    expect(snapshot).toBeDefined();
    expect(snapshot.totalFiles).toBeGreaterThan(0);
    expect(snapshot.totalLOC).toBeGreaterThan(0);
    expect(snapshot.files.size).toBe(snapshot.totalFiles);
    expect(snapshot.astNodes.size).toBe(snapshot.totalFiles);
    expect(snapshot.dependencyGraph).toBeDefined();
  });

  it('2. AnalyzerRegistry manages plugins and runs parallel analyzers (Promise.all)', async () => {
    const registry = new AnalyzerRegistry();
    const deadCode = new DeadCodeAnalyzer();
    const duplicate = new DuplicateCodeAnalyzer();

    registry.register(deadCode);
    registry.register(duplicate);

    expect(registry.getAnalyzers().length).toBe(2);

    const builder = new SnapshotBuilder();
    const snapshot = await builder.buildSnapshot(sampleRoot);

    const results = await registry.runAllParallel(snapshot);
    expect(results.length).toBe(2);
    expect(results[0].executionTimeMs).toBeGreaterThanOrEqual(0);
    expect(results[1].executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('3. All 5 Analyzers execute cleanly without errors', async () => {
    const builder = new SnapshotBuilder();
    const snapshot = await builder.buildSnapshot(sampleRoot);

    const deadCode = new DeadCodeAnalyzer();
    const duplicate = new DuplicateCodeAnalyzer();
    const dependency = new DependencyAnalyzer();
    const architecture = new ArchitectureAnalyzer();
    const complexity = new ComplexityAnalyzer();

    const res1 = await deadCode.analyze(snapshot);
    const res2 = await duplicate.analyze(snapshot);
    const res3 = await dependency.analyze(snapshot);
    const res4 = await architecture.analyze(snapshot);
    const res5 = await complexity.analyze(snapshot);

    expect(res1.analyzerName).toBe('dead-code');
    expect(res2.analyzerName).toBe('duplicate-code');
    expect(res3.analyzerName).toBe('dependency');
    expect(res4.analyzerName).toBe('architecture');
    expect(res5.analyzerName).toBe('complexity');
  });

  it('4. FindingStore & RepositoryMetricsCalculator aggregate findings & stats', async () => {
    const store = new FindingStore();
    store.setFindings([
      {
        id: 'f1',
        title: 'Test Finding',
        severity: 'high',
        category: 'complexity',
        confidence: 0.9,
        file: 'test.ts',
        description: 'desc',
        suggestion: 'sug',
        fixStrategy: 'split-class',
        evidence: { matchedRules: ['Rule1'], relatedFiles: [], metrics: {} },
        autoFixAvailable: true,
        estimatedImpact: 'high',
        timestamp: Date.now()
      }
    ]);

    expect(store.getFindings().length).toBe(1);
    expect(store.getFixableFindings().length).toBe(1);
    expect(store.filter('high').length).toBe(1);
    expect(store.filter('low').length).toBe(0);
  });

  it('5. HealthReportGenerator generates weighted scores and handles trend comparison', async () => {
    const builder = new SnapshotBuilder();
    const snapshot = await builder.buildSnapshot(sampleRoot);

    const calc = new RepositoryMetricsCalculator();
    const metrics = calc.calculate(snapshot);

    const generator = new HealthReportGenerator();
    const report1 = generator.generateReport(snapshot, [], metrics);

    expect(report1.overallScore).toBeGreaterThanOrEqual(0);
    expect(report1.overallScore).toBeLessThanOrEqual(100);
    expect(report1.categoryScores.length).toBe(5);

    const report2 = generator.generateReport(snapshot, [], metrics);
    expect(report2.historicalDelta).toBe(0);
  });

  it('6. RepositoryHealthOrchestrator runs full scan lifecycle and publishes events', async () => {
    const mockEventBus = {
      emit: vi.fn(),
      on: vi.fn(),
      subscribe: vi.fn()
    };

    const orchestrator = new RepositoryHealthOrchestrator(mockEventBus as any);
    const report = await orchestrator.runFullScan(sampleRoot);

    expect(report).toBeDefined();
    expect(orchestrator.getLatestReport()).toBe(report);
    expect(orchestrator.getLatestSnapshot()).toBeDefined();

    expect(mockEventBus.emit).toHaveBeenCalledWith(
      'engineering.timeline',
      expect.objectContaining({ type: 'repository.scan.started' })
    );
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      'engineering.timeline',
      expect.objectContaining({ type: 'repository.scan.completed' })
    );
  });

  it('7. RepositoryHealthApplicationService provides facade API', async () => {
    const service = new RepositoryHealthApplicationService();
    const report = await service.scanRepository(sampleRoot);

    expect(report).toBeDefined();
    const fetchedReport = await service.getHealthReport();
    expect(fetchedReport).toBe(report);
    const snapshot = await service.getSnapshot();
    expect(snapshot).toBeDefined();
  });
});
