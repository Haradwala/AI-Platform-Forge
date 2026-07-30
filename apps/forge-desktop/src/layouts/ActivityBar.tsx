import React from 'react';
import * as Lucide from 'lucide-react';
import { panelRegistry } from '../plugins/panel-registry';
import { useLayoutStore } from '../stores/layout-store';
import { CommandService } from '../commands/command-service';

export const ActivityBar: React.FC = () => {
  const { layout, setActivePanel, toggleAgentPanel } = useLayoutStore();
  
  const panels = panelRegistry.getAll().filter(
    (p) => !p.preferredDock?.position || p.preferredDock.position === 'sidebar'
  );

  const activePanelId = layout.sidebar.activePanelId;
  const isTerminalVisible = layout.dock.dockState !== 'collapsed';
  const isAgentVisible = layout.agentPanel.visible;

  const handleIconClick = (panelId: string) => {
    if (activePanelId === panelId) {
      setActivePanel(null); // Collapse sidebar
    } else {
      setActivePanel(panelId); // Expand and switch
    }
  };

  return React.createElement(
    'div',
    {
      className: 'w-12 h-full flex flex-col items-center justify-between border-r border-forge-border bg-forge-bg-elevated py-4 select-none',
      id: 'forge-activity-sidebar'
    },
    React.createElement(
      'div',
      { className: 'flex flex-col items-center gap-4 w-full' },
      panels.map((panel) => {
        const IconComponent = (Lucide as any)[panel.icon] || Lucide.HelpCircle;
        const isActive = activePanelId === panel.id;

        return React.createElement(
          'button',
          {
            key: panel.id,
            onClick: () => handleIconClick(panel.id),
            title: panel.title,
            className: `w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 relative group ${
              isActive
                ? 'text-forge-accent bg-forge-bg-active'
                : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover'
            }`,
          },
          React.createElement(IconComponent, { size: 20 }),
          // Left indicators
          isActive &&
            React.createElement('div', {
              className: 'absolute left-0 top-2 bottom-2 w-[3px] bg-forge-accent rounded-r-md',
            })
        );
      })
    ),
    // Bottom bar actions (like Settings/Help)
    React.createElement(
      'div',
      { className: 'flex flex-col items-center gap-4' },
      React.createElement(
        'button',
        {
          title: 'Toggle Terminal (Ctrl+`)',
          onClick: () => CommandService.execute('forge.view.toggleTerminal'),
          className: `w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 group hover:bg-forge-bg-hover ${
            isTerminalVisible
              ? 'text-forge-accent bg-forge-bg-active'
              : 'text-forge-text-muted hover:text-forge-text'
          }`,
        },
        React.createElement(Lucide.Terminal, { size: 20 })
      ),
      // Agent Panel toggle
      React.createElement(
        'button',
        {
          id: 'forge-activity-agent',
          title: 'Toggle Agent Panel',
          onClick: toggleAgentPanel,
          className: `w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 relative group hover:bg-forge-bg-hover ${
            isAgentVisible
              ? 'text-forge-accent bg-forge-bg-active'
              : 'text-forge-text-muted hover:text-forge-text'
          }`,
        },
        React.createElement(Lucide.Sparkles, { size: 20 }),
        isAgentVisible &&
          React.createElement('div', {
            className: 'absolute left-0 top-2 bottom-2 w-[3px] bg-forge-accent rounded-r-md',
          })
      ),
      React.createElement(
        'button',
        {
          title: 'Settings',
          className: 'w-10 h-10 flex items-center justify-center rounded-lg text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-all duration-150',
        },
        React.createElement(Lucide.Settings, { size: 20 })
      )
    )
  );
};

export default ActivityBar;
