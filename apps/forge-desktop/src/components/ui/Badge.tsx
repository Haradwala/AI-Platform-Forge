import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'running' | 'pending' | 'neutral';
  pulse?: boolean;
  size?: 'xs' | 'sm';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  pulse = false,
  size = 'xs',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    running: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    pending: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    neutral: 'bg-forge-bg-hover text-forge-text-muted border-forge-border',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    running: 'bg-indigo-400',
    pending: 'bg-slate-400',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border uppercase tracking-wider ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
