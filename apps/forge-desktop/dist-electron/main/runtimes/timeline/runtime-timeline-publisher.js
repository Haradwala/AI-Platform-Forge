"use strict";
/**
 * runtime-timeline-publisher.ts — Timeline Event Publisher for Multi-Runtime Subsystem
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeTimelinePublisher = void 0;
class RuntimeTimelinePublisher {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    publishLifecycleEvent(runtimeId, action) {
        this.emit(`runtime.lifecycle.${action}`, {
            runtimeId,
            timestamp: Date.now(),
            message: `Runtime [${runtimeId}] ${action}`,
        });
    }
    publishRoutingDecision(workspaceRoot, decision) {
        this.emit('runtime.routing.decision', {
            workspaceRoot,
            modelId: decision.selectedModelId,
            routingDecision: decision,
            timestamp: Date.now(),
            message: `Routed to model [${decision.selectedModelId}] (${decision.rationale})`,
        });
    }
    publishFailover(workspaceRoot, failedModelId, fallbackModelId, error) {
        this.emit('runtime.routing.failover', {
            workspaceRoot,
            modelId: fallbackModelId,
            timestamp: Date.now(),
            message: `Failover triggered from [${failedModelId}] to fallback [${fallbackModelId}] due to: ${error}`,
            error,
        });
    }
    publishBenchmark(sample) {
        this.emit('runtime.performance.benchmark', {
            workspaceRoot: sample.workspaceRoot,
            modelId: sample.modelId,
            metricSample: sample,
            timestamp: sample.timestamp,
            message: `Benchmark metric for [${sample.modelId}]: TTFT ${sample.ttftMs}ms, ${sample.tokensPerSec.toFixed(1)} tok/s`,
        });
    }
    emit(eventType, payload) {
        if (this.eventBus) {
            this.eventBus.emit('engineering.timeline', {
                type: eventType,
                payload,
            });
        }
    }
}
exports.RuntimeTimelinePublisher = RuntimeTimelinePublisher;
//# sourceMappingURL=runtime-timeline-publisher.js.map