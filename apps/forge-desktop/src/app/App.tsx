import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../stores/workspace-store';
import { WelcomeScreen } from '../layouts/WelcomeScreen';
import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import { DesktopEventBus } from '../eventbus/desktop-eventbus';
import { DesktopEventBusContext } from '../hooks/useDesktopEvent';
import { PluginManager } from '../plugins/plugin-manager';
import { useThemeStore } from '../stores/theme-store';
import { useAgentBridge } from '../hooks/useAgentBridge';

import { WorkspaceClient } from '../services/workspace-client';
import { restoreSession } from '../services/session-helper';
import { CommandPalette } from '../components/CommandPalette';
import { CommandService } from '../commands/command-service';

import { FocusService } from '../services/focus-service';

// Module-level singletons to survive React StrictMode remount cycles in development
const globalEventBus = new DesktopEventBus();
FocusService.setEventBus(globalEventBus);
const globalPluginManager = new PluginManager(globalEventBus, null);
let activationPromise: Promise<void> | null = null;

/**
 * Root App Component.
 * Switches dynamically between WelcomeScreen and WorkspaceLayout based on
 * whether a workspace path is loaded in the WorkspaceStore.
 */
export const App: React.FC = () => {
  const { rootPath } = useWorkspaceStore();
  const { initializeTheme } = useThemeStore();
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  // Phase 4 — wire IPC ai:event stream → run-store
  useAgentBridge();

  useEffect(() => {
    // Initialize active theme
    initializeTheme();

    // 1. Fetch initial workspace state if already opened by Main Process
    WorkspaceClient.getTree().then((tree) => {
      if (tree) {
        useWorkspaceStore.setState({
          rootPath: tree.path,
          fileTree: tree,
        });
        restoreSession();
      }
    }).catch((err) => {
      console.error('[App] Failed to fetch initial workspace tree:', err);
    });

    // 2. Activate all plugins once and reuse the promise
    if (!activationPromise) {
      activationPromise = globalPluginManager.activateAll();
    }
    activationPromise.then(() => {
      setPluginsLoaded(true);
    });
  }, []);

  // 3. Centralized Keyboard Shortcuts & IPC Menu Listener routing via CommandService
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle Agent Panel: Ctrl+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        CommandService.execute('forge.view.toggleAgentPanel');
      }
      // Toggle Terminal: Ctrl+` (or Ctrl+Backquote)
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        CommandService.execute('forge.view.toggleTerminal');
      }
      // Toggle Command Palette: Ctrl+Shift+P or Cmd+Shift+P
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        CommandService.execute('forge.view.toggleCommandPalette');
      }
      // Switch Dock Tabs: Ctrl+1...9
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        CommandService.execute(`forge.view.switchTab${e.key}`);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    // Setup listener hooks for Electron native application menus
    let unsubTerminal: (() => void) | null = null;
    let unsubPalette: (() => void) | null = null;
    let unsubOpenFolder: (() => void) | null = null;

    if (typeof window !== 'undefined' && window.forge) {
      unsubTerminal = window.forge.on('menu:toggle-terminal', () => {
        CommandService.execute('forge.view.toggleTerminal');
      });
      unsubPalette = window.forge.on('menu:toggle-command-palette', () => {
        CommandService.execute('forge.view.toggleCommandPalette');
      });
      unsubOpenFolder = window.forge.on('menu:open-folder', () => {
        CommandService.execute('forge.workspace.openFolder');
      });
    }

    const unsubAiCommand = globalEventBus.on('ai:execute-command', (payload: any) => {
      const { commandId, args } = payload as { commandId: string; args: any[] };
      CommandService.execute(commandId, ...(args || []));
    });

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (unsubTerminal) unsubTerminal();
      if (unsubPalette) unsubPalette();
      if (unsubOpenFolder) unsubOpenFolder();
      unsubAiCommand();
    };
  }, []);

  if (!pluginsLoaded) {
    return React.createElement(
      'div',
      { className: 'w-screen h-screen flex items-center justify-center bg-forge-bg text-forge-text font-medium select-none' },
      'Loading Forge Plugins...'
    );
  }

  return React.createElement(
    DesktopEventBusContext.Provider,
    { value: globalEventBus },
    React.createElement(
      React.Fragment,
      null,
      rootPath ? React.createElement(WorkspaceLayout) : React.createElement(WelcomeScreen),
      React.createElement(CommandPalette)
    )
  );
};

export default App;
