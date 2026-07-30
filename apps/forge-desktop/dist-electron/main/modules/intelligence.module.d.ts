/**
 * intelligence.module.ts — Composition Module for Engineering Intelligence Engine
 *
 * Registers IntelligenceDatabase, LanguageParserRegistry, RepositoryIndexCoordinator,
 * KnowledgeGraphEngine, EmbeddingProvider, SemanticSearchEngine, ContextAssemblyEngine,
 * EngineeringMemoryStore, AnalysisCacheService, EngineeringIntelligenceService,
 * IntelligenceTimelinePublisher, and IntelligenceApplicationService in DesktopContainer.
 */
import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
export declare class IntelligenceModule implements IContainerModule {
    readonly name = "IntelligenceModule";
    register(container: IDesktopContainer): void;
    static register(container: IDesktopContainer): void;
}
