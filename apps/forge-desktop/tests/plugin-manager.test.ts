import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginManager } from '../src/plugins/plugin-manager';
import { DesktopEventBus } from '../src/eventbus/desktop-eventbus';
import { panelRegistry } from '../src/plugins/panel-registry';
import { commandRegistry } from '../src/plugins/command-registry';
import { IPlugin } from '../src/plugins/interfaces';

describe('PluginManager', () => {
  let eventBus: DesktopEventBus;
  let manager: PluginManager;

  beforeEach(() => {
    // Clean window mocks if any
    if (typeof global !== 'undefined') {
      (global as any).window = {};
    }

    eventBus = new DesktopEventBus();
    manager = new PluginManager(eventBus, '/test/workspace');
    panelRegistry.clear();
    commandRegistry.clear();
  });

  it('activates all built-in plugins on activateAll()', async () => {
    await manager.activateAll();
    const active = manager.getActivePlugins();
    expect(active).toContain('forge.explorer');
    expect(active).toContain('forge.chat');
    expect(active).toContain('forge.memory');
    expect(active).toContain('forge.graph');
    expect(active).toContain('forge.retrieval');

    // Asserts explorer registered panels
    const panels = panelRegistry.getAll();
    expect(panels.some((p) => p.id === 'explorer')).toBe(true);
    expect(panels.some((p) => p.id === 'chat')).toBe(true);
    expect(panels.some((p) => p.id === 'memory')).toBe(true);
    expect(panels.some((p) => p.id === 'graph')).toBe(true);
    expect(panels.some((p) => p.id === 'retrieval')).toBe(true);

    // Asserts explorer registered commands
    const commands = commandRegistry.getAll();
    expect(commands.some((c) => c.id === 'forge.explorer.focus')).toBe(true);
  });

  it('injects context with eventBus and workspaceRoot', async () => {
    const customPlugin: IPlugin = {
      id: 'test.plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      activate: vi.fn().mockImplementation((context) => {
        expect(context.workspaceRoot).toBe('/test/workspace');
        expect(context.eventBus).toBe(eventBus);
      }),
    };

    await manager.activatePlugin(customPlugin);
    expect(customPlugin.activate).toHaveBeenCalled();
  });

  it('throws validation error on invalid plugin structures', async () => {
    const brokenPlugin = {
      id: 'broken',
      name: 'Broken Plugin',
      // missing version and activate
    };

    await expect(manager.activatePlugin(brokenPlugin as any)).rejects.toThrow(
      'Invalid plugin structure'
    );
  });

  it('deactivates all active plugins and clears registries', async () => {
    const deactivateMock = vi.fn();
    const customPlugin: IPlugin = {
      id: 'test.plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      activate: (context) => {
        context.panels.register({ id: 'dummy', title: 'Dummy', icon: 'i', component: () => null });
      },
      deactivate: deactivateMock,
    };

    await manager.activatePlugin(customPlugin);
    expect(panelRegistry.getAll()).toHaveLength(1);

    await manager.deactivateAll();
    expect(deactivateMock).toHaveBeenCalled();
    expect(panelRegistry.getAll()).toHaveLength(0);
    expect(manager.getActivePlugins()).toHaveLength(0);
  });
});
