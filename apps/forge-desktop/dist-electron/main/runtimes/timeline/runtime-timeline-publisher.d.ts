/**
 * runtime-timeline-publisher.ts — Timeline Event Publisher for Multi-Runtime Subsystem
 */
import type { IDesktopEventBus } from '../../container/service-interfaces';
import { RoutingDecision, ExecutionMetricSample } from '../contracts/runtime-types';
export declare class RuntimeTimelinePublisher {
    private readonly eventBus?;
    constructor(eventBus?: IDesktopEventBus | undefined);
    publishLifecycleEvent(runtimeId: string, action: 'started' | 'stopped'): void;
    publishRoutingDecision(workspaceRoot: string, decision: RoutingDecision): void;
    publishFailover(workspaceRoot: string, failedModelId: string, fallbackModelId: string, error: string): void;
    publishBenchmark(sample: ExecutionMetricSample): void;
    private emit;
}
