import React from 'react';
import * as Lucide from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store';

export const EditorTabs: React.FC = () => {
  const { tabs, activeTabPath, setActiveTab, closeFile } = useEditorStore();

  if (tabs.length === 0) return null;

  return React.createElement(
    'div',
    { className: 'h-9 w-full flex items-center bg-forge-bg-elevated border-b border-forge-border overflow-x-auto select-none scrollbar-none' },
    tabs.map((tab) => {
      const isActive = activeTabPath === tab.path;

      return React.createElement(
        'div',
        {
          key: tab.path,
          onClick: () => setActiveTab(tab.path),
          className: `h-full px-4 flex items-center gap-2 border-r border-forge-border cursor-pointer transition-colors relative ${
            isActive
              ? 'bg-forge-bg text-forge-text font-medium'
              : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover'
          }`,
        },
        React.createElement('span', { className: 'text-xs truncate max-w-[120px]' }, tab.name),
        // Close button or dirty indicator
        React.createElement(
          'button',
          {
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              closeFile(tab.path);
            },
            className: 'w-4 h-4 flex items-center justify-center rounded hover:bg-forge-bg-active text-forge-text-muted hover:text-forge-text transition-colors',
          },
          tab.isDirty
            ? React.createElement(Lucide.Dot, { size: 16, className: 'text-forge-accent' })
            : React.createElement(Lucide.X, { size: 10 })
        ),
        // Top active indicator line
        isActive &&
          React.createElement('div', {
            className: 'absolute top-0 left-0 right-0 h-[2px] bg-forge-accent',
          })
      );
    })
  );
};

export default EditorTabs;
