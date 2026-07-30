import { describe, it, expect, vi } from 'vitest';
import { ProviderRegistry } from '../electron/main/ai/session/provider-registry';
import { AiSessionService } from '../electron/main/ai/session/ai-session-service';
import { ContextEngine } from '../electron/main/ai/context/context-engine';
import { PromptNormalizer } from '../electron/main/ai/context/prompt-normalizer';
import { ToolRegistry } from '../electron/main/ai/tools/tool-registry';
import { AiKernel } from '../electron/main/ai/kernel/ai-kernel';
import { MockProvider } from '../electron/main/ai/providers/mock-provider';
import { ReadFileTool } from '../electron/main/ai/tools/built-in-tools';
import { TaskPlanner } from '../electron/main/ai/planner/planner';
import { ExecutionEngine } from '../electron/main/ai/execution/execution-engine';
import { ExecutionGraphEngine } from '../electron/main/ai/execution/execution-graph-engine';
import { ExecutionScheduler, LinearRetry } from '../electron/main/ai/execution/execution-scheduler';
import { ExecutionObserver } from '../electron/main/ai/execution/execution-observer';
import { TaskDispatcher } from '../electron/main/ai/execution/task-dispatcher';
import { ExecutionPolicyRegistry } from '../electron/main/ai/execution/execution-policy-registry';
import type { IWorkspaceService, IThemeService, IDesktopLogger, IDesktopEventBus } from '../electron/main/container/service-interfaces';
import * as path from 'path';

describe('AI Core Foundation', () => {
  const mockLogger: IDesktopLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };

  describe('Provider Registry & Session', () => {
    it('registers and retrieves providers', () => {
      const registry = new ProviderRegistry();
      const mockProv = new MockProvider();
      registry.register(mockProv);

      expect(registry.getById('mock')).toBe(mockProv);
      expect(registry.getAll()).toContain(mockProv);
    });

    it('manages sessions and settings', () => {
      const registry = new ProviderRegistry();
      registry.register(new MockProvider());
      const sessionService = new AiSessionService(registry, mockLogger);

      const session = sessionService.createSession();
      expect(session.activeProviderId).toBe('mock');
      expect(sessionService.getActiveSession()).toBe(session);

      sessionService.setProvider('mock');
      sessionService.setModel('custom-model');
      expect(session.activeModelId).toBe('custom-model');
    });
  });

  describe('Context & Normalization', () => {
    it('normalizes prompt intents correctly', () => {
      const normalizer = new PromptNormalizer();
      const mockContext: any = { timestamp: '123' };

      const r1 = normalizer.normalize('hello', mockContext);
      expect(r1.executionMode).toBe('chat');
      expect(r1.goal).toBe('hello');

      const r2 = normalizer.normalize('/plan do this thing', mockContext);
      expect(r2.executionMode).toBe('plan');
      expect(r2.goal).toBe('do this thing');
    });
  });

  describe('Tool Registry', () => {
    it('registers and executes tools', async () => {
      const registry = new ToolRegistry();
      const mockWs: any = {
        readFile: vi.fn().mockResolvedValue('file-content'),
        getRootPath: vi.fn().mockReturnValue('/root')
      };
      
      const tool = new ReadFileTool(mockWs);
      registry.register(tool);

      expect(registry.getById('read_file')).toBe(tool);
      const res = await registry.execute('read_file', { filePath: 'foo.txt' });
      expect(res.content).toBe('file-content');
      expect(mockWs.readFile).toHaveBeenCalledWith(path.join('/root', 'foo.txt'));
    });
  });

  describe('AI Kernel', () => {
    it('executes tasks streaming tokens successfully', async () => {
      const registry = new ProviderRegistry();
      registry.register(new MockProvider());
      const sessionService = new AiSessionService(registry, mockLogger);
      const kernel = new AiKernel(sessionService, registry, mockLogger);

      const tokens: string[] = [];
      const prompt = 'build a house';
      
      const result = await kernel.executeTask(
        { goal: prompt, executionMode: 'chat' },
        (token) => tokens.push(token)
      );

      expect(result).toContain('build a house');
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('supports streaming cancellation signals', async () => {
      const registry = new ProviderRegistry();
      registry.register(new MockProvider());
      const sessionService = new AiSessionService(registry, mockLogger);
      const kernel = new AiKernel(sessionService, registry, mockLogger);

      const promise = kernel.executeTask(
        { goal: 'sleep', executionMode: 'chat' },
        () => {}
      );

      kernel.cancelActiveTask();

      await expect(promise).rejects.toThrow('aborted');
    });
  });

  describe('Planner', () => {
    it('generates multi-task plans for coding goals', async () => {
      const planner = new TaskPlanner();
      const plan = await planner.generatePlan('create calculator component', {
        timestamp: new Date().toISOString(),
        editor: { activeFilePath: null, openFilePaths: [], currentSelection: null, cursorPosition: null },
        workspace: { rootPath: '/root', recentCommands: [], activeThemeId: 'forge-dark', gitBranchPlaceholder: '' }
      });

      expect(plan.goal).toBe('create calculator component');
      expect(plan.tasks.length).toBe(3);
      expect(plan.tasks[1].title).toContain('Calculator');
      expect(plan.tasks[1].toolCall?.toolId).toBe('write_file');
    });
  });

  describe('Execution Engine', () => {
    it('executes plans and triggers eventBus updates successfully', async () => {
      const toolRegistry = new ToolRegistry();
      toolRegistry.register({
        id: 'noop',
        description: 'No operation tool',
        inputSchema: { type: 'object' },
        execute: vi.fn().mockResolvedValue('success')
      } as any);

      const mockEventBus: IDesktopEventBus = {
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn()
      } as any;

      const mockWs = {
        getRootPath: vi.fn().mockReturnValue(null)
      } as any;

      const graphEngine = new ExecutionGraphEngine();
      const policyRegistry = new ExecutionPolicyRegistry();
      const dispatcher = new TaskDispatcher(toolRegistry, policyRegistry, mockWs, mockLogger);
      const observer = new ExecutionObserver();
      const scheduler = new ExecutionScheduler(dispatcher, observer, new LinearRetry());

      const engine = new ExecutionEngine(
        graphEngine,
        scheduler,
        observer,
        mockWs,
        mockLogger,
        mockEventBus
      );
      const plan = {
        id: 'plan_test',
        goal: 'test run',
        tasks: [
          { id: 't1', title: 'Task 1', description: 'desc 1', status: 'pending' as const, dependencies: [], toolCall: { toolId: 'noop', input: {} } }
        ]
      };

      await engine.executePlan(plan);

      expect(mockEventBus.emit).toHaveBeenCalledWith('ai:task-started', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ai:task-completed', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ai:plan-completed', expect.any(Object));
      expect(engine.getJournal().length).toBe(1);
    });
  });
});
