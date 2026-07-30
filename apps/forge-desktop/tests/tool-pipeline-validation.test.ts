import { describe, it, expect, vi } from 'vitest';
import { GoalTaskPlanner } from '../electron/main/ai/planner/task-planner';
import { TaskPlanner } from '../electron/main/ai/planner/planner';
import { PlanningStage } from '../electron/main/ai/pipeline/pipeline-stage';
import { ExecutionPlanner } from '../electron/main/ai/planner/execution-planner';
import { ToolRegistry } from '../electron/main/ai/tools/tool-registry';
import {
  ReadFileTool,
  WriteFileTool,
  ListDirectoryTool,
  SearchWorkspaceTool,
  RunTerminalCommandTool,
  OpenFileTool,
  ToggleTerminalTool,
  NoOpTool,
} from '../electron/main/ai/tools/built-in-tools';
import { PipelineContextHelper } from '../electron/main/ai/pipeline/pipeline-context';
import { PlanningError } from '../electron/main/ai/errors/planning-errors';

describe('AI Tool Pipeline & ToolRegistry Validation', () => {
  function makeToolRegistry(): ToolRegistry {
    const registry = new ToolRegistry();
    const mockWs: any = { getRootPath: () => '/mock' };
    const mockRepo: any = { query: vi.fn() };
    const mockTerm: any = { create: vi.fn(), write: vi.fn() };
    const mockBus: any = { emit: vi.fn() };

    registry.register(new ReadFileTool(mockWs));
    registry.register(new WriteFileTool(mockWs));
    registry.register(new ListDirectoryTool(mockWs, mockRepo));
    registry.register(new SearchWorkspaceTool(mockWs, mockRepo));
    registry.register(new RunTerminalCommandTool(mockTerm));
    registry.register(new OpenFileTool(mockBus, mockWs));
    registry.register(new ToggleTerminalTool(mockBus));
    registry.register(new NoOpTool());

    return registry;
  }

  it('audits ToolRegistry and verifies all 8 built-in tools are registered', () => {
    const registry = makeToolRegistry();
    const tools = registry.getAll();
    const toolIds = tools.map((t) => t.id);

    expect(tools.length).toBe(8);
    expect(toolIds).toEqual([
      'read_file',
      'write_file',
      'list_dir',
      'search_workspace',
      'run_terminal_command',
      'open_file',
      'toggle_terminal',
      'noop',
    ]);
  });

  it('ensures GoalTaskPlanner produces graph nodes with only registered tool IDs', () => {
    const planner = new GoalTaskPlanner();
    const registry = makeToolRegistry();
    const graph = planner.buildTaskGraph({
      id: 'g1',
      description: 'Create calculator component',
      targetFiles: ['src/components/Calculator.tsx'],
      scope: 'src/components',
    });

    expect(graph.nodes.length).toBeGreaterThan(0);
    for (const node of graph.nodes) {
      expect(registry.getById(node.toolId)).not.toBeNull();
    }
  });

  it('ensures TaskPlanner produces plan tasks with valid registered tool calls', async () => {
    const planner = new TaskPlanner();
    const registry = makeToolRegistry();

    const plan = await planner.generatePlan('create a calculator', {
      timestamp: '',
      editor: { activeFilePath: null, openFilePaths: [], currentSelection: null, cursorPosition: null },
      workspace: { rootPath: null, recentCommands: [], activeThemeId: '', gitBranchPlaceholder: '' },
    });

    expect(plan.tasks.length).toBeGreaterThan(0);
    for (const task of plan.tasks) {
      expect(task.toolCall).toBeDefined();
      expect(task.toolCall?.toolId).toBeDefined();
      expect(registry.getById(task.toolCall!.toolId)).not.toBeNull();
    }
  });

  it('verifies PlanningStage succeeds when all tasks use registered tool IDs', async () => {
    const registry = makeToolRegistry();
    const goalPlanner = new GoalTaskPlanner();
    const strategyPlanner = new ExecutionPlanner();
    const corePlanner = new TaskPlanner();

    const planningStage = new PlanningStage(goalPlanner, strategyPlanner, corePlanner, registry);

    const context = PipelineContextHelper.create('Build calculator component');
    const contextWithGoal = PipelineContextHelper.cloneWith(context, {
      prompt: 'Build calculator component',
      goalExtracted: {
        id: 'g1',
        description: 'Build calculator',
        targetFiles: ['src/Calculator.tsx'],
        scope: 'src',
      },
    });

    const result = await planningStage.execute(contextWithGoal);
    expect(result.status).toBe('completed');
    expect(result.nextContext.generatedPlan).toBeDefined();

    for (const task of result.nextContext.generatedPlan!.tasks) {
      expect(registry.getById(task.toolCall!.toolId)).not.toBeNull();
    }
  });

  it('verifies PlanningStage throws PlanningError if a task contains an unregistered toolId (such as stub_tool)', async () => {
    const registry = makeToolRegistry();
    const goalPlanner = new GoalTaskPlanner();
    const strategyPlanner = new ExecutionPlanner();

    const badPlanner = {
      async generatePlan(): Promise<any> {
        return {
          id: 'bad_plan',
          goal: 'invalid tool goal',
          tasks: [
            {
              id: 't_bad',
              title: 'Bad Task',
              description: 'Using stub_tool',
              status: 'pending',
              dependencies: [],
              toolCall: { toolId: 'stub_tool', input: {} },
            },
          ],
        };
      },
    };

    const planningStage = new PlanningStage(goalPlanner, strategyPlanner, badPlanner, registry);
    const context = PipelineContextHelper.create('Run invalid tool prompt');
    const contextWithGoal = PipelineContextHelper.cloneWith(context, {
      prompt: 'Run invalid tool prompt',
      goalExtracted: {
        id: 'g2',
        description: 'Test invalid tool',
        targetFiles: [],
        scope: 'root',
      },
    });

    await expect(planningStage.execute(contextWithGoal)).rejects.toThrow(PlanningError);
    await expect(planningStage.execute(contextWithGoal)).rejects.toThrow(/stub_tool/);
  });
});
