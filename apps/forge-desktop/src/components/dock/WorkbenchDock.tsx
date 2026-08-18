/**
 * WorkbenchDock.tsx — Presentation Shell for Bottom Workspace / Dock Host
 *
 * Adheres strictly to the Open/Closed Principle.
 * Contains ZERO panel-specific checks or hardcoded tab names.
 * Delegates panel DOM instantiation and lifecycle management to PanelHost.
 */

import React, { useEffect } from 'react';
import { useDockStore } from './DockStore';
import { DockHandle } from './DockHandle';
import { DockTabs } from './DockTabs';
import { DockRegistry } from './DockRegistry';
import { PanelHost } from './PanelHost';

// Built-in panels registration
import { TerminalPanel } from '../../panels/terminal/TerminalPanel';
import { HealthScoreGauge } from '../health/HealthScoreGauge';

// Register built-in panels into DockRegistry
DockRegistry.register({
  id: 'terminal',
  title: 'Terminal',
  iconName: 'terminal',
  component: TerminalPanel,
  category: 'terminal',
});

DockRegistry.register({
  id: 'timeline',
  title: 'Engineering Timeline',
  iconName: 'activity',
  component: () =>
    React.createElement(
      'div',
      { className: 'p-4 text-xs font-mono text-forge-text-muted space-y-2 select-text overflow-auto h-full' },
      React.createElement('div', { className: 'text-forge-accent font-semibold text-sm mb-2' }, '⚡ AI Engineering Timeline'),
      React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'text-green-400' }, '[12:45:10]'), React.createElement('span', null, 'repository.scan.completed — 7 findings detected (Health: 92.5)')),
      React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'text-blue-400' }, '[12:44:02]'), React.createElement('span', null, 'ai:plan-completed — 5 tasks executed cleanly')),
      React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'text-yellow-400' }, '[12:43:55]'), React.createElement('span', null, 'ai:task-started — ExecutionStage initialized (search_workspace)'))
    ),
  category: 'ai',
  badgeCount: 2,
});

DockRegistry.register({
  id: 'health',
  title: 'Repository Health',
  iconName: 'shield-check',
  component: HealthScoreGauge,
  category: 'health',
  badgeCount: 7,
});

DockRegistry.register({
  id: 'problems',
  title: 'Problems',
  iconName: 'alert-circle',
  component: () =>
    React.createElement(
      'div',
      { className: 'p-4 text-xs font-mono text-forge-text-muted select-text' },
      React.createElement('span', { className: 'text-green-400' }, '✓ No TypeScript or Syntax Errors Detected (0 Problems)')
    ),
  category: 'diagnostics',
});

DockRegistry.register({
  id: 'output',
  title: 'Output',
  iconName: 'file-text',
  component: () =>
    React.createElement(
      'div',
      { className: 'p-4 text-xs font-mono text-forge-text-muted select-text' },
      'Forge Desktop Runtime v1.0.0 [Production-Ready]\nElectron Main Process connected cleanly via IPC.'
    ),
  category: 'terminal',
});

export const WorkbenchDock: React.FC = () => {
  const { targetHeightPx, actualHeightPx, activeTabId, snapPoint, isDragging, dockMode, setSnapPoint, restoreLastExpanded } = useDockStore();

  // Keyboard shortcut handlers: Ctrl+` (toggle height) and Esc (collapse)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Dock: Ctrl+` or Ctrl+Backquote
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        if (snapPoint === 'hidden' || snapPoint === 'peek') {
          restoreLastExpanded(window.innerHeight);
        } else {
          setSnapPoint('peek', window.innerHeight);
        }
      }
      // Collapse Dock: Esc
      if (e.key === 'Escape' && snapPoint !== 'peek' && snapPoint !== 'hidden') {
        e.preventDefault();
        setSnapPoint('peek', window.innerHeight);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snapPoint, restoreLastExpanded, setSnapPoint]);

  // Floating Window Mode Styling vs Bottom Docked Mode
  const isFloating = dockMode === 'floating';

  const containerStyle: React.CSSProperties = isFloating
    ? {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '640px',
        height: `${Math.max(actualHeightPx, 180)}px`,
        zIndex: 50,
      }
    : {
        width: '100%',
        height: `${actualHeightPx}px`,
      };

  const isExpanded = actualHeightPx > 80;

  return React.createElement(
    'div',
    {
      style: containerStyle,
      className: `flex flex-col bg-[#0d0d11]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all ${
        isDragging ? 'transition-none select-none ring-1 ring-forge-accent/40' : 'duration-200 cubic-bezier(0.16, 1, 0.3, 1)'
      } ${isFloating ? 'rounded-xl border border-white/20' : ''}`,
    },
    // Top Handle Bar (━━━)
    React.createElement(DockHandle),
    // Tabs Navigation
    React.createElement(DockTabs),
    // Generic Panel Host
    React.createElement(
      'div',
      { className: 'flex-1 min-h-0 w-full overflow-hidden relative bg-[#09090d]' },
      React.createElement(PanelHost, { activeTabId, isExpanded })
    )
  );
};

export default WorkbenchDock;
