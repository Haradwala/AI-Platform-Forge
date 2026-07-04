import { IWorkspaceFile } from '../domain/workspace';
import { ISymbol } from '../domain/symbol';
import { IRelationship } from '../domain/relationship';
import { IGraphNode, IGraphEdge } from '../domain/graph';

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
}
