/**
 * engineering-intelligence-service.ts — High-level Intelligence Analytical Services
 *
 * Implements blast-radius impact analysis, dead code detection, structural clone detection,
 * architectural health insights, and automated refactoring suggestions.
 */
import { KnowledgeGraphEngine } from '../graph/knowledge-graph-engine';
import { AnalysisCacheService } from '../cache/analysis-cache-service';
import { IntelligenceTimelinePublisher } from '../timeline/intelligence-timeline-publisher';
import { ImpactAnalysisReport, DeadCodeReport, DuplicateCodeReport, ArchitectureInsightsReport } from '../contracts/intelligence-types';
export declare class EngineeringIntelligenceService {
    private readonly graphEngine;
    private readonly cache;
    private readonly timelinePublisher?;
    constructor(graphEngine: KnowledgeGraphEngine, cache?: AnalysisCacheService, timelinePublisher?: IntelligenceTimelinePublisher | undefined);
    analyzeImpact(changedFiles: string[], workspaceRoot?: string): Promise<ImpactAnalysisReport>;
    detectDeadCode(workspaceRoot: string): Promise<DeadCodeReport>;
    detectDuplicates(workspaceRoot: string): Promise<DuplicateCodeReport>;
    getArchitectureInsights(workspaceRoot: string): Promise<ArchitectureInsightsReport>;
    suggestRefactorings(targetPath: string): Promise<string[]>;
}
