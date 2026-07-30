/**
 * automation-engine.test.ts — Unit Test Suite for Engineering Automation Engine
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { WorkflowDefinitionParser } from '../electron/main/automation/parser/workflow-definition-parser';
import { WorkflowTemplateRegistry } from '../electron/main/automation/templates/workflow-template-registry';
import { AutomationResourceScheduler } from '../electron/main/automation/scheduler/automation-resource-scheduler';
import { AutomationArtifactStore } from '../electron/main/automation/artifacts/automation-artifact-store';
import { AutomationTimelinePublisher } from '../electron/main/automation/timeline/automation-timeline-publisher';
import { AutomationStepExecutor } from '../electron/main/automation/execution/automation-step-executor';
import { AutomationPipelineRunner } from '../electron/main/automation/execution/automation-pipeline-runner';
import { AutomationCoordinator } from '../electron/main/automation/coordinator/automation-coordinator';
import { AutomationApplicationService } from '../electron/main/application/automation/automation-application-service';
import { ActionRegistry } from '../electron/main/ai/actions/action-registry';
import { ActionHistory } from '../electron/main/ai/actions/action-history';
import { ActionExecutor } from '../electron/main/ai/actions/action-executor';
import { CoreActionProvider } from '../electron/main/ai/actions/providers/core-action-provider';
import { AgentRegistry } from '../electron/main/ai/agents/agent-registry';
import { AgentScheduler } from '../electron/main/ai/agents/agent-scheduler';
import { AgentMemory } from '../electron/main/ai/agents/agent-memory';
import { AgentOrchestrator } from '../electron/main/ai/agents/agent-orchestrator';
import { PlannerAgent, ArchitectAgent, CoderAgent } from '../electron/main/ai/agents/built-in-agents';

describe('Engineering Automation Engine', () => {
  const testDir = path.join(__dirname, 'temp_automation_test');
  let parser: WorkflowDefinitionParser;
  let artifactStore: AutomationArtifactStore;
  let resourceScheduler: AutomationResourceScheduler;
  let stepExecutor: AutomationStepExecutor;
  let runner: AutomationPipelineRunner;
  let coordinator: AutomationCoordinator;
  let appService: AutomationApplicationService;

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    parser = new WorkflowDefinitionParser();
    artifactStore = new AutomationArtifactStore();
    resourceScheduler = new AutomationResourceScheduler(2);

    const actionRegistry = new ActionRegistry();
    actionRegistry.registerProvider(new CoreActionProvider());
    const actionExecutor = new ActionExecutor(actionRegistry, new ActionHistory());

    const agentRegistry = new AgentRegistry();
    agentRegistry.register(new PlannerAgent());
    agentRegistry.register(new ArchitectAgent());
    agentRegistry.register(new CoderAgent());
    const agentOrchestrator = new AgentOrchestrator(
      agentRegistry,
      new AgentScheduler(),
      new AgentMemory(),
      undefined,
      undefined,
      undefined,
      actionExecutor
    );

    const timelinePublisher = new AutomationTimelinePublisher();
    stepExecutor = new AutomationStepExecutor(actionExecutor, agentOrchestrator, artifactStore);
    runner = new AutomationPipelineRunner(stepExecutor, timelinePublisher, resourceScheduler);
    coordinator = new AutomationCoordinator(runner, resourceScheduler, artifactStore);
    appService = new AutomationApplicationService(coordinator, parser, undefined, new WorkflowTemplateRegistry(), artifactStore);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('WorkflowDefinitionParser parses YAML and detects DAG cycles', () => {
    const yaml = `
name: CI Verification
id: ci_test
jobs:
  job1:
    name: Build
    steps:
      - name: Compile
        action: term.run_build
`;
    const def = parser.parse(yaml, testDir, 'yaml');
    expect(def.name).toBe('CI Verification');
    expect(def.jobs.job1).toBeDefined();

    const cyclicWorkflow: any = {
      id: 'cycle',
      name: 'Cycle Test',
      workspaceRoot: testDir,
      jobs: {
        j1: { id: 'j1', name: 'J1', needs: ['j2'], steps: [] },
        j2: { id: 'j2', name: 'J2', needs: ['j1'], steps: [] },
      }
    };
    const val = parser.validate(cyclicWorkflow);
    expect(val.valid).toBe(false);
    expect(val.errors[0]).toContain('Cyclic dependency');
  });

  it('AutomationResourceScheduler limits concurrency and sorts by priority', async () => {
    const scheduler = new AutomationResourceScheduler(1);
    await scheduler.acquireSlot('s1', 'exec1', 'normal');
    expect(scheduler.getActiveSlotCount()).toBe(1);

    let acquiredS2 = false;
    const p2 = scheduler.acquireSlot('s2', 'exec1', 'high').then(() => { acquiredS2 = true; });
    expect(scheduler.getQueueLength()).toBe(1);
    expect(acquiredS2).toBe(false);

    scheduler.releaseSlot('s1');
    await p2;
    expect(acquiredS2).toBe(true);
  });

  it('AutomationArtifactStore saves, reads, and lists artifacts', async () => {
    const art = await artifactStore.saveArtifact(testDir, 'exec1', 'step1', 'report.txt', 'Artifact Content');
    expect(fs.existsSync(art.path)).toBe(true);

    const content = await artifactStore.readArtifact(art.path);
    expect(content).toBe('Artifact Content');

    const list = await artifactStore.listArtifacts(testDir, 'exec1');
    expect(list.length).toBe(1);
  });

  it('AutomationPipelineRunner executes action steps through ActionExecutor', async () => {
    const yaml = `
name: Pipeline Action Test
id: pipe_act
jobs:
  build:
    name: Build Job
    steps:
      - name: Run Command
        action: term.run_command
        params:
          command: echo test
`;
    const def = parser.parse(yaml, testDir, 'yaml');
    const exec = await runner.executePipeline(def);
    expect(exec.status).toBe('COMPLETED');
    expect(Object.keys(exec.stepResults).length).toBe(1);
  });

  it('AutomationApplicationService lists templates and manages workflows', async () => {
    const templates = appService.listTemplates();
    expect(templates.length).toBeGreaterThan(0);

    const def = parser.parse(`name: App Test\nid: app_test\njobs:\n  j1:\n    steps:\n      - name: S1\n        action: term.run_build`, testDir, 'yaml');
    await appService.saveWorkflow(testDir, def);

    const loaded = await appService.listWorkflows(testDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('app_test');

    const exec = await appService.runWorkflow(testDir, 'app_test');
    expect(exec.status).toBe('COMPLETED');

    const fetched = await appService.getExecution(testDir, exec.id);
    expect(fetched?.id).toBe(exec.id);
  });
});
