import React from 'react';

interface DockPanelProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const DockPanel: React.FC<DockPanelProps> = ({ title, children }) => {
  return React.createElement(
    'div',
    {
      className: 'w-full h-full flex flex-col min-h-0 bg-[#0d0d11]',
      id: `dock-panel-${title.toLowerCase().replace(/\s+/g, '-')}`,
    },
    React.createElement(
      'div',
      { className: 'flex-1 min-h-0 overflow-hidden' },
      children
    )
  );
};
export default DockPanel;
