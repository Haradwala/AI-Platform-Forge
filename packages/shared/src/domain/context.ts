import { ISymbol } from './symbol';
import { IGraphNode, IGraphEdge } from './graph';

export interface IIntent {
  readonly type: string;
  readonly confidence: number;
  readonly entities: string[];
  readonly language?: string;
  readonly scopePaths: string[];
}

export interface IContextPlan {
  readonly includeActiveFile: boolean;
  readonly maxGraphHopDepth: number;
  readonly searchQueries: string[];
  readonly relationKinds: string[];
}

export interface IContextMetadata {
  readonly workspaceId: string;
  readonly retrievalSource: 'workspace' | 'knowledge-graph' | 'documentation' | 'vector' | 'git';
  readonly confidenceScore: number;
  readonly createdAt: Date;
}

export interface ICandidateContext {
  readonly id: string;
  readonly type: 'file' | 'symbol' | 'relationship' | 'diagnostics' | 'documentation';
  readonly path: string;
  readonly content: string;
  readonly estimatedTokens: number;
  readonly metadata: IContextMetadata;
  
  readonly relevanceScore: number;
  readonly importanceScore: number;
  readonly graphDistance: number;
  readonly freshnessScore: number;
  
  readonly nodeAssociation?: IGraphNode;
}

export interface IContextDiagnostics {
  readonly planningTimeMs: number;
  readonly retrievalTimeMs: number;
  readonly rankingTimeMs: number;
  readonly compressionTimeMs: number;
  readonly assemblyTimeMs: number;
  readonly cacheHit: boolean;
  readonly candidatesCount: number;
  readonly discardedCount: number;
  readonly compressedCount: number;
  readonly finalTokenCount: number;
}

export interface IContextTraceItem {
  readonly candidateId: string;
  readonly selectionReason: string;
  readonly retrievalSource: string;
  readonly rankingScore: number;
  readonly graphDistance: number;
  readonly compressionApplied: string[];
}

export interface IContextTrace {
  readonly traceItems: IContextTraceItem[];
  readonly metrics: IContextDiagnostics;
}

export interface IContextPackage {
  readonly id: string;
  readonly workspaceId: string;
  readonly request: string;
  readonly intent: IIntent;
  readonly files: { path: string; content: string; hash: string }[];
  readonly symbols: ISymbol[];
  readonly relationships: IGraphEdge[];
  readonly trace: IContextTrace;
  readonly timestamp: Date;
}
