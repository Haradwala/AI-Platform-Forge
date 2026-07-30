/**
 * DockTabs.tsx — Sleek Glassmorphism Tab Bar for WorkbenchDock
 */

import React from 'react';
import { useDockStore } from './DockStore';
import { DockRegistry } from './DockRegistry';

export const DockTabs: React.FC = () => {
  const { activeTabId, setActiveTab, snapPoint, setSnapPoint, dockMode, setDockMode } = useDockStore();
  const registeredPanels = DockRegistry.getAll();

  const handleSnapClick = (targetSnap: 'peek' | 'quarter' | 'half' | 'threeQuarter' | 'full') => {
    setSnapPoint(targetSnap, window.innerHeight);
  };

  const toggleFloatingMode = () => {
    const nextMode = dockMode === 'floating' ? 'bottom' : 'floating';
    setDockMode(nextMode);
  };

  return React.createElement(
    'div',
    {
      className:
        'h-9 px-3 flex items-center justify-between border-b border-white/10 bg-[#121319]/80 backdrop-blur-md select-none min-w-0',
    },
    // Left: Panel Tabs
    React.createElement(
      'div',
      { className: 'flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0' },
      registeredPanels.map((panel) => {
        const isActive = activeTabId === panel.id;
        return React.createElement(
          'button',
          {
            key: panel.id,
            onClick: () => setActiveTab(panel.id),
            className: `h-7 px-3 rounded-md text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${
              isActive
                ? 'bg-forge-accent/20 text-forge-accent border border-forge-accent/40 shadow-sm'
                : 'text-forge-text-muted hover:text-forge-text hover:bg-white/5'
            }`,
          },
          React.createElement('span', null, panel.title),
          panel.badgeCount !== undefined && panel.badgeCount > 0
            ? React.createElement(
                'span',
                { className: 'px-1.5 py-0.2 rounded-full text-[10px] bg-forge-accent text-white font-semibold' },
                panel.badgeCount
              )
            : null
        );
      })
    ),
    // Right: Dock Controls (Snap & Floating mode)
    React.createElement(
      'div',
      { className: 'flex items-center gap-1 shrink-0 text-forge-text-muted' },
      React.createElement(
        'button',
        {
          onClick: () => handleSnapClick(snapPoint === 'peek' ? 'quarter' : 'peek'),
          className: 'h-6 px-2 rounded text-[11px] hover:bg-white/10 transition-colors',
          title: 'Toggle Peek / Quarter height',
        },
        snapPoint === 'peek' ? 'Expand' : 'Peek'
      ),
      React.createElement(
        'button',
        {
          onClick: () => handleSnapClick('half'),
          className: `h-6 px-2 rounded text-[11px] transition-colors ${
            snapPoint === 'half' ? 'text-forge-accent font-semibold' : 'hover:bg-white/10'
          }`,
          title: 'Snap 50%',
        },
        '50%'
      ),
      React.createElement(
        'button',
        {
          onClick: () => handleSnapClick('threeQuarter'),
          className: `h-6 px-2 rounded text-[11px] transition-colors ${
            snapPoint === 'threeQuarter' ? 'text-forge-accent font-semibold' : 'hover:bg-white/10'
          }`,
          title: 'Snap 70%',
        },
        '70%'
      ),
      React.createElement(
        'button',
        {
          onClick: toggleFloatingMode,
          className: `h-6 px-2 rounded text-[11px] transition-colors ${
            dockMode === 'floating'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'hover:bg-white/10'
          }`,
          title: 'Toggle Floating Window Mode',
        },
        dockMode === 'floating' ? 'Docked' : 'Float'
      )
    )
  );
};
