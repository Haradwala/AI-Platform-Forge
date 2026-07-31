/**
 * ai-foundation.module.ts — Sub-module for AI Foundation & Planning Services
 *
 * Registers ProviderRegistry, RuntimeManager, ConfigurationService, AiProvider,
 * AiSessionService, ContextEngine, TokenBudgetManager, ConversationManager,
 * PromptAssemblyEngine, PlanningGraph, ExecutionOrchestrator, ReasoningEngine, etc.
 */

import type { IDesktopContainer, IServiceResolver } from '../../container/interfaces';
import { T } from '../../container/tokens';
import { ProviderRegistry } from '../../ai/session/provider-registry';
import { RuntimeManager } from '../../ai/runtime/runtime-manager';
import type { IAiRuntime } from '../../ai/runtime/runtime-types';
import { ConfigurationService } from '../../config/configuration-service';
import { MockProvider } from '../../ai/providers/mock-provider';
import { AiSessionService } from '../../ai/session/ai-session-service';
import { ContextEngine } from '../../ai/context/context-engine';
import { TokenBudgetManager } from '../../ai/context/token-budget-manager';
import { ConversationManager } from '../../ai/session/conversation-manager';
import { ToolRegistry } from '../../ai/tools/tool-registry';
import { ToolExecutionEngine } from '../../ai/tools/tool-execution-engine';
import { AgentLoop } from '../../ai/agent/agent-loop';
import { AiKernel } from '../../ai/kernel/ai-kernel';
import { TaskPlanner } from '../../ai/planner/planner';
import { ExecutionEngine } from '../../ai/execution/execution-engine';
import { ContextRankingService } from '../../ai/context/context-ranking-service';
import { MemoryRegistry } from '../../ai/memory/memory-registry';
import { MemoryEngine } from '../../ai/memory/memory-engine';
import { PromptAssemblyEngine } from '../../ai/context/prompt-assembly-engine';
import { PlanningGraph } from '../../ai/planner/planning-graph';
import { ExecutionOrchestrator } from '../../ai/orchestration/execution-orchestrator';
import { ReasoningEngine, AssumptionManager, ConstraintRegistry, EvidenceCollector } from '../../ai/reasoning/reasoning-engine';
import { GoalExtractor } from '../../ai/planner/goal-extractor';
import { IntentDetector } from '../../ai/planner/intent-detector';
import { PlanApprovalPolicy } from '../../ai/planner/plan-approval-policy';
import { PlanScorer } from '../../ai/planner/plan-scorer';
import { PlanValidator } from '../../ai/planner/plan-validator';
import { GoalTaskPlanner } from '../../ai/planner/task-planner';
import { ToolSelector } from '../../ai/planner/tool-selector';
import { ExecutionPlanner } from '../../ai/planner/execution-planner';
import { ExecutionGraphEngine } from '../../ai/execution/execution-graph-engine';
import { ExecutionScheduler, LinearRetry } from '../../ai/execution/execution-scheduler';
import { TaskDispatcher } from '../../ai/execution/task-dispatcher';
import { ExecutionSnapshotService } from '../../ai/execution/execution-snapshot-service';
import { ExecutionMetricsService } from '../../ai/execution/execution-metrics';
import { ExecutionObserver } from '../../ai/execution/execution-observer';
import { ExecutionPolicyRegistry } from '../../ai/execution/execution-policy-registry';
import { ExecutionContextFactory } from '../../ai/execution/execution-context';
import { VerificationEngine } from '../../ai/verification/verification-engine';
import { VerificationPipeline } from '../../ai/verification/verification-pipeline';
import { VerificationMetrics } from '../../ai/verification/verification-metrics';
import { CompilationVerifier } from '../../ai/verification/checkers/compilation-verifier';
import { LintVerifier } from '../../ai/verification/checkers/lint-verifier';
import { FormattingChecker } from '../../ai/verification/checkers/formatting-checker';
import { TestRunner } from '../../ai/verification/checkers/test-runner';
import { RepositoryRules } from '../../ai/verification/checkers/repository-rules';
import { SecurityScanner } from '../../ai/verification/checkers/security-scanner';
import { PerformanceChecker } from '../../ai/verification/checkers/performance-checker';
import { AiOrchestrator } from '../../ai/orchestrator/ai-orchestrator';
import { RecoveryOrchestrator } from '../../ai/recovery/recovery-orchestrator';
import { FailureAnalyzer } from '../../ai/recovery/failure-analyzer';
import { RecoveryPolicyEngine } from '../../ai/recovery/recovery-policy-engine';
import { RecoveryStrategyRegistry } from '../../ai/recovery/recovery-strategy-registry';
import { RecoveryExecutor } from '../../ai/recovery/recovery-executor';
import { RollbackManager } from '../../ai/recovery/rollback-manager';
import { RecoveryJournal } from '../../ai/recovery/recovery-journal';
import { RecoveryMetrics } from '../../ai/recovery/recovery-metrics';
import {
  ReflectionEngine,
  ReflectionContextBuilder,
  ArchitectureReviewer,
  SolutionReviewer,
  SelfCritiqueEngine,
  ConfidenceEngine,
  ScoreAggregator,
  RecommendationEngine,
  ReflectionReportBuilder,
} from '../../ai/reflection/reflection-engine';
import { OutcomeManager } from '../../ai/outcome/outcome-manager';
import { ExperienceBuilder } from '../../ai/outcome/experience-builder';
import { DecisionLog } from '../../ai/outcome/decision-log';
import { PipelineExecutor } from '../../ai/pipeline/pipeline-executor';
import { PipelineRecorder } from '../../ai/pipeline/pipeline-recorder';
import { WorkflowEngine } from '../../ai/workflow/workflow-engine';
import { WorkspaceSessionManager } from '../../ai/session/workspace-session-manager';
import { WorkspaceProfileManager } from '../../ai/session/workspace-profile';
import { RepositoryImporter } from '../../platform/repository-importer';
import {
  ReadFileTool,
  WriteFileTool,
  ListDirectoryTool,
  SearchWorkspaceTool,
  RunTerminalCommandTool,
  OpenFileTool,
  ToggleTerminalTool,
  NoOpTool,
} from '../../ai/tools/built-in-tools';
import { ResponseGenerationEngine } from '../../ai/response/response-generation-engine';
import { DiagnosticsService } from '../../ai/diagnostics/diagnostics-service';
import type { IRuntimeManager } from '../../ai/runtime/runtime-types';
import type {
  IWorkspaceService,
  ITerminalService,
  IRepositoryProvider,
  IDesktopEventBus,
  IDesktopLogger,
  IToolRegistry,
  IWorkspaceApplicationService,
  ITerminalApplicationService,
  IProviderRegistry,
} from '../../container/service-interfaces';

export function registerBuiltInTools(registry: ToolRegistry, resolver: IServiceResolver): ToolRegistry {
  const workspaceService = resolver.tryResolve<IWorkspaceService>(T.IWorkspaceService) ?? undefined;
  const workspaceAppService = resolver.tryResolve<IWorkspaceApplicationService>(T.IWorkspaceApplicationService) ?? undefined;
  const repositoryProvider = resolver.tryResolve<IRepositoryProvider>(T.IRepositoryProvider) ?? undefined;
  const terminalService = resolver.tryResolve<ITerminalService>(T.ITerminalService) ?? undefined;
  const terminalAppService = resolver.tryResolve<ITerminalApplicationService>(T.ITerminalApplicationService) ?? undefined;
  const eventBus = resolver.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined;

  const dynamicWorkspaceService: IWorkspaceService = new Proxy({} as IWorkspaceService, {
    get(_target, prop: keyof IWorkspaceService) {
      const live = resolver.tryResolve<IWorkspaceService>(T.IWorkspaceService) ?? workspaceService;
      if (live && typeof live[prop] === 'function') {
        return (live[prop] as Function).bind(live);
      }
      if (prop === 'getRootPath') return () => null;
      if (prop === 'getRecentWorkspaces') return async () => [];
      if (prop === 'getTree') return async () => null;
      if (prop === 'readFile') return async () => '';
      return async () => {};
    }
  });

  const dynamicRepositoryProvider: IRepositoryProvider = new Proxy({} as IRepositoryProvider, {
    get(_target, prop: keyof IRepositoryProvider) {
      const live = resolver.tryResolve<IRepositoryProvider>(T.IRepositoryProvider) ?? repositoryProvider;
      if (live && typeof live[prop] === 'function') {
        return (live[prop] as Function).bind(live);
      }
      if (prop === 'query') return async () => ({ success: false, data: [] });
      if (prop === 'subscribe') return () => ({ dispose: () => {} });
      return async () => {};
    }
  });

  const stubTerminalService: ITerminalService = terminalService ?? ({
    create: async () => {},
    write: () => {},
    resize: () => {},
    destroy: () => {},
  } as any);

  const stubEventBus: IDesktopEventBus = eventBus ?? ({
    emit: () => {},
    on: () => {},
    off: () => {},
  } as any);

  registry.register(new ReadFileTool(dynamicWorkspaceService));
  registry.register(new WriteFileTool(dynamicWorkspaceService, workspaceAppService));
  registry.register(new ListDirectoryTool(dynamicWorkspaceService, dynamicRepositoryProvider));
  registry.register(new SearchWorkspaceTool(dynamicWorkspaceService, dynamicRepositoryProvider));
  registry.register(new RunTerminalCommandTool(stubTerminalService, terminalAppService, dynamicWorkspaceService));
  registry.register(new OpenFileTool(stubEventBus, dynamicWorkspaceService));
  registry.register(new ToggleTerminalTool(stubEventBus));
  registry.register(new NoOpTool());

  return registry;
}

export class AiFoundationModule {
  static register(container: IDesktopContainer): void {
    container.registerSingleton<RuntimeManager>({
      token: T.IRuntimeManager,
      name: 'IRuntimeManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => {
        const configService = resolver.tryResolve<ConfigurationService>(T.IConfigurationService) ?? undefined;
        const manager = new RuntimeManager(configService);

        const runtimeTokens = [
          T.MockProvider,
          T.OllamaProvider,
          T.OpenAIRuntime,
          T.AnthropicRuntime,
          T.GeminiRuntime,
          T.GroqRuntime,
          T.OpenRouterRuntime,
          T.ClaudeCodeRuntime,
          T.GeminiCLIRuntime,
          T.CodexCLIRuntime,
          T.AiderCLIRuntime,
          T.GooseCLIRuntime,
        ];

        for (const token of runtimeTokens) {
          const rt = resolver.tryResolve<IAiRuntime>(token);
          if (rt) {
            manager.register(rt);
          }
        }

        return manager;
      }
    });

    container.registerSingleton<RuntimeManager>({
      token: T.IProviderRegistry,
      name: 'IProviderRegistry',
      lifetime: 'singleton',
      dependencies: [T.IRuntimeManager],
      factory: (resolver: IServiceResolver) => resolver.resolve<RuntimeManager>(T.IRuntimeManager)
    });

    container.registerSingleton<ConfigurationService>({
      token: T.IConfigurationService,
      name: 'IConfigurationService',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ConfigurationService()
    });

    container.registerSingleton<MockProvider>({
      token: T.IAiProvider,
      name: 'IAiProvider',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new MockProvider()
    });

    container.registerSingleton<AiSessionService>({
      token: T.IAiSessionService,
      name: 'IAiSessionService',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new AiSessionService(
        resolver.tryResolve<IProviderRegistry>(T.IProviderRegistry) ?? undefined as any,
        resolver.tryResolve<IDesktopLogger>(T.IDesktopLogger) ?? undefined as any
      )
    });

    container.registerSingleton<ContextEngine>({
      token: T.IContextEngine,
      name: 'IContextEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ContextEngine()
    });

    container.registerSingleton<TokenBudgetManager>({
      token: T.ITokenBudgetManager,
      name: 'ITokenBudgetManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new TokenBudgetManager()
    });

    container.registerSingleton<ConversationManager>({
      token: T.IConversationManager,
      name: 'IConversationManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ConversationManager()
    });

    container.registerSingleton<ToolRegistry>({
      token: T.IToolRegistry,
      name: 'IToolRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => {
        const registry = new ToolRegistry();
        registerBuiltInTools(registry, resolver);
        return registry;
      }
    });

    container.registerSingleton<ToolExecutionEngine>({
      token: T.IToolExecutionEngine,
      name: 'IToolExecutionEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new ToolExecutionEngine(
        resolver.tryResolve<IToolRegistry>(T.IToolRegistry) ?? registerBuiltInTools(new ToolRegistry(), resolver)
      )
    });

    container.registerSingleton<AiKernel>({
      token: T.IAiKernel,
      name: 'IAiKernel',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new AiKernel(
        resolver.tryResolve(T.IAiSessionService) ?? undefined as any,
        resolver.tryResolve(T.IProviderRegistry) ?? undefined as any,
        resolver.tryResolve(T.IDesktopLogger) ?? undefined as any,
        resolver.tryResolve(T.IToolExecutionEngine) ?? undefined as any
      )
    });

    container.registerSingleton<AgentLoop>({
      token: T.IAgentLoop,
      name: 'IAgentLoop',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new AgentLoop(
        resolver.tryResolve(T.IAiKernel) ?? undefined as any,
        resolver.tryResolve(T.IToolExecutionEngine) ?? undefined as any
      )
    });

    container.registerSingleton<TaskPlanner>({
      token: T.IPlanner,
      name: 'IPlanner',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new TaskPlanner()
    });

    container.registerSingleton<ExecutionEngine>({
      token: T.IExecutionEngine,
      name: 'IExecutionEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) =>
        new ExecutionEngine(
          resolver.tryResolve<ExecutionGraphEngine>(T.IExecutionGraphEngine) ?? new ExecutionGraphEngine(),
          resolver.tryResolve<ExecutionScheduler>(T.IExecutionScheduler) ?? new ExecutionScheduler(
            resolver.tryResolve<TaskDispatcher>(T.ITaskDispatcher) ?? new TaskDispatcher(resolver.tryResolve<IToolRegistry>(T.IToolRegistry) ?? registerBuiltInTools(new ToolRegistry(), resolver), new ExecutionPolicyRegistry(), undefined as any, undefined as any),
            new ExecutionObserver(),
            new LinearRetry()
          ),
          resolver.tryResolve<ExecutionObserver>(T.IExecutionObserver) ?? new ExecutionObserver(),
          resolver.tryResolve<IWorkspaceService>(T.IWorkspaceService) ?? undefined as any,
          resolver.tryResolve<IDesktopLogger>(T.IDesktopLogger) ?? undefined as any,
          resolver.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined as any
        ),
    });

    container.registerSingleton<ContextRankingService>({
      token: T.IContextRankingService,
      name: 'IContextRankingService',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ContextRankingService()
    });

    container.registerSingleton<MemoryRegistry>({
      token: T.IMemoryRegistry,
      name: 'IMemoryRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new MemoryRegistry()
    });

    container.registerSingleton<MemoryEngine>({
      token: T.IMemoryEngine,
      name: 'IMemoryEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new MemoryEngine()
    });

    container.registerSingleton<PromptAssemblyEngine>({
      token: T.IPromptAssemblyEngine,
      name: 'IPromptAssemblyEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new PromptAssemblyEngine(
        resolver.tryResolve<IToolRegistry>(T.IToolRegistry) ?? registerBuiltInTools(new ToolRegistry(), resolver)
      )
    });

    container.registerSingleton<PlanningGraph>({
      token: T.IPlanningGraph,
      name: 'IPlanningGraph',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new PlanningGraph()
    });

    container.registerSingleton<ExecutionOrchestrator>({
      token: T.IExecutionOrchestrator,
      name: 'IExecutionOrchestrator',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new ExecutionOrchestrator(
        resolver.tryResolve(T.IRuntimeManager) ?? undefined as any,
        resolver.tryResolve(T.IToolExecutionEngine) ?? undefined as any
      )
    });

    container.registerSingleton<ReasoningEngine>({
      token: T.IReasoningEngine,
      name: 'IReasoningEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ReasoningEngine(
        new AssumptionManager(),
        new ConstraintRegistry(),
        new EvidenceCollector()
      )
    });

    container.registerSingleton<GoalExtractor>({
      token: T.IGoalExtractor,
      name: 'IGoalExtractor',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new GoalExtractor()
    });

    container.registerSingleton<IntentDetector>({
      token: T.IIntentDetector,
      name: 'IIntentDetector',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new IntentDetector()
    });

    container.registerSingleton<PlanApprovalPolicy>({
      token: T.IPlanApprovalPolicy,
      name: 'IPlanApprovalPolicy',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new PlanApprovalPolicy()
    });

    container.registerSingleton<PlanScorer>({
      token: T.IPlanScorer,
      name: 'IPlanScorer',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new PlanScorer()
    });

    container.registerSingleton<PlanValidator>({
      token: T.IPlanValidator,
      name: 'IPlanValidator',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new PlanValidator()
    });

    container.registerSingleton<GoalTaskPlanner>({
      token: T.IGoalTaskPlanner,
      name: 'IGoalTaskPlanner',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new GoalTaskPlanner()
    });

    container.registerSingleton<ToolSelector>({
      token: T.IToolSelector,
      name: 'IToolSelector',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ToolSelector()
    });

    container.registerSingleton<ExecutionPlanner>({
      token: T.IExecutionPlanner,
      name: 'IExecutionPlanner',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionPlanner()
    });

    container.registerSingleton<ExecutionGraphEngine>({
      token: T.IExecutionGraphEngine,
      name: 'IExecutionGraphEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionGraphEngine()
    });

    container.registerSingleton<TaskDispatcher>({
      token: T.ITaskDispatcher,
      name: 'ITaskDispatcher',
      lifetime: 'singleton',
      dependencies: [T.IToolRegistry, T.IExecutionPolicyRegistry, T.IWorkspaceService, T.IDesktopLogger],
      factory: (resolver) =>
        new TaskDispatcher(
          resolver.resolve<IToolRegistry>(T.IToolRegistry),
          resolver.resolve<ExecutionPolicyRegistry>(T.IExecutionPolicyRegistry),
          resolver.resolve<IWorkspaceService>(T.IWorkspaceService),
          resolver.resolve<IDesktopLogger>(T.IDesktopLogger)
        ),
    });

    container.registerSingleton<ExecutionScheduler>({
      token: T.IExecutionScheduler,
      name: 'IExecutionScheduler',
      lifetime: 'singleton',
      dependencies: [T.ITaskDispatcher, T.IExecutionObserver],
      factory: (resolver) =>
        new ExecutionScheduler(
          resolver.resolve<TaskDispatcher>(T.ITaskDispatcher),
          resolver.resolve<ExecutionObserver>(T.IExecutionObserver),
          new LinearRetry()
        ),
    });

    container.registerSingleton<ExecutionSnapshotService>({
      token: T.IExecutionSnapshotService,
      name: 'IExecutionSnapshotService',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionSnapshotService()
    });

    container.registerSingleton<ExecutionMetricsService>({
      token: T.IExecutionMetricsService,
      name: 'IExecutionMetricsService',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionMetricsService()
    });

    container.registerSingleton<ExecutionObserver>({
      token: T.IExecutionObserver,
      name: 'IExecutionObserver',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionObserver()
    });

    container.registerSingleton<ExecutionPolicyRegistry>({
      token: T.IExecutionPolicyRegistry,
      name: 'IExecutionPolicyRegistry',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionPolicyRegistry()
    });

    container.registerSingleton<ExecutionContextFactory>({
      token: T.IExecutionContextFactory,
      name: 'IExecutionContextFactory',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new ExecutionContextFactory()
    });

    container.registerSingleton<VerificationEngine>({
      token: T.IVerificationEngine,
      name: 'IVerificationEngine',
      lifetime: 'singleton',
      dependencies: [T.IVerificationPipeline, T.IVerificationMetrics],
      factory: (resolver: IServiceResolver) => new VerificationEngine(
        resolver.tryResolve<VerificationPipeline>(T.IVerificationPipeline) ?? undefined as any,
        resolver.tryResolve<VerificationMetrics>(T.IVerificationMetrics) ?? new VerificationMetrics(),
        resolver.tryResolve<IDesktopLogger>(T.IDesktopLogger) ?? undefined as any
      )
    });

    container.registerSingleton<VerificationPipeline>({
      token: T.IVerificationPipeline,
      name: 'IVerificationPipeline',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new VerificationPipeline(
        resolver.tryResolve(T.ICompilationVerifier) ?? undefined as any,
        resolver.tryResolve(T.ILintVerifier) ?? undefined as any,
        resolver.tryResolve(T.IFormattingChecker) ?? undefined as any,
        resolver.tryResolve(T.ITestRunner) ?? undefined as any,
        resolver.tryResolve(T.IRepositoryRules) ?? undefined as any,
        resolver.tryResolve(T.ISecurityScanner) ?? undefined as any,
        resolver.tryResolve(T.IPerformanceChecker) ?? undefined as any,
        resolver.tryResolve(T.IDesktopEventBus) ?? undefined as any,
        resolver.tryResolve(T.IDesktopLogger) ?? undefined as any
      )
    });

    container.registerSingleton<VerificationMetrics>({
      token: T.IVerificationMetrics,
      name: 'IVerificationMetrics',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new VerificationMetrics()
    });

    container.registerSingleton<CompilationVerifier>({
      token: T.ICompilationVerifier,
      name: 'ICompilationVerifier',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new CompilationVerifier()
    });

    container.registerSingleton<LintVerifier>({
      token: T.ILintVerifier,
      name: 'ILintVerifier',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new LintVerifier()
    });

    container.registerSingleton<FormattingChecker>({
      token: T.IFormattingChecker,
      name: 'IFormattingChecker',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new FormattingChecker()
    });

    container.registerSingleton<TestRunner>({
      token: T.ITestRunner,
      name: 'ITestRunner',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new TestRunner()
    });

    container.registerSingleton<RepositoryRules>({
      token: T.IRepositoryRules,
      name: 'IRepositoryRules',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new RepositoryRules()
    });

    container.registerSingleton<SecurityScanner>({
      token: T.ISecurityScanner,
      name: 'ISecurityScanner',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new SecurityScanner()
    });

    container.registerSingleton<PerformanceChecker>({
      token: T.IPerformanceChecker,
      name: 'IPerformanceChecker',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new PerformanceChecker()
    });

    container.registerSingleton<DiagnosticsService>({
      token: T.IDiagnosticsService,
      name: 'IDiagnosticsService',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: IServiceResolver) => new DiagnosticsService(
        resolver.tryResolve<any>(T.IAiSessionService) ?? undefined as any,
        resolver.tryResolve<any>(T.IProviderRegistry) ?? undefined as any,
        resolver.tryResolve<any>(T.IRepositoryProvider) ?? undefined as any,
        resolver.tryResolve<any>(T.IMemoryRegistry) ?? undefined as any,
        resolver.tryResolve<any>(T.IExecutionEngine) ?? undefined as any
      )
    });

    container.registerSingleton<ResponseGenerationEngine>({
      token: T.IResponseGenerationEngine,
      name: 'IResponseGenerationEngine',
      lifetime: 'singleton',
      dependencies: [T.IRuntimeManager, T.IDesktopEventBus, T.IDesktopLogger],
      factory: (resolver: IServiceResolver) => new ResponseGenerationEngine(
        resolver.resolve<IRuntimeManager>(T.IRuntimeManager),
        resolver.tryResolve<IDesktopEventBus>(T.IDesktopEventBus) ?? undefined,
        resolver.resolve<IDesktopLogger>(T.IDesktopLogger)
      )
    });

    container.registerSingleton<AiOrchestrator>({
      token: T.IAiOrchestrator,
      name: 'IAiOrchestrator',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new AiOrchestrator(
        resolver.tryResolve(T.IContextEngine) ?? undefined as any,
        resolver.tryResolve(T.IMemoryRegistry) ?? undefined as any,
        resolver.tryResolve(T.IRepositoryProvider) ?? undefined as any,
        resolver.tryResolve(T.IIntentDetector) ?? undefined as any,
        resolver.tryResolve(T.IGoalExtractor) ?? undefined as any,
        resolver.tryResolve(T.IGoalTaskPlanner) ?? undefined as any,
        resolver.tryResolve(T.IExecutionPlanner) ?? undefined as any,
        resolver.tryResolve(T.IPlanner) ?? undefined as any,
        resolver.tryResolve(T.IReasoningEngine) ?? undefined as any,
        resolver.tryResolve(T.IExecutionEngine) ?? undefined as any,
        resolver.tryResolve(T.IVerificationEngine) ?? undefined as any,
        resolver.tryResolve(T.IRecoveryOrchestrator) ?? undefined as any,
        resolver.tryResolve(T.IReflectionEngine) ?? undefined as any,
        resolver.tryResolve(T.IOutcomeManager) ?? undefined as any,
        resolver.tryResolve(T.ILearningEngine) ?? undefined as any,
        resolver.tryResolve(T.IPipelineExecutor) ?? new PipelineExecutor(resolver.tryResolve(T.IDesktopEventBus) ?? undefined as any),
        resolver.tryResolve(T.IPipelineRecorder) ?? new PipelineRecorder(resolver.tryResolve(T.IWorkspaceService) ?? undefined as any, resolver.tryResolve(T.IDesktopLogger) ?? undefined as any),
        resolver.tryResolve(T.IWorkspaceService) ?? undefined as any,
        resolver.tryResolve(T.IDesktopLogger) ?? undefined as any,
        resolver.resolve(T.IResponseGenerationEngine) as ResponseGenerationEngine
      )
    });

    container.registerSingleton<RecoveryOrchestrator>({
      token: T.IRecoveryOrchestrator,
      name: 'IRecoveryOrchestrator',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new RecoveryOrchestrator(
        resolver.tryResolve((T as any).IFailureAnalyzer) ?? new FailureAnalyzer(),
        resolver.tryResolve((T as any).IRecoveryPolicyEngine) ?? new RecoveryPolicyEngine(),
        resolver.tryResolve((T as any).IRecoveryStrategyRegistry) ?? new RecoveryStrategyRegistry(),
        resolver.tryResolve((T as any).IRecoveryExecutor) ?? new RecoveryExecutor(new RecoveryStrategyRegistry()),
        resolver.tryResolve((T as any).IRollbackManager) ?? new RollbackManager(),
        resolver.tryResolve((T as any).IRecoveryJournal) ?? new RecoveryJournal(),
        resolver.tryResolve((T as any).IRecoveryMetrics) ?? new RecoveryMetrics(),
        resolver.tryResolve(T.IDesktopEventBus) ?? undefined as any,
        resolver.tryResolve(T.IDesktopLogger) ?? undefined as any
      )
    });

    container.registerSingleton<ReflectionEngine>({
      token: T.IReflectionEngine,
      name: 'IReflectionEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new ReflectionEngine(
        new ReflectionContextBuilder(),
        new ArchitectureReviewer(),
        new SolutionReviewer(),
        new SelfCritiqueEngine(),
        new ConfidenceEngine(),
        new ScoreAggregator(),
        new RecommendationEngine(),
        new ReflectionReportBuilder(),
        resolver.tryResolve(T.IDesktopEventBus) ?? undefined as any,
        resolver.tryResolve(T.IDesktopLogger) ?? undefined as any
      )
    });

    container.registerSingleton<OutcomeManager>({
      token: T.IOutcomeManager,
      name: 'IOutcomeManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver: any) => new OutcomeManager(
        new ExperienceBuilder(),
        new DecisionLog(),
        resolver.tryResolve(T.IDesktopEventBus) ?? undefined as any,
        resolver.tryResolve(T.IDesktopLogger) ?? undefined as any
      )
    });

    container.registerSingleton<WorkflowEngine>({
      token: T.IWorkflowEngine,
      name: 'IWorkflowEngine',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new WorkflowEngine()
    });

    container.registerSingleton<WorkspaceSessionManager>({
      token: T.IWorkspaceSessionManager,
      name: 'IWorkspaceSessionManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new WorkspaceSessionManager()
    });

    container.registerSingleton<WorkspaceProfileManager>({
      token: T.IWorkspaceProfileManager,
      name: 'IWorkspaceProfileManager',
      lifetime: 'singleton',
      dependencies: [],
      factory: () => new WorkspaceProfileManager()
    });

    container.registerSingleton<RepositoryImporter>({
      token: T.IRepositoryImporter,
      name: 'IRepositoryImporter',
      lifetime: 'singleton',
      dependencies: [],
      factory: (resolver) => new RepositoryImporter(undefined, resolver.tryResolve<WorkspaceProfileManager>(T.IWorkspaceProfileManager) ?? undefined as any)
    });
  }
}
