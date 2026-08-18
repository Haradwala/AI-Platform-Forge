"use strict";
/**
 * ai-intelligence.module.ts — Sub-module for Engineering & Code Intelligence
 *
 * Registers RepositoryIndexer, CodeIntelligenceEngine, WorkspaceEngine,
 * EngineeringIntelligenceEngine, SemanticKnowledgeBuilder, LearningEngine,
 * and (Sprint 87) WorkspaceSymbolIndexer, DependencyGraphEngine, SemanticContextRetriever.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiIntelligenceModule = void 0;
const tokens_1 = require("../../container/tokens");
const repository_indexer_1 = require("../../ai/context/repository-indexer");
const code_intelligence_engine_1 = require("../../ai/code-intelligence/code-intelligence-engine");
const workspace_engine_1 = require("../../ai/workspace/workspace-engine");
const engineering_intelligence_engine_1 = require("../../ai/intelligence/engineering-intelligence-engine");
const semantic_knowledge_builder_1 = require("../../ai/knowledge/semantic-knowledge-builder");
const symbol_indexer_1 = require("../../ai/workspace/symbol-indexer");
const dependency_graph_engine_1 = require("../../ai/workspace/dependency-graph-engine");
const semantic_retriever_1 = require("../../ai/context/semantic-retriever");
const learning_engine_1 = require("../../ai/learning/learning-engine");
const memory_registry_1 = require("../../ai/memory/memory-registry");
const repository_intelligence_1 = require("../../platform/repository-intelligence");
class AiIntelligenceModule {
    static register(container) {
        // Repository Indexer
        container.registerSingleton({
            token: tokens_1.T.IRepositoryIndexer,
            name: 'IRepositoryIndexer',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new repository_indexer_1.RepositoryIndexer()
        });
        // Repository Provider
        container.registerSingleton({
            token: tokens_1.T.IRepositoryProvider,
            name: 'IRepositoryProvider',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IWorkspaceService],
            factory: (resolver) => new repository_intelligence_1.RepositoryIntelligenceEngine(resolver.resolve(tokens_1.T.IWorkspaceService), resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined)
        });
        // Code Intelligence Engine
        container.registerSingleton({
            token: tokens_1.T.ICodeIntelligenceEngine,
            name: 'ICodeIntelligenceEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new code_intelligence_engine_1.CodeIntelligenceEngine()
        });
        // Workspace Engine
        container.registerSingleton({
            token: tokens_1.T.IWorkspaceEngine,
            name: 'IWorkspaceEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new workspace_engine_1.WorkspaceEngine()
        });
        // Engineering Intelligence Engine
        container.registerSingleton({
            token: tokens_1.T.IEngineeringIntelligenceEngine,
            name: 'IEngineeringIntelligenceEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new engineering_intelligence_engine_1.EngineeringIntelligenceEngine(resolver.tryResolve(tokens_1.T.ICodeIntelligenceEngine) ?? undefined)
        });
        // Semantic Knowledge Builder
        container.registerSingleton({
            token: tokens_1.T.ISemanticKnowledgeBuilder,
            name: 'ISemanticKnowledgeBuilder',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRepositoryProvider],
            factory: (resolver) => new semantic_knowledge_builder_1.SemanticKnowledgeBuilder(resolver.resolve(tokens_1.T.IRepositoryProvider))
        });
        // Sprint 87: WorkspaceSymbolIndexer — wired through DI so SCR + orchestrator
        // share a single instance rather than parallel module-level singletons.
        container.registerSingleton({
            token: tokens_1.T.IWorkspaceSymbolIndexer,
            name: 'IWorkspaceSymbolIndexer',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new symbol_indexer_1.WorkspaceSymbolIndexer()
        });
        // Sprint 87: DependencyGraphEngine — depends on shared WorkspaceSymbolIndexer
        container.registerSingleton({
            token: tokens_1.T.IDependencyGraphEngine,
            name: 'IDependencyGraphEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IWorkspaceSymbolIndexer],
            factory: (resolver) => new dependency_graph_engine_1.DependencyGraphEngine(resolver.resolve(tokens_1.T.IWorkspaceSymbolIndexer))
        });
        // Sprint 87: SemanticContextRetriever — depends on shared indexer + graph engine.
        // Now injectable into AiOrchestrator via DI; no new instance created inside orchestrator.
        container.registerSingleton({
            token: tokens_1.T.ISemanticContextRetriever,
            name: 'ISemanticContextRetriever',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IWorkspaceSymbolIndexer, tokens_1.T.IDependencyGraphEngine],
            factory: (resolver) => new semantic_retriever_1.SemanticContextRetriever(resolver.resolve(tokens_1.T.IWorkspaceSymbolIndexer), resolver.resolve(tokens_1.T.IDependencyGraphEngine))
        });
        container.registerSingleton({
            token: tokens_1.T.ILearningEngine,
            name: 'ILearningEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new learning_engine_1.LearningEngine(new learning_engine_1.ExperienceStore(), new learning_engine_1.PatternEngine(), new learning_engine_1.StrategyOptimizer(), new learning_engine_1.PlanningOptimizer(), new learning_engine_1.RecoveryOptimizer(), new learning_engine_1.PromptOptimizer(), new learning_engine_1.ToolOptimizer(), new learning_engine_1.LearningPolicyEngine(), new learning_engine_1.ConfidenceCalibrator(), new learning_engine_1.MemoryConsolidator(resolver.tryResolve(tokens_1.T.IMemoryRegistry) ?? new memory_registry_1.MemoryRegistry()), new learning_engine_1.LearningReportBuilder(), new learning_engine_1.LearningMetrics(), resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
    }
}
exports.AiIntelligenceModule = AiIntelligenceModule;
//# sourceMappingURL=ai-intelligence.module.js.map