/**
 * runtime-performance-engine.ts — Performance Benchmarking, Cost & Reliability Tracker
 */
import { ExecutionMetricSample, PerformanceMetrics } from '../contracts/runtime-types';
import { RuntimeTimelinePublisher } from '../timeline/runtime-timeline-publisher';
export declare class RuntimePerformanceEngine {
    private readonly timelinePublisher?;
    private samples;
    constructor(timelinePublisher?: RuntimeTimelinePublisher | undefined);
    recordExecution(sample: ExecutionMetricSample): void;
    getMetrics(modelId: string): PerformanceMetrics;
    getReliabilityScore(modelId: string): number;
    runBenchmark(modelId: string): Promise<PerformanceMetrics>;
}
