import { IWorkspaceFile } from '../domain/workspace';
import { ISymbol } from '../domain/symbol';
import { IRelationship } from '../domain/relationship';
import { IGraphNode, IGraphEdge } from '../domain/graph';
import { ICorrelationMetadata, IReflectionDecision, ApprovalStatus } from '../domain/agent';

export interface IDiagnosticEvent {
  readonly message: string;
  readonly severity: 'error' | 'warning' | 'info';
  readonly range: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
}

export interface SystemEventMap {
  // Process Events
  'process.started': { pid: number; command: string; env: Record<string, string> };
  'process.stdout': { pid: number; chunk: string };
  'process.stderr': { pid: number; chunk: string };
  'process.ended': { pid: number; exitCode: number; durationMs: number };
  'file.modified': { relativePath: string; size: number };
  'guardrail.alert': { ruleName: string; violationDetails: string };

  // Sprint 2 Lifecycle & Health Events
  'forge.booting': { timestamp: Date };
  'forge.initialized': { timestamp: Date; durationMs: number };
  'forge.ready': { timestamp: Date; durationMs: number };
  'forge.stopping': { timestamp: Date; reason?: string };
  'forge.stopped': { timestamp: Date; durationMs: number };
  'service.registered': { serviceName: string; timestamp: Date };
  'service.started': { serviceName: string; timestamp: Date; durationMs: number };
  'service.failed': { serviceName: string; error: string; timestamp: Date };
  'service.disposed': { serviceName: string; timestamp: Date };
  'health.changed': { serviceName: string; status: 'healthy' | 'degraded' | 'failed'; message?: string; timestamp: Date };

  // Sprint 3 Workspace Events
  'workspace.opening': { workspaceId: string; path: string; timestamp: Date };
  'workspace.opened': { workspaceId: string; path: string; timestamp: Date };
  'workspace.ready': { workspaceId: string; path: string; filesCount: number; timestamp: Date };
  'workspace.closing': { workspaceId: string; path: string; timestamp: Date };
  'workspace.closed': { workspaceId: string; path: string; timestamp: Date };
  'workspace.scan.started': { workspaceId: string; timestamp: Date };
  'workspace.scan.completed': { workspaceId: string; filesCount: number; durationMs: number; timestamp: Date };
  'workspace.file.created': { workspaceId: string; file: IWorkspaceFile; timestamp: Date };
  'workspace.file.modified': { workspaceId: string; file: IWorkspaceFile; timestamp: Date };
  'workspace.file.deleted': { workspaceId: string; relativePath: string; timestamp: Date };
  'workspace.error': { workspaceId: string; error: string; timestamp: Date };

  // Sprint 4 Parser Events
  'parser.started': { timestamp: Date };
  'parser.completed': { durationMs: number; filesParsed: number; timestamp: Date };
  'parser.failed': { error: string; timestamp: Date };
  'parser.file.started': { workspaceId: string; relativePath: string; timestamp: Date };
  'parser.file.completed': { workspaceId: string; relativePath: string; symbolsCount: number; timestamp: Date };
  'parser.file.failed': { workspaceId: string; relativePath: string; error: string; timestamp: Date };
  'parser.symbol.discovered': { workspaceId: string; symbol: ISymbol; timestamp: Date };
  'parser.relationship.created': { workspaceId: string; relationship: IRelationship; timestamp: Date };
  'parser.diagnostics.updated': { workspaceId: string; relativePath: string; diagnostics: IDiagnosticEvent[]; timestamp: Date };
  'parser.incremental.completed': { workspaceId: string; relativePath: string; durationMs: number; timestamp: Date };

  // Sprint 5 Graph Events
  'graph.started': { timestamp: Date };
  'graph.completed': { durationMs: number; nodesCount: number; edgesCount: number; timestamp: Date };
  'graph.node.created': { nodeId: string; node: IGraphNode; timestamp: Date };
  'graph.node.updated': { nodeId: string; node: IGraphNode; timestamp: Date };
  'graph.node.deleted': { nodeId: string; timestamp: Date };
  'graph.edge.created': { edgeId: string; edge: IGraphEdge; timestamp: Date };
  'graph.edge.deleted': { edgeId: string; timestamp: Date };
  'graph.cache.updated': { timestamp: Date };
  'graph.query.executed': { queryType: string; durationMs: number; timestamp: Date };
  'graph.incremental.completed': { filesUpdatedCount: number; durationMs: number; timestamp: Date };

  // Sprint 6 Context Events
  'context.requested': { requestId: string; request: string; timestamp: Date };
  'context.planned': { requestId: string; plan: any; timestamp: Date };
  'context.retrieved': { requestId: string; candidatesCount: number; timestamp: Date };
  'context.ranked': { requestId: string; timestamp: Date };
  'context.compressed': { requestId: string; fileId: string; tokensSaved: number; timestamp: Date };
  'context.assembled': { requestId: string; packageId: string; estimatedTokens: number; timestamp: Date };
  'context.cached': { packageId: string; timestamp: Date };
  'context.invalidated': { reason: string; timestamp: Date };
  'context.failed': { requestId: string; error: string; timestamp: Date };

  // Sprint 7 Hybrid Retrieval Events
  'retrieval.requested': { query: string; workspaceId: string; timestamp: Date };
  'retrieval.provider.started': { providerId: string; timestamp: Date };
  'retrieval.provider.completed': { providerId: string; candidatesCount: number; durationMs: number; timestamp: Date };
  'retrieval.provider.failed': { providerId: string; error: string; timestamp: Date };
  'retrieval.merged': { candidatesCount: number; timestamp: Date };
  'retrieval.deduplicated': { initialCount: number; finalCount: number; timestamp: Date };
  'retrieval.ranked': { topCandidateId: string; topScore: number; timestamp: Date };
  'retrieval.cached': { queryKey: string; timestamp: Date };
  'retrieval.invalidated': { reason: string; timestamp: Date };
  'retrieval.completed': { durationMs: number; finalCandidatesCount: number; timestamp: Date };
  'retrieval.failed': { error: string; timestamp: Date };

  // Sprint 8 Tool Runtime Events
  'tool.requested': { requestId: string; toolId: string; workspaceId: string; timestamp: Date };
  'tool.validated': { requestId: string; success: boolean; timestamp: Date };
  'tool.queued': { requestId: string; position: number; timestamp: Date };
  'tool.waiting': { requestId: string; reason: string; timestamp: Date };
  'tool.started': { requestId: string; toolId: string; timestamp: Date };
  'tool.progress': { requestId: string; percent: number; timestamp: Date };
  'tool.streaming': { requestId: string; chunkLength: number; timestamp: Date };
  'tool.stdout': { requestId: string; text: string; timestamp: Date };
  'tool.stderr': { requestId: string; text: string; timestamp: Date };
  'tool.completed': { requestId: string; status: string; durationMs: number; timestamp: Date };
  'tool.failed': { requestId: string; error: string; timestamp: Date };
  'tool.cancelled': { requestId: string; reason: string; timestamp: Date };
  'tool.timeout': { requestId: string; elapsedMs: number; timestamp: Date };
  'tool.permission.denied': { requestId: string; toolId: string; capability: string; timestamp: Date };
  'tool.sandbox.denied': { requestId: string; path: string; timestamp: Date };
  'tool.retry.started': { requestId: string; attempt: number; timestamp: Date };
  'tool.retry.completed': { requestId: string; attempt: number; success: boolean; timestamp: Date };
  'tool.audit.created': { auditId: string; toolId: string; status: string; timestamp: Date };
  'tool.executor.started': { executorId: string; timestamp: Date };
  'tool.executor.finished': { executorId: string; durationMs: number; timestamp: Date };

  // Sprint 9 Planning Events
  'planner.started': { planId: string; query: string; timestamp: Date };
  'planner.completed': { planId: string; durationMs: number; timestamp: Date };
  'planner.failed': { planId: string; error: string; timestamp: Date };
  'planner.goal.created': { goalId: string; description: string; timestamp: Date };
  'planner.goal.completed': { goalId: string; timestamp: Date };
  'planner.goal.failed': { goalId: string; reason: string; timestamp: Date };
  'planner.goal.cancelled': { goalId: string; reason: string; timestamp: Date };
  'planner.plan.created': { planId: string; stepsCount: number; timestamp: Date };
  'planner.plan.optimized': { planId: string; removedStepsCount: number; timestamp: Date };
  'planner.plan.validated': { planId: string; isValid: boolean; timestamp: Date };
  'planner.plan.failed': { planId: string; error: string; timestamp: Date };
  'planner.execution.started': { planId: string; timestamp: Date };
  'planner.execution.completed': { planId: string; timestamp: Date };
  'planner.execution.paused': { planId: string; timestamp: Date };
  'planner.execution.resumed': { planId: string; timestamp: Date };
  'planner.step.started': { stepId: string; toolId?: string; timestamp: Date };
  'planner.step.completed': { stepId: string; durationMs: number; timestamp: Date };
  'planner.step.failed': { stepId: string; error: string; timestamp: Date };
  'planner.step.skipped': { stepId: string; reason: string; timestamp: Date };
  'planner.step.retry': { stepId: string; attempt: number; timestamp: Date };
  'planner.snapshot.created': { snapshotId: string; planId: string; timestamp: Date };
  'planner.blackboard.updated': { count: number; timestamp: Date };
  'planner.observation.created': { observationId: string; type: string; timestamp: Date };
  'planner.policy.selected': { policyId: string; timestamp: Date };
  'planner.optimizer.completed': { planId: string; timestamp: Date };
  'planner.validation.failed': { planId: string; reason: string; timestamp: Date };
  'planner.reflection.started': { stepId: string; timestamp: Date };
  'planner.reflection.completed': { stepId: string; decision: string; timestamp: Date };
  'planner.reflection.failed': { stepId: string; error: string; timestamp: Date };
  'planner.replanned': { oldPlanId: string; newPlanId: string; reason: string; timestamp: Date };
  'planner.cancelled': { planId: string; reason: string; timestamp: Date };
  'planner.metrics.updated': { planId: string; progress: number; timestamp: Date };
  'planner.finished': { planId: string; success: boolean; timestamp: Date };

  // Sprint 10 AI Events
  'ai.requested': { requestId: string; modelId: string; timestamp: Date };
  'ai.prompt.compiled': { requestId: string; tokensCount: number; timestamp: Date };
  'ai.prompt.cached': { keyHash: string; timestamp: Date };
  'ai.policy.selected': { policyId: string; timestamp: Date };
  'ai.model.selected': { requestId: string; modelId: string; score: number; timestamp: Date };
  'ai.tokens.counted': { requestId: string; promptTokens: number; timestamp: Date };
  'ai.provider.selected': { requestId: string; providerId: string; timestamp: Date };
  'ai.provider.failed': { requestId: string; providerId: string; error: string; timestamp: Date };
  'ai.stream.started': { requestId: string; timestamp: Date };
  'ai.stream.chunk': { requestId: string; type: string; timestamp: Date };
  'ai.stream.completed': { requestId: string; timestamp: Date };
  'ai.validation.failed': { requestId: string; error: string; timestamp: Date };
  'ai.repaired': { requestId: string; strategy: string; success: boolean; timestamp: Date };
  'ai.middleware.started': { requestId: string; middlewareId: string; timestamp: Date };
  'ai.middleware.completed': { requestId: string; middlewareId: string; durationMs: number; timestamp: Date };
  'ai.circuit.opened': { providerId: string; reason: string; timestamp: Date };
  'ai.circuit.closed': { providerId: string; timestamp: Date };
  'ai.response.validated': { requestId: string; isValid: boolean; timestamp: Date };
  'ai.retry': { requestId: string; attempt: number; delayMs: number; timestamp: Date };
  'ai.fallback': { requestId: string; fromProviderId: string; toProviderId: string; timestamp: Date };
  'ai.cache.hit': { requestId: string; keyHash: string; timestamp: Date };
  'ai.cache.miss': { requestId: string; keyHash: string; timestamp: Date };
  'ai.completed': { requestId: string; cost: number; durationMs: number; timestamp: Date };

  'ai.failed': { requestId: string; error: string; timestamp: Date };

  // Sprint 11 Memory Events
  'memory.record.created': { recordId: string; state: string; createdBy: string; timestamp: Date };
  'memory.record.accessed': { recordId: string; timestamp: Date };
  'memory.state.transitioned': { recordId: string; from: string; to: string; timestamp: Date };
  'memory.transaction.started': { txId: string; timestamp: Date };
  'memory.transaction.committed': { txId: string; timestamp: Date };
  'memory.transaction.rolledback': { txId: string; reason: string; timestamp: Date };
  'memory.journal.replayed': { entriesCount: number; timestamp: Date };
  'memory.gc.completed': { expiredCount: number; timestamp: Date };
  'memory.learning.pattern.extracted': { patternId: string; timestamp: Date };
  'memory.compaction.completed': { compactedCount: number; timestamp: Date };
  'memory.consolidation.started': { timestamp: Date };
  'memory.consolidation.completed': { mergedCount: number; archivedCount: number; timestamp: Date };
  'memory.reinforced': { recordId: string; newConfidence: number; timestamp: Date };
  'memory.decayed': { recordId: string; newConfidence: number; timestamp: Date };
  'memory.conflict.detected': { key: string; recordsCount: number; timestamp: Date };
  'memory.conflict.resolved': { key: string; winnerRecordId: string; timestamp: Date };
  'memory.snapshot.created': { snapshotId: string; timestamp: Date };
  'memory.snapshot.restored': { snapshotId: string; timestamp: Date };
  'memory.search.planned': { query: string; timestamp: Date };
  'memory.search.completed': { query: string; resultsCount: number; timestamp: Date };

  // Sprint 12 Agent Events
  'agent.session.created': { metadata: ICorrelationMetadata; timestamp: Date };
  'agent.state.transitioned': { metadata: ICorrelationMetadata; fromState: string; toState: string; timestamp: Date };
  'agent.loop.started': { metadata: ICorrelationMetadata; iteration: number; timestamp: Date };
  'agent.approval.queued': { metadata: ICorrelationMetadata; approvalId: string; toolId: string; timestamp: Date };
  'agent.approval.resolved': { metadata: ICorrelationMetadata; approvalId: string; status: ApprovalStatus; timestamp: Date };
  'agent.checkpoint.saved': { metadata: ICorrelationMetadata; checkpointId: string; timestamp: Date };
  'agent.checkpoint.restored': { metadata: ICorrelationMetadata; checkpointId: string; timestamp: Date };
  'agent.budget.exhausted': { metadata: ICorrelationMetadata; currentCost: number; limitCost: number; timestamp: Date };
  'agent.loop.reflected': { metadata: ICorrelationMetadata; decision: IReflectionDecision; timestamp: Date };
  'agent.session.completed': { metadata: ICorrelationMetadata; status: string; totalLoops: number; timestamp: Date };
}


