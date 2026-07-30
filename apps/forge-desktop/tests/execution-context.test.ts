import { describe, it, expect, vi } from 'vitest';
import { ExecutionContextFactory } from '../electron/main/ai/execution/execution-context';
import type { IDesktopLogger } from '../electron/main/container/service-interfaces';

describe('ExecutionContextFactory', () => {
  it('creates isolated execution contexts with correct tracing scopes', () => {
    const factory = new ExecutionContextFactory();
    const controller = new AbortController();
    const mockLogger = {} as unknown as IDesktopLogger;

    const context = factory.createContext(
      'exec-1',
      'task-1',
      { tokenBudget: 100, timeBudget: 10, costBudget: 0.1, fileBudget: 1, retryBudget: 1 },
      mockLogger,
      controller.signal,
      '/root'
    );

    expect(context.traceId).toBe('exec-1-task-1-trace');
    expect(context.spanId).toBe('task-1-span');
    expect(context.executionId).toBe('exec-1');
    expect(context.rootPath).toBe('/root');
  });
});
