import { PipelineContext, PipelineContextHelper } from '../pipeline/pipeline-context';
import { PipelineExecutor } from '../pipeline/pipeline-executor';
import { PipelineRecorder } from '../pipeline/pipeline-recorder';
import {
  ContextCollectionStage,
  MemoryRetrievalStage,
  RepositoryScanStage,
  IntentDetectionStage,
  GoalExtractionStage,
  PlanningStage,
  ReasoningStage,
  ExecutionStage,
  VerificationStage,
  RecoveryStage,
  ReflectionStage,
  OutcomeStage,
  LearningStage,
  IAiPipelineStage,
} from '../pipeline/pipeline-stage';
import type {
  IContextEngine,
  IRepositoryProvider,
  IPlanner,
  IExecutionEngine,
  IWorkspaceService,
  IDesktopLogger,
  IPlan,
} from '../../container/service-interfaces';
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
import { ResponseContextBuilder } from '../response/response-context-builder';
import { ResponseGenerationEngine } from '../response/response-generation-engine';
import type { AiExecutionResult } from '../response/response-types';

export interface IAiRequest {
  readonly id: string;
  readonly prompt: string;
  readonly options?: Record<string, any>;
}

export class AiOrchestrator {
  private readonly stages: IAiPipelineStage[];
  private readonly responseContextBuilder: ResponseContextBuilder;

  constructor(
    private readonly contextEngine: IContextEngine,
    private readonly memoryRegistry: MemoryRegistry,
    private readonly repo: IRepositoryProvider,
    private readonly intentDetector: IntentDetector,
    private readonly goalExtractor: GoalExtractor,
    private readonly taskPlanner: GoalTaskPlanner,
    private readonly strategyPlanner: ExecutionPlanner,
    private readonly corePlanner: IPlanner,
    private readonly reasoningEngine: ReasoningEngine,
    private readonly executionEngine: IExecutionEngine,
    private readonly verificationEngine: VerificationEngine,
    private readonly recoveryOrchestrator: RecoveryOrchestrator,
    private readonly reflectionEngine: ReflectionEngine,
    private readonly outcomeManager: OutcomeManager,
    private readonly learningEngine: LearningEngine,
    private readonly pipelineExecutor: PipelineExecutor,
    private readonly pipelineRecorder: PipelineRecorder,
    private readonly workspaceService: IWorkspaceService,
    private readonly logger: IDesktopLogger,
    private readonly responseGenerationEngine: ResponseGenerationEngine
  ) {
    this.responseContextBuilder = new ResponseContextBuilder();
    this.stages = [
      new ContextCollectionStage(this.contextEngine),
      new MemoryRetrievalStage(this.memoryRegistry),
      new RepositoryScanStage(this.repo),
      new IntentDetectionStage(this.intentDetector),
      new GoalExtractionStage(this.goalExtractor),
      new PlanningStage(this.taskPlanner, this.strategyPlanner, this.corePlanner),
      new ReasoningStage(this.reasoningEngine),
      new ExecutionStage(this.executionEngine),
      new VerificationStage(this.verificationEngine),
      new RecoveryStage(this.recoveryOrchestrator),
      new ReflectionStage(this.reflectionEngine),
      new OutcomeStage(this.outcomeManager),
      new LearningStage(this.learningEngine),
    ];
  }

  async executeRequest(req: IAiRequest): Promise<AiExecutionResult> {
    this.logger.info(`[AiOrchestrator] Initiating request: ${req.id} - Prompt: "${req.prompt}"`);

    const workspaceRoot = this.workspaceService.getRootPath();
    const initialContext = PipelineContextHelper.create(req.id, req.prompt, workspaceRoot);

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
  async runOrchestration(plan: IPlan, workspaceRoot: string | null): Promise<void> {
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
    const reflectionReport = await this.reflectionEngine.reflect(
      plan,
      verificationReport,
      recoveryReport,
      workspaceRoot
    );

    this.logger.info('[AiOrchestrator] Running Outcome Runtime...');
    const outcome = await this.outcomeManager.processOutcome(
      plan,
      verificationReport,
      recoveryReport,
      reflectionReport
    );

    this.logger.info('[AiOrchestrator] Running Learning Runtime...');
    await this.learningEngine.learn(outcome);

    this.logger.info(`[AiOrchestrator] AI legacy orchestration loop completed for plan: ${plan.id}`);
  }
}
