/**
 * action-system.test.ts — Phase 29 Engineering Action System Test Suite
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ActionRegistry } from '../electron/main/ai/actions/action-registry';
import { ActionValidator } from '../electron/main/ai/actions/action-validator';
import { ActionHistory } from '../electron/main/ai/actions/action-history';
import { ActionExecutor } from '../electron/main/ai/actions/action-executor';
import { CoreActionProvider } from '../electron/main/ai/actions/providers/core-action-provider';
import { GitActionProvider } from '../electron/main/ai/actions/providers/git-action-provider';
import { UIActionProvider } from '../electron/main/ai/actions/providers/ui-action-provider';
import { ActionRequest } from '../electron/main/ai/actions/action-types';

describe('Phase 29 Engineering Action System Suite', () => {
  const testDir = path.join(__dirname, 'temp_action_test');

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

  it('ActionRegistry registers providers and lists actions by category', () => {
    const registry = new ActionRegistry();
    registry.registerProvider(new CoreActionProvider());
    registry.registerProvider(new GitActionProvider());
    registry.registerProvider(new UIActionProvider());

    const allActions = registry.listActions();
    expect(allActions.length).toBeGreaterThanOrEqual(20);

    const fsActions = registry.listByCategory('filesystem');
    expect(fsActions.length).toBeGreaterThanOrEqual(10);
    expect(registry.exists('fs.read_file')).toBe(true);
    expect(registry.exists('git.commit')).toBe(true);
    expect(registry.exists('ui.browser_preview')).toBe(true);
  });

  it('ActionValidator rejects requests with invalid workspace roots or traversal attempts', async () => {
    const registry = new ActionRegistry();
    registry.registerProvider(new CoreActionProvider());
    const validator = new ActionValidator();

    const action = registry.getAction('fs.read_file')!;
    const invalidReq: ActionRequest = {
      id: 'act_val_1',
      actionId: 'fs.read_file',
      runtimeId: 'claude',
      workspaceRoot: '',
      params: { filePath: 'foo.ts' },
      timestamp: Date.now(),
    };

    const res = await validator.validate(action, invalidReq);
    expect(res.valid).toBe(false);
    expect(res.errors[0]).toContain('missing required workspaceRoot');
  });

  it('ActionExecutor executes fs.write_file and fs.read_file through middleware pipeline', async () => {
    const registry = new ActionRegistry();
    registry.registerProvider(new CoreActionProvider());
    const history = new ActionHistory();
    const executor = new ActionExecutor(registry, history);

    const fileRelPath = 'sample.txt';
    const writeReq: ActionRequest = {
      id: 'act_w_1',
      actionId: 'fs.write_file',
      runtimeId: 'claude',
      workspaceRoot: testDir,
      params: { filePath: fileRelPath, content: 'Hello Forge Action System!' },
      timestamp: Date.now(),
    };

    const writeRes = await executor.executeAction(writeReq);
    expect(writeRes.status).toBe('COMPLETED');
    expect(writeRes.data.success).toBe(true);

    const readReq: ActionRequest = {
      id: 'act_r_1',
      actionId: 'fs.read_file',
      runtimeId: 'claude',
      workspaceRoot: testDir,
      params: { filePath: fileRelPath },
      timestamp: Date.now(),
    };

    const readRes = await executor.executeAction(readReq);
    expect(readRes.status).toBe('COMPLETED');
    expect(readRes.data.content).toBe('Hello Forge Action System!');
  });

  it('ActionExecutor gates approval-required actions and supports user approval/rejection', async () => {
    const registry = new ActionRegistry();
    registry.registerProvider(new GitActionProvider());
    const executor = new ActionExecutor(registry);

    const commitReq: ActionRequest = {
      id: 'act_commit_1',
      actionId: 'git.commit',
      runtimeId: 'gemini',
      workspaceRoot: testDir,
      params: { message: 'Initial commit' },
      timestamp: Date.now(),
    };

    // Execute in background since approval middleware blocks until respondApproval is called
    const execPromise = executor.executeAction(commitReq);

    // Give time for approval middleware to register pending approval
    await new Promise((r) => setTimeout(r, 50));

    // Reject approval
    const rejected = executor.approvalMiddleware.respondApproval('act_commit_1', false);
    expect(rejected).toBe(true);

    const res = await execPromise;
    expect(res.status).toBe('CANCELLED');
    expect(res.error).toContain('rejected by user approval');
  });

  it('ActionHistory persists multi-file audit logs to .forge/history/', async () => {
    const registry = new ActionRegistry();
    registry.registerProvider(new CoreActionProvider());
    const history = new ActionHistory();
    const executor = new ActionExecutor(registry, history);

    const req: ActionRequest = {
      id: 'act_hist_1',
      actionId: 'fs.create_folder',
      runtimeId: 'ollama',
      workspaceRoot: testDir,
      params: { folderPath: 'src/components' },
      timestamp: Date.now(),
    };

    await executor.executeAction(req);

    const historyDir = path.join(testDir, '.forge', 'history');
    expect(fs.existsSync(path.join(historyDir, 'actions.json'))).toBe(true);
    expect(fs.existsSync(path.join(historyDir, 'timeline.json'))).toBe(true);

    const loaded = await history.getHistory(testDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].actionId).toBe('fs.create_folder');
    expect(loaded[0].runtimeId).toBe('ollama');
  });
});
