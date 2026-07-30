/**
 * runtime-events.ts — Timeline Event Payload Contracts for Multi-Runtime Subsystem
 */

import { RoutingDecision, ExecutionMetricSample } from './runtime-types';

export type RuntimeEventType =
  | 'runtime.lifecycle.started'
  | 'runtime.lifecycle.stopped'
  | 'runtime.routing.decision'
  | 'runtime.routing.failover'
  | 'runtime.performance.benchmark';

export interface RuntimeTimelineEventPayload {
  workspaceRoot?: string;
  runtimeId?: string;
  modelId?: string;
  routingDecision?: RoutingDecision;
  metricSample?: ExecutionMetricSample;
  timestamp: number;
  message: string;
  error?: string;
}
