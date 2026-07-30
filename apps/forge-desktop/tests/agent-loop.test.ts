/**
 * agent-loop.test.ts
 *
 * Unit test suite for Phase 5 AgentLoop.
 * Covers:
 *  - Successful completion on first iteration
 *  - Retry after initial failure leading to success
 *  - Max iterations limit reached
 *  - Early & mid-execution cancellation via AbortSignal
 *  - Tool execution failure handling
 *  - Verification failure handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentLoop } from '../electron/main/ai/agent/agent-loop';
import type {
  IAiKernel,
  IToolExecutionEngine,
  ToolInvocation,
  ToolResult,
} from '../electron/main/container/service-interfaces';
import type { VerificationEngine } from '../electron/main/ai/verification/verification-engine';

// ─── Mock Builders ────────────────────────────────────────────────────────────

function makeMockKernel(executeTaskFn?: (req: any) => Promise<string>): IAiKernel {
  return {
    executeTask: vi.fn(executeTaskFn || (async () => 'Default Plan')),
    cancelActiveTask: vi.fn(),
  };
}

function makeMockToolEngine(
  executeToolFn?: (inv: ToolInvocation, ctx?: any) => Promise<ToolResult>
): IToolExecutionEngine {
  return {
    executeTool: vi.fn(
      executeToolFn ||
        (async () => ({
          success: true,
          data: { result: 'ok' },
          durationMs: 5,
        }))
    ),
  };
}

function makeMockVerificationEngine(
  verifyFn?: (policy: any, root: any) => Promise<any>
): VerificationEngine {
  return {
    verify: vi.fn(
      verifyFn || (async () => ({ success: true, state: 'completed', durationMs: 10 }))
    ),
  } as unknown as VerificationEngine;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ═══════════════════════════════════════════════════════════════════════════════

describe('AgentLoop', () => {
  let mockKernel: IAiKernel;
  let mockToolEngine: IToolExecutionEngine;
  let mockVerificationEngine: VerificationEngine;

  beforeEach(() => {
    mockKernel = makeMockKernel();
    mockToolEngine = makeMockToolEngine();
    mockVerificationEngine = makeMockVerificationEngine();
  });

  it('completes task successfully on first iteration when all phases pass', async () => {
    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const result = await loop.runTask({
      goal: 'Refactor module X',
      verificationPolicy: 'strict',
    });

    expect(result.success).toBe(true);
    expect(result.finalState).toBe('completed');
    expect(result.totalIterations).toBe(1);
    expect(result.summary).toContain('iteration 1');
    expect(mockKernel.executeTask).toHaveBeenCalledTimes(1);
    expect(mockVerificationEngine.verify).toHaveBeenCalledTimes(1);
  });

  it('retries after initial failure and succeeds on subsequent iteration', async () => {
    let verifyAttempts = 0;
    mockVerificationEngine = makeMockVerificationEngine(async () => {
      verifyAttempts++;
      if (verifyAttempts === 1) {
        return {
          success: false,
          state: 'failed',
          durationMs: 10,
          lint: { success: false, errors: [{ message: 'Lint error', file: 'a.ts', line: 1, column: 1, severity: 'error', source: 'eslint' }] },
        };
      }
      return { success: true, state: 'completed', durationMs: 10 };
    });

    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const result = await loop.runTask({
      goal: 'Fix linting issues',
      verificationPolicy: 'standard',
      maxIterations: 3,
    });

    expect(result.success).toBe(true);
    expect(result.finalState).toBe('completed');
    expect(result.totalIterations).toBe(2);
    expect(mockKernel.executeTask).toHaveBeenCalledTimes(2);
    expect(result.steps.some((s) => s.phase === 'reflecting')).toBe(true);
  });

  it('fails with max iterations reached when verification consistently fails', async () => {
    mockVerificationEngine = makeMockVerificationEngine(async () => ({
      success: false,
      state: 'failed',
      durationMs: 5,
      compilation: { success: false, errors: [{ message: 'Persistent build error', file: 'a.ts', line: 1, column: 1, severity: 'error', source: 'tsc' }] },
    }));

    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const result = await loop.runTask({
      goal: 'Impossible goal',
      verificationPolicy: 'strict',
      maxIterations: 2,
    });

    expect(result.success).toBe(false);
    expect(result.finalState).toBe('failed');
    expect(result.totalIterations).toBe(2);
    expect(result.error).toContain('Max iterations');
  });

  it('handles tool execution failures as phase failures triggering retry', async () => {
    let toolCallCount = 0;
    mockToolEngine = makeMockToolEngine(async () => {
      toolCallCount++;
      if (toolCallCount === 1) {
        return {
          success: false,
          error: { name: 'ToolError', code: 'TOOL_ERROR', message: 'Command failed' },
          durationMs: 5,
        };
      }
      return { success: true, data: 'fixed', durationMs: 5 };
    });

    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const result = await loop.runTask({
      goal: 'Execute terminal command',
      toolInvocations: [{ id: 'run_cmd', params: { cmd: 'npm test' } }],
      maxIterations: 3,
    });

    expect(result.success).toBe(true);
    expect(result.totalIterations).toBe(2);
    expect(mockToolEngine.executeTool).toHaveBeenCalledTimes(2);
  });

  it('cancels task execution immediately when AbortSignal is pre-aborted', async () => {
    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const controller = new AbortController();
    controller.abort();

    const result = await loop.runTask({
      goal: 'Cancelled task',
      signal: controller.signal,
    });

    expect(result.success).toBe(false);
    expect(result.finalState).toBe('cancelled');
    expect(result.error).toContain('Cancelled');
    expect(mockKernel.executeTask).not.toHaveBeenCalled();
  });

  it('cancels task during tool execution when AbortSignal triggers mid-loop', async () => {
    const controller = new AbortController();
    mockToolEngine = makeMockToolEngine(async () => {
      controller.abort();
      return { success: true, durationMs: 1 };
    });

    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const result = await loop.runTask({
      goal: 'Mid-loop cancellation',
      toolInvocations: [
        { id: 't1', params: {} },
        { id: 't2', params: {} },
      ],
      signal: controller.signal,
    });

    expect(result.success).toBe(false);
    expect(result.finalState).toBe('cancelled');
  });

  it('handles verification failure gracefully without throwing exceptions', async () => {
    mockVerificationEngine = makeMockVerificationEngine(async () => {
      throw new Error('Verification pipeline crashed');
    });

    const loop = new AgentLoop(mockKernel, mockToolEngine, mockVerificationEngine);

    const result = await loop.runTask({
      goal: 'Test crashing verifier',
      verificationPolicy: 'strict',
      maxIterations: 1,
    });

    expect(result.success).toBe(false);
    expect(result.finalState).toBe('failed');
    expect(result.steps.some((s) => s.verification?.issues?.includes('Verification pipeline crashed'))).toBe(true);
  });
});
