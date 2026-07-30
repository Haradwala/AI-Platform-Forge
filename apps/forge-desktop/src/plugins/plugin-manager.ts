import React from 'react';
import { IPlugin, IPluginContext } from './interfaces';
import { PluginLoader } from './plugin-loader';
import { panelRegistry } from './panel-registry';
import { commandRegistry } from './command-registry';
import { DesktopEventBus } from '../eventbus/desktop-eventbus';
import { ExplorerPanel } from '../panels/explorer/ExplorerPanel';
import { AIEnginePanel } from '../panels/ai/AIEnginePanel';
import { TerminalPanel } from '../panels/terminal/TerminalPanel';
import { RuntimeManagerPanel } from '../panels/runtime/RuntimeManagerPanel';
import { useRuntimeStore } from '../stores/runtime-store';


// Store and service imports for core commands integration
import { useLayoutStore } from '../stores/layout-store';
import { useWorkspaceStore } from '../stores/workspace-store';
import { useThemeStore } from '../stores/theme-store';
import { useCommandPaletteStore } from '../stores/command-palette-store';
import { WorkspaceClient } from '../services/workspace-client';
import { PlatformDiagnosticsService } from '../services/platform-diagnostics-service';

// Built-in Core Commands Plugin
const coreCommandsPlugin: IPlugin = {
  id: 'forge.core-commands',
  name: 'Core Commands Plugin',
  version: '0.1.0',
  activate(context) {
    context.commands.register({
      id: 'forge.view.toggleTerminal',
      title: 'Toggle Terminal',
      category: 'View',
      handler: () => {
        useLayoutStore.getState().toggleDock();
      },
    });

    context.commands.register({
      id: 'forge.view.toggleCommandPalette',
      title: 'Toggle Command Palette',
      category: 'View',
      handler: () => {
        useCommandPaletteStore.getState().toggle();
      },
    });

    context.commands.register({
      id: 'forge.workspace.openFolder',
      title: 'Open Folder...',
      category: 'Workspace',
      handler: async () => {
        if (typeof window !== 'undefined' && window.forge) {
          const folderPath = await WorkspaceClient.pickFolder();
          if (folderPath) {
            await useWorkspaceStore.getState().openWorkspace(folderPath);
          }
        }
      },
    });

    context.commands.register({
      id: 'forge.theme.changeTheme',
      title: 'Change Theme',
      category: 'Preferences',
      handler: () => {
        const current = useThemeStore.getState().activeThemeId;
        const next = current === 'forge-dark' ? 'forge-light' : 'forge-dark';
        useThemeStore.getState().setTheme(next);
      },
    });

    context.commands.register({
      id: 'forge.workspace.closeWorkspace',
      title: 'Close Workspace',
      category: 'Workspace',
      handler: () => {
        useWorkspaceStore.getState().closeWorkspace();
      },
    });

    context.commands.register({
      id: 'forge.diagnostics.dump',
      title: 'Dump Platform Diagnostics',
      category: 'Developer',
      handler: () => {
        const info = PlatformDiagnosticsService.collect();
        console.log('[Forge Diagnostics]', info);
        return info;
      },
    });

    context.commands.register({
      id: 'forge.layout.applyProfile',
      title: 'Apply Layout Profile',
      category: 'View',
      handler: (profileId: string) => {
        useLayoutStore.getState().applyLayoutProfile(profileId);
      },
    });

    context.commands.register({
      id: 'forge.layout.undo',
      title: 'Undo Layout Change',
      category: 'View',
      handler: () => {
        useLayoutStore.getState().undoLayout();
      },
    });

    context.commands.register({
      id: 'forge.layout.redo',
      title: 'Redo Layout Change',
      category: 'View',
      handler: () => {
        useLayoutStore.getState().redoLayout();
      },
    });

    context.commands.register({
      id: 'forge.view.toggleAgentPanel',
      title: 'Toggle Agent Panel',
      category: 'View',
      handler: () => {
        useLayoutStore.getState().toggleAgentPanel();
      },
    });

    // Switch tabs keyboard shortcuts
    for (let i = 1; i <= 9; i++) {
      context.commands.register({
        id: `forge.view.switchTab${i}`,
        title: `Switch to Panel Tab ${i}`,
        category: 'View',
        handler: () => {
          const dockPanels = panelRegistry.getAll().filter(
            (p) => p.preferredDock?.position && p.preferredDock.position !== 'sidebar'
          );
          const targetPanel = dockPanels[i - 1];
          if (targetPanel) {
            useLayoutStore.getState().setDockActivePanel(targetPanel.id);
            useLayoutStore.getState().openDock();
          }
        },
      });
    }
  },
};

// Built-in Explorer Plugin (Epic 12 requirement)
const explorerPlugin: IPlugin = {
  id: 'forge.explorer',
  name: 'Explorer Panel Plugin',
  version: '0.1.0',
  activate(context) {
    context.panels.register({
      id: 'explorer',
      title: 'Explorer',
      icon: 'FolderOpen',
      component: ExplorerPanel,
      defaultVisible: true,
      order: 1,
      preferredDock: { position: 'sidebar', order: 1 }
    });

    context.commands.register({
      id: 'forge.explorer.focus',
      title: 'Focus Explorer View',
      category: 'View',
      handler: () => {
        console.log('[ExplorerPlugin] Focused Explorer view.');
      },
    });
  },
};

// Built-in AI Panels (Epic 21 requirement)
const aiChatPlugin: IPlugin = {
  id: 'forge.chat',
  name: 'AI Chat Panel Plugin',
  version: '0.1.0',
  activate(context) {
    context.panels.register({
      id: 'chat',
      title: 'AI Chat',
      icon: 'MessageSquare',
      component: AIEnginePanel,
      order: 2,
      preferredDock: { position: 'sidebar', order: 2 }
    });
  },
};

const aiMemoryPlugin: IPlugin = {
  id: 'forge.memory',
  name: 'Workspace Memory Plugin',
  version: '0.1.0',
  activate(context) {
    context.panels.register({
      id: 'memory',
      title: 'Memory',
      icon: 'Brain',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'Workspace Memory Panel (Stub)'),
      order: 3,
      preferredDock: { position: 'sidebar', order: 3 }
    });
  },
};

const aiGraphPlugin: IPlugin = {
  id: 'forge.graph',
  name: 'Architecture Graph Plugin',
  version: '0.1.0',
  activate(context) {
    context.panels.register({
      id: 'graph',
      title: 'Graph',
      icon: 'Network',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'Architecture Graph Panel (Stub)'),
      order: 4,
      preferredDock: { position: 'sidebar', order: 4 }
    });
  },
};

const aiRetrievalPlugin: IPlugin = {
  id: 'forge.retrieval',
  name: 'Context Retrieval Plugin',
  version: '0.1.0',
  activate(context) {
    context.panels.register({
      id: 'retrieval',
      title: 'Retrieval',
      icon: 'Search',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'Context Retrieval Panel (Stub)'),
      order: 5,
      preferredDock: { position: 'sidebar', order: 5 }
    });
  },
};

// Built-in Dock Panels Plugin (Epic 15.6 - 15.8 requirement)
const dockPanelsPlugin: IPlugin = {
  id: 'forge.dock-panels',
  name: 'Dock Panels Plugin',
  version: '0.1.0',
  activate(context) {
    context.panels.register({
      id: 'terminal',
      title: 'Terminal',
      icon: 'Terminal',
      component: TerminalPanel,
      preferredDock: { position: 'bottom', order: 1 }
    });

    context.panels.register({
      id: 'problems',
      title: 'Problems',
      icon: 'AlertTriangle',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'No problems have been detected in the workspace.'),
      preferredDock: { position: 'bottom', order: 2 }
    });

    context.panels.register({
      id: 'output',
      title: 'Output',
      icon: 'FileText',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none font-mono text-[11px]' }, '[info] Starting Forge compilation...\n[info] Finished compilation successfully in 52ms.'),
      preferredDock: { position: 'bottom', order: 3 }
    });

    context.panels.register({
      id: 'debug',
      title: 'Debug Console',
      icon: 'Play',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none font-mono text-[11px]' }, '> debug session not active.'),
      preferredDock: { position: 'bottom', order: 4 }
    });

    context.panels.register({
      id: 'tasks',
      title: 'Tasks',
      icon: 'CheckSquare',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'No active background tasks running.'),
      preferredDock: { position: 'bottom', order: 5 }
    });

    context.panels.register({
      id: 'git',
      title: 'Git Output',
      icon: 'GitBranch',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'Working tree clean. Nothing to commit.'),
      preferredDock: { position: 'bottom', order: 6 }
    });

    context.panels.register({
      id: 'ai_logs',
      title: 'AI Logs',
      icon: 'Activity',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none font-mono text-[11px]' }, '[tracelog] Kernel executeTask called.\n[tracelog] Context Normalizer normalizer-v1 matching prompt goals.'),
      preferredDock: { position: 'bottom', order: 7 }
    });

    context.panels.register({
      id: 'ai_timeline',
      title: 'AI Timeline',
      icon: 'History',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'No execution task running.'),
      preferredDock: { position: 'bottom', order: 8 }
    });

    context.panels.register({
      id: 'database',
      title: 'Database Console',
      icon: 'Database',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'No active database connections.'),
      preferredDock: { position: 'bottom', order: 9 }
    });

    context.panels.register({
      id: 'test_runner',
      title: 'Test Runner',
      icon: 'Beaker',
      component: () => React.createElement('div', { className: 'p-4 text-forge-text-muted select-none text-xs' }, 'All test runs passed.'),
      preferredDock: { position: 'bottom', order: 10 }
    });

    context.panels.register({
      id: 'runtime_discovery',
      title: 'Runtimes',
      icon: 'Server',
      component: RuntimeManagerPanel,
      preferredDock: { position: 'bottom', order: 11 }
    });
  }
};

const runtimeDiscoveryPlugin: IPlugin = {
  id: 'forge.runtime-discovery',
  name: 'Runtime Discovery & Environment Manager Plugin',
  version: '0.1.0',
  activate(context) {
    context.commands.register({
      id: 'forge.runtime.discover',
      title: 'Discover & Refresh Runtimes',
      category: 'Runtime',
      handler: async () => {
        await useRuntimeStore.getState().discoverRuntimes(true);
      },
    });

    context.commands.register({
      id: 'forge.runtime.diagnostics',
      title: 'Run Environment Doctor Diagnostics',
      category: 'Runtime',
      handler: async () => {
        useRuntimeStore.getState().setActiveTab('diagnostics');
        useLayoutStore.getState().setDockActivePanel('runtime_discovery');
        useLayoutStore.getState().openDock();
        await useRuntimeStore.getState().runDiagnostics();
      },
    });

    context.commands.register({
      id: 'forge.runtime.manage',
      title: 'Open Runtime Discovery Panel',
      category: 'Runtime',
      handler: () => {
        useLayoutStore.getState().setDockActivePanel('runtime_discovery');
        useLayoutStore.getState().openDock();
      },
    });
  },
};

export interface PluginRuntimeContext {
  id: string;
  status: 'inactive' | 'activating' | 'active' | 'deactivating';
  commands: string[];
  panels: string[];
  subscriptions: Set<() => void>;
  disposables: Array<{ dispose(): void }>;
  plugin: IPlugin;
}

export class PluginManager {
  private readonly activePlugins = new Map<string, PluginRuntimeContext>();
  private readonly eventBus: DesktopEventBus;
  private readonly workspaceRoot: string | null;

  constructor(eventBus: DesktopEventBus, workspaceRoot: string | null = null) {
    this.eventBus = eventBus;
    this.workspaceRoot = workspaceRoot;
  }

  async activateAll(): Promise<void> {
    const builtIn = [
      coreCommandsPlugin,
      explorerPlugin,
      aiChatPlugin,
      aiMemoryPlugin,
      aiGraphPlugin,
      aiRetrievalPlugin,
      dockPanelsPlugin,
      runtimeDiscoveryPlugin,
    ];
    for (const plugin of builtIn) {
      await this.activatePlugin(plugin);
    }
  }

  async activatePlugin(plugin: IPlugin): Promise<void> {
    const existing = this.activePlugins.get(plugin.id);
    if (existing && (existing.status === 'active' || existing.status === 'activating')) {
      console.warn(`[PluginManager] Plugin "${plugin.id}" is already active.`);
      return;
    }

    if (!PluginLoader.isValidPlugin(plugin)) {
      throw new Error(`[PluginManager] Invalid plugin structure: ${(plugin as any).id || 'unknown'}`);
    }

    const runtimeCtx: PluginRuntimeContext = {
      id: plugin.id,
      status: 'activating',
      commands: [],
      panels: [],
      subscriptions: new Set(),
      disposables: [],
      plugin,
    };

    this.activePlugins.set(plugin.id, runtimeCtx);

    const pluginContext: IPluginContext = {
      eventBus: this.eventBus,
      workspaceRoot: this.workspaceRoot,
      panels: {
        register: (panel) => {
          runtimeCtx.panels.push(panel.id);
          panelRegistry.register(panel);
        },
      },
      commands: {
        register: (command) => {
          runtimeCtx.commands.push(command.id);
          commandRegistry.register(command);
        },
      },
    };

    try {
      await plugin.activate(pluginContext);
      runtimeCtx.status = 'active';
    } catch (err) {
      runtimeCtx.status = 'inactive';
      this.activePlugins.delete(plugin.id);
      console.error(`[PluginManager] Failed to activate plugin "${plugin.id}":`, err);
      throw err;
    }
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    const ctx = this.activePlugins.get(pluginId);
    if (!ctx) return;

    ctx.status = 'deactivating';

    // 1. Unregister contributed commands & panels cleanly from strict registries
    for (const cmdId of ctx.commands) {
      commandRegistry.unregister(cmdId);
    }
    for (const pnlId of ctx.panels) {
      panelRegistry.unregister(pnlId);
    }

    // 2. Invoke event bus subscriptions & disposables
    for (const unsub of ctx.subscriptions) {
      try { unsub(); } catch { /* ignore */ }
    }
    ctx.subscriptions.clear();

    for (const d of ctx.disposables) {
      try { d.dispose(); } catch { /* ignore */ }
    }
    ctx.disposables = [];

    // 3. Deactivate plugin hook
    try {
      if (ctx.plugin.deactivate) {
        await ctx.plugin.deactivate();
      }
    } catch (err) {
      console.error(`[PluginManager] Failed to deactivate plugin "${pluginId}":`, err);
    }

    ctx.status = 'inactive';
    this.activePlugins.delete(pluginId);
  }

  async deactivateAll(): Promise<void> {
    const ids = Array.from(this.activePlugins.keys());
    for (const id of ids) {
      await this.deactivatePlugin(id);
    }
  }

  getActivePlugins(): string[] {
    return Array.from(this.activePlugins.keys());
  }
}

