import { PipelineContext } from './pipeline-context';
import type { IContextEngine, IRepositoryProvider, IPlanner, IExecutionEngine, IToolRegistry } from '../../container/service-interfaces';
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
export interface StageResult {
    readonly status: 'skipped' | 'completed' | 'failed';
    readonly durationMs: number;
    readonly warnings: string[];
    readonly nextContext: PipelineContext;
}
export interface IAiPipelineStage {
    readonly name: string;
    readonly phase: 'collection' | 'reasoning' | 'execution' | 'recovery' | 'learning';
    shouldExecute(context: PipelineContext): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class ContextCollectionStage implements IAiPipelineStage {
    private readonly contextEngine;
    readonly name = "ContextCollectionStage";
    readonly phase = "collection";
    constructor(contextEngine: IContextEngine);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class MemoryRetrievalStage implements IAiPipelineStage {
    private readonly memoryRegistry;
    readonly name = "MemoryRetrievalStage";
    readonly phase = "collection";
    constructor(memoryRegistry: MemoryRegistry);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class RepositoryScanStage implements IAiPipelineStage {
    private readonly repo;
    readonly name = "RepositoryScanStage";
    readonly phase = "collection";
    constructor(repo: IRepositoryProvider);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class IntentDetectionStage implements IAiPipelineStage {
    private readonly detector;
    readonly name = "IntentDetectionStage";
    readonly phase = "reasoning";
    constructor(detector: IntentDetector);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class GoalExtractionStage implements IAiPipelineStage {
    private readonly extractor;
    readonly name = "GoalExtractionStage";
    readonly phase = "reasoning";
    constructor(extractor: GoalExtractor);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class PlanningStage implements IAiPipelineStage {
    private readonly taskPlanner;
    private readonly strategyPlanner;
    private readonly corePlanner;
    private readonly toolRegistry?;
    readonly name = "PlanningStage";
    readonly phase = "reasoning";
    constructor(taskPlanner: GoalTaskPlanner, strategyPlanner: ExecutionPlanner, corePlanner: IPlanner, toolRegistry?: IToolRegistry | undefined);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class ReasoningStage implements IAiPipelineStage {
    private readonly reasoningEngine;
    readonly name = "ReasoningStage";
    readonly phase = "reasoning";
    constructor(reasoningEngine: ReasoningEngine);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class ExecutionStage implements IAiPipelineStage {
    private readonly executionEngine;
    readonly name = "ExecutionStage";
    readonly phase = "execution";
    constructor(executionEngine: IExecutionEngine);
    shouldExecute(context: PipelineContext): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class VerificationStage implements IAiPipelineStage {
    private readonly verificationEngine;
    readonly name = "VerificationStage";
    readonly phase = "execution";
    constructor(verificationEngine: VerificationEngine);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class RecoveryStage implements IAiPipelineStage {
    private readonly recoveryOrchestrator;
    readonly name = "RecoveryStage";
    readonly phase = "recovery";
    constructor(recoveryOrchestrator: RecoveryOrchestrator);
    shouldExecute(context: PipelineContext): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class ReflectionStage implements IAiPipelineStage {
    private readonly reflectionEngine;
    readonly name = "ReflectionStage";
    readonly phase = "recovery";
    constructor(reflectionEngine: ReflectionEngine);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class OutcomeStage implements IAiPipelineStage {
    private readonly outcomeManager;
    readonly name = "OutcomeStage";
    readonly phase = "learning";
    constructor(outcomeManager: OutcomeManager);
    shouldExecute(): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
export declare class LearningStage implements IAiPipelineStage {
    private readonly learningEngine;
    readonly name = "LearningStage";
    readonly phase = "learning";
    constructor(learningEngine: LearningEngine);
    shouldExecute(context: PipelineContext): boolean;
    execute(context: PipelineContext): Promise<StageResult>;
}
