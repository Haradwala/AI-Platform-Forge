"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningStage = exports.OutcomeStage = exports.ReflectionStage = exports.RecoveryStage = exports.VerificationStage = exports.ExecutionStage = exports.ReasoningStage = exports.PlanningStage = exports.GoalExtractionStage = exports.IntentDetectionStage = exports.RepositoryScanStage = exports.MemoryRetrievalStage = exports.ContextCollectionStage = void 0;
const pipeline_context_1 = require("./pipeline-context");
const planning_errors_1 = require("../errors/planning-errors");
class ContextCollectionStage {
    contextEngine;
    name = 'ContextCollectionStage';
    phase = 'collection';
    constructor(contextEngine) {
        this.contextEngine = contextEngine;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const mockEditor = {
            activeFilePath: null,
            openFilePaths: [],
            currentSelection: null,
            cursorPosition: null,
        };
        const contextCollected = await this.contextEngine.collectContext(mockEditor);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { contextCollected });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.ContextCollectionStage = ContextCollectionStage;
class MemoryRetrievalStage {
    memoryRegistry;
    name = 'MemoryRetrievalStage';
    phase = 'collection';
    constructor(memoryRegistry) {
        this.memoryRegistry = memoryRegistry;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const memoriesFetched = this.memoryRegistry.getRecords('pattern');
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { memoriesFetched });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.MemoryRetrievalStage = MemoryRetrievalStage;
class RepositoryScanStage {
    repo;
    name = 'RepositoryScanStage';
    phase = 'collection';
    constructor(repo) {
        this.repo = repo;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const stats = await this.repo.query({ type: 'workspaceStatistics' });
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, {
            memoriesFetched: [...(context.memoriesFetched || []), { type: 'repo_stats', data: stats }],
        });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.RepositoryScanStage = RepositoryScanStage;
class IntentDetectionStage {
    detector;
    name = 'IntentDetectionStage';
    phase = 'reasoning';
    constructor(detector) {
        this.detector = detector;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const intentDetected = this.detector.detectIntent(context.prompt);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { intentDetected });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.IntentDetectionStage = IntentDetectionStage;
class GoalExtractionStage {
    extractor;
    name = 'GoalExtractionStage';
    phase = 'reasoning';
    constructor(extractor) {
        this.extractor = extractor;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const activeFile = context.contextCollected?.editor?.activeFilePath || undefined;
        const goalExtracted = this.extractor.extractGoal(context.prompt, activeFile);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { goalExtracted });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.GoalExtractionStage = GoalExtractionStage;
class PlanningStage {
    taskPlanner;
    strategyPlanner;
    corePlanner;
    toolRegistry;
    name = 'PlanningStage';
    phase = 'reasoning';
    constructor(taskPlanner, strategyPlanner, corePlanner, toolRegistry) {
        this.taskPlanner = taskPlanner;
        this.strategyPlanner = strategyPlanner;
        this.corePlanner = corePlanner;
        this.toolRegistry = toolRegistry;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        if (!context.goalExtracted) {
            return { status: 'skipped', durationMs: 0, warnings: ['No goal extracted'], nextContext: context };
        }
        const taskGraph = this.taskPlanner.buildTaskGraph(context.goalExtracted);
        const executionStrategy = this.strategyPlanner.determineStrategy(taskGraph);
        const generatedPlan = await this.corePlanner.generatePlan(context.prompt, context.contextCollected || {
            timestamp: '',
            editor: { activeFilePath: null, openFilePaths: [], currentSelection: null, cursorPosition: null },
            workspace: { rootPath: null, recentCommands: [], activeThemeId: '', gitBranchPlaceholder: '' },
        });
        // Validate that every task in the generated plan specifies a valid, registered tool ID
        for (const task of generatedPlan.tasks) {
            if (!task.toolCall || !task.toolCall.toolId) {
                task.toolCall = { toolId: 'noop', input: {} };
            }
            if (this.toolRegistry) {
                const toolId = task.toolCall?.toolId || 'noop';
                if (!this.toolRegistry.getById(toolId)) {
                    const registered = this.toolRegistry.getAll().map((t) => t.id).join(', ');
                    throw new planning_errors_1.PlanningError(`PlanningStage Validation Failed: Task "${task.id}" (${task.title}) generated toolId "${toolId}", which is NOT registered in ToolRegistry. Registered tools: [${registered}].`, task.id);
                }
            }
        }
        const plannedToolIds = generatedPlan.tasks.map((t) => t.toolCall?.toolId);
        const taskPayloads = generatedPlan.tasks.map((t) => ({ id: t.id, toolId: t.toolCall?.toolId, input: t.toolCall?.input }));
        console.log(`[PlanningStage] Planned tool IDs: ${JSON.stringify(plannedToolIds)}`);
        console.log(`[PlanningStage] Task payloads: ${JSON.stringify(taskPayloads)}`);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, {
            taskGraph,
            executionStrategy,
            generatedPlan,
        });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.PlanningStage = PlanningStage;
class ReasoningStage {
    reasoningEngine;
    name = 'ReasoningStage';
    phase = 'reasoning';
    constructor(reasoningEngine) {
        this.reasoningEngine = reasoningEngine;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const reasoningReport = this.reasoningEngine.reason(context.prompt, []);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { reasoningReport });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.ReasoningStage = ReasoningStage;
class ExecutionStage {
    executionEngine;
    name = 'ExecutionStage';
    phase = 'execution';
    constructor(executionEngine) {
        this.executionEngine = executionEngine;
    }
    shouldExecute(context) {
        return !!context.generatedPlan;
    }
    async execute(context) {
        const start = Date.now();
        if (!context.generatedPlan) {
            return { status: 'skipped', durationMs: 0, warnings: ['No plan generated'], nextContext: context };
        }
        console.log(`[ExecutionStage] Executing plan "${context.generatedPlan.id}" with ${context.generatedPlan.tasks.length} task(s)...`);
        const executionResults = await this.executionEngine.executePlan(context.generatedPlan);
        console.log(`[ExecutionStage] Completed execution. Results count: ${executionResults.length}, results: ${JSON.stringify(executionResults)}`);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { executionResults });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.ExecutionStage = ExecutionStage;
class VerificationStage {
    verificationEngine;
    name = 'VerificationStage';
    phase = 'execution';
    constructor(verificationEngine) {
        this.verificationEngine = verificationEngine;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        const verificationReport = await this.verificationEngine.verify('standard', context.workspaceRoot);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { verificationReport });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.VerificationStage = VerificationStage;
class RecoveryStage {
    recoveryOrchestrator;
    name = 'RecoveryStage';
    phase = 'recovery';
    constructor(recoveryOrchestrator) {
        this.recoveryOrchestrator = recoveryOrchestrator;
    }
    shouldExecute(context) {
        return !!context.verificationReport && !context.verificationReport.success;
    }
    async execute(context) {
        const start = Date.now();
        if (!context.verificationReport) {
            return { status: 'skipped', durationMs: 0, warnings: [], nextContext: context };
        }
        const recoveryReport = await this.recoveryOrchestrator.recover(context.verificationReport, context.workspaceRoot);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { recoveryReport });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.RecoveryStage = RecoveryStage;
class ReflectionStage {
    reflectionEngine;
    name = 'ReflectionStage';
    phase = 'recovery';
    constructor(reflectionEngine) {
        this.reflectionEngine = reflectionEngine;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        if (!context.generatedPlan || !context.verificationReport) {
            return { status: 'skipped', durationMs: 0, warnings: ['Missing execution/verification details'], nextContext: context };
        }
        const reflectionReport = await this.reflectionEngine.reflect(context.generatedPlan, context.verificationReport, context.recoveryReport || null, context.workspaceRoot);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { reflectionReport });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.ReflectionStage = ReflectionStage;
class OutcomeStage {
    outcomeManager;
    name = 'OutcomeStage';
    phase = 'learning';
    constructor(outcomeManager) {
        this.outcomeManager = outcomeManager;
    }
    shouldExecute() {
        return true;
    }
    async execute(context) {
        const start = Date.now();
        if (!context.generatedPlan || !context.verificationReport || !context.reflectionReport) {
            return { status: 'skipped', durationMs: 0, warnings: ['Missing reflection details'], nextContext: context };
        }
        const executionOutcome = await this.outcomeManager.processOutcome(context.generatedPlan, context.verificationReport, context.recoveryReport || null, context.reflectionReport);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { executionOutcome });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.OutcomeStage = OutcomeStage;
class LearningStage {
    learningEngine;
    name = 'LearningStage';
    phase = 'learning';
    constructor(learningEngine) {
        this.learningEngine = learningEngine;
    }
    shouldExecute(context) {
        return !!context.executionOutcome;
    }
    async execute(context) {
        const start = Date.now();
        if (!context.executionOutcome) {
            return { status: 'skipped', durationMs: 0, warnings: ['No outcome produced'], nextContext: context };
        }
        const learningReport = await this.learningEngine.learn(context.executionOutcome);
        const nextContext = pipeline_context_1.PipelineContextHelper.cloneWith(context, { learningReport });
        return {
            status: 'completed',
            durationMs: Date.now() - start,
            warnings: [],
            nextContext,
        };
    }
}
exports.LearningStage = LearningStage;
//# sourceMappingURL=pipeline-stage.js.map