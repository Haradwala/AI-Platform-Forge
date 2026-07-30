"use strict";
/**
 * intelligence.module.ts — Composition Module for Engineering Intelligence Engine
 *
 * Registers IntelligenceDatabase, LanguageParserRegistry, RepositoryIndexCoordinator,
 * KnowledgeGraphEngine, EmbeddingProvider, SemanticSearchEngine, ContextAssemblyEngine,
 * EngineeringMemoryStore, AnalysisCacheService, EngineeringIntelligenceService,
 * IntelligenceTimelinePublisher, and IntelligenceApplicationService in DesktopContainer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceModule = void 0;
const tokens_1 = require("../container/tokens");
const intelligence_database_1 = require("../intelligence/storage/intelligence-database");
const language_parser_registry_1 = require("../intelligence/parser/language-parser-registry");
const repository_index_coordinator_1 = require("../intelligence/indexer/repository-index-coordinator");
const knowledge_graph_engine_1 = require("../intelligence/graph/knowledge-graph-engine");
const embedding_provider_1 = require("../intelligence/search/embedding-provider");
const semantic_search_engine_1 = require("../intelligence/search/semantic-search-engine");
const context_assembly_engine_1 = require("../intelligence/context/context-assembly-engine");
const engineering_memory_store_1 = require("../intelligence/memory/engineering-memory-store");
const analysis_cache_service_1 = require("../intelligence/cache/analysis-cache-service");
const engineering_intelligence_service_1 = require("../intelligence/services/engineering-intelligence-service");
const intelligence_timeline_publisher_1 = require("../intelligence/timeline/intelligence-timeline-publisher");
const intelligence_application_service_1 = require("../application/intelligence/intelligence-application-service");
class IntelligenceModule {
    name = 'IntelligenceModule';
    register(container) {
        if (container.isModuleLoaded(this.name))
            return;
        // 1. Intelligence Database
        container.registerSingleton({
            token: tokens_1.T.IIntelligenceDatabase,
            name: 'IIntelligenceDatabase',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new intelligence_database_1.IntelligenceDatabase(),
        });
        // 2. Language Parser Registry
        container.registerSingleton({
            token: tokens_1.T.ILanguageParserRegistry,
            name: 'ILanguageParserRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new language_parser_registry_1.LanguageParserRegistry(),
        });
        // 3. Intelligence Timeline Publisher
        container.registerSingleton({
            token: tokens_1.T.IIntelligenceTimelinePublisher,
            name: 'IIntelligenceTimelinePublisher',
            lifetime: 'singleton',
            dependencies: [],
            factory: (r) => new intelligence_timeline_publisher_1.IntelligenceTimelinePublisher(r.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined),
        });
        // 4. Knowledge Graph Engine
        container.registerSingleton({
            token: tokens_1.T.IKnowledgeGraphEngine,
            name: 'IKnowledgeGraphEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IIntelligenceDatabase],
            factory: (r) => new knowledge_graph_engine_1.KnowledgeGraphEngine(r.resolve(tokens_1.T.IIntelligenceDatabase)),
        });
        // 5. Repository Index Coordinator
        container.registerSingleton({
            token: tokens_1.T.IRepositoryIndexCoordinator,
            name: 'IRepositoryIndexCoordinator',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IIntelligenceDatabase, tokens_1.T.ILanguageParserRegistry, tokens_1.T.IIntelligenceTimelinePublisher],
            factory: (r) => new repository_index_coordinator_1.RepositoryIndexCoordinator(r.resolve(tokens_1.T.IIntelligenceDatabase), r.resolve(tokens_1.T.ILanguageParserRegistry), r.resolve(tokens_1.T.IIntelligenceTimelinePublisher), r.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined),
        });
        // 6. Embedding Provider
        container.registerSingleton({
            token: tokens_1.T.IEmbeddingProvider,
            name: 'IEmbeddingProvider',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new embedding_provider_1.DefaultEmbeddingProvider(),
        });
        // 7. Semantic Search Engine
        container.registerSingleton({
            token: tokens_1.T.ISemanticSearchEngine,
            name: 'ISemanticSearchEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IIntelligenceDatabase, tokens_1.T.IKnowledgeGraphEngine, tokens_1.T.IEmbeddingProvider],
            factory: (r) => new semantic_search_engine_1.SemanticSearchEngine(r.resolve(tokens_1.T.IIntelligenceDatabase), r.resolve(tokens_1.T.IKnowledgeGraphEngine), r.resolve(tokens_1.T.IEmbeddingProvider)),
        });
        // 8. Engineering Memory Store
        container.registerSingleton({
            token: tokens_1.T.IEngineeringMemoryStore,
            name: 'IEngineeringMemoryStore',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IIntelligenceDatabase],
            factory: (r) => new engineering_memory_store_1.EngineeringMemoryStore(r.resolve(tokens_1.T.IIntelligenceDatabase)),
        });
        // 9. Context Assembly Engine
        container.registerSingleton({
            token: tokens_1.T.IContextAssemblyEngine,
            name: 'IContextAssemblyEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ISemanticSearchEngine, tokens_1.T.IEngineeringMemoryStore, tokens_1.T.IIntelligenceTimelinePublisher],
            factory: (r) => new context_assembly_engine_1.ContextAssemblyEngine(r.resolve(tokens_1.T.ISemanticSearchEngine), r.resolve(tokens_1.T.IEngineeringMemoryStore), r.resolve(tokens_1.T.IIntelligenceTimelinePublisher)),
        });
        // 10. Analysis Cache Service
        container.registerSingleton({
            token: tokens_1.T.IAnalysisCacheService,
            name: 'IAnalysisCacheService',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new analysis_cache_service_1.AnalysisCacheService(),
        });
        // 11. Engineering Intelligence Service
        container.registerSingleton({
            token: tokens_1.T.IEngineeringIntelligenceService,
            name: 'IEngineeringIntelligenceService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IKnowledgeGraphEngine, tokens_1.T.IAnalysisCacheService, tokens_1.T.IIntelligenceTimelinePublisher],
            factory: (r) => new engineering_intelligence_service_1.EngineeringIntelligenceService(r.resolve(tokens_1.T.IKnowledgeGraphEngine), r.resolve(tokens_1.T.IAnalysisCacheService), r.resolve(tokens_1.T.IIntelligenceTimelinePublisher)),
        });
        // 12. Intelligence Application Service Facade
        container.registerSingleton({
            token: tokens_1.T.IIntelligenceApplicationService,
            name: 'IIntelligenceApplicationService',
            lifetime: 'singleton',
            dependencies: [
                tokens_1.T.IRepositoryIndexCoordinator,
                tokens_1.T.ISemanticSearchEngine,
                tokens_1.T.IContextAssemblyEngine,
                tokens_1.T.IEngineeringMemoryStore,
                tokens_1.T.IEngineeringIntelligenceService,
            ],
            factory: (r) => new intelligence_application_service_1.IntelligenceApplicationService(r.resolve(tokens_1.T.IRepositoryIndexCoordinator), r.resolve(tokens_1.T.ISemanticSearchEngine), r.resolve(tokens_1.T.IContextAssemblyEngine), r.resolve(tokens_1.T.IEngineeringMemoryStore), r.resolve(tokens_1.T.IEngineeringIntelligenceService)),
        });
    }
    static register(container) {
        if (!container.isModuleLoaded('IntelligenceModule')) {
            container.loadModule(new IntelligenceModule());
        }
    }
}
exports.IntelligenceModule = IntelligenceModule;
//# sourceMappingURL=intelligence.module.js.map