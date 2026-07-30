import { describe, it, expect } from 'vitest';
import { ExecutionMetricsService } from '../electron/main/ai/execution/execution-metrics';

describe('ExecutionMetricsService', () => {
  it('records metrics and prints aggregate summaries', () => {
    const service = new ExecutionMetricsService();
    service.recordTaskMetric({
      taskId: 't1',
      durationMs: 100,
      retries: 0,
      success: true,
      tokens: 150,
      cost: 0.01,
    });
    service.recordTaskMetric({
      taskId: 't2',
      durationMs: 200,
      retries: 2,
      success: false,
      tokens: 350,
      cost: 0.03,
    });

    const summary = service.getMetricsSummary();
    expect(summary.totalTasks).toBe(2);
    expect(summary.successRate).toBe(50);
    expect(summary.averageDurationMs).toBe(150);
    expect(summary.averageRetries).toBe(1);
    expect(summary.totalTokens).toBe(500);
    expect(summary.totalCost).toBe(0.04);
  });
});
