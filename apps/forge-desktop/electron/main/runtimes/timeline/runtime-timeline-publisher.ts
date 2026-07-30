/**
 * runtime-timeline-publisher.ts — Timeline Event Publisher for Multi-Runtime Subsystem
 */

import type { IDesktopEventBus } from '../../container/service-interfaces';
import { RoutingDecision, ExecutionMetricSample } from '../contracts/runtime-types';
import { RuntimeTimelineEventPayload } from '../contracts/runtime-events';

export class RuntimeTimelinePublisher {
  constructor(private readonly eventBus?: IDesktopEventBus) {}

  publishLifecycleEvent(runtimeId: string, action: 'started' | 'stopped'): void {
    this.emit(`runtime.lifecycle.${action}`, {
      runtimeId,
      timestamp: Date.now(),
      message: `Runtime [${runtimeId}] ${action}`,
    });
  }

  publishRoutingDecision(workspaceRoot: string, decision: RoutingDecision): void {
    this.emit('runtime.routing.decision', {
      workspaceRoot,
      modelId: decision.selectedModelId,
      routingDecision: decision,
      timestamp: Date.now(),
      message: `Routed to model [${decision.selectedModelId}] (${decision.rationale})`,
    });
  }

  publishFailover(workspaceRoot: string, failedModelId: string, fallbackModelId: string, error: string): void {
    this.emit('runtime.routing.failover', {
      workspaceRoot,
      modelId: fallbackModelId,
      timestamp: Date.now(),
      message: `Failover triggered from [${failedModelId}] to fallback [${fallbackModelId}] due to: ${error}`,
      error,
    });
  }

  publishBenchmark(sample: ExecutionMetricSample): void {
    this.emit('runtime.performance.benchmark', {
      workspaceRoot: sample.workspaceRoot,
      modelId: sample.modelId,
      metricSample: sample,
      timestamp: sample.timestamp,
      message: `Benchmark metric for [${sample.modelId}]: TTFT ${sample.ttftMs}ms, ${sample.tokensPerSec.toFixed(1)} tok/s`,
    });
  }

  private emit(eventType: string, payload: RuntimeTimelineEventPayload): void {
    if (this.eventBus) {
      this.eventBus.emit('engineering.timeline', {
        type: eventType,
        payload,
      });
    }
  }
}
