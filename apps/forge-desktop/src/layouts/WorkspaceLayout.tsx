import React from 'react';
import { WorkbenchLayoutManager } from './WorkbenchLayoutManager';
import { StatusBar } from './StatusBar';

export const WorkspaceLayout: React.FC = () => {
  return React.createElement(
    'div',
    {
      className: 'w-full h-full flex flex-col bg-forge-bg text-forge-text overflow-hidden select-none',
      id: 'forge-workspace-layout',
    },
    React.createElement(WorkbenchLayoutManager),
    React.createElement(StatusBar)
  );
};

export default WorkspaceLayout;
