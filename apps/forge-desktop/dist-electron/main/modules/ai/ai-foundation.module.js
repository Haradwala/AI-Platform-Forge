"use strict";
/**
 * ai-foundation.module.ts — Sub-module for AI Foundation & Planning Services
 *
 * Registers ProviderRegistry, RuntimeManager, ConfigurationService, AiProvider,
 * AiSessionService, ContextEngine, TokenBudgetManager, ConversationManager,
 * PromptAssemblyEngine, PlanningGraph, ExecutionOrchestrator, ReasoningEngine, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFoundationModule = void 0;
exports.registerBuiltInTools = registerBuiltInTools;
const tokens_1 = require("../../container/tokens");
const runtime_manager_1 = require("../../ai/runtime/runtime-manager");
const configuration_service_1 = require("../../config/configuration-service");
const mock_provider_1 = require("../../ai/providers/mock-provider");
const ai_session_service_1 = require("../../ai/session/ai-session-service");
const context_engine_1 = require("../../ai/context/context-engine");
const token_budget_manager_1 = require("../../ai/context/token-budget-manager");
const conversation_manager_1 = require("../../ai/session/conversation-manager");
const tool_registry_1 = require("../../ai/tools/tool-registry");
const tool_execution_engine_1 = require("../../ai/tools/tool-execution-engine");
const agent_loop_1 = require("../../ai/agent/agent-loop");
const ai_kernel_1 = require("../../ai/kernel/ai-kernel");
const planner_1 = require("../../ai/planner/planner");
const execution_engine_1 = require("../../ai/execution/execution-engine");
const context_ranking_service_1 = require("../../ai/context/context-ranking-service");
const memory_registry_1 = require("../../ai/memory/memory-registry");
const memory_engine_1 = require("../../ai/memory/memory-engine");
const prompt_assembly_engine_1 = require("../../ai/context/prompt-assembly-engine");
const planning_graph_1 = require("../../ai/planner/planning-graph");
const execution_orchestrator_1 = require("../../ai/orchestration/execution-orchestrator");
const reasoning_engine_1 = require("../../ai/reasoning/reasoning-engine");
const goal_extractor_1 = require("../../ai/planner/goal-extractor");
const intent_detector_1 = require("../../ai/planner/intent-detector");
const plan_approval_policy_1 = require("../../ai/planner/plan-approval-policy");
const plan_scorer_1 = require("../../ai/planner/plan-scorer");
const plan_validator_1 = require("../../ai/planner/plan-validator");
const task_planner_1 = require("../../ai/planner/task-planner");
const tool_selector_1 = require("../../ai/planner/tool-selector");
const execution_planner_1 = require("../../ai/planner/execution-planner");
const execution_graph_engine_1 = require("../../ai/execution/execution-graph-engine");
const execution_scheduler_1 = require("../../ai/execution/execution-scheduler");
const task_dispatcher_1 = require("../../ai/execution/task-dispatcher");
const execution_snapshot_service_1 = require("../../ai/execution/execution-snapshot-service");
const execution_metrics_1 = require("../../ai/execution/execution-metrics");
const execution_observer_1 = require("../../ai/execution/execution-observer");
const execution_policy_registry_1 = require("../../ai/execution/execution-policy-registry");
const execution_context_1 = require("../../ai/execution/execution-context");
const verification_engine_1 = require("../../ai/verification/verification-engine");
const verification_pipeline_1 = require("../../ai/verification/verification-pipeline");
const verification_metrics_1 = require("../../ai/verification/verification-metrics");
const compilation_verifier_1 = require("../../ai/verification/checkers/compilation-verifier");
const lint_verifier_1 = require("../../ai/verification/checkers/lint-verifier");
const formatting_checker_1 = require("../../ai/verification/checkers/formatting-checker");
const test_runner_1 = require("../../ai/verification/checkers/test-runner");
const repository_rules_1 = require("../../ai/verification/checkers/repository-rules");
const security_scanner_1 = require("../../ai/verification/checkers/security-scanner");
const performance_checker_1 = require("../../ai/verification/checkers/performance-checker");
const ai_orchestrator_1 = require("../../ai/orchestrator/ai-orchestrator");
const recovery_orchestrator_1 = require("../../ai/recovery/recovery-orchestrator");
const failure_analyzer_1 = require("../../ai/recovery/failure-analyzer");
const recovery_policy_engine_1 = require("../../ai/recovery/recovery-policy-engine");
const recovery_strategy_registry_1 = require("../../ai/recovery/recovery-strategy-registry");
const recovery_executor_1 = require("../../ai/recovery/recovery-executor");
const rollback_manager_1 = require("../../ai/recovery/rollback-manager");
const recovery_journal_1 = require("../../ai/recovery/recovery-journal");
const recovery_metrics_1 = require("../../ai/recovery/recovery-metrics");
const reflection_engine_1 = require("../../ai/reflection/reflection-engine");
const outcome_manager_1 = require("../../ai/outcome/outcome-manager");
const experience_builder_1 = require("../../ai/outcome/experience-builder");
const decision_log_1 = require("../../ai/outcome/decision-log");
const pipeline_executor_1 = require("../../ai/pipeline/pipeline-executor");
const pipeline_recorder_1 = require("../../ai/pipeline/pipeline-recorder");
const workflow_engine_1 = require("../../ai/workflow/workflow-engine");
const workspace_session_manager_1 = require("../../ai/session/workspace-session-manager");
const workspace_profile_1 = require("../../ai/session/workspace-profile");
const repository_importer_1 = require("../../platform/repository-importer");
const built_in_tools_1 = require("../../ai/tools/built-in-tools");
const response_generation_engine_1 = require("../../ai/response/response-generation-engine");
const diagnostics_service_1 = require("../../ai/diagnostics/diagnostics-service");
function registerBuiltInTools(registry, resolver) {
    const workspaceService = resolver.tryResolve(tokens_1.T.IWorkspaceService) ?? undefined;
    const workspaceAppService = resolver.tryResolve(tokens_1.T.IWorkspaceApplicationService) ?? undefined;
    const repositoryProvider = resolver.tryResolve(tokens_1.T.IRepositoryProvider) ?? undefined;
    const terminalService = resolver.tryResolve(tokens_1.T.ITerminalService) ?? undefined;
    const terminalAppService = resolver.tryResolve(tokens_1.T.ITerminalApplicationService) ?? undefined;
    const eventBus = resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined;
    const dynamicWorkspaceService = new Proxy({}, {
        get(_target, prop) {
            const live = resolver.tryResolve(tokens_1.T.IWorkspaceService) ?? workspaceService;
            if (live && typeof live[prop] === 'function') {
                return live[prop].bind(live);
            }
            if (prop === 'getRootPath')
                return () => null;
            if (prop === 'getRecentWorkspaces')
                return async () => [];
            if (prop === 'getTree')
                return async () => null;
            if (prop === 'readFile')
                return async () => '';
            return async () => { };
        }
    });
    const dynamicRepositoryProvider = new Proxy({}, {
        get(_target, prop) {
            const live = resolver.tryResolve(tokens_1.T.IRepositoryProvider) ?? repositoryProvider;
            if (live && typeof live[prop] === 'function') {
                return live[prop].bind(live);
            }
            if (prop === 'query')
                return async () => ({ success: false, data: [] });
            if (prop === 'subscribe')
                return () => ({ dispose: () => { } });
            return async () => { };
        }
    });
    const stubTerminalService = terminalService ?? {
        create: async () => { },
        write: () => { },
        resize: () => { },
        destroy: () => { },
    };
    const stubEventBus = eventBus ?? {
        emit: () => { },
        on: () => { },
        off: () => { },
    };
    registry.register(new built_in_tools_1.ReadFileTool(dynamicWorkspaceService));
    registry.register(new built_in_tools_1.WriteFileTool(dynamicWorkspaceService, workspaceAppService));
    registry.register(new built_in_tools_1.ListDirectoryTool(dynamicWorkspaceService, dynamicRepositoryProvider));
    registry.register(new built_in_tools_1.SearchWorkspaceTool(dynamicWorkspaceService, dynamicRepositoryProvider));
    registry.register(new built_in_tools_1.RunTerminalCommandTool(stubTerminalService, terminalAppService, dynamicWorkspaceService));
    registry.register(new built_in_tools_1.OpenFileTool(stubEventBus, dynamicWorkspaceService));
    registry.register(new built_in_tools_1.ToggleTerminalTool(stubEventBus));
    registry.register(new built_in_tools_1.NoOpTool());
    return registry;
}
class AiFoundationModule {
    static register(container) {
        container.registerSingleton({
            token: tokens_1.T.IRuntimeManager,
            name: 'IRuntimeManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => {
                const configService = resolver.tryResolve(tokens_1.T.IConfigurationService) ?? undefined;
                const manager = new runtime_manager_1.RuntimeManager(configService);
                const runtimeTokens = [
                    tokens_1.T.MockProvider,
                    tokens_1.T.OllamaProvider,
                    tokens_1.T.OpenAIRuntime,
                    tokens_1.T.AnthropicRuntime,
                    tokens_1.T.GeminiRuntime,
                    tokens_1.T.GroqRuntime,
                    tokens_1.T.OpenRouterRuntime,
                    tokens_1.T.ClaudeCodeRuntime,
                    tokens_1.T.GeminiCLIRuntime,
                    tokens_1.T.CodexCLIRuntime,
                    tokens_1.T.AiderCLIRuntime,
                    tokens_1.T.GooseCLIRuntime,
                ];
                for (const token of runtimeTokens) {
                    const rt = resolver.tryResolve(token);
                    if (rt) {
                        manager.register(rt);
                    }
                }
                return manager;
            }
        });
        container.registerSingleton({
            token: tokens_1.T.IProviderRegistry,
            name: 'IProviderRegistry',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRuntimeManager],
            factory: (resolver) => resolver.resolve(tokens_1.T.IRuntimeManager)
        });
        container.registerSingleton({
            token: tokens_1.T.IConfigurationService,
            name: 'IConfigurationService',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new configuration_service_1.ConfigurationService()
        });
        container.registerSingleton({
            token: tokens_1.T.IAiProvider,
            name: 'IAiProvider',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new mock_provider_1.MockProvider()
        });
        container.registerSingleton({
            token: tokens_1.T.IAiSessionService,
            name: 'IAiSessionService',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new ai_session_service_1.AiSessionService(resolver.tryResolve(tokens_1.T.IProviderRegistry) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IContextEngine,
            name: 'IContextEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new context_engine_1.ContextEngine()
        });
        container.registerSingleton({
            token: tokens_1.T.ITokenBudgetManager,
            name: 'ITokenBudgetManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new token_budget_manager_1.TokenBudgetManager()
        });
        container.registerSingleton({
            token: tokens_1.T.IConversationManager,
            name: 'IConversationManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new conversation_manager_1.ConversationManager()
        });
        container.registerSingleton({
            token: tokens_1.T.IToolRegistry,
            name: 'IToolRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => {
                const registry = new tool_registry_1.ToolRegistry();
                registerBuiltInTools(registry, resolver);
                return registry;
            }
        });
        container.registerSingleton({
            token: tokens_1.T.IToolExecutionEngine,
            name: 'IToolExecutionEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new tool_execution_engine_1.ToolExecutionEngine(resolver.tryResolve(tokens_1.T.IToolRegistry) ?? registerBuiltInTools(new tool_registry_1.ToolRegistry(), resolver))
        });
        container.registerSingleton({
            token: tokens_1.T.IAiKernel,
            name: 'IAiKernel',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new ai_kernel_1.AiKernel(resolver.tryResolve(tokens_1.T.IAiSessionService) ?? undefined, resolver.tryResolve(tokens_1.T.IProviderRegistry) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined, resolver.tryResolve(tokens_1.T.IToolExecutionEngine) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IAgentLoop,
            name: 'IAgentLoop',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new agent_loop_1.AgentLoop(resolver.tryResolve(tokens_1.T.IAiKernel) ?? undefined, resolver.tryResolve(tokens_1.T.IToolExecutionEngine) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IPlanner,
            name: 'IPlanner',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new planner_1.TaskPlanner()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionEngine,
            name: 'IExecutionEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new execution_engine_1.ExecutionEngine(resolver.tryResolve(tokens_1.T.IExecutionGraphEngine) ?? new execution_graph_engine_1.ExecutionGraphEngine(), resolver.tryResolve(tokens_1.T.IExecutionScheduler) ?? new execution_scheduler_1.ExecutionScheduler(resolver.tryResolve(tokens_1.T.ITaskDispatcher) ?? new task_dispatcher_1.TaskDispatcher(resolver.tryResolve(tokens_1.T.IToolRegistry) ?? registerBuiltInTools(new tool_registry_1.ToolRegistry(), resolver), new execution_policy_registry_1.ExecutionPolicyRegistry(), undefined, undefined), new execution_observer_1.ExecutionObserver(), new execution_scheduler_1.LinearRetry()), resolver.tryResolve(tokens_1.T.IExecutionObserver) ?? new execution_observer_1.ExecutionObserver(), resolver.tryResolve(tokens_1.T.IWorkspaceService) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined),
        });
        container.registerSingleton({
            token: tokens_1.T.IContextRankingService,
            name: 'IContextRankingService',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new context_ranking_service_1.ContextRankingService()
        });
        container.registerSingleton({
            token: tokens_1.T.IMemoryRegistry,
            name: 'IMemoryRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new memory_registry_1.MemoryRegistry()
        });
        container.registerSingleton({
            token: tokens_1.T.IMemoryEngine,
            name: 'IMemoryEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new memory_engine_1.MemoryEngine()
        });
        container.registerSingleton({
            token: tokens_1.T.IPromptAssemblyEngine,
            name: 'IPromptAssemblyEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new prompt_assembly_engine_1.PromptAssemblyEngine(resolver.tryResolve(tokens_1.T.IToolRegistry) ?? registerBuiltInTools(new tool_registry_1.ToolRegistry(), resolver))
        });
        container.registerSingleton({
            token: tokens_1.T.IPlanningGraph,
            name: 'IPlanningGraph',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new planning_graph_1.PlanningGraph()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionOrchestrator,
            name: 'IExecutionOrchestrator',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new execution_orchestrator_1.ExecutionOrchestrator(resolver.tryResolve(tokens_1.T.IRuntimeManager) ?? undefined, resolver.tryResolve(tokens_1.T.IToolExecutionEngine) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IReasoningEngine,
            name: 'IReasoningEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new reasoning_engine_1.ReasoningEngine(new reasoning_engine_1.AssumptionManager(), new reasoning_engine_1.ConstraintRegistry(), new reasoning_engine_1.EvidenceCollector())
        });
        container.registerSingleton({
            token: tokens_1.T.IGoalExtractor,
            name: 'IGoalExtractor',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new goal_extractor_1.GoalExtractor()
        });
        container.registerSingleton({
            token: tokens_1.T.IIntentDetector,
            name: 'IIntentDetector',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new intent_detector_1.IntentDetector()
        });
        container.registerSingleton({
            token: tokens_1.T.IPlanApprovalPolicy,
            name: 'IPlanApprovalPolicy',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new plan_approval_policy_1.PlanApprovalPolicy()
        });
        container.registerSingleton({
            token: tokens_1.T.IPlanScorer,
            name: 'IPlanScorer',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new plan_scorer_1.PlanScorer()
        });
        container.registerSingleton({
            token: tokens_1.T.IPlanValidator,
            name: 'IPlanValidator',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new plan_validator_1.PlanValidator()
        });
        container.registerSingleton({
            token: tokens_1.T.IGoalTaskPlanner,
            name: 'IGoalTaskPlanner',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new task_planner_1.GoalTaskPlanner()
        });
        container.registerSingleton({
            token: tokens_1.T.IToolSelector,
            name: 'IToolSelector',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new tool_selector_1.ToolSelector()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionPlanner,
            name: 'IExecutionPlanner',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_planner_1.ExecutionPlanner()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionGraphEngine,
            name: 'IExecutionGraphEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_graph_engine_1.ExecutionGraphEngine()
        });
        container.registerSingleton({
            token: tokens_1.T.ITaskDispatcher,
            name: 'ITaskDispatcher',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IToolRegistry, tokens_1.T.IExecutionPolicyRegistry, tokens_1.T.IWorkspaceService, tokens_1.T.IDesktopLogger],
            factory: (resolver) => new task_dispatcher_1.TaskDispatcher(resolver.resolve(tokens_1.T.IToolRegistry), resolver.resolve(tokens_1.T.IExecutionPolicyRegistry), resolver.resolve(tokens_1.T.IWorkspaceService), resolver.resolve(tokens_1.T.IDesktopLogger)),
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionScheduler,
            name: 'IExecutionScheduler',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.ITaskDispatcher, tokens_1.T.IExecutionObserver],
            factory: (resolver) => new execution_scheduler_1.ExecutionScheduler(resolver.resolve(tokens_1.T.ITaskDispatcher), resolver.resolve(tokens_1.T.IExecutionObserver), new execution_scheduler_1.LinearRetry()),
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionSnapshotService,
            name: 'IExecutionSnapshotService',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_snapshot_service_1.ExecutionSnapshotService()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionMetricsService,
            name: 'IExecutionMetricsService',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_metrics_1.ExecutionMetricsService()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionObserver,
            name: 'IExecutionObserver',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_observer_1.ExecutionObserver()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionPolicyRegistry,
            name: 'IExecutionPolicyRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_policy_registry_1.ExecutionPolicyRegistry()
        });
        container.registerSingleton({
            token: tokens_1.T.IExecutionContextFactory,
            name: 'IExecutionContextFactory',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new execution_context_1.ExecutionContextFactory()
        });
        container.registerSingleton({
            token: tokens_1.T.IVerificationEngine,
            name: 'IVerificationEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IVerificationPipeline, tokens_1.T.IVerificationMetrics],
            factory: (resolver) => new verification_engine_1.VerificationEngine(resolver.tryResolve(tokens_1.T.IVerificationPipeline) ?? undefined, resolver.tryResolve(tokens_1.T.IVerificationMetrics) ?? new verification_metrics_1.VerificationMetrics(), resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IVerificationPipeline,
            name: 'IVerificationPipeline',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new verification_pipeline_1.VerificationPipeline(resolver.tryResolve(tokens_1.T.ICompilationVerifier) ?? undefined, resolver.tryResolve(tokens_1.T.ILintVerifier) ?? undefined, resolver.tryResolve(tokens_1.T.IFormattingChecker) ?? undefined, resolver.tryResolve(tokens_1.T.ITestRunner) ?? undefined, resolver.tryResolve(tokens_1.T.IRepositoryRules) ?? undefined, resolver.tryResolve(tokens_1.T.ISecurityScanner) ?? undefined, resolver.tryResolve(tokens_1.T.IPerformanceChecker) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IVerificationMetrics,
            name: 'IVerificationMetrics',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new verification_metrics_1.VerificationMetrics()
        });
        container.registerSingleton({
            token: tokens_1.T.ICompilationVerifier,
            name: 'ICompilationVerifier',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new compilation_verifier_1.CompilationVerifier()
        });
        container.registerSingleton({
            token: tokens_1.T.ILintVerifier,
            name: 'ILintVerifier',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new lint_verifier_1.LintVerifier()
        });
        container.registerSingleton({
            token: tokens_1.T.IFormattingChecker,
            name: 'IFormattingChecker',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new formatting_checker_1.FormattingChecker()
        });
        container.registerSingleton({
            token: tokens_1.T.ITestRunner,
            name: 'ITestRunner',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new test_runner_1.TestRunner()
        });
        container.registerSingleton({
            token: tokens_1.T.IRepositoryRules,
            name: 'IRepositoryRules',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new repository_rules_1.RepositoryRules()
        });
        container.registerSingleton({
            token: tokens_1.T.ISecurityScanner,
            name: 'ISecurityScanner',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new security_scanner_1.SecurityScanner()
        });
        container.registerSingleton({
            token: tokens_1.T.IPerformanceChecker,
            name: 'IPerformanceChecker',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new performance_checker_1.PerformanceChecker()
        });
        container.registerSingleton({
            token: tokens_1.T.IDiagnosticsService,
            name: 'IDiagnosticsService',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new diagnostics_service_1.DiagnosticsService(resolver.tryResolve(tokens_1.T.IAiSessionService) ?? undefined, resolver.tryResolve(tokens_1.T.IProviderRegistry) ?? undefined, resolver.tryResolve(tokens_1.T.IRepositoryProvider) ?? undefined, resolver.tryResolve(tokens_1.T.IMemoryRegistry) ?? undefined, resolver.tryResolve(tokens_1.T.IExecutionEngine) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IResponseGenerationEngine,
            name: 'IResponseGenerationEngine',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IRuntimeManager, tokens_1.T.IDesktopEventBus, tokens_1.T.IDesktopLogger],
            factory: (resolver) => new response_generation_engine_1.ResponseGenerationEngine(resolver.resolve(tokens_1.T.IRuntimeManager), resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, resolver.resolve(tokens_1.T.IDesktopLogger))
        });
        container.registerSingleton({
            token: tokens_1.T.IAiOrchestrator,
            name: 'IAiOrchestrator',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new ai_orchestrator_1.AiOrchestrator(resolver.tryResolve(tokens_1.T.IContextEngine) ?? undefined, resolver.tryResolve(tokens_1.T.IMemoryRegistry) ?? undefined, resolver.tryResolve(tokens_1.T.IRepositoryProvider) ?? undefined, resolver.tryResolve(tokens_1.T.IIntentDetector) ?? undefined, resolver.tryResolve(tokens_1.T.IGoalExtractor) ?? undefined, resolver.tryResolve(tokens_1.T.IGoalTaskPlanner) ?? undefined, resolver.tryResolve(tokens_1.T.IExecutionPlanner) ?? undefined, resolver.tryResolve(tokens_1.T.IPlanner) ?? undefined, resolver.tryResolve(tokens_1.T.IReasoningEngine) ?? undefined, resolver.tryResolve(tokens_1.T.IExecutionEngine) ?? undefined, resolver.tryResolve(tokens_1.T.IVerificationEngine) ?? undefined, resolver.tryResolve(tokens_1.T.IRecoveryOrchestrator) ?? undefined, resolver.tryResolve(tokens_1.T.IReflectionEngine) ?? undefined, resolver.tryResolve(tokens_1.T.IOutcomeManager) ?? undefined, resolver.tryResolve(tokens_1.T.ILearningEngine) ?? undefined, resolver.tryResolve(tokens_1.T.IPipelineExecutor) ?? new pipeline_executor_1.PipelineExecutor(resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined), resolver.tryResolve(tokens_1.T.IPipelineRecorder) ?? new pipeline_recorder_1.PipelineRecorder(resolver.tryResolve(tokens_1.T.IWorkspaceService) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined), resolver.tryResolve(tokens_1.T.IWorkspaceService) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined, resolver.resolve(tokens_1.T.IResponseGenerationEngine))
        });
        container.registerSingleton({
            token: tokens_1.T.IRecoveryOrchestrator,
            name: 'IRecoveryOrchestrator',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new recovery_orchestrator_1.RecoveryOrchestrator(resolver.tryResolve(tokens_1.T.IFailureAnalyzer) ?? new failure_analyzer_1.FailureAnalyzer(), resolver.tryResolve(tokens_1.T.IRecoveryPolicyEngine) ?? new recovery_policy_engine_1.RecoveryPolicyEngine(), resolver.tryResolve(tokens_1.T.IRecoveryStrategyRegistry) ?? new recovery_strategy_registry_1.RecoveryStrategyRegistry(), resolver.tryResolve(tokens_1.T.IRecoveryExecutor) ?? new recovery_executor_1.RecoveryExecutor(new recovery_strategy_registry_1.RecoveryStrategyRegistry()), resolver.tryResolve(tokens_1.T.IRollbackManager) ?? new rollback_manager_1.RollbackManager(), resolver.tryResolve(tokens_1.T.IRecoveryJournal) ?? new recovery_journal_1.RecoveryJournal(), resolver.tryResolve(tokens_1.T.IRecoveryMetrics) ?? new recovery_metrics_1.RecoveryMetrics(), resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IReflectionEngine,
            name: 'IReflectionEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new reflection_engine_1.ReflectionEngine(new reflection_engine_1.ReflectionContextBuilder(), new reflection_engine_1.ArchitectureReviewer(), new reflection_engine_1.SolutionReviewer(), new reflection_engine_1.SelfCritiqueEngine(), new reflection_engine_1.ConfidenceEngine(), new reflection_engine_1.ScoreAggregator(), new reflection_engine_1.RecommendationEngine(), new reflection_engine_1.ReflectionReportBuilder(), resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IOutcomeManager,
            name: 'IOutcomeManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new outcome_manager_1.OutcomeManager(new experience_builder_1.ExperienceBuilder(), new decision_log_1.DecisionLog(), resolver.tryResolve(tokens_1.T.IDesktopEventBus) ?? undefined, resolver.tryResolve(tokens_1.T.IDesktopLogger) ?? undefined)
        });
        container.registerSingleton({
            token: tokens_1.T.IWorkflowEngine,
            name: 'IWorkflowEngine',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new workflow_engine_1.WorkflowEngine()
        });
        container.registerSingleton({
            token: tokens_1.T.IWorkspaceSessionManager,
            name: 'IWorkspaceSessionManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new workspace_session_manager_1.WorkspaceSessionManager()
        });
        container.registerSingleton({
            token: tokens_1.T.IWorkspaceProfileManager,
            name: 'IWorkspaceProfileManager',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new workspace_profile_1.WorkspaceProfileManager()
        });
        container.registerSingleton({
            token: tokens_1.T.IRepositoryImporter,
            name: 'IRepositoryImporter',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new repository_importer_1.RepositoryImporter(undefined, resolver.tryResolve(tokens_1.T.IWorkspaceProfileManager) ?? undefined)
        });
    }
}
exports.AiFoundationModule = AiFoundationModule;
//# sourceMappingURL=ai-foundation.module.js.map