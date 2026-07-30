import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceSessionManager } from '../electron/main/ai/session/workspace-session-manager';
import { WorkspaceProfileManager } from '../electron/main/ai/session/workspace-profile';

const testWorkspace = path.join(__dirname, 'temp_workspace_session_test');

describe('Phase 25-28 Workspace Session & Profile Suite', () => {
  beforeEach(() => {
    if (!fs.existsSync(testWorkspace)) {
      fs.mkdirSync(testWorkspace, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testWorkspace)) {
      fs.rmSync(testWorkspace, { recursive: true, force: true });
    }
  });

  it('saves and restores workspace session cleanly from .forge/session/session.json', async () => {
    const manager = new WorkspaceSessionManager();
    const sessionData: any = {
      workspaceRoot: testWorkspace,
      lastSavedAt: Date.now(),
      openTabs: [{ id: 'tab1', filePath: 'src/App.tsx', line: 12 }],
      activeTabId: 'tab1',
      recentCommands: ['git status', 'pnpm test'],
      terminalState: { activeTerminals: [{ id: 'term1', cwd: testWorkspace }] },
      approvals: [{ id: 'app1', toolName: 'run_command', approvedAt: Date.now() }],
      activeSessions: [],
    };

    await manager.saveSession(sessionData);

    const restored = await manager.restoreSession(testWorkspace);
    expect(restored).not.toBeNull();
    expect(restored?.openTabs.length).toBe(1);
    expect(restored?.recentCommands).toContain('pnpm test');
  });

  it('generates and persists workspace.json workspace profile', () => {
    const profileMgr = new WorkspaceProfileManager();
    const profile = profileMgr.getProfile(testWorkspace);

    expect(profile).not.toBeNull();
    expect(profile.language).toBe('typescript');
    expect(profile.analysis.runtimeRecommendations.length).toBeGreaterThan(0);
  });
});
