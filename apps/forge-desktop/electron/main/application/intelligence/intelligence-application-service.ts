/**
 * intelligence-application-service.ts — Application Service for Engineering Intelligence
 *
 * Single orchestration boundary for Renderer IPC and external consumers.
 */

import {
  SymbolSearchResult,
  CodeSearchResult,
  CrossReferenceResult,
  ContextAssemblyRequest,
  AssembledContext,
  ImpactAnalysisReport,
  DeadCodeReport,
  ArchitectureInsightsReport,
  ArchitecturalDecision,
  IndexJobStatus,
} from '../../intelligence/contracts/intelligence-types';
import { RepositoryIndexCoordinator } from '../../intelligence/indexer/repository-index-coordinator';
import { SemanticSearchEngine } from '../../intelligence/search/semantic-search-engine';
import { ContextAssemblyEngine } from '../../intelligence/context/context-assembly-engine';
import { EngineeringMemoryStore } from '../../intelligence/memory/engineering-memory-store';
import { EngineeringIntelligenceService } from '../../intelligence/services/engineering-intelligence-service';

export interface IIntelligenceApplicationService {
  startIndexing(workspaceRoot: string): Promise<IndexJobStatus>;
  getIndexStatus(jobId: string): Promise<IndexJobStatus | null>;
  searchSymbols(workspaceRoot: string, query: string): Promise<SymbolSearchResult[]>;
  searchCodeNaturalLanguage(workspaceRoot: string, query: string): Promise<CodeSearchResult[]>;
  crossReferenceLookup(workspaceRoot: string, identifier: string): Promise<CrossReferenceResult>;
  assembleContext(request: ContextAssemblyRequest): Promise<AssembledContext>;
  analyzeImpact(workspaceRoot: string, changedFiles: string[]): Promise<ImpactAnalysisReport>;
  detectDeadCode(workspaceRoot: string): Promise<DeadCodeReport>;
  getArchitectureInsights(workspaceRoot: string): Promise<ArchitectureInsightsReport>;
  addADR(adr: ArchitecturalDecision): Promise<void>;
  listADRs(workspaceRoot: string): Promise<ArchitecturalDecision[]>;
}

export class IntelligenceApplicationService implements IIntelligenceApplicationService {
  constructor(
    private readonly indexCoordinator?: RepositoryIndexCoordinator,
    private readonly searchEngine?: SemanticSearchEngine,
    private readonly contextEngine?: ContextAssemblyEngine,
    private readonly memoryStore?: EngineeringMemoryStore,
    private readonly intelligenceService?: EngineeringIntelligenceService
  ) {}

  async startIndexing(workspaceRoot: string): Promise<IndexJobStatus> {
    if (!this.indexCoordinator) throw new Error('RepositoryIndexCoordinator unavailable');
    return this.indexCoordinator.startIndexing(workspaceRoot);
  }

  async getIndexStatus(jobId: string): Promise<IndexJobStatus | null> {
    if (!this.indexCoordinator) return null;
    return this.indexCoordinator.getIndexJob(jobId);
  }

  async searchSymbols(workspaceRoot: string, query: string): Promise<SymbolSearchResult[]> {
    if (!this.searchEngine) return [];
    return this.searchEngine.searchSymbols(query);
  }

  async searchCodeNaturalLanguage(workspaceRoot: string, query: string): Promise<CodeSearchResult[]> {
    if (!this.searchEngine) return [];
    return this.searchEngine.searchCodeNaturalLanguage(query);
  }

  async crossReferenceLookup(workspaceRoot: string, identifier: string): Promise<CrossReferenceResult> {
    if (!this.searchEngine) {
      throw new Error('SemanticSearchEngine unavailable');
    }
    return this.searchEngine.crossReferenceLookup(identifier);
  }

  async assembleContext(request: ContextAssemblyRequest): Promise<AssembledContext> {
    if (!this.contextEngine) throw new Error('ContextAssemblyEngine unavailable');
    return this.contextEngine.assembleContext(request);
  }

  async analyzeImpact(workspaceRoot: string, changedFiles: string[]): Promise<ImpactAnalysisReport> {
    if (!this.intelligenceService) throw new Error('EngineeringIntelligenceService unavailable');
    return this.intelligenceService.analyzeImpact(changedFiles, workspaceRoot);
  }

  async detectDeadCode(workspaceRoot: string): Promise<DeadCodeReport> {
    if (!this.intelligenceService) throw new Error('EngineeringIntelligenceService unavailable');
    return this.intelligenceService.detectDeadCode(workspaceRoot);
  }

  async getArchitectureInsights(workspaceRoot: string): Promise<ArchitectureInsightsReport> {
    if (!this.intelligenceService) throw new Error('EngineeringIntelligenceService unavailable');
    return this.intelligenceService.getArchitectureInsights(workspaceRoot);
  }

  async addADR(adr: ArchitecturalDecision): Promise<void> {
    if (this.memoryStore) {
      await this.memoryStore.addArchitecturalDecision(adr);
    }
  }

  async listADRs(workspaceRoot: string): Promise<ArchitecturalDecision[]> {
    if (!this.memoryStore) return [];
    return this.memoryStore.getArchitecturalDecisions(workspaceRoot);
  }
}
