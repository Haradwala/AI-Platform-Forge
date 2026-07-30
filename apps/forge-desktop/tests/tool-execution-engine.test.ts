/**
 * tool-execution-engine.test.ts
 *
 * Unit test suite for Phase 4 ToolExecutionEngine.
 * Tests tool resolution, successful execution, tool not found, timeout,
 * cancellation via AbortSignal, and error normalization.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ToolExecutionEngine,
  ToolNotFoundError,
  ToolError,
  TimeoutError,
  CancelledError,
  ExecutionError,
} from '../electron/main/ai/tools/tool-execution-engine';
import type { IToolRegistry, ITool } from '../electron/main/container/service-interfaces';

// ─── Mock Registry Helper ─────────────────────────────────────────────────────

function createMockToolRegistry(tools: ITool[] = []): IToolRegistry {
  const map = new Map<string, ITool>();
  for (const t of tools) map.set(t.id, t);

  return {
    register(tool: ITool) { map.set(tool.id, tool); },
    getById(id: string) { return map.get(id) || null; },
    getAll() {
      return Array.from(map.values()).map((t) => ({
        id: t.id,
        description: t.description,
        inputSchema: t.inputSchema,
        outputSchema: t.outputSchema,
      }));
    },
    async execute(id: string, input: any) {
      const tool = map.get(id);
      if (!tool) throw new Error(`Not found: ${id}`);
      return tool.execute(input);
    },
  };
}

function makeMockTool(
  id: string,
  executeFn: (input: any) => Promise<any>
): ITool {
  return {
    id,
    description: `Mock tool ${id}`,
    inputSchema: {},
    outputSchema: {},
    execute: vi.fn(executeFn),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ═══════════════════════════════════════════════════════════════════════════════

describe('ToolExecutionEngine', () => {
  let registry: IToolRegistry;
  let engine: ToolExecutionEngine;

  beforeEach(() => {
    registry = createMockToolRegistry();
    engine = new ToolExecutionEngine(registry);
  });

  it('executes a registered tool successfully and returns structured ToolResult', async () => {
    const tool = makeMockTool('echo', async (input) => ({ echo: input.msg }));
    registry.register(tool);

    const result = await engine.executeTool({
      id: 'echo',
      params: { msg: 'Hello World' },
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ echo: 'Hello World' });
    expect(result.error).toBeUndefined();
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(tool.execute).toHaveBeenCalledWith({ msg: 'Hello World' });
  });

  it('returns ToolNotFoundError when tool is not registered in registry', async () => {
    const result = await engine.executeTool({
      id: 'nonexistent_tool',
      params: {},
    });

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeInstanceOf(ToolNotFoundError);
    expect(result.error?.code).toBe('TOOL_NOT_FOUND');
    expect(result.error?.message).toContain('nonexistent_tool');
  });

  it('handles execution failure and normalizes thrown errors into ToolError', async () => {
    const tool = makeMockTool('failing_tool', async () => {
      throw new Error('Disk full');
    });
    registry.register(tool);

    const result = await engine.executeTool({
      id: 'failing_tool',
      params: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ToolError);
    expect(result.error?.code).toBe('TOOL_ERROR');
    expect(result.error?.message).toBe('Disk full');
  });

  it('enforces execution timeout and returns TimeoutError', async () => {
    const tool = makeMockTool('slow_tool', () => {
      return new Promise((resolve) => setTimeout(() => resolve('done'), 200));
    });
    registry.register(tool);

    const result = await engine.executeTool(
      { id: 'slow_tool', params: {}, timeoutMs: 50 }
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(TimeoutError);
    expect(result.error?.code).toBe('TIMEOUT');
    expect(result.error?.message).toContain('timed out after 50ms');
  });

  it('handles early cancellation via AbortSignal', async () => {
    const tool = makeMockTool('any_tool', async () => 'ok');
    registry.register(tool);

    const controller = new AbortController();
    controller.abort();

    const result = await engine.executeTool(
      { id: 'any_tool', params: {} },
      { signal: controller.signal }
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CancelledError);
    expect(result.error?.code).toBe('CANCELLED');
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it('handles cancellation during tool execution', async () => {
    const controller = new AbortController();
    const tool = makeMockTool('long_running', () => {
      return new Promise((resolve) => setTimeout(resolve, 300));
    });
    registry.register(tool);

    const promise = engine.executeTool(
      { id: 'long_running', params: {} },
      { signal: controller.signal }
    );

    setTimeout(() => controller.abort(), 30);

    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CancelledError);
    expect(result.error?.code).toBe('CANCELLED');
  });

  it('preserves existing ExecutionError instances thrown by tools', async () => {
    const customErr = new ExecutionError('Custom failure', 'CUSTOM_CODE');
    const tool = makeMockTool('custom_err_tool', async () => {
      throw customErr;
    });
    registry.register(tool);

    const result = await engine.executeTool({
      id: 'custom_err_tool',
      params: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe(customErr);
    expect(result.error?.code).toBe('CUSTOM_CODE');
  });
});
