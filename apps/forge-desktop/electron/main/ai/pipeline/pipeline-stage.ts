import { PipelineContext, PipelineContextHelper } from './pipeline-context';
import type {
  IContextEngine,
  IRepositoryProvider,
  IPlanner,
  IExecutionEngine,
  IToolRegistry,
} from '../../container/service-interfaces';
import { PlanningError } from '../errors/planning-errors';
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

export class ContextCollectionStage implements IAiPipelineStage {
  readonly name = 'ContextCollectionStage';
  readonly phase = 'collection';

  constructor(private readonly contextEngine: IContextEngine) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const mockEditor = {
      activeFilePath: null,
      openFilePaths: [],
      currentSelection: null,
      cursorPosition: null,
    };
    const contextCollected = await this.contextEngine.collectContext(mockEditor);
    const nextContext = PipelineContextHelper.cloneWith(context, { contextCollected });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class MemoryRetrievalStage implements IAiPipelineStage {
  readonly name = 'MemoryRetrievalStage';
  readonly phase = 'collection';

  constructor(private readonly memoryRegistry: MemoryRegistry) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const memoriesFetched = this.memoryRegistry.getRecords('pattern');
    const nextContext = PipelineContextHelper.cloneWith(context, { memoriesFetched });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class RepositoryScanStage implements IAiPipelineStage {
  readonly name = 'RepositoryScanStage';
  readonly phase = 'collection';

  constructor(private readonly repo: IRepositoryProvider) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const stats = await this.repo.query({ type: 'workspaceStatistics' });
    const nextContext = PipelineContextHelper.cloneWith(context, {
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

export class IntentDetectionStage implements IAiPipelineStage {
  readonly name = 'IntentDetectionStage';
  readonly phase = 'reasoning';

  constructor(private readonly detector: IntentDetector) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const intentDetected = this.detector.detectIntent(context.prompt);
    const nextContext = PipelineContextHelper.cloneWith(context, { intentDetected });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class GoalExtractionStage implements IAiPipelineStage {
  readonly name = 'GoalExtractionStage';
  readonly phase = 'reasoning';

  constructor(private readonly extractor: GoalExtractor) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const activeFile = context.contextCollected?.editor?.activeFilePath || undefined;
    const goalExtracted = this.extractor.extractGoal(context.prompt, activeFile);
    const nextContext = PipelineContextHelper.cloneWith(context, { goalExtracted });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class PlanningStage implements IAiPipelineStage {
  readonly name = 'PlanningStage';
  readonly phase = 'reasoning';

  constructor(
    private readonly taskPlanner: GoalTaskPlanner,
    private readonly strategyPlanner: ExecutionPlanner,
    private readonly corePlanner: IPlanner,
    private readonly toolRegistry?: IToolRegistry
  ) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    if (!context.goalExtracted) {
      return { status: 'skipped', durationMs: 0, warnings: ['No goal extracted'], nextContext: context };
    }

    const taskGraph = this.taskPlanner.buildTaskGraph(context.goalExtracted);
    const executionStrategy = this.strategyPlanner.determineStrategy(taskGraph);
    const baseContext = context.contextCollected || {
      timestamp: new Date().toISOString(),
      editor: { activeFilePath: null, openFilePaths: [], currentSelection: null, cursorPosition: null },
      workspace: { rootPath: context.workspaceRoot || null, recentCommands: [], activeThemeId: '', gitBranchPlaceholder: '' },
    };

    const sessionServices = (context as any).session || (baseContext as any)?.session;
    const enrichedContext = {
      ...baseContext,
      state: (context as any).state || (baseContext as any)?.state || (sessionServices?.getState ? sessionServices.getState() : undefined),
      session: sessionServices,
      entities: (context as any).entities || (baseContext as any)?.entities,
      previousExecutionResults: context.executionResults || (baseContext as any)?.previousExecutionResults || [],
      knowledgeFacts: (context as any).knowledgeFacts || (baseContext as any)?.knowledgeFacts || [],
      conversationHistory: (context as any).conversationHistory || (baseContext as any)?.conversationHistory || [],
    };

    const generatedPlan = await this.corePlanner.generatePlan(
      context.prompt,
      enrichedContext
    );

    // Validate that every task in the generated plan specifies a valid, registered tool ID
    for (const task of generatedPlan.tasks) {
      if (!task.toolCall || !task.toolCall.toolId) {
        (task as any).toolCall = { toolId: 'noop', input: {} };
      }

      if (this.toolRegistry) {
        const toolId = task.toolCall?.toolId || 'noop';
        if (!this.toolRegistry.getById(toolId)) {
          const registered = this.toolRegistry.getAll().map((t) => t.id).join(', ');
          throw new PlanningError(
            `PlanningStage Validation Failed: Task "${task.id}" (${task.title}) generated toolId "${toolId}", which is NOT registered in ToolRegistry. Registered tools: [${registered}].`,
            task.id
          );
        }
      }
    }

    const plannedToolIds = generatedPlan.tasks.map((t) => t.toolCall?.toolId);
    const taskPayloads = generatedPlan.tasks.map((t) => ({ id: t.id, toolId: t.toolCall?.toolId, input: t.toolCall?.input }));
    console.log(`[PlanningStage] Planned tool IDs: ${JSON.stringify(plannedToolIds)}`);
    console.log(`[PlanningStage] Task payloads: ${JSON.stringify(taskPayloads)}`);

    const nextContext = PipelineContextHelper.cloneWith(context, {
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

export class ReasoningStage implements IAiPipelineStage {
  readonly name = 'ReasoningStage';
  readonly phase = 'reasoning';

  constructor(private readonly reasoningEngine: ReasoningEngine) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const reasoningReport = this.reasoningEngine.reason(context.prompt, []);
    const nextContext = PipelineContextHelper.cloneWith(context, { reasoningReport });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class ExecutionStage implements IAiPipelineStage {
  readonly name = 'ExecutionStage';
  readonly phase = 'execution';

  constructor(private readonly executionEngine: IExecutionEngine) {}

  shouldExecute(context: PipelineContext): boolean {
    return !!context.generatedPlan;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    if (!context.generatedPlan) {
      return { status: 'skipped', durationMs: 0, warnings: ['No plan generated'], nextContext: context };
    }
    console.log(`[ExecutionStage] Executing plan "${context.generatedPlan.id}" with ${context.generatedPlan.tasks.length} task(s)...`);
    const executionResults = await this.executionEngine.executePlan(context.generatedPlan);
    console.log(`[ExecutionStage] Completed execution. Results count: ${executionResults.length}, results: ${JSON.stringify(executionResults)}`);
    const nextContext = PipelineContextHelper.cloneWith(context, { executionResults });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class VerificationStage implements IAiPipelineStage {
  readonly name = 'VerificationStage';
  readonly phase = 'execution';

  constructor(private readonly verificationEngine: VerificationEngine) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    const verificationReport = await this.verificationEngine.verify('standard', context.workspaceRoot);
    const nextContext = PipelineContextHelper.cloneWith(context, { verificationReport });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class RecoveryStage implements IAiPipelineStage {
  readonly name = 'RecoveryStage';
  readonly phase = 'recovery';

  constructor(private readonly recoveryOrchestrator: RecoveryOrchestrator) {}

  shouldExecute(context: PipelineContext): boolean {
    return !!context.verificationReport && !context.verificationReport.success;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    if (!context.verificationReport) {
      return { status: 'skipped', durationMs: 0, warnings: [], nextContext: context };
    }
    const recoveryReport = await this.recoveryOrchestrator.recover(context.verificationReport, context.workspaceRoot);
    const nextContext = PipelineContextHelper.cloneWith(context, { recoveryReport });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class ReflectionStage implements IAiPipelineStage {
  readonly name = 'ReflectionStage';
  readonly phase = 'recovery';

  constructor(private readonly reflectionEngine: ReflectionEngine) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    if (!context.generatedPlan || !context.verificationReport) {
      return { status: 'skipped', durationMs: 0, warnings: ['Missing execution/verification details'], nextContext: context };
    }
    const reflectionReport = await this.reflectionEngine.reflect(
      context.generatedPlan,
      context.verificationReport,
      context.recoveryReport || null,
      context.workspaceRoot
    );
    const nextContext = PipelineContextHelper.cloneWith(context, { reflectionReport });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class OutcomeStage implements IAiPipelineStage {
  readonly name = 'OutcomeStage';
  readonly phase = 'learning';

  constructor(private readonly outcomeManager: OutcomeManager) {}

  shouldExecute(): boolean {
    return true;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    if (!context.generatedPlan || !context.verificationReport || !context.reflectionReport) {
      return { status: 'skipped', durationMs: 0, warnings: ['Missing reflection details'], nextContext: context };
    }
    const executionOutcome = await this.outcomeManager.processOutcome(
      context.generatedPlan,
      context.verificationReport,
      context.recoveryReport || null,
      context.reflectionReport
    );
    const nextContext = PipelineContextHelper.cloneWith(context, { executionOutcome });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}

export class LearningStage implements IAiPipelineStage {
  readonly name = 'LearningStage';
  readonly phase = 'learning';

  constructor(private readonly learningEngine: LearningEngine) {}

  shouldExecute(context: PipelineContext): boolean {
    return !!context.executionOutcome;
  }

  async execute(context: PipelineContext): Promise<StageResult> {
    const start = Date.now();
    if (!context.executionOutcome) {
      return { status: 'skipped', durationMs: 0, warnings: ['No outcome produced'], nextContext: context };
    }
    const learningReport = await this.learningEngine.learn(context.executionOutcome);
    const nextContext = PipelineContextHelper.cloneWith(context, { learningReport });
    return {
      status: 'completed',
      durationMs: Date.now() - start,
      warnings: [],
      nextContext,
    };
  }
}
