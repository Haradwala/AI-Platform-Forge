import React, { useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { useWorkspaceStore } from '../stores/workspace-store';
import { WorkspaceClient } from '../services/workspace-client';

export const WelcomeScreen: React.FC = () => {
  const { recentWorkspaces, loadRecentWorkspaces, openWorkspace, clearRecent } = useWorkspaceStore();

  useEffect(() => {
    loadRecentWorkspaces();
  }, []);

  const handleOpenFolder = async () => {
    if (typeof window === 'undefined' || !window.forge) {
      console.warn('[WelcomeScreen] forge API not available — not running in Electron.');
      return;
    }
    const folderPath = await WorkspaceClient.pickFolder();
    if (folderPath) {
      await openWorkspace(folderPath);
    }
  };

  return React.createElement(
    'div',
    {
      className: 'flex-1 h-full flex flex-col items-center justify-center bg-forge-bg text-forge-text selection:bg-forge-accent/30 select-none px-8 py-12',
      id: 'forge-welcome-screen'
    },
    React.createElement(
      'div',
      { className: 'max-w-2xl w-full flex flex-col items-center text-center gap-8' },
      // Sleek Logo/Icon
      React.createElement(
        'div',
        { className: 'w-20 h-20 rounded-2xl bg-gradient-to-tr from-forge-accent/80 to-purple-600 flex items-center justify-center shadow-lg shadow-forge-accent/20 animate-fade-in' },
        React.createElement(Lucide.Terminal, { size: 40, className: 'text-white' })
      ),

      // Premium Sleek Typography
      React.createElement(
        'div',
        { className: 'flex flex-col gap-2' },
        React.createElement(
          'h1',
          { className: 'text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-forge-text-muted bg-clip-text text-transparent' },
          'Welcome to Forge'
        ),
        React.createElement(
          'p',
          { className: 'text-sm text-forge-text-muted max-w-md mx-auto' },
          'An intelligent, interface-first development platform built for autonomous AI pair programming.'
        )
      ),

      // Layout split
      React.createElement(
        'div',
        { className: 'w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 text-left' },
        // Quick start actions
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-sm font-semibold uppercase tracking-wider text-forge-text-muted mb-2' }, 'Start'),
          React.createElement(
            'button',
            {
              onClick: handleOpenFolder,
              className: 'flex items-center gap-3 p-3 rounded-xl border border-forge-border hover:border-forge-accent/50 hover:bg-forge-bg-hover transition-all duration-150 group text-sm',
            },
            React.createElement(Lucide.FolderOpen, { size: 18, className: 'text-forge-accent group-hover:scale-110 transition-transform' }),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'font-medium' }, 'Open Folder...'),
              React.createElement('span', { className: 'text-xs text-forge-text-muted' }, 'Open an existing workspace folder')
            )
          )
        ),

        // Recent Workspaces
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between mb-2' },
            React.createElement('h3', { className: 'text-sm font-semibold uppercase tracking-wider text-forge-text-muted' }, 'Recent Workspaces'),
            recentWorkspaces.length > 0 &&
              React.createElement(
                'button',
                {
                  onClick: clearRecent,
                  className: 'text-xs text-red-400 hover:text-red-300 transition-colors',
                },
                'Clear'
              )
          ),
          recentWorkspaces.length === 0
            ? React.createElement(
                'div',
                { className: 'text-xs text-forge-text-muted border border-dashed border-forge-border rounded-xl p-6 text-center' },
                'No recent workspaces'
              )
            : React.createElement(
                'div',
                { className: 'flex flex-col gap-2 max-h-48 overflow-y-auto' },
                recentWorkspaces.map((wsPath) =>
                  React.createElement(
                    'button',
                    {
                      key: wsPath,
                      onClick: () => openWorkspace(wsPath),
                      className: 'flex items-center gap-2 p-2 rounded-lg hover:bg-forge-bg-hover text-left transition-colors text-xs border border-transparent hover:border-forge-border',
                    },
                    React.createElement(Lucide.Folder, { size: 14, className: 'text-forge-text-muted shrink-0' }),
                    React.createElement(
                      'div',
                      { className: 'truncate' },
                      React.createElement('div', { className: 'truncate font-medium' }, wsPath.split(/[\\/]/).pop()),
                      React.createElement('div', { className: 'truncate text-[10px] text-forge-text-muted' }, wsPath)
                    )
                  )
                )
              )
        )
      )
    )
  );
};

export default WelcomeScreen;
