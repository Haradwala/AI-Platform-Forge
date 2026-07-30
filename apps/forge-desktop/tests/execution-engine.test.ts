import { describe, it, expect, vi } from 'vitest';
import { ExecutionEngine } from '../electron/main/ai/execution/execution-engine';
import { ExecutionGraphEngine } from '../electron/main/ai/execution/execution-graph-engine';
import { ExecutionScheduler } from '../electron/main/ai/execution/execution-scheduler';
import { ExecutionObserver } from '../electron/main/ai/execution/execution-observer';
import type { IWorkspaceService, IDesktopLogger, IDesktopEventBus, IPlan } from '../electron/main/container/service-interfaces';

describe('ExecutionEngine', () => {
  it('orchestrates plan execution end to end successfully', async () => {
    const graphEngine = new ExecutionGraphEngine();
    
    const mockScheduler = {
      schedule: vi.fn().mockResolvedValue(undefined),
    } as unknown as ExecutionScheduler;

    const observer = new ExecutionObserver();
    
    const mockWorkspace = {
      getRootPath: vi.fn().mockReturnValue(null),
    } as unknown as IWorkspaceService;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const mockEventBus = {
      emit: vi.fn(),
    } as unknown as IDesktopEventBus;

    const engine = new ExecutionEngine(
      graphEngine,
      mockScheduler,
      observer,
      mockWorkspace,
      mockLogger,
      mockEventBus
    );

    const plan: IPlan = {
      id: 'p1',
      goal: 'test engine',
      tasks: [
        { id: 't1', title: 'Task 1', description: 'desc', status: 'pending', dependencies: [], toolCall: { toolId: 'read_file', input: {} } },
      ],
    };

    await engine.executePlan(plan);

    expect(mockScheduler.schedule).toHaveBeenCalled();
    expect(mockEventBus.emit).toHaveBeenCalledWith('ai:plan-completed', expect.objectContaining({ success: true }));
  });
});
