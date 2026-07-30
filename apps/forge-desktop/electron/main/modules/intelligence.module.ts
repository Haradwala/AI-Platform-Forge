/**
 * intelligence.module.ts — Composition Module for Engineering Intelligence Engine
 *
 * Registers IntelligenceDatabase, LanguageParserRegistry, RepositoryIndexCoordinator,
 * KnowledgeGraphEngine, EmbeddingProvider, SemanticSearchEngine, ContextAssemblyEngine,
 * EngineeringMemoryStore, AnalysisCacheService, EngineeringIntelligenceService,
 * IntelligenceTimelinePublisher, and IntelligenceApplicationService in DesktopContainer.
 */

import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import { T } from '../container/tokens';
import { IntelligenceDatabase } from '../intelligence/storage/intelligence-database';
import { LanguageParserRegistry } from '../intelligence/parser/language-parser-registry';
import { RepositoryIndexCoordinator } from '../intelligence/indexer/repository-index-coordinator';
import { KnowledgeGraphEngine } from '../intelligence/graph/knowledge-graph-engine';
import { DefaultEmbeddingProvider, IEmbeddingProvider } from '../intelligence/search/embedding-provider';
import { SemanticSearchEngine } from '../intelligence/search/semantic-search-engine';
import { ContextAssemblyEngine } from '../intelligence/context/context-assembly-engine';
import { EngineeringMemoryStore } from '../intelligence/memory/engineering-memory-store';
import { AnalysisCacheService } from '../intelligence/cache/analysis-cache-service';
import { EngineeringIntelligenceService } from '../intelligence/services/engineering-intelligence-service';
import { IntelligenceTimelinePublisher } from '../intelligence/timeline/intelligence-timeline-publisher';
import { IntelligenceApplicationService } from '../application/intelligence/intelligence-application-service';
import type { IDesktopEventBus } from '../container/service-interfaces';

export class IntelligenceModule implements IContainerModule {
  readonly name = 'IntelligenceModule';

  register(container: IDesktopContainer): void {
    if (container.isModuleLoaded(this.name)) return;

    // 1. Intelligence Database
    container.registerSingleton<IntelligenceDatabase>({
      token: T.IIntelligenceDatabase,
      name: 'IIntelligenceDatabase',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new IntelligenceDatabase(),
    });

    // 2. Language Parser Registry
    container.registerSingleton<LanguageParserRegistry>({
      token: T.ILanguageParserRegistry,
      name: 'ILanguageParserRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new LanguageParserRegistry(),
    });

    // 3. Intelligence Timeline Publisher
    container.registerSingleton<IntelligenceTimelinePublisher>({
      token: T.IIntelligenceTimelinePublisher,
      name: 'IIntelligenceTimelinePublisher',
      lifetime: 'singleton',
      dependencies: [],
      factory: (r) => new IntelligenceTimelinePublisher(
        r.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined
      ),
    });

    // 4. Knowledge Graph Engine
    container.registerSingleton<KnowledgeGraphEngine>({
      token: T.IKnowledgeGraphEngine,
      name: 'IKnowledgeGraphEngine',
      lifetime: 'singleton',
      dependencies: [T.IIntelligenceDatabase],
      factory: (r) => new KnowledgeGraphEngine(r.resolve<IntelligenceDatabase>(T.IIntelligenceDatabase)),
    });

    // 5. Repository Index Coordinator
    container.registerSingleton<RepositoryIndexCoordinator>({
      token: T.IRepositoryIndexCoordinator,
      name: 'IRepositoryIndexCoordinator',
      lifetime: 'singleton',
      dependencies: [T.IIntelligenceDatabase, T.ILanguageParserRegistry, T.IIntelligenceTimelinePublisher],
      factory: (r) => new RepositoryIndexCoordinator(
        r.resolve<IntelligenceDatabase>(T.IIntelligenceDatabase),
        r.resolve<LanguageParserRegistry>(T.ILanguageParserRegistry),
        r.resolve<IntelligenceTimelinePublisher>(T.IIntelligenceTimelinePublisher),
        r.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined
      ),
    });

    // 6. Embedding Provider
    container.registerSingleton<IEmbeddingProvider>({
      token: T.IEmbeddingProvider,
      name: 'IEmbeddingProvider',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new DefaultEmbeddingProvider(),
    });

    // 7. Semantic Search Engine
    container.registerSingleton<SemanticSearchEngine>({
      token: T.ISemanticSearchEngine,
      name: 'ISemanticSearchEngine',
      lifetime: 'singleton',
      dependencies: [T.IIntelligenceDatabase, T.IKnowledgeGraphEngine, T.IEmbeddingProvider],
      factory: (r) => new SemanticSearchEngine(
        r.resolve<IntelligenceDatabase>(T.IIntelligenceDatabase),
        r.resolve<KnowledgeGraphEngine>(T.IKnowledgeGraphEngine),
        r.resolve<IEmbeddingProvider>(T.IEmbeddingProvider)
      ),
    });

    // 8. Engineering Memory Store
    container.registerSingleton<EngineeringMemoryStore>({
      token: T.IEngineeringMemoryStore,
      name: 'IEngineeringMemoryStore',
      lifetime: 'singleton',
      dependencies: [T.IIntelligenceDatabase],
      factory: (r) => new EngineeringMemoryStore(r.resolve<IntelligenceDatabase>(T.IIntelligenceDatabase)),
    });

    // 9. Context Assembly Engine
    container.registerSingleton<ContextAssemblyEngine>({
      token: T.IContextAssemblyEngine,
      name: 'IContextAssemblyEngine',
      lifetime: 'singleton',
      dependencies: [T.ISemanticSearchEngine, T.IEngineeringMemoryStore, T.IIntelligenceTimelinePublisher],
      factory: (r) => new ContextAssemblyEngine(
        r.resolve<SemanticSearchEngine>(T.ISemanticSearchEngine),
        r.resolve<EngineeringMemoryStore>(T.IEngineeringMemoryStore),
        r.resolve<IntelligenceTimelinePublisher>(T.IIntelligenceTimelinePublisher)
      ),
    });

    // 10. Analysis Cache Service
    container.registerSingleton<AnalysisCacheService>({
      token: T.IAnalysisCacheService,
      name: 'IAnalysisCacheService',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new AnalysisCacheService(),
    });

    // 11. Engineering Intelligence Service
    container.registerSingleton<EngineeringIntelligenceService>({
      token: T.IEngineeringIntelligenceService,
      name: 'IEngineeringIntelligenceService',
      lifetime: 'singleton',
      dependencies: [T.IKnowledgeGraphEngine, T.IAnalysisCacheService, T.IIntelligenceTimelinePublisher],
      factory: (r) => new EngineeringIntelligenceService(
        r.resolve<KnowledgeGraphEngine>(T.IKnowledgeGraphEngine),
        r.resolve<AnalysisCacheService>(T.IAnalysisCacheService),
        r.resolve<IntelligenceTimelinePublisher>(T.IIntelligenceTimelinePublisher)
      ),
    });

    // 12. Intelligence Application Service Facade
    container.registerSingleton<IntelligenceApplicationService>({
      token: T.IIntelligenceApplicationService,
      name: 'IIntelligenceApplicationService',
      lifetime: 'singleton',
      dependencies: [
        T.IRepositoryIndexCoordinator,
        T.ISemanticSearchEngine,
        T.IContextAssemblyEngine,
        T.IEngineeringMemoryStore,
        T.IEngineeringIntelligenceService,
      ],
      factory: (r) => new IntelligenceApplicationService(
        r.resolve<RepositoryIndexCoordinator>(T.IRepositoryIndexCoordinator),
        r.resolve<SemanticSearchEngine>(T.ISemanticSearchEngine),
        r.resolve<ContextAssemblyEngine>(T.IContextAssemblyEngine),
        r.resolve<EngineeringMemoryStore>(T.IEngineeringMemoryStore),
        r.resolve<EngineeringIntelligenceService>(T.IEngineeringIntelligenceService)
      ),
    });
  }

  static register(container: IDesktopContainer): void {
    if (!container.isModuleLoaded('IntelligenceModule')) {
      container.loadModule(new IntelligenceModule());
    }
  }
}
