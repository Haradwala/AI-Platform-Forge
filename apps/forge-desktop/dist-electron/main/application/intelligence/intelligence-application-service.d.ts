/**
 * intelligence-application-service.ts — Application Service for Engineering Intelligence
 *
 * Single orchestration boundary for Renderer IPC and external consumers.
 */
import { SymbolSearchResult, CodeSearchResult, CrossReferenceResult, ContextAssemblyRequest, AssembledContext, ImpactAnalysisReport, DeadCodeReport, ArchitectureInsightsReport, ArchitecturalDecision, IndexJobStatus } from '../../intelligence/contracts/intelligence-types';
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
export declare class IntelligenceApplicationService implements IIntelligenceApplicationService {
    private readonly indexCoordinator?;
    private readonly searchEngine?;
    private readonly contextEngine?;
    private readonly memoryStore?;
    private readonly intelligenceService?;
    constructor(indexCoordinator?: RepositoryIndexCoordinator | undefined, searchEngine?: SemanticSearchEngine | undefined, contextEngine?: ContextAssemblyEngine | undefined, memoryStore?: EngineeringMemoryStore | undefined, intelligenceService?: EngineeringIntelligenceService | undefined);
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
