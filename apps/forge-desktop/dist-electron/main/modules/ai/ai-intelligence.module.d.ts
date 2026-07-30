/**
 * ai-intelligence.module.ts — Sub-module for Engineering & Code Intelligence
 *
 * Registers RepositoryIndexer, CodeIntelligenceEngine, WorkspaceEngine,
 * EngineeringIntelligenceEngine, SemanticKnowledgeBuilder, and LearningEngine.
 */
import type { IDesktopContainer } from '../../container/interfaces';
export declare class AiIntelligenceModule {
    static register(container: IDesktopContainer): void;
}
