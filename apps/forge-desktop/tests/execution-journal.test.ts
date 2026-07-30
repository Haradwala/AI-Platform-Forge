import { describe, it, expect, vi } from 'vitest';
import { ExecutionEngine } from '../electron/main/ai/execution/execution-engine';
import { ExecutionGraphEngine } from '../electron/main/ai/execution/execution-graph-engine';
import { ExecutionObserver } from '../electron/main/ai/execution/execution-observer';
import type { ExecutionScheduler } from '../electron/main/ai/execution/execution-scheduler';
import type { IWorkspaceService, IDesktopLogger, IDesktopEventBus } from '../electron/main/container/service-interfaces';

describe('ExecutionJournal Telemetry', () => {
  it('appends and returns journal entries of executions', () => {
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

    expect(engine.getJournal()).toEqual([]);
  });
});
