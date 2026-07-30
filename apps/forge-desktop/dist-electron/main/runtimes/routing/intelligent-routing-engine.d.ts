/**
 * intelligent-routing-engine.ts — Multi-Criteria Intelligent Router & Failover Engine
 *
 * Evaluates candidate models across 6 vectors: task suitability, language, context size,
 * cost ($/1M tokens), latency, and reliability score.
 */
import { RuntimeProfileRegistry } from '../profiles/runtime-profile-registry';
import { RuntimePerformanceEngine } from '../performance/runtime-performance-engine';
import { RuntimeManager } from '../manager/runtime-manager';
import { RuntimeTimelinePublisher } from '../timeline/runtime-timeline-publisher';
import { RoutingRequest, RoutingDecision } from '../contracts/runtime-types';
export declare class IntelligentRoutingEngine {
    private readonly profileRegistry;
    private readonly performanceEngine;
    private readonly runtimeManager?;
    private readonly timelinePublisher?;
    constructor(profileRegistry?: RuntimeProfileRegistry, performanceEngine?: RuntimePerformanceEngine, runtimeManager?: RuntimeManager | undefined, timelinePublisher?: RuntimeTimelinePublisher | undefined);
    /**
     * Evaluates routing request and selects optimal model candidate with failover fallback chain.
     */
    routeRequest(request: RoutingRequest): Promise<RoutingDecision>;
}
