/**
 * ai-intelligence.module.ts — Sub-module for Engineering & Code Intelligence
 *
 * Registers RepositoryIndexer, CodeIntelligenceEngine, WorkspaceEngine,
 * EngineeringIntelligenceEngine, SemanticKnowledgeBuilder, and LearningEngine.
 */

import type { IDesktopContainer, IServiceResolver } from '../../container/interfaces';
import { T } from '../../container/tokens';
import { RepositoryIndexer } from '../../ai/context/repository-indexer';
import { CodeIntelligenceEngine } from '../../ai/code-intelligence/code-intelligence-engine';
import { WorkspaceEngine } from '../../ai/workspace/workspace-engine';
import { EngineeringIntelligenceEngine } from '../../ai/intelligence/engineering-intelligence-engine';
import { SemanticKnowledgeBuilder } from '../../ai/knowledge/semantic-knowledge-builder';
import {
  LearningEngine,
  ExperienceStore,
  PatternEngine,
  StrategyOptimizer,
  PlanningOptimizer,
  RecoveryOptimizer,
  PromptOptimizer,
  ToolOptimizer,
  LearningPolicyEngine,
  ConfidenceCalibrator,
  MemoryConsolidator,
  LearningReportBuilder,
  LearningMetrics,
} from '../../ai/learning/learning-engine';
import { MemoryRegistry } from '../../ai/memory/memory-registry';
import { RepositoryIntelligenceEngine } from '../../platform/repository-intelligence';
import type { IDesktopEventBus, IDesktopLogger, IWorkspaceService, IRepositoryProvider } from '../../container/service-interfaces';

export class AiIntelligenceModule {
  static register(container: IDesktopContainer): void {
    // Repository Indexer
    container.registerSingleton<RepositoryIndexer>({
      token: T.IRepositoryIndexer,
      name: 'IRepositoryIndexer',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RepositoryIndexer()
    });

    // Repository Provider
    container.registerSingleton<IRepositoryProvider>({
      token: T.IRepositoryProvider,
      name: 'IRepositoryProvider',
      lifetime: 'singleton',
      dependencies: [T.IWorkspaceService],
      factory: (resolver: IServiceResolver) => new RepositoryIntelligenceEngine(
        resolver.resolve<IWorkspaceService>(T.IWorkspaceService),
        resolver.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined
      )
    });

    // Code Intelligence Engine
    container.registerSingleton<CodeIntelligenceEngine>({
      token: T.ICodeIntelligenceEngine,
      name: 'ICodeIntelligenceEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new CodeIntelligenceEngine()
    });

    // Workspace Engine
    container.registerSingleton<WorkspaceEngine>({
      token: T.IWorkspaceEngine,
      name: 'IWorkspaceEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new WorkspaceEngine()
    });

    // Engineering Intelligence Engine
    container.registerSingleton<EngineeringIntelligenceEngine>({
      token: T.IEngineeringIntelligenceEngine,
      name: 'IEngineeringIntelligenceEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new EngineeringIntelligenceEngine(
        resolver.tryResolve<CodeIntelligenceEngine>(T.ICodeIntelligenceEngine) ?? undefined
      )
    });

    // Semantic Knowledge Builder
    container.registerSingleton<SemanticKnowledgeBuilder>({
      token: T.ISemanticKnowledgeBuilder,
      name: 'ISemanticKnowledgeBuilder',
      lifetime: 'singleton',
      dependencies: [T.IRepositoryProvider],
      factory: (resolver: IServiceResolver) => new SemanticKnowledgeBuilder(
        resolver.resolve<IRepositoryProvider>(T.IRepositoryProvider)
      )
    });

    // Learning Engine
    container.registerSingleton<LearningEngine>({
      token: T.ILearningEngine,
      name: 'ILearningEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new LearningEngine(
        new ExperienceStore(),
        new PatternEngine(),
        new StrategyOptimizer(),
        new PlanningOptimizer(),
        new RecoveryOptimizer(),
        new PromptOptimizer(),
        new ToolOptimizer(),
        new LearningPolicyEngine(),
        new ConfidenceCalibrator(),
        new MemoryConsolidator(resolver.tryResolve<MemoryRegistry>(T.IMemoryRegistry) ?? new MemoryRegistry()),
        new LearningReportBuilder(),
        new LearningMetrics(),
        resolver.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined as any,
        resolver.tryResolve<IDesktopLogger>(T.IDesktopLogger) ?? undefined as any
      )
    });
  }
}
