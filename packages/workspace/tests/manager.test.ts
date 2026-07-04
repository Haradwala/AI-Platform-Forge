import { describe, it, expect } from 'vitest';
import { WorkspaceManager } from '../src/manager';
import { EventBus } from '@forge/core';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('WorkspaceManager & Session Integration Tests', () => {
  it('should manage opening and closing lifecycle events, and resolve active sessions', async () => {
    const tmpDir = path.join(__dirname, 'tmp_manager_test');
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(path.join(tmpDir, 'readme.md'), '# test project');

    const eventBus = new EventBus();
    const manager = new WorkspaceManager(eventBus);

    const emittedEvents: string[] = [];
    eventBus.subscribe('workspace.opening', () => emittedEvents.push('opening'));
    eventBus.subscribe('workspace.opened', () => emittedEvents.push('opened'));
    eventBus.subscribe('workspace.scan.started', () => emittedEvents.push('scan_started'));
    eventBus.subscribe('workspace.scan.completed', () => emittedEvents.push('scan_completed'));
    eventBus.subscribe('workspace.ready', () => emittedEvents.push('ready'));
    eventBus.subscribe('workspace.closing', () => emittedEvents.push('closing'));
    eventBus.subscribe('workspace.closed', () => emittedEvents.push('closed'));

    const session = await manager.openWorkspace(tmpDir);
    expect(session).toBeDefined();
    expect(session.status).toBe('ready');
    expect(manager.getActiveSession()).toBe(session);

    const files = session.getFilesList();
    expect(files.length).toBe(1);
    expect(files[0].name).toBe('readme.md');

    expect(emittedEvents).toEqual([
      'opening',
      'opened',
      'scan_started',
      'scan_completed',
      'ready'
    ]);

    await manager.closeWorkspace(session.id);
    expect(manager.getActiveSession()).toBeUndefined();
    expect(session.status).toBe('closed');

    expect(emittedEvents).toContain('closing');
    expect(emittedEvents).toContain('closed');

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
