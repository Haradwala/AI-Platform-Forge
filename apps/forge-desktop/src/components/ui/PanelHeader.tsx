import React from 'react';

export interface PanelHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  icon,
  actions,
  onClose,
  className = '',
}) => {
  return (
    <div
      className={`h-9 px-3 flex items-center justify-between border-b border-forge-border bg-forge-bg-elevated text-xs select-none ${className}`}
    >
      <div className="flex items-center gap-2 font-medium text-forge-text truncate">
        {icon && <span className="text-forge-text-muted flex-shrink-0">{icon}</span>}
        <span className="truncate">{title}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {actions}
        {onClose && (
          <button
            onClick={onClose}
            title="Close panel"
            className="p-1 rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default PanelHeader;
