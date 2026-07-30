import React from 'react';
import { useEditorStore } from '../../stores/editor-store';
import { EditorTabs } from './EditorTabs';
import { MonacoAdapter } from './MonacoAdapter';
import * as Lucide from 'lucide-react';

export const EditorPanel: React.FC = () => {
  const { tabs, activeTabPath } = useEditorStore();
  const activeTab = tabs.find((t) => t.path === activeTabPath);

  return React.createElement(
    'div',
    { className: 'w-full h-full flex flex-col bg-forge-editor-bg overflow-hidden' },
    React.createElement(EditorTabs),
    activeTab
      ? React.createElement(
          'div',
          { className: 'flex-1 min-h-0 w-full relative' },
          React.createElement(MonacoAdapter, { key: activeTab.path, tab: activeTab })
        )
      : React.createElement(
          'div',
          { className: 'flex-1 flex flex-col items-center justify-center text-forge-text-muted select-none gap-4 p-8' },
          React.createElement(Lucide.Code, { size: 36, className: 'opacity-40 animate-pulse' }),
          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement('div', { className: 'text-xs font-semibold' }, 'No Files Open'),
            React.createElement('div', { className: 'text-[11px] mt-1' }, 'Select a file from the explorer sidebar to begin editing.')
          )
        )
  );
};

export default EditorPanel;
