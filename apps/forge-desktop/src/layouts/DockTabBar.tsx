import React from 'react';
import * as Lucide from 'lucide-react';
import { panelRegistry } from '../plugins/panel-registry';
import { useLayoutStore } from '../stores/layout-store';

export const DockTabBar: React.FC = () => {
  const { layout, setDockActivePanel, closeDock, setDockPosition, setDockState } = useLayoutStore();

  const dockPanels = panelRegistry.getAll().filter(
    (p) => p.preferredDock?.position && p.preferredDock.position !== 'sidebar'
  );

  const activePanelId = layout.dock.activePanelId || (dockPanels[0]?.id ?? null);

  const handleTabClick = (panelId: string) => {
    if (layout.dock.dockState === 'collapsed') {
      setDockState('open');
    }
    setDockActivePanel(panelId);
  };

  const handleTogglePosition = () => {
    const current = layout.dock.position;
    const next = current === 'bottom' ? 'right' : current === 'right' ? 'left' : 'bottom';
    setDockPosition(next);
  };

  const handleToggleMaximize = () => {
    if (layout.dock.dockState === 'maximized') {
      setDockState('open');
    } else {
      setDockState('maximized');
    }
  };

  return React.createElement(
    'div',
    {
      className: 'h-9 w-full flex items-center justify-between border-b border-forge-border bg-forge-bg-elevated px-2 select-none relative',
    },
    // Left: Panel Tabs
    React.createElement(
      'div',
      { className: 'flex items-center gap-1 h-full' },
      dockPanels.map((panel) => {
        const Icon = (Lucide as any)[panel.icon] || Lucide.HelpCircle;
        const isActive = activePanelId === panel.id && layout.dock.dockState !== 'collapsed';

        return React.createElement(
          'button',
          {
            key: panel.id,
            onClick: () => handleTabClick(panel.id),
            className: `h-full px-3 flex items-center gap-1.5 text-xs transition-colors duration-150 border-b-2 font-medium relative group ${
              isActive
                ? 'text-forge-text border-forge-accent'
                : 'text-forge-text-muted border-transparent hover:text-forge-text'
            }`,
          },
          React.createElement(Icon, { size: 13 }),
          React.createElement('span', null, panel.title)
        );
      })
    ),
    // Right: Toolbar Controls
    React.createElement(
      'div',
      { className: 'flex items-center gap-1.5 text-forge-text-muted' },
      // Split Mock Icon
      React.createElement(
        'button',
        {
          title: 'Split Panel',
          className: 'p-1 hover:text-forge-text rounded transition-colors',
        },
        React.createElement(Lucide.Columns, { size: 14 })
      ),
      // Toggle Dock Position
      React.createElement(
        'button',
        {
          onClick: handleTogglePosition,
          title: `Position: ${layout.dock.position} (Click to toggle)`,
          className: 'p-1 hover:text-forge-text rounded transition-colors',
        },
        React.createElement(Lucide.Layout, { size: 14 })
      ),
      // Maximize/Restore Toggle
      React.createElement(
        'button',
        {
          onClick: handleToggleMaximize,
          title: layout.dock.dockState === 'maximized' ? 'Restore Panel Size' : 'Maximize Panel',
          className: 'p-1 hover:text-forge-text rounded transition-colors',
        },
        React.createElement(
          layout.dock.dockState === 'maximized' ? Lucide.Minimize2 : Lucide.Maximize2,
          { size: 14 }
        )
      ),
      // Close Panel
      React.createElement(
        'button',
        {
          onClick: closeDock,
          title: 'Close Panel (Ctrl+`)',
          className: 'p-1 hover:text-forge-text rounded hover:bg-red-500/20 transition-colors',
        },
        React.createElement(Lucide.X, { size: 14 })
      )
    )
  );
};
export default DockTabBar;
