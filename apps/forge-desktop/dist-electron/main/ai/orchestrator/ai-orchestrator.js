"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiOrchestrator = void 0;
const pipeline_context_1 = require("../pipeline/pipeline-context");
const pipeline_stage_1 = require("../pipeline/pipeline-stage");
const response_context_builder_1 = require("../response/response-context-builder");
class AiOrchestrator {
    contextEngine;
    memoryRegistry;
    repo;
    intentDetector;
    goalExtractor;
    taskPlanner;
    strategyPlanner;
    corePlanner;
    reasoningEngine;
    executionEngine;
    verificationEngine;
    recoveryOrchestrator;
    reflectionEngine;
    outcomeManager;
    learningEngine;
    pipelineExecutor;
    pipelineRecorder;
    workspaceService;
    logger;
    responseGenerationEngine;
    stages;
    responseContextBuilder;
    constructor(contextEngine, memoryRegistry, repo, intentDetector, goalExtractor, taskPlanner, strategyPlanner, corePlanner, reasoningEngine, executionEngine, verificationEngine, recoveryOrchestrator, reflectionEngine, outcomeManager, learningEngine, pipelineExecutor, pipelineRecorder, workspaceService, logger, responseGenerationEngine) {
        this.contextEngine = contextEngine;
        this.memoryRegistry = memoryRegistry;
        this.repo = repo;
        this.intentDetector = intentDetector;
        this.goalExtractor = goalExtractor;
        this.taskPlanner = taskPlanner;
        this.strategyPlanner = strategyPlanner;
        this.corePlanner = corePlanner;
        this.reasoningEngine = reasoningEngine;
        this.executionEngine = executionEngine;
        this.verificationEngine = verificationEngine;
        this.recoveryOrchestrator = recoveryOrchestrator;
        this.reflectionEngine = reflectionEngine;
        this.outcomeManager = outcomeManager;
        this.learningEngine = learningEngine;
        this.pipelineExecutor = pipelineExecutor;
        this.pipelineRecorder = pipelineRecorder;
        this.workspaceService = workspaceService;
        this.logger = logger;
        this.responseGenerationEngine = responseGenerationEngine;
        this.responseContextBuilder = new response_context_builder_1.ResponseContextBuilder();
        this.stages = [
            new pipeline_stage_1.ContextCollectionStage(this.contextEngine),
            new pipeline_stage_1.MemoryRetrievalStage(this.memoryRegistry),
            new pipeline_stage_1.RepositoryScanStage(this.repo),
            new pipeline_stage_1.IntentDetectionStage(this.intentDetector),
            new pipeline_stage_1.GoalExtractionStage(this.goalExtractor),
            new pipeline_stage_1.PlanningStage(this.taskPlanner, this.strategyPlanner, this.corePlanner),
            new pipeline_stage_1.ReasoningStage(this.reasoningEngine),
            new pipeline_stage_1.ExecutionStage(this.executionEngine),
            new pipeline_stage_1.VerificationStage(this.verificationEngine),
            new pipeline_stage_1.RecoveryStage(this.recoveryOrchestrator),
            new pipeline_stage_1.ReflectionStage(this.reflectionEngine),
            new pipeline_stage_1.OutcomeStage(this.outcomeManager),
            new pipeline_stage_1.LearningStage(this.learningEngine),
        ];
    }
    async executeRequest(req) {
        this.logger.info(`[AiOrchestrator] Initiating request: ${req.id} - Prompt: "${req.prompt}"`);
        const workspaceRoot = this.workspaceService.getRootPath();
        const initialContext = pipeline_context_1.PipelineContextHelper.create(req.id, req.prompt, workspaceRoot);
        const finalContext = await this.pipelineExecutor.execute(initialContext, this.stages);
        await this.pipelineRecorder.record(finalContext);
        // ─── Response Generation (presentation layer — separate from engineering pipeline) ─
        const responseRequest = this.responseContextBuilder.build(finalContext, req.prompt);
        const { text: response, metadata } = await this.responseGenerationEngine.generate(responseRequest);
        return {
            success: true,
            result: {
                response,
                metadata,
            },
            finalContext,
        };
    }
    // Legacy entrypoint for execution/verification/reflection test runs compatibility
    async runOrchestration(plan, workspaceRoot) {
        this.logger.info(`[AiOrchestrator] Starting AI legacy orchestration loop for plan: ${plan.id}`);
        this.logger.info('[AiOrchestrator] Running Execution Runtime...');
        await this.executionEngine.executePlan(plan);
        this.logger.info('[AiOrchestrator] Running Verification Runtime...');
        let verificationReport = await this.verificationEngine.verify('standard', workspaceRoot);
        let recoveryReport = null;
        if (!verificationReport.success) {
            this.logger.info('[AiOrchestrator] Verification failed. Initiating Recovery Runtime...');
            recoveryReport = await this.recoveryOrchestrator.recover(verificationReport, workspaceRoot);
            verificationReport = await this.verificationEngine.verify('standard', workspaceRoot);
        }
        this.logger.info('[AiOrchestrator] Running Reflection Runtime...');
        const reflectionReport = await this.reflectionEngine.reflect(plan, verificationReport, recoveryReport, workspaceRoot);
        this.logger.info('[AiOrchestrator] Running Outcome Runtime...');
        const outcome = await this.outcomeManager.processOutcome(plan, verificationReport, recoveryReport, reflectionReport);
        this.logger.info('[AiOrchestrator] Running Learning Runtime...');
        await this.learningEngine.learn(outcome);
        this.logger.info(`[AiOrchestrator] AI legacy orchestration loop completed for plan: ${plan.id}`);
    }
}
exports.AiOrchestrator = AiOrchestrator;
//# sourceMappingURL=ai-orchestrator.js.map