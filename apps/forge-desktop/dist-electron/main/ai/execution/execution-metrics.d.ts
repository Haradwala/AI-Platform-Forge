export interface ITaskMetric {
    readonly taskId: string;
    readonly durationMs: number;
    readonly retries: number;
    readonly success: boolean;
    readonly tokens: number;
    readonly cost: number;
}
export declare class ExecutionMetricsService {
    private readonly metrics;
    private activeWorkers;
    recordTaskMetric(metric: ITaskMetric): void;
    incrementActiveWorkers(): void;
    decrementActiveWorkers(): void;
    getMetricsSummary(): {
        totalTasks: number;
        successRate: number;
        averageDurationMs: number;
        averageRetries: number;
        totalTokens: number;
        totalCost: number;
        parallelismLevel: number;
    };
    clear(): void;
}
