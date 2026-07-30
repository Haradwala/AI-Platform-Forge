/**
 * execution-orchestrator.test.ts
 *
 * Unit test suite for Phase 8 ExecutionOrchestrator.
 * Covers:
 *  - Full end-to-end orchestration flow across all 9 subsystems
 *  - Tool execution via ToolExecutionEngine
 *  - Verification failure & ReflectionEngine insight generation
 *  - Memory storage & consolidation upon completion
 *  - AbortSignal cancellation handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionOrchestrator } from '../electron/main/ai/orchestration/execution-orchestrator';
import type {
  IRuntimeManager,
  IAiRuntime,
  IToolExecutionEngine,
  IContextEngine,
  IMemoryEngine,
} from '../electron/main/container/service-interfaces';
import type { VerificationEngine } from '../electron/main/ai/verification/verification-engine';
import type { ReflectionEngine } from '../electron/main/ai/reflection/reflection-engine';

// ─── Mocks ────────────────────────────────────────────────────────────────────

function makeMockRuntime(): IAiRuntime {
  return {
    id: 'mock_runtime',
    name: 'Mock Runtime',
    runtimeType: 'local',
    generateStream: vi.fn(async () => ({
      onToken: (cb: any) => { cb('AI Response Text'); return {} as any; },
      onComplete: (cb: any) => { cb('AI Response Text'); return {} as any; },
      onError: (_cb: any) => ({} as any),
      cancel: () => {},
    })),
    listAvailableModels: async () => ['mock-model-1'],
    healthCheck: async () => ({ healthy: true, latencyMs: 1 }),
  };
}

function makeMockRuntimeManager(runtime?: IAiRuntime): IRuntimeManager {
  const rt = runtime || makeMockRuntime();
  return {
    register: vi.fn(),
    getById: vi.fn(() => rt),
    activate: vi.fn(),
    listAvailable: vi.fn(() => [{ id: rt.id, name: rt.name, type: rt.runtimeType, health: { healthy: true, latencyMs: 1 } }]),
    checkAllHealth: vi.fn(async () => []),
    discoverModels: vi.fn(async () => []),
    resolveFallbackRuntime: vi.fn(() => rt),
  } as unknown as IRuntimeManager;
}

function makeMockToolEngine(): IToolExecutionEngine {
  return {
    executeTool: vi.fn(async (inv: any) => ({
      success: true,
      data: `executed ${inv.id}` as any,
      durationMs: 5,
    })),
  };
}

function makeMockContextEngine(): IContextEngine {
  return {
    collectContext: vi.fn(async () => ({
      timestamp: new Date().toISOString(),
      editor: { activeFilePath: 'src/main.ts', openFilePaths: ['src/main.ts'], currentSelection: null, cursorPosition: null },
      workspace: { rootPath: '/app', recentCommands: [], activeThemeId: 'dark', gitBranchPlaceholder: 'main' },
    })),
    gatherSnapshot: vi.fn(async () => ({
      timestamp: new Date().toISOString(),
      userGoal: 'Test Goal',
      items: [{ id: 'c1', source: 'active_editor' as const, content: 'src/main.ts code', score: 100, rankReasons: [] }],
      totalTokens: 10,
      maxTokenBudget: 1000,
      truncated: false,
      indexedFileCount: 1,
      durationMs: 2,
    })),
  };
}

function makeMockMemoryEngine(): IMemoryEngine {
  return {
    store: vi.fn((item) => ({ ...item, id: 'mem_1', timestamp: Date.now() })),
    retrieve: vi.fn(async () => [
      { id: 'm1', type: 'user' as const, content: 'User prefers async', score: 90, matchReasons: [], timestamp: Date.now() },
    ]),
    consolidate: vi.fn(async () => ({ mergedCount: 0, purgedCount: 0 })),
    getSnapshot: vi.fn(() => ({ timestamp: '', totalItems: 1, itemsByType: { conversation: 1, workspace: 0, semantic: 0, project: 0, user: 0, temporary: 0 }, items: [] })),
    deleteItem: vi.fn(),
    clear: vi.fn(),
  };
}

function makeMockVerificationEngine(success = true): VerificationEngine {
  return {
    verify: vi.fn(async () => ({
      success,
      state: success ? 'completed' : 'failed',
      durationMs: 10,
      compilation: { success, errors: success ? [] : [{ message: 'Type error', file: 'src/a.ts', line: 1, column: 1, severity: 'error', source: 'tsc' }] },
    })),
  } as unknown as VerificationEngine;
}

function makeMockReflectionEngine(): ReflectionEngine {
  return {
    reflect: vi.fn(async () => ({
      success: false,
      findings: [],
      scores: { maintainability: 5, readability: 5, safety: 5, performance: 5, correctness: 5, complexity: 5 },
      confidence: { execution: 5, verification: 5, recovery: 5, architecture: 5, reasoning: 5, overall: 5 },
      recommendations: ['Fix type error by adding interface property'],
    })),
  } as unknown as ReflectionEngine;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ═══════════════════════════════════════════════════════════════════════════════

describe('ExecutionOrchestrator', () => {
  let runtimeManager: IRuntimeManager;
  let toolEngine: IToolExecutionEngine;
  let contextEngine: IContextEngine;
  let memoryEngine: IMemoryEngine;
  let verificationEngine: VerificationEngine;
  let reflectionEngine: ReflectionEngine;
  let orchestrator: ExecutionOrchestrator;

  beforeEach(() => {
    runtimeManager = makeMockRuntimeManager();
    toolEngine = makeMockToolEngine();
    contextEngine = makeMockContextEngine();
    memoryEngine = makeMockMemoryEngine();
    verificationEngine = makeMockVerificationEngine(true);
    reflectionEngine = makeMockReflectionEngine();

    orchestrator = new ExecutionOrchestrator(
      runtimeManager,
      toolEngine,
      contextEngine,
      memoryEngine,
      verificationEngine,
      reflectionEngine
    );
  });

  it('orchestrates end-to-end execution through Memory, Context, PromptAssembly, Runtime, Tools, and Verification', async () => {
    const result = await orchestrator.execute({
      goal: 'Refactor main function',
      toolInvocations: [{ id: 'read_file', params: { path: 'src/main.ts' } }],
      verificationPolicy: 'standard',
    });

    expect(result.success).toBe(true);
    expect(result.response).toBe('AI Response Text');
    expect(result.toolResults.length).toBe(1);
    expect(result.toolResults[0].success).toBe(true);
    expect(result.assembledPrompt.sections).toContain('Target Goal');
    expect(memoryEngine.retrieve).toHaveBeenCalled();
    expect(contextEngine.gatherSnapshot).toHaveBeenCalled();
    expect(memoryEngine.store).toHaveBeenCalled();
  });

  it('handles verification failures and generates insights via ReflectionEngine', async () => {
    verificationEngine = makeMockVerificationEngine(false);
    orchestrator = new ExecutionOrchestrator(
      runtimeManager,
      toolEngine,
      contextEngine,
      memoryEngine,
      verificationEngine,
      reflectionEngine
    );

    const result = await orchestrator.execute({
      goal: 'Failing task',
      verificationPolicy: 'standard',
    });

    expect(result.success).toBe(false);
    expect(result.verificationPassed).toBe(false);
    expect(reflectionEngine.reflect).toHaveBeenCalled();
    expect(result.reflection).toBe('Fix type error by adding interface property');
  });

  it('cancels execution immediately when AbortSignal is aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      orchestrator.execute({
        goal: 'Cancelled goal',
        signal: controller.signal,
      })
    ).rejects.toThrow('cancelled by AbortSignal');
  });
});
