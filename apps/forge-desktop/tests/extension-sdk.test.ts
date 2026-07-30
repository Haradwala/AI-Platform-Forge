import { describe, it, expect, vi } from 'vitest';
import { ExtensionContext, Permission, WorkbenchEvents } from '@forge/shared';

describe('Extension SDK Contracts', () => {
  it('implements type contracts correctly', () => {
    const mockStorage = new Map<string, any>();
    
    const context: ExtensionContext = {
      extensionId: 'test-extension',
      permissions: new Set([Permission.FilesystemRead, Permission.AI]),
      workspace: {
        getRootPath: () => '/mock/workspace',
        readFile: async () => 'mock file content',
        writeFile: async () => {},
        exists: async () => true,
        findFiles: async () => ['file1.ts'],
      },
      editor: {
        getActiveFile: () => 'index.ts',
        openFile: async () => {},
      },
      layout: {
        getProfile: () => 'AI',
        applyProfile: async () => {},
        moveDock: () => {},
        toggleDock: () => {},
      },
      terminal: {
        execute: async () => 'stdout output',
      },
      git: {
        getStatus: async () => 'git status mock',
        stage: async () => {},
        commit: async () => {},
      },
      ai: {
        chat: async () => 'AI reply',
        complete: async () => 'completed snippet',
      },
      commands: {
        register: () => {},
        execute: async () => null,
      },
      events: {
        on: () => () => {},
        emit: () => {},
      },
      storage: {
        get: (key) => mockStorage.get(key),
        set: async (key, val) => { mockStorage.set(key, val); },
        clear: async () => { mockStorage.clear(); },
      },
      configuration: {
        get: () => undefined,
      },
      logger: {
        info: () => {},
        warn: () => {},
        error: () => {},
      },
    };

    expect(context.extensionId).toBe('test-extension');
    expect(context.permissions.has(Permission.AI)).toBe(true);
    expect(context.permissions.has(Permission.GitWrite)).toBe(false);
    expect(context.workspace.getRootPath()).toBe('/mock/workspace');
  });
});
