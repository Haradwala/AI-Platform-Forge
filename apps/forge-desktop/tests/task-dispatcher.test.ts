import { describe, it, expect, vi } from 'vitest';
import { TaskDispatcher } from '../electron/main/ai/execution/task-dispatcher';
import type { ExecutionPolicyRegistry } from '../electron/main/ai/execution/execution-policy-registry';
import type { IWorkspaceService, IDesktopLogger, IToolRegistry } from '../electron/main/container/service-interfaces';

describe('TaskDispatcher', () => {
  it('creates trace context and dispatches successfully', async () => {
    const mockRegistry = {
      getById: vi.fn().mockReturnValue({ id: 'read_file' }),
      execute: vi.fn().mockResolvedValue({ status: 'done' }),
    } as unknown as IToolRegistry;

    const mockPolicies = {
      validate: vi.fn().mockReturnValue({ allowed: true, action: 'execute' }),
    } as unknown as ExecutionPolicyRegistry;

    const mockWorkspace = {
      getRootPath: vi.fn().mockReturnValue('/mock/root'),
    } as unknown as IWorkspaceService;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const dispatcher = new TaskDispatcher(mockRegistry, mockPolicies, mockWorkspace, mockLogger);
    const controller = new AbortController();

    const result = await dispatcher.dispatch(
      {
        id: 't1',
        toolId: 'read_file',
        dependencies: [],
        priority: 'normal',
        retryLimit: 1,
        timeout: 1000,
        estimatedCost: 0,
        executionPolicy: 'safe',
        input: { path: 'a.ts' },
      },
      controller.signal,
      'exec-1'
    );

    expect(result).toEqual({ status: 'done' });
    expect(mockRegistry.execute).toHaveBeenCalledWith('read_file', { path: 'a.ts' });
  });

  it('rejects call if abortSignal is already aborted', async () => {
    const mockRegistry = {
      getById: vi.fn().mockReturnValue({ id: 'read_file' }),
      execute: vi.fn().mockResolvedValue({ status: 'done' }),
    } as unknown as IToolRegistry;

    const mockPolicies = {
      validate: vi.fn().mockReturnValue({ allowed: true, action: 'execute' }),
    } as unknown as ExecutionPolicyRegistry;

    const mockWorkspace = {
      getRootPath: vi.fn().mockReturnValue('/mock/root'),
    } as unknown as IWorkspaceService;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const dispatcher = new TaskDispatcher(mockRegistry, mockPolicies, mockWorkspace, mockLogger);
    const controller = new AbortController();
    controller.abort();

    await expect(
      dispatcher.dispatch(
        {
          id: 't1',
          toolId: 'read_file',
          dependencies: [],
          priority: 'normal',
          retryLimit: 1,
          timeout: 1000,
          estimatedCost: 0,
          executionPolicy: 'safe',
          input: { path: 'a.ts' },
        },
        controller.signal,
        'exec-1'
      )
    ).rejects.toThrow('aborted');
  });
});
