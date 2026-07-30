/**
 * application-services.test.ts — Test suite for Application Layer Services
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ActionRegistry } from '../electron/main/ai/actions/action-registry';
import { ActionHistory } from '../electron/main/ai/actions/action-history';
import { ActionExecutor } from '../electron/main/ai/actions/action-executor';
import { CoreActionProvider } from '../electron/main/ai/actions/providers/core-action-provider';
import { GitActionProvider } from '../electron/main/ai/actions/providers/git-action-provider';
import { WorkspaceApplicationService } from '../electron/main/application/workspace/workspace-application-service';
import { TerminalApplicationService } from '../electron/main/application/terminal/terminal-application-service';
import { GitApplicationService } from '../electron/main/application/git/git-application-service';
import { EngineeringApplicationService } from '../electron/main/application/engineering-application-service';
import { RuntimeApplicationService } from '../electron/main/application/runtime/runtime-application-service';
import { AgentApplicationService } from '../electron/main/application/agents/agent-application-service';

describe('Application Layer Services', () => {
  const testDir = path.join(__dirname, 'temp_app_services_test');
  let executor: ActionExecutor;
  let history: ActionHistory;

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    const registry = new ActionRegistry();
    registry.registerProvider(new CoreActionProvider());
    registry.registerProvider(new GitActionProvider());

    history = new ActionHistory();
    executor = new ActionExecutor(registry, history);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('WorkspaceApplicationService writes file through ActionExecutor and records history', async () => {
    const wsAppService = new WorkspaceApplicationService(executor);
    const targetFile = 'test.txt';

    const res = await wsAppService.writeFile(testDir, targetFile, 'Hello Application Service');
    expect(res.status).toBe('COMPLETED');
    expect(fs.readFileSync(path.join(testDir, targetFile), 'utf-8')).toBe('Hello Application Service');

    const content = await wsAppService.readFile(testDir, targetFile);
    expect(content).toBe('Hello Application Service');

    const entries = await history.getHistory(testDir);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].actionId).toBe('fs.write_file');
  });

  it('TerminalApplicationService executes commands through ActionExecutor', async () => {
    const termAppService = new TerminalApplicationService(executor);
    const res = await termAppService.runCommand(testDir, 'echo hello');
    expect(res.status).toBe('COMPLETED');
  });

  it('GitApplicationService status executes through ActionExecutor', async () => {
    const gitAppService = new GitApplicationService(executor);
    const res = await gitAppService.getStatus(testDir);
    expect(res.status).toBe('COMPLETED');
  });

  it('EngineeringApplicationService master facade aggregates all domain services', () => {
    const ws = new WorkspaceApplicationService(executor);
    const term = new TerminalApplicationService(executor);
    const git = new GitApplicationService(executor);
    const runtime = new RuntimeApplicationService();
    const agents = new AgentApplicationService();

    const facade = new EngineeringApplicationService(ws, term, git, runtime, agents);
    expect(facade.workspace).toBe(ws);
    expect(facade.terminal).toBe(term);
    expect(facade.git).toBe(git);
    expect(facade.runtime).toBe(runtime);
    expect(facade.agents).toBe(agents);
  });
});
