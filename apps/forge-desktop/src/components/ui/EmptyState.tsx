import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center rounded-lg border border-dashed border-forge-border/60 bg-forge-bg/40 ${className}`}
    >
      {icon && <div className="mb-2 text-forge-text-subtle">{icon}</div>}
      <h4 className="text-xs font-semibold text-forge-text mb-1">{title}</h4>
      {description && <p className="text-[11px] text-forge-text-muted max-w-xs mb-3">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
