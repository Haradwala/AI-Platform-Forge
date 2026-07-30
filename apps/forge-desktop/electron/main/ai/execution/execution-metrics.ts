export interface ITaskMetric {
  readonly taskId: string;
  readonly durationMs: number;
  readonly retries: number;
  readonly success: boolean;
  readonly tokens: number;
  readonly cost: number;
}

export class ExecutionMetricsService {
  private readonly metrics: ITaskMetric[] = [];
  private activeWorkers = 0;

  recordTaskMetric(metric: ITaskMetric): void {
    this.metrics.push(metric);
  }

  incrementActiveWorkers(): void {
    this.activeWorkers++;
  }

  decrementActiveWorkers(): void {
    this.activeWorkers = Math.max(0, this.activeWorkers - 1);
  }

  getMetricsSummary() {
    const totalTasks = this.metrics.length;
    if (totalTasks === 0) {
      return {
        totalTasks: 0,
        successRate: 100,
        averageDurationMs: 0,
        averageRetries: 0,
        totalTokens: 0,
        totalCost: 0,
        parallelismLevel: this.activeWorkers,
      };
    }

    const successfulTasks = this.metrics.filter((m) => m.success).length;
    const totalDuration = this.metrics.reduce((acc, m) => acc + m.durationMs, 0);
    const totalRetries = this.metrics.reduce((acc, m) => acc + m.retries, 0);
    const totalTokens = this.metrics.reduce((acc, m) => acc + m.tokens, 0);
    const totalCost = this.metrics.reduce((acc, m) => acc + m.cost, 0);

    return {
      totalTasks,
      successRate: (successfulTasks / totalTasks) * 100,
      averageDurationMs: totalDuration / totalTasks,
      averageRetries: totalRetries / totalTasks,
      totalTokens,
      totalCost,
      parallelismLevel: this.activeWorkers,
    };
  }

  clear(): void {
    this.metrics.length = 0;
    this.activeWorkers = 0;
  }
}
