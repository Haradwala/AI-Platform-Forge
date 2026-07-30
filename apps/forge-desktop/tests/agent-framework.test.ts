/**
 * agent-framework.test.ts — Phase 30 Agent Framework Test Suite
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { AgentRegistry } from '../electron/main/ai/agents/agent-registry';
import { AgentScheduler } from '../electron/main/ai/agents/agent-scheduler';
import { AgentMemory } from '../electron/main/ai/agents/agent-memory';
import { AgentEventEmitter } from '../electron/main/ai/agents/agent-events';
import { AgentOrchestrator } from '../electron/main/ai/agents/agent-orchestrator';
import { PlannerAgent, CoderAgent, TesterAgent, ReviewerAgent } from '../electron/main/ai/agents/built-in-agents';
import { AgentTask, AgentResult } from '../electron/main/ai/agents/agent-types';

describe('Phase 30 Agent Framework & Multi-Agent Suite', () => {
  const testDir = path.join(__dirname, 'temp_agent_test');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('AgentRegistry registers agents and assigns agent based on capabilities', () => {
    const registry = new AgentRegistry();
    registry.register(new PlannerAgent());
    registry.register(new CoderAgent());
    registry.register(new TesterAgent());

    expect(registry.list().length).toBe(3);
    expect(registry.get('coder')?.name).toBe('Software Engineering Agent');

    const assigned = registry.assign(['coding', 'edits']);
    expect(assigned?.role).toBe('coder');
  });

  it('AgentScheduler builds DAG execution levels and executes tasks in topological order', async () => {
    const events = new AgentEventEmitter();
    const scheduler = new AgentScheduler(events);

    const tasks: AgentTask[] = [
      { id: 't1', agentRole: 'planner', title: 'Plan', prompt: 'Plan task', dependencies: [], priority: 1 },
      { id: 't2', agentRole: 'coder', title: 'Code', prompt: 'Code task', dependencies: ['t1'], priority: 1 },
      { id: 't3', agentRole: 'tester', title: 'Test', prompt: 'Test task', dependencies: ['t2'], priority: 1 },
    ];

    const levels = scheduler.buildExecutionLevels(tasks);
    expect(levels.length).toBe(3);
    expect(levels[0][0].id).toBe('t1');
    expect(levels[1][0].id).toBe('t2');
    expect(levels[2][0].id).toBe('t3');

    const executionOrder: string[] = [];
    const results = await scheduler.scheduleDAG(tasks, async (task) => {
      executionOrder.push(task.id);
      return {
        taskId: task.id,
        agentRole: task.agentRole,
        status: 'COMPLETED',
        output: 'Done',
        durationMs: 10,
      };
    });

    expect(executionOrder).toEqual(['t1', 't2', 't3']);
    expect(results.size).toBe(3);
  });

  it('AgentScheduler respects task cancellation signals', async () => {
    const events = new AgentEventEmitter();
    const scheduler = new AgentScheduler(events);

    const tasks: AgentTask[] = [
      { id: 't1', agentRole: 'planner', title: 'Plan', prompt: 'Plan', dependencies: [], priority: 1 },
      { id: 't2', agentRole: 'coder', title: 'Code', prompt: 'Code', dependencies: ['t1'], priority: 1 },
    ];

    scheduler.cancelTask('t2');

    const results = await scheduler.scheduleDAG(tasks, async (task) => ({
      taskId: task.id,
      agentRole: task.agentRole,
      status: 'COMPLETED',
      output: 'Done',
      durationMs: 5,
    }));

    expect(results.get('t1')?.status).toBe('COMPLETED');
    expect(results.get('t2')?.status).toBe('CANCELLED');
  });

  it('AgentMemory stores and retrieves reasoning entries in .forge/session/agents.json', async () => {
    const memory = new AgentMemory();

    await memory.set(testDir, 'planner', 'architecture_plan', { modules: ['ui', 'backend'] });
    const entry = await memory.get(testDir, 'architecture_plan');

    expect(entry).toBeDefined();
    expect(entry?.agentRole).toBe('planner');
    expect(entry?.value.modules).toContain('backend');

    const filePath = path.join(testDir, '.forge', 'session', 'agents.json');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('AgentOrchestrator executes multi-agent workflow and delegates to RuntimeRouter', async () => {
    const registry = new AgentRegistry();
    registry.register(new PlannerAgent());
    registry.register(new CoderAgent());

    const mockRouter = {
      rankRuntimes: vi.fn(() => [{ candidate: { id: 'claude' } }]),
    };

    const orchestrator = new AgentOrchestrator(registry, undefined, undefined, undefined, mockRouter);

    const res = await orchestrator.runWorkflow({
      id: 'wf_test_1',
      goal: 'Build feature',
      workspaceRoot: testDir,
      tasks: [
        { id: 'task_1', agentRole: 'planner', title: 'Plan', prompt: 'Plan', dependencies: [], priority: 1 },
        { id: 'task_2', agentRole: 'coder', title: 'Code', prompt: 'Code', dependencies: ['task_1'], priority: 1 },
      ],
    });

    expect(res.status).toBe('COMPLETED');
    expect(res.taskResults.length).toBe(2);
    expect(res.taskResults[0].runtimeId).toBe('claude');
  });
});
