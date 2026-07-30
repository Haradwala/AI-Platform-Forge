/**
 * intelligence-types.ts — Core Data Contracts for Engineering Intelligence Engine
 */

export type SymbolKind = 'function' | 'class' | 'interface' | 'variable' | 'type' | 'module' | 'enum';
export type GraphRelationship = 'calls' | 'implements' | 'extends' | 'imports' | 'references';
export type IndexJobState = 'running' | 'completed' | 'failed' | 'paused';
export type ADRStatus = 'proposed' | 'accepted' | 'deprecated' | 'superseded';

export interface FileMetadata {
  id: string;
  path: string;
  hash: string;
  language: string;
  sizeBytes: number;
  lastIndexedAt: number;
}

export interface KnowledgeNode {
  id: string;
  fileId: string;
  filePath: string;
  name: string;
  kind: SymbolKind;
  containerName?: string;
  startLine: number;
  endLine: number;
  signature?: string;
  docstring?: string;
}

export interface KnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: GraphRelationship;
  confidence?: number;
}

export interface IndexJobStatus {
  id: string;
  workspaceRoot: string;
  status: IndexJobState;
  startedAt: number;
  finishedAt?: number;
  durationMs?: number;
  filesScanned: number;
  filesIndexed: number;
  errorsCount: number;
  details?: Record<string, any>;
}

export interface SymbolSearchResult {
  node: KnowledgeNode;
  score: number;
  matchType: 'exact' | 'prefix' | 'fuzzy' | 'semantic';
}

export interface CodeSearchResult {
  node: KnowledgeNode;
  snippet: string;
  score: number;
}

export interface CrossReferenceResult {
  symbol: KnowledgeNode;
  definitions: KnowledgeNode[];
  references: KnowledgeNode[];
  callers: KnowledgeNode[];
  callees: KnowledgeNode[];
}

export interface ContextAssemblyRequest {
  workspaceRoot: string;
  prompt: string;
  modelId?: string;
  maxTokens?: number;
  targetFile?: string;
  includeMemories?: boolean;
}

export interface AssembledContext {
  prompt: string;
  selectedNodes: KnowledgeNode[];
  snippets: string[];
  memories: WorkspaceMemoryItem[];
  tokenUsage: {
    promptTokens: number;
    contextTokens: number;
    totalTokens: number;
    maxTokens: number;
  };
}

export interface ArchitecturalDecision {
  id: string;
  workspaceRoot: string;
  title: string;
  decision: string;
  rationale: string;
  status: ADRStatus;
  createdAt: number;
  tags?: string[];
}

export interface WorkspaceMemoryItem {
  id: string;
  key: string;
  value: any;
  tags?: string[];
  updatedAt: number;
}

export interface ImpactAnalysisReport {
  changedFiles: string[];
  impactedSymbols: KnowledgeNode[];
  impactedFiles: string[];
  affectedCallChains: Array<{ source: string; target: string; depth: number }>;
  riskScore: 'low' | 'medium' | 'high' | 'critical';
}

export interface DeadCodeReport {
  workspaceRoot: string;
  unusedExports: KnowledgeNode[];
  orphanedSymbols: KnowledgeNode[];
  scannedAt: number;
}

export interface DuplicateCodeReport {
  workspaceRoot: string;
  clones: Array<{
    similarityScore: number;
    nodes: KnowledgeNode[];
    snippet: string;
  }>;
}

export interface ArchitectureInsightsReport {
  workspaceRoot: string;
  couplingScore: number;
  godObjects: KnowledgeNode[];
  cyclicModules: string[][];
  recommendations: string[];
}
