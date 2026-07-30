import { describe, it, expect, vi } from 'vitest';
import { AiOrchestrator } from '../electron/main/ai/orchestrator/ai-orchestrator';
import type {
  IExecutionEngine,
  IPlan,
  IDesktopLogger,
  IContextEngine,
  IRepositoryProvider,
  IPlanner,
  IWorkspaceService,
} from '../electron/main/container/service-interfaces';
import type { MemoryRegistry } from '../electron/main/ai/memory/memory-registry';
import type { IntentDetector } from '../electron/main/ai/planner/intent-detector';
import type { GoalExtractor } from '../electron/main/ai/planner/goal-extractor';
import type { GoalTaskPlanner } from '../electron/main/ai/planner/task-planner';
import type { ExecutionPlanner } from '../electron/main/ai/planner/execution-planner';
import type { ReasoningEngine } from '../electron/main/ai/reasoning/reasoning-engine';
import type { VerificationEngine } from '../electron/main/ai/verification/verification-engine';
import type { RecoveryOrchestrator } from '../electron/main/ai/recovery/recovery-orchestrator';
import type { ReflectionEngine } from '../electron/main/ai/reflection/reflection-engine';
import type { OutcomeManager } from '../electron/main/ai/outcome/outcome-manager';
import type { LearningEngine } from '../electron/main/ai/learning/learning-engine';
import type { PipelineExecutor } from '../electron/main/ai/pipeline/pipeline-executor';
import type { PipelineRecorder } from '../electron/main/ai/pipeline/pipeline-recorder';

describe('AiOrchestrator', () => {
  it('runs the end-to-end quality pipeline and learning cycle', async () => {
    const mockContextEngine = {} as unknown as IContextEngine;
    const mockMemoryRegistry = {} as unknown as MemoryRegistry;
    const mockRepo = {} as unknown as IRepositoryProvider;
    const mockIntentDetector = {} as unknown as IntentDetector;
    const mockGoalExtractor = {} as unknown as GoalExtractor;
    const mockTaskPlanner = {} as unknown as GoalTaskPlanner;
    const mockStrategyPlanner = {} as unknown as ExecutionPlanner;
    const mockCorePlanner = {} as unknown as IPlanner;
    const mockReasoningEngine = {} as unknown as ReasoningEngine;
    const mockPipelineExecutor = {} as unknown as PipelineExecutor;
    const mockPipelineRecorder = {} as unknown as PipelineRecorder;
    const mockWorkspaceService = {} as unknown as IWorkspaceService;

    const mockExecution = {
      executePlan: vi.fn().mockResolvedValue(undefined),
    } as unknown as IExecutionEngine;

    const mockVerification = {
      verify: vi.fn().mockResolvedValue({ success: true, suggestions: [] }),
    } as unknown as VerificationEngine;

    const mockRecovery = {
      recover: vi.fn().mockResolvedValue({ success: true, attempts: [], durationMs: 0 }),
    } as unknown as RecoveryOrchestrator;

    const mockReflection = {
      reflect: vi.fn().mockResolvedValue({ success: true, findings: [], recommendations: [] }),
    } as unknown as ReflectionEngine;

    const mockOutcome = {
      processOutcome: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as OutcomeManager;

    const mockLearning = {
      learn: vi.fn().mockResolvedValue({ patternsDiscovered: [] }),
    } as unknown as LearningEngine;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const orchestrator = new AiOrchestrator(
      mockContextEngine,
      mockMemoryRegistry,
      mockRepo,
      mockIntentDetector,
      mockGoalExtractor,
      mockTaskPlanner,
      mockStrategyPlanner,
      mockCorePlanner,
      mockReasoningEngine,
      mockExecution,
      mockVerification,
      mockRecovery,
      mockReflection,
      mockOutcome,
      mockLearning,
      mockPipelineExecutor,
      mockPipelineRecorder,
      mockWorkspaceService,
      mockLogger
    );

    const plan: IPlan = { id: 'p1', goal: 'orchestrate', tasks: [] };
    await orchestrator.runOrchestration(plan, '/root');

    expect(mockExecution.executePlan).toHaveBeenCalledWith(plan);
    expect(mockVerification.verify).toHaveBeenCalledWith('standard', '/root');
    expect(mockReflection.reflect).toHaveBeenCalled();
    expect(mockOutcome.processOutcome).toHaveBeenCalled();
    expect(mockLearning.learn).toHaveBeenCalled();
  });
});
