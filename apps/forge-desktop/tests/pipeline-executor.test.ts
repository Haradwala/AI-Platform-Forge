import { describe, it, expect, vi } from 'vitest';
import { PipelineContext, PipelineContextHelper } from '../electron/main/ai/pipeline/pipeline-context';
import { PipelineExecutor } from '../electron/main/ai/pipeline/pipeline-executor';
import { PipelineRecorder } from '../electron/main/ai/pipeline/pipeline-recorder';
import { DiagnosticsService } from '../electron/main/ai/diagnostics/diagnostics-service';
import type { IAiPipelineStage, StageResult } from '../electron/main/ai/pipeline/pipeline-stage';
import type { IDesktopEventBus, IWorkspaceService, IDesktopLogger, IAiSessionService, IProviderRegistry, IRepositoryProvider, IExecutionEngine } from '../electron/main/container/service-interfaces';
import type { MemoryRegistry } from '../electron/main/ai/memory/memory-registry';

describe('Pipeline Subsystem', () => {
  it('executes and skips stages conditionally', async () => {
    const events: any[] = [];
    const mockEventBus = {
      emit: vi.fn().mockImplementation((channel, data) => {
        if (channel === 'ai:event') {
          events.push(data);
        }
      }),
    } as unknown as IDesktopEventBus;

    const executor = new PipelineExecutor(mockEventBus);
    const initialContext = PipelineContextHelper.create('run_1', 'optimize auth', '/root');

    const completedStage: IAiPipelineStage = {
      name: 'CompletedStage',
      phase: 'reasoning',
      shouldExecute: () => true,
      execute: async (context) => {
        return {
          status: 'completed',
          durationMs: 12,
          warnings: [],
          nextContext: PipelineContextHelper.cloneWith(context, {
            memoriesFetched: [{ id: 'm1' }],
          }),
        };
      },
    };

    const skippedStage: IAiPipelineStage = {
      name: 'SkippedStage',
      phase: 'execution',
      shouldExecute: () => false,
      execute: async (context) => {
        return {
          status: 'skipped',
          durationMs: 0,
          warnings: [],
          nextContext: context,
        };
      },
    };

    const result = await executor.execute(initialContext, [completedStage, skippedStage]);

    expect(result.id).toBe('run_1');
    expect(result.timeline).toHaveLength(2);
    expect(result.timeline[0].stageName).toBe('CompletedStage');
    expect(result.timeline[0].status).toBe('completed');
    expect(result.timeline[1].stageName).toBe('SkippedStage');
    expect(result.timeline[1].status).toBe('skipped');

    expect(mockEventBus.emit).toHaveBeenCalled();
    const completedEvent = events.find((e) => e.type === 'STAGE_COMPLETED' && e.payload.stageName === 'CompletedStage');
    expect(completedEvent).toBeDefined();
    expect(completedEvent.payload.status).toBe('completed');
  });

  it('PipelineRecorder skips logs writing if no workspace is active', async () => {
    const mockWorkspace = {
      getRootPath: vi.fn().mockReturnValue(null),
    } as unknown as IWorkspaceService;

    const mockLogger = {
      warn: vi.fn(),
      info: vi.fn(),
    } as unknown as IDesktopLogger;

    const recorder = new PipelineRecorder(mockWorkspace, mockLogger);
    const context = PipelineContextHelper.create('run_1', 'prompt', null);

    const path = await recorder.record(context);
    expect(path).toBeNull();
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('DiagnosticsService aggregates runtime diagnostics snapshot correctly', async () => {
    const mockSession = {
      getActiveSession: vi.fn().mockReturnValue({ activeProviderId: 'mock-provider', activeModelId: 'mock-model' }),
    } as unknown as IAiSessionService;

    const mockRegistry = {} as unknown as IProviderRegistry;

    const mockRepo = {
      query: vi.fn().mockResolvedValue({
        success: true,
        data: { filesCount: 42, symbolsCount: 150 },
      }),
    } as unknown as IRepositoryProvider;

    const mockMemory = {
      getRecords: vi.fn().mockReturnValue([{ id: 'record_1' }, { id: 'record_2' }]),
    } as unknown as MemoryRegistry;

    const mockExecution = {
      getJournal: vi.fn().mockReturnValue([{ status: 'completed' }]),
    } as unknown as IExecutionEngine;

    const service = new DiagnosticsService(mockSession, mockRegistry, mockRepo, mockMemory, mockExecution);
    const snapshot = await service.getDiagnosticsSnapshot();

    expect(snapshot.status).toBe('healthy');
    expect(snapshot.provider).toBe('mock-provider');
    expect(snapshot.model).toBe('mock-model');
    expect(snapshot.repositoryIndexedCount).toBe(42);
    expect(snapshot.memoryRecordsCount).toBe(2);
    expect(snapshot.lastExecutionStatus).toBe('completed');
  });
});
