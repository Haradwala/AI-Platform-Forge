import { PipelineExecutor } from '../pipeline/pipeline-executor';
import { PipelineRecorder } from '../pipeline/pipeline-recorder';
import type { IContextEngine, IRepositoryProvider, IPlanner, IExecutionEngine, IWorkspaceService, IDesktopLogger, IPlan } from '../../container/service-interfaces';
import { MemoryRegistry } from '../memory/memory-registry';
import { IntentDetector } from '../planner/intent-detector';
import { GoalExtractor } from '../planner/goal-extractor';
import { GoalTaskPlanner } from '../planner/task-planner';
import { ExecutionPlanner } from '../planner/execution-planner';
import { ReasoningEngine } from '../reasoning/reasoning-engine';
import { VerificationEngine } from '../verification/verification-engine';
import { RecoveryOrchestrator } from '../recovery/recovery-orchestrator';
import { ReflectionEngine } from '../reflection/reflection-engine';
import { OutcomeManager } from '../outcome/outcome-manager';
import { LearningEngine } from '../learning/learning-engine';
import { ResponseGenerationEngine } from '../response/response-generation-engine';
import type { AiExecutionResult } from '../response/response-types';
export interface IAiRequest {
    readonly id: string;
    readonly prompt: string;
    readonly options?: Record<string, any>;
}
export declare class AiOrchestrator {
    private readonly contextEngine;
    private readonly memoryRegistry;
    private readonly repo;
    private readonly intentDetector;
    private readonly goalExtractor;
    private readonly taskPlanner;
    private readonly strategyPlanner;
    private readonly corePlanner;
    private readonly reasoningEngine;
    private readonly executionEngine;
    private readonly verificationEngine;
    private readonly recoveryOrchestrator;
    private readonly reflectionEngine;
    private readonly outcomeManager;
    private readonly learningEngine;
    private readonly pipelineExecutor;
    private readonly pipelineRecorder;
    private readonly workspaceService;
    private readonly logger;
    private readonly responseGenerationEngine;
    private readonly stages;
    private readonly responseContextBuilder;
    constructor(contextEngine: IContextEngine, memoryRegistry: MemoryRegistry, repo: IRepositoryProvider, intentDetector: IntentDetector, goalExtractor: GoalExtractor, taskPlanner: GoalTaskPlanner, strategyPlanner: ExecutionPlanner, corePlanner: IPlanner, reasoningEngine: ReasoningEngine, executionEngine: IExecutionEngine, verificationEngine: VerificationEngine, recoveryOrchestrator: RecoveryOrchestrator, reflectionEngine: ReflectionEngine, outcomeManager: OutcomeManager, learningEngine: LearningEngine, pipelineExecutor: PipelineExecutor, pipelineRecorder: PipelineRecorder, workspaceService: IWorkspaceService, logger: IDesktopLogger, responseGenerationEngine: ResponseGenerationEngine);
    executeRequest(req: IAiRequest): Promise<AiExecutionResult>;
    runOrchestration(plan: IPlan, workspaceRoot: string | null): Promise<void>;
}
