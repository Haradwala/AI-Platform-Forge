/**
 * Service tokens — the only public identifiers for services in the DesktopContainer.
 *
 * Rules:
 * - Every token is a unique Symbol
 * - Token names match the interface they represent
 * - This file is the single source of truth — no token is defined elsewhere
 * - Modules and callers import from this file only
 */

import type { ServiceToken } from './interfaces';

// ─── Core infrastructure ──────────────────────────────────────────────────────

export const T = {
  // Core
  IDesktopLogger:      Symbol('IDesktopLogger')      as ServiceToken,
  IDesktopEventBus:    Symbol('IDesktopEventBus')    as ServiceToken,

  // IPC
  IIpcRouter:          Symbol('IIpcRouter')          as ServiceToken,

  // Window
  IWindowService:      Symbol('IWindowService')      as ServiceToken,
  IWindowRegistry:     Symbol('IWindowRegistry')     as ServiceToken,

  // Workspace
  IWorkspaceService:   Symbol('IWorkspaceService')   as ServiceToken,
  IWorkspaceWatcher:   Symbol('IWorkspaceWatcher')   as ServiceToken,

  // Theme
  IThemeService:       Symbol('IThemeService')       as ServiceToken,
  IThemeEngine:        Symbol('IThemeEngine')        as ServiceToken,

  // Terminal
  ITerminalService:    Symbol('ITerminalService')    as ServiceToken,

  // Session
  ISessionManager:     Symbol('ISessionManager')     as ServiceToken,

  // Performance
  IPerformanceMonitor: Symbol('IPerformanceMonitor') as ServiceToken,

  // Startup
  IStartupManager:     Symbol('IStartupManager')     as ServiceToken,

  // AI Foundation
  IProviderRegistry:   Symbol('IProviderRegistry')   as ServiceToken,
  IRuntimeManager:     Symbol('IRuntimeManager')     as ServiceToken, // Phase 1 runtime layer
  IConfigurationService: Symbol('IConfigurationService') as ServiceToken, // Phase 3 config service
  IAiProvider:         Symbol('IAiProvider')         as ServiceToken,
  IAiSessionService:   Symbol('IAiSessionService')   as ServiceToken,
  IContextEngine:      Symbol('IContextEngine')      as ServiceToken,
  IRepositoryIndexer:  Symbol('IRepositoryIndexer')  as ServiceToken, // Phase 6 repository indexer
  IToolRegistry:       Symbol('IToolRegistry')       as ServiceToken,
  IToolExecutionEngine: Symbol('IToolExecutionEngine') as ServiceToken, // Phase 4 tool engine
  IAgentLoop:          Symbol('IAgentLoop')          as ServiceToken, // Phase 5 agent loop
  IAiKernel:           Symbol('IAiKernel')           as ServiceToken,
  IPlanner:            Symbol('IPlanner')            as ServiceToken,
  IExecutionEngine:    Symbol('IExecutionEngine')    as ServiceToken,
  IRepositoryProvider: Symbol('IRepositoryProvider') as ServiceToken,
  IContextRankingService: Symbol('IContextRankingService') as ServiceToken,
  ITokenBudgetManager: Symbol('ITokenBudgetManager') as ServiceToken,
  IMemoryRegistry:     Symbol('IMemoryRegistry')     as ServiceToken,
  IMemoryEngine:       Symbol('IMemoryEngine')       as ServiceToken, // Phase 7 memory engine
  IPromptAssemblyEngine: Symbol('IPromptAssemblyEngine') as ServiceToken, // Phase 8 prompt assembly engine
  IPlanningGraph:      Symbol('IPlanningGraph')      as ServiceToken, // Phase 8 planning graph
  IExecutionOrchestrator: Symbol('IExecutionOrchestrator') as ServiceToken, // Phase 8 execution orchestrator
  ICodeIntelligenceEngine: Symbol('ICodeIntelligenceEngine') as ServiceToken, // Phase 9 code intelligence engine
  IWorkspaceEngine:    Symbol('IWorkspaceEngine')    as ServiceToken, // Phase 10 workspace engine
  IExternalRuntimeManager: Symbol('IExternalRuntimeManager') as ServiceToken, // Phase 18 external runtime manager
  IMCPRuntime:         Symbol('IMCPRuntime')         as ServiceToken, // MCP Runtime
  ICLIManager:         Symbol('ICLIManager')         as ServiceToken, // CLI Process Engine
  ClaudeCodeRuntime:   Symbol('ClaudeCodeRuntime')   as ServiceToken, // Claude Code CLI Runtime
  GeminiCLIRuntime:    Symbol('GeminiCLIRuntime')    as ServiceToken, // Gemini CLI Runtime
  CodexCLIRuntime:     Symbol('CodexCLIRuntime')     as ServiceToken, // Codex CLI Runtime
  AiderCLIRuntime:     Symbol('AiderCLIRuntime')     as ServiceToken, // Aider CLI Runtime
  GooseCLIRuntime:     Symbol('GooseCLIRuntime')     as ServiceToken, // Goose CLI Runtime
  MockProvider:        Symbol('MockProvider')        as ServiceToken, // Mock AI Provider
  OllamaProvider:      Symbol('OllamaProvider')      as ServiceToken, // Ollama Local LLM Runtime
  OpenAIRuntime:       Symbol('OpenAIRuntime')       as ServiceToken, // OpenAI Cloud Runtime
  AnthropicRuntime:    Symbol('AnthropicRuntime')    as ServiceToken, // Anthropic Cloud Runtime
  GeminiRuntime:       Symbol('GeminiRuntime')       as ServiceToken, // Gemini Cloud Runtime
  GroqRuntime:         Symbol('GroqRuntime')         as ServiceToken, // Groq Cloud Runtime
  OpenRouterRuntime:   Symbol('OpenRouterRuntime')   as ServiceToken, // OpenRouter Cloud Runtime
  ISemanticKnowledgeBuilder: Symbol('ISemanticKnowledgeBuilder') as ServiceToken,
  IConversationManager: Symbol('IConversationManager') as ServiceToken,
  IContextSufficiencyChecker: Symbol('IContextSufficiencyChecker') as ServiceToken,
  IIntentDetector:     Symbol('IIntentDetector')     as ServiceToken,
  IGoalExtractor:      Symbol('IGoalExtractor')      as ServiceToken,
  IReasoningEngine:    Symbol('IReasoningEngine')    as ServiceToken,
  IDependencyResolver: Symbol('IDependencyResolver') as ServiceToken,
  IGoalTaskPlanner:    Symbol('IGoalTaskPlanner')    as ServiceToken,
  IPlanValidator:      Symbol('IPlanValidator')      as ServiceToken,
  IPlanScorer:         Symbol('IPlanScorer')         as ServiceToken,
  IPlanApprovalPolicy: Symbol('IPlanApprovalPolicy') as ServiceToken,
  IToolSelector:       Symbol('IToolSelector')       as ServiceToken,
  IExecutionPlanner:   Symbol('IExecutionPlanner')   as ServiceToken,
  IExecutionGraphEngine: Symbol('IExecutionGraphEngine') as ServiceToken,
  IExecutionScheduler:   Symbol('IExecutionScheduler')   as ServiceToken,
  ITaskDispatcher:     Symbol('ITaskDispatcher')     as ServiceToken,
  IExecutionSnapshotService: Symbol('IExecutionSnapshotService') as ServiceToken,
  IExecutionMetricsService:  Symbol('IExecutionMetricsService')  as ServiceToken,
  IExecutionObserver:   Symbol('IExecutionObserver')   as ServiceToken,
  IExecutionPolicyRegistry: Symbol('IExecutionPolicyRegistry') as ServiceToken,
  IExecutionContextFactory: Symbol('IExecutionContextFactory') as ServiceToken,
  IVerificationEngine: Symbol('IVerificationEngine') as ServiceToken,
  IVerificationPipeline: Symbol('IVerificationPipeline') as ServiceToken,
  IVerificationMetrics: Symbol('IVerificationMetrics') as ServiceToken,
  ICompilationVerifier: Symbol('ICompilationVerifier') as ServiceToken,
  ILintVerifier: Symbol('ILintVerifier') as ServiceToken,
  IFormattingChecker: Symbol('IFormattingChecker') as ServiceToken,
  ITestRunner: Symbol('ITestRunner') as ServiceToken,
  IRepositoryRules: Symbol('IRepositoryRules') as ServiceToken,
  ISecurityScanner: Symbol('ISecurityScanner') as ServiceToken,
  IPerformanceChecker: Symbol('IPerformanceChecker') as ServiceToken,
  IAiOrchestrator: Symbol('IAiOrchestrator') as ServiceToken,
  IRecoveryOrchestrator: Symbol('IRecoveryOrchestrator') as ServiceToken,
  IReflectionEngine: Symbol('IReflectionEngine') as ServiceToken,
  IOutcomeManager: Symbol('IOutcomeManager') as ServiceToken,
  ILearningEngine: Symbol('ILearningEngine') as ServiceToken,
  IFailureAnalyzer: Symbol('IFailureAnalyzer') as ServiceToken,
  IRecoveryPolicyEngine: Symbol('IRecoveryPolicyEngine') as ServiceToken,
  IRecoveryStrategyRegistry: Symbol('IRecoveryStrategyRegistry') as ServiceToken,
  IRecoveryExecutor: Symbol('IRecoveryExecutor') as ServiceToken,
  IRollbackManager: Symbol('IRollbackManager') as ServiceToken,
  IRecoveryJournal: Symbol('IRecoveryJournal') as ServiceToken,
  IRecoveryMetricsService: Symbol('IRecoveryMetricsService') as ServiceToken,
  IReflectionContextBuilder: Symbol('IReflectionContextBuilder') as ServiceToken,
  IArchitectureReviewer: Symbol('IArchitectureReviewer') as ServiceToken,
  ISolutionReviewer: Symbol('ISolutionReviewer') as ServiceToken,
  ISelfCritiqueEngine: Symbol('ISelfCritiqueEngine') as ServiceToken,
  IConfidenceEngine: Symbol('IConfidenceEngine') as ServiceToken,
  IScoreAggregator: Symbol('IScoreAggregator') as ServiceToken,
  IRecommendationEngine: Symbol('IRecommendationEngine') as ServiceToken,
  IReflectionReportBuilder: Symbol('IReflectionReportBuilder') as ServiceToken,
  IExperienceBuilder: Symbol('IExperienceBuilder') as ServiceToken,
  IDecisionLog: Symbol('IDecisionLog') as ServiceToken,
  IExperienceStore: Symbol('IExperienceStore') as ServiceToken,
  IPatternEngine: Symbol('IPatternEngine') as ServiceToken,
  IStrategyOptimizer: Symbol('IStrategyOptimizer') as ServiceToken,
  IPlanningOptimizer: Symbol('IPlanningOptimizer') as ServiceToken,
  IRecoveryOptimizer: Symbol('IRecoveryOptimizer') as ServiceToken,
  IPromptOptimizer: Symbol('IPromptOptimizer') as ServiceToken,
  IToolOptimizer: Symbol('IToolOptimizer') as ServiceToken,
  ILearningPolicyEngine: Symbol('ILearningPolicyEngine') as ServiceToken,
  IConfidenceCalibrator: Symbol('IConfidenceCalibrator') as ServiceToken,
  IMemoryConsolidator: Symbol('IMemoryConsolidator') as ServiceToken,
  ILearningMetrics: Symbol('ILearningMetrics') as ServiceToken,
  ILearningReportBuilder: Symbol('ILearningReportBuilder') as ServiceToken,
  IPipelineExecutor: Symbol('IPipelineExecutor') as ServiceToken,
  IPipelineRecorder: Symbol('IPipelineRecorder') as ServiceToken,
  IDiagnosticsService: Symbol('IDiagnosticsService') as ServiceToken,
  IRuntimeDiscoveryEngine: Symbol('IRuntimeDiscoveryEngine') as ServiceToken,
  IRuntimeExecutionManager: Symbol('IRuntimeExecutionManager') as ServiceToken,
  ISessionStorage: Symbol('ISessionStorage') as ServiceToken,
  IRuntimeEventBus: Symbol('IRuntimeEventBus') as ServiceToken,
  IWorkflowEngine: Symbol('IWorkflowEngine') as ServiceToken,
  IRuntimeRouter: Symbol('IRuntimeRouter') as ServiceToken,
  IWorkspaceSessionManager: Symbol('IWorkspaceSessionManager') as ServiceToken,
  IRepositoryImporter: Symbol('IRepositoryImporter') as ServiceToken,
  IRuntimeLearningEngine: Symbol('IRuntimeLearningEngine') as ServiceToken,
  IWorkspaceProfileManager: Symbol('IWorkspaceProfileManager') as ServiceToken,
  IActionRegistry: Symbol('IActionRegistry') as ServiceToken,
  IActionExecutor: Symbol('IActionExecutor') as ServiceToken,
  IWorkspaceApplicationService: Symbol('IWorkspaceApplicationService') as ServiceToken,
  ITerminalApplicationService: Symbol('ITerminalApplicationService') as ServiceToken,
  IGitApplicationService: Symbol('IGitApplicationService') as ServiceToken,
  IRuntimeApplicationService: Symbol('IRuntimeApplicationService') as ServiceToken,
  IAgentApplicationService: Symbol('IAgentApplicationService') as ServiceToken,
  IEngineeringApplicationService: Symbol('IEngineeringApplicationService') as ServiceToken,
  IEngineeringIntelligenceEngine: Symbol('IEngineeringIntelligenceEngine') as ServiceToken,
  IAgentRegistry: Symbol('IAgentRegistry') as ServiceToken,
  IAgentMemory: Symbol('IAgentMemory') as ServiceToken,
  IAgentScheduler: Symbol('IAgentScheduler') as ServiceToken,
  IAgentOrchestrator: Symbol('IAgentOrchestrator') as ServiceToken,
  IActionHistory: Symbol('IActionHistory') as ServiceToken,
  IWorkflowDefinitionParser: Symbol('IWorkflowDefinitionParser') as ServiceToken,
  IAutomationCoordinator: Symbol('IAutomationCoordinator') as ServiceToken,
  IAutomationPipelineRunner: Symbol('IAutomationPipelineRunner') as ServiceToken,
  IAutomationResourceScheduler: Symbol('IAutomationResourceScheduler') as ServiceToken,
  IAutomationArtifactStore: Symbol('IAutomationArtifactStore') as ServiceToken,
  IAutomationStepExecutor: Symbol('IAutomationStepExecutor') as ServiceToken,
  IWorkflowTemplateRegistry: Symbol('IWorkflowTemplateRegistry') as ServiceToken,
  ITriggerManager: Symbol('ITriggerManager') as ServiceToken,
  IAutomationTimelinePublisher: Symbol('IAutomationTimelinePublisher') as ServiceToken,
  IAutomationApplicationService: Symbol('IAutomationApplicationService') as ServiceToken,
  IIntelligenceDatabase: Symbol('IIntelligenceDatabase') as ServiceToken,
  ILanguageParserRegistry: Symbol('ILanguageParserRegistry') as ServiceToken,
  IRepositoryIndexCoordinator: Symbol('IRepositoryIndexCoordinator') as ServiceToken,
  IKnowledgeGraphEngine: Symbol('IKnowledgeGraphEngine') as ServiceToken,
  IEmbeddingProvider: Symbol('IEmbeddingProvider') as ServiceToken,
  ISemanticSearchEngine: Symbol('ISemanticSearchEngine') as ServiceToken,
  IContextAssemblyEngine: Symbol('IContextAssemblyEngine') as ServiceToken,
  IEngineeringMemoryStore: Symbol('IEngineeringMemoryStore') as ServiceToken,
  IAnalysisCacheService: Symbol('IAnalysisCacheService') as ServiceToken,
  IEngineeringIntelligenceService: Symbol('IEngineeringIntelligenceService') as ServiceToken,
  IIntelligenceTimelinePublisher: Symbol('IIntelligenceTimelinePublisher') as ServiceToken,
  IIntelligenceApplicationService: Symbol('IIntelligenceApplicationService') as ServiceToken,
  IRuntimeProviderRegistry: Symbol('IRuntimeProviderRegistry') as ServiceToken,
  IRuntimeProfileRegistry: Symbol('IRuntimeProfileRegistry') as ServiceToken,
  IMultiRuntimeManager: Symbol('IMultiRuntimeManager') as ServiceToken,
  IIntelligentRoutingEngine: Symbol('IIntelligentRoutingEngine') as ServiceToken,
  IMultiRuntimeSessionManager: Symbol('IMultiRuntimeSessionManager') as ServiceToken,
  IRuntimePerformanceEngine: Symbol('IRuntimePerformanceEngine') as ServiceToken,
  IRuntimeTimelinePublisher: Symbol('IRuntimeTimelinePublisher') as ServiceToken,
  IMultiRuntimeApplicationService: Symbol('IMultiRuntimeApplicationService') as ServiceToken,
  IRepositoryHealthApplicationService: Symbol('IRepositoryHealthApplicationService') as ServiceToken,
  IResponseGenerationEngine: Symbol('IResponseGenerationEngine') as ServiceToken,
} as const;

/** Type alias for the union of all registered token values */
export type KnownToken = typeof T[keyof typeof T];
