import React from 'react';
import { ActivityBar } from './ActivityBar';
import { ResizablePanel } from '../components/ResizablePanel';
import { panelRegistry } from '../plugins/panel-registry';
import { useLayoutStore } from '../stores/layout-store';
import { EditorPanel } from '../panels/editor/EditorPanel';
import { DockHost } from './DockHost';
import { AgentPanelShell } from '../panels/agent/AgentPanelShell';
import { WorkbenchDock } from '../components/dock/WorkbenchDock';

export const WorkbenchLayoutManager: React.FC = () => {
  const { layout, setSidebarWidth } = useLayoutStore();

  const sidebarPanels = panelRegistry.getAll().filter(
    (p) => !p.preferredDock?.position || p.preferredDock.position === 'sidebar'
  );

  const activePanelId = layout.sidebar.activePanelId;
  const activePanel = activePanelId ? panelRegistry.getById(activePanelId) : null;

  // Render the center/editor layout area
  const renderEditorArea = () => {
    return React.createElement(
      'div',
      { className: 'flex-1 h-full min-w-0 bg-[#0f0f13] relative' },
      React.createElement(EditorPanel)
    );
  };

  // Render Sidebar panel container
  const renderSidebar = () => {
    if (!activePanel) return null;

    return React.createElement(
      ResizablePanel,
      {
        axis: 'x',
        resizeSide: 'right',
        width: layout.sidebar.width,
        onResize: setSidebarWidth,
      },
      React.createElement(
        'div',
        { className: 'w-full h-full border-r border-forge-border bg-forge-bg-elevated flex flex-col min-w-0' },
        // Sidebar Header
        React.createElement(
          'div',
          { className: 'h-10 px-4 flex items-center justify-between border-b border-forge-border' },
          React.createElement(
            'span',
            { className: 'text-xs font-semibold uppercase tracking-wider text-forge-text-muted' },
            activePanel.title
          )
        ),
        // Sidebar Content
        React.createElement(
          'div',
          { className: 'flex-1 overflow-auto min-w-0 min-h-0' },
          React.createElement(activePanel.component)
        )
      )
    );
  };

  // Assemble center layout pane (Sidebar + Editor Area + Agent Panel)
  const renderCenterArea = () => {
    return React.createElement(
      'div',
      { className: 'flex-1 flex min-w-0 h-full relative' },
      renderSidebar(),
      renderEditorArea(),
      React.createElement(AgentPanelShell)
    );
  };

  // Assemble dynamic workspace layout based on dock position
  const renderWorkbenchContent = () => {
    const isDockActive = layout.dock.dockState !== 'collapsed';
    const isBottom = layout.dock.position === 'bottom';
    const isLeft = layout.dock.position === 'left';
    const isRight = layout.dock.position === 'right';

    if (isBottom) {
      return React.createElement(
        'div',
        { className: 'flex-1 flex flex-col min-h-0 min-w-0' },
        // Top row
        React.createElement(
          'div',
          { className: 'flex-1 flex min-w-0 min-h-0 relative' },
          renderCenterArea()
        ),
        // Bottom Dock Workspace
        React.createElement(WorkbenchDock)
      );
    }

    // Row positions (left or right dock)
    return React.createElement(
      'div',
      { className: 'flex-1 flex min-w-0 h-full relative' },
      isDockActive && isLeft && React.createElement(DockHost),
      renderCenterArea(),
      isDockActive && isRight && React.createElement(DockHost)
    );
  };

  return React.createElement(
    'div',
    { className: 'flex-1 w-full flex min-h-0 relative' },
    // Activity Bar (always far left)
    React.createElement(ActivityBar),
    // Dynamic workbench content
    renderWorkbenchContent()
  );
};
export default WorkbenchLayoutManager;
