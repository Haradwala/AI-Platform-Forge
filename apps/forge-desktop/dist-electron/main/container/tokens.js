"use strict";
/**
 * Service tokens — the only public identifiers for services in the DesktopContainer.
 *
 * Rules:
 * - Every token is a unique Symbol
 * - Token names match the interface they represent
 * - This file is the single source of truth — no token is defined elsewhere
 * - Modules and callers import from this file only
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.T = void 0;
// ─── Core infrastructure ──────────────────────────────────────────────────────
exports.T = {
    // Core
    IDesktopLogger: Symbol('IDesktopLogger'),
    IDesktopEventBus: Symbol('IDesktopEventBus'),
    // IPC
    IIpcRouter: Symbol('IIpcRouter'),
    // Window
    IWindowService: Symbol('IWindowService'),
    IWindowRegistry: Symbol('IWindowRegistry'),
    // Workspace
    IWorkspaceService: Symbol('IWorkspaceService'),
    IWorkspaceWatcher: Symbol('IWorkspaceWatcher'),
    // Theme
    IThemeService: Symbol('IThemeService'),
    IThemeEngine: Symbol('IThemeEngine'),
    // Terminal
    ITerminalService: Symbol('ITerminalService'),
    // Session
    ISessionManager: Symbol('ISessionManager'),
    // Performance
    IPerformanceMonitor: Symbol('IPerformanceMonitor'),
    // Startup
    IStartupManager: Symbol('IStartupManager'),
    // AI Foundation
    IProviderRegistry: Symbol('IProviderRegistry'),
    IRuntimeManager: Symbol('IRuntimeManager'), // Phase 1 runtime layer
    IConfigurationService: Symbol('IConfigurationService'), // Phase 3 config service
    IAiProvider: Symbol('IAiProvider'),
    IAiSessionService: Symbol('IAiSessionService'),
    IContextEngine: Symbol('IContextEngine'),
    IRepositoryIndexer: Symbol('IRepositoryIndexer'), // Phase 6 repository indexer
    IToolRegistry: Symbol('IToolRegistry'),
    IToolExecutionEngine: Symbol('IToolExecutionEngine'), // Phase 4 tool engine
    IAgentLoop: Symbol('IAgentLoop'), // Phase 5 agent loop
    IAiKernel: Symbol('IAiKernel'),
    IPlanner: Symbol('IPlanner'),
    IExecutionEngine: Symbol('IExecutionEngine'),
    IRepositoryProvider: Symbol('IRepositoryProvider'),
    IContextRankingService: Symbol('IContextRankingService'),
    ITokenBudgetManager: Symbol('ITokenBudgetManager'),
    IMemoryRegistry: Symbol('IMemoryRegistry'),
    IMemoryEngine: Symbol('IMemoryEngine'), // Phase 7 memory engine
    IPromptAssemblyEngine: Symbol('IPromptAssemblyEngine'), // Phase 8 prompt assembly engine
    IPlanningGraph: Symbol('IPlanningGraph'), // Phase 8 planning graph
    IExecutionOrchestrator: Symbol('IExecutionOrchestrator'), // Phase 8 execution orchestrator
    ICodeIntelligenceEngine: Symbol('ICodeIntelligenceEngine'), // Phase 9 code intelligence engine
    IWorkspaceEngine: Symbol('IWorkspaceEngine'), // Phase 10 workspace engine
    IExternalRuntimeManager: Symbol('IExternalRuntimeManager'), // Phase 18 external runtime manager
    IMCPRuntime: Symbol('IMCPRuntime'), // MCP Runtime
    ICLIManager: Symbol('ICLIManager'), // CLI Process Engine
    ClaudeCodeRuntime: Symbol('ClaudeCodeRuntime'), // Claude Code CLI Runtime
    GeminiCLIRuntime: Symbol('GeminiCLIRuntime'), // Gemini CLI Runtime
    CodexCLIRuntime: Symbol('CodexCLIRuntime'), // Codex CLI Runtime
    AiderCLIRuntime: Symbol('AiderCLIRuntime'), // Aider CLI Runtime
    GooseCLIRuntime: Symbol('GooseCLIRuntime'), // Goose CLI Runtime
    MockProvider: Symbol('MockProvider'), // Mock AI Provider
    OllamaProvider: Symbol('OllamaProvider'), // Ollama Local LLM Runtime
    OpenAIRuntime: Symbol('OpenAIRuntime'), // OpenAI Cloud Runtime
    AnthropicRuntime: Symbol('AnthropicRuntime'), // Anthropic Cloud Runtime
    GeminiRuntime: Symbol('GeminiRuntime'), // Gemini Cloud Runtime
    GroqRuntime: Symbol('GroqRuntime'), // Groq Cloud Runtime
    OpenRouterRuntime: Symbol('OpenRouterRuntime'), // OpenRouter Cloud Runtime
    ISemanticKnowledgeBuilder: Symbol('ISemanticKnowledgeBuilder'),
    IConversationManager: Symbol('IConversationManager'),
    IContextSufficiencyChecker: Symbol('IContextSufficiencyChecker'),
    IIntentDetector: Symbol('IIntentDetector'),
    IGoalExtractor: Symbol('IGoalExtractor'),
    IReasoningEngine: Symbol('IReasoningEngine'),
    IDependencyResolver: Symbol('IDependencyResolver'),
    IGoalTaskPlanner: Symbol('IGoalTaskPlanner'),
    IPlanValidator: Symbol('IPlanValidator'),
    IPlanScorer: Symbol('IPlanScorer'),
    IPlanApprovalPolicy: Symbol('IPlanApprovalPolicy'),
    IToolSelector: Symbol('IToolSelector'),
    IExecutionPlanner: Symbol('IExecutionPlanner'),
    IExecutionGraphEngine: Symbol('IExecutionGraphEngine'),
    IExecutionScheduler: Symbol('IExecutionScheduler'),
    ITaskDispatcher: Symbol('ITaskDispatcher'),
    IExecutionSnapshotService: Symbol('IExecutionSnapshotService'),
    IExecutionMetricsService: Symbol('IExecutionMetricsService'),
    IExecutionObserver: Symbol('IExecutionObserver'),
    IExecutionPolicyRegistry: Symbol('IExecutionPolicyRegistry'),
    IExecutionContextFactory: Symbol('IExecutionContextFactory'),
    IVerificationEngine: Symbol('IVerificationEngine'),
    IVerificationPipeline: Symbol('IVerificationPipeline'),
    IVerificationMetrics: Symbol('IVerificationMetrics'),
    ICompilationVerifier: Symbol('ICompilationVerifier'),
    ILintVerifier: Symbol('ILintVerifier'),
    IFormattingChecker: Symbol('IFormattingChecker'),
    ITestRunner: Symbol('ITestRunner'),
    IRepositoryRules: Symbol('IRepositoryRules'),
    ISecurityScanner: Symbol('ISecurityScanner'),
    IPerformanceChecker: Symbol('IPerformanceChecker'),
    IAiOrchestrator: Symbol('IAiOrchestrator'),
    IRecoveryOrchestrator: Symbol('IRecoveryOrchestrator'),
    IReflectionEngine: Symbol('IReflectionEngine'),
    IOutcomeManager: Symbol('IOutcomeManager'),
    ILearningEngine: Symbol('ILearningEngine'),
    IFailureAnalyzer: Symbol('IFailureAnalyzer'),
    IRecoveryPolicyEngine: Symbol('IRecoveryPolicyEngine'),
    IRecoveryStrategyRegistry: Symbol('IRecoveryStrategyRegistry'),
    IRecoveryExecutor: Symbol('IRecoveryExecutor'),
    IRollbackManager: Symbol('IRollbackManager'),
    IRecoveryJournal: Symbol('IRecoveryJournal'),
    IRecoveryMetricsService: Symbol('IRecoveryMetricsService'),
    IReflectionContextBuilder: Symbol('IReflectionContextBuilder'),
    IArchitectureReviewer: Symbol('IArchitectureReviewer'),
    ISolutionReviewer: Symbol('ISolutionReviewer'),
    ISelfCritiqueEngine: Symbol('ISelfCritiqueEngine'),
    IConfidenceEngine: Symbol('IConfidenceEngine'),
    IScoreAggregator: Symbol('IScoreAggregator'),
    IRecommendationEngine: Symbol('IRecommendationEngine'),
    IReflectionReportBuilder: Symbol('IReflectionReportBuilder'),
    IExperienceBuilder: Symbol('IExperienceBuilder'),
    IDecisionLog: Symbol('IDecisionLog'),
    IExperienceStore: Symbol('IExperienceStore'),
    IPatternEngine: Symbol('IPatternEngine'),
    IStrategyOptimizer: Symbol('IStrategyOptimizer'),
    IPlanningOptimizer: Symbol('IPlanningOptimizer'),
    IRecoveryOptimizer: Symbol('IRecoveryOptimizer'),
    IPromptOptimizer: Symbol('IPromptOptimizer'),
    IToolOptimizer: Symbol('IToolOptimizer'),
    ILearningPolicyEngine: Symbol('ILearningPolicyEngine'),
    IConfidenceCalibrator: Symbol('IConfidenceCalibrator'),
    IMemoryConsolidator: Symbol('IMemoryConsolidator'),
    ILearningMetrics: Symbol('ILearningMetrics'),
    ILearningReportBuilder: Symbol('ILearningReportBuilder'),
    IPipelineExecutor: Symbol('IPipelineExecutor'),
    IPipelineRecorder: Symbol('IPipelineRecorder'),
    IDiagnosticsService: Symbol('IDiagnosticsService'),
    IRuntimeDiscoveryEngine: Symbol('IRuntimeDiscoveryEngine'),
    IRuntimeExecutionManager: Symbol('IRuntimeExecutionManager'),
    ISessionStorage: Symbol('ISessionStorage'),
    IRuntimeEventBus: Symbol('IRuntimeEventBus'),
    IWorkflowEngine: Symbol('IWorkflowEngine'),
    IRuntimeRouter: Symbol('IRuntimeRouter'),
    IWorkspaceSessionManager: Symbol('IWorkspaceSessionManager'),
    IRepositoryImporter: Symbol('IRepositoryImporter'),
    IRuntimeLearningEngine: Symbol('IRuntimeLearningEngine'),
    IWorkspaceProfileManager: Symbol('IWorkspaceProfileManager'),
    IActionRegistry: Symbol('IActionRegistry'),
    IActionExecutor: Symbol('IActionExecutor'),
    IWorkspaceApplicationService: Symbol('IWorkspaceApplicationService'),
    ITerminalApplicationService: Symbol('ITerminalApplicationService'),
    IGitApplicationService: Symbol('IGitApplicationService'),
    IRuntimeApplicationService: Symbol('IRuntimeApplicationService'),
    IAgentApplicationService: Symbol('IAgentApplicationService'),
    IEngineeringApplicationService: Symbol('IEngineeringApplicationService'),
    IEngineeringIntelligenceEngine: Symbol('IEngineeringIntelligenceEngine'),
    IAgentRegistry: Symbol('IAgentRegistry'),
    IAgentMemory: Symbol('IAgentMemory'),
    IAgentScheduler: Symbol('IAgentScheduler'),
    IAgentOrchestrator: Symbol('IAgentOrchestrator'),
    IActionHistory: Symbol('IActionHistory'),
    IWorkflowDefinitionParser: Symbol('IWorkflowDefinitionParser'),
    IAutomationCoordinator: Symbol('IAutomationCoordinator'),
    IAutomationPipelineRunner: Symbol('IAutomationPipelineRunner'),
    IAutomationResourceScheduler: Symbol('IAutomationResourceScheduler'),
    IAutomationArtifactStore: Symbol('IAutomationArtifactStore'),
    IAutomationStepExecutor: Symbol('IAutomationStepExecutor'),
    IWorkflowTemplateRegistry: Symbol('IWorkflowTemplateRegistry'),
    ITriggerManager: Symbol('ITriggerManager'),
    IAutomationTimelinePublisher: Symbol('IAutomationTimelinePublisher'),
    IAutomationApplicationService: Symbol('IAutomationApplicationService'),
    IIntelligenceDatabase: Symbol('IIntelligenceDatabase'),
    ILanguageParserRegistry: Symbol('ILanguageParserRegistry'),
    IRepositoryIndexCoordinator: Symbol('IRepositoryIndexCoordinator'),
    IKnowledgeGraphEngine: Symbol('IKnowledgeGraphEngine'),
    IEmbeddingProvider: Symbol('IEmbeddingProvider'),
    ISemanticSearchEngine: Symbol('ISemanticSearchEngine'),
    IContextAssemblyEngine: Symbol('IContextAssemblyEngine'),
    IEngineeringMemoryStore: Symbol('IEngineeringMemoryStore'),
    IAnalysisCacheService: Symbol('IAnalysisCacheService'),
    IEngineeringIntelligenceService: Symbol('IEngineeringIntelligenceService'),
    IIntelligenceTimelinePublisher: Symbol('IIntelligenceTimelinePublisher'),
    IIntelligenceApplicationService: Symbol('IIntelligenceApplicationService'),
    IRuntimeProviderRegistry: Symbol('IRuntimeProviderRegistry'),
    IRuntimeProfileRegistry: Symbol('IRuntimeProfileRegistry'),
    IMultiRuntimeManager: Symbol('IMultiRuntimeManager'),
    IIntelligentRoutingEngine: Symbol('IIntelligentRoutingEngine'),
    IMultiRuntimeSessionManager: Symbol('IMultiRuntimeSessionManager'),
    IRuntimePerformanceEngine: Symbol('IRuntimePerformanceEngine'),
    IRuntimeTimelinePublisher: Symbol('IRuntimeTimelinePublisher'),
    IMultiRuntimeApplicationService: Symbol('IMultiRuntimeApplicationService'),
    IRepositoryHealthApplicationService: Symbol('IRepositoryHealthApplicationService'),
    IResponseGenerationEngine: Symbol('IResponseGenerationEngine'),
};
//# sourceMappingURL=tokens.js.map