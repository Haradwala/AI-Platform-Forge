import React, { useEffect, useState } from 'react';
import * as Lucide from 'lucide-react';
import { useWorkspaceStore } from '../stores/workspace-store';

export const StatusBar: React.FC = () => {
  const { rootPath } = useWorkspaceStore();
  const [startupStage, setStartupStage] = useState('loading');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.forge) {
      window.forge.invoke('system:get-startup-stage').then((stage: any) => {
        setStartupStage(stage as string);
      });

      const unsubscribe = window.forge.on('startup:stage-changed', (data: any) => {
        if (data && typeof data === 'object' && 'stage' in data) {
          setStartupStage(data.stage);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  return React.createElement(
    'div',
    {
      className: 'h-6 w-full flex items-center justify-between border-t border-forge-border bg-forge-bg-elevated px-4 text-xs text-forge-text-muted select-none',
      id: 'forge-statusbar'
    },
    // Left section
    React.createElement(
      'div',
      { className: 'flex items-center gap-4' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-1 text-forge-accent font-medium' },
        React.createElement(Lucide.Activity, { size: 12 }),
        React.createElement('span', null, `Status: ${startupStage}`)
      ),
      rootPath &&
        React.createElement(
          'div',
          { className: 'flex items-center gap-1' },
          React.createElement(Lucide.Folder, { size: 12 }),
          React.createElement('span', null, rootPath)
        )
    ),
    // Right section
    React.createElement(
      'div',
      { className: 'flex items-center gap-4' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-1' },
        React.createElement(Lucide.Wifi, { size: 12 }),
        React.createElement('span', null, 'Connected')
      ),
      React.createElement('span', null, 'UTF-8'),
      React.createElement('span', null, 'TypeScript')
    )
  );
};

export default StatusBar;
