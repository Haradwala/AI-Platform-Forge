/**
 * StatusBadge.tsx — Phase 2
 *
 * Compact status indicator used in InboxStrip pills and RunTimeline headers.
 * Renders a coloured dot (with pulse animation for 'running') + optional label.
 */

import React from 'react';
import type { RunStatus, StageStatus } from '../../../types/agent';

type AnyStatus = RunStatus | StageStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  /** Show text label alongside the dot. Defaults to false. */
  showLabel?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<AnyStatus, { dot: string; label: string; pulse: boolean }> = {
  running:   { dot: 'bg-emerald-400',   label: 'Running',   pulse: true  },
  waiting:   { dot: 'bg-amber-400',     label: 'Waiting',   pulse: false },
  completed: { dot: 'bg-emerald-500',   label: 'Completed', pulse: false },
  failed:    { dot: 'bg-red-500',       label: 'Failed',    pulse: false },
  cancelled: { dot: 'bg-forge-text-subtle', label: 'Cancelled', pulse: false },
  pending:   { dot: 'bg-forge-text-subtle', label: 'Pending',   pulse: false },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showLabel = false, className = '' }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return React.createElement(
    'span',
    { className: `inline-flex items-center gap-1.5 ${className}` },
    // Dot
    React.createElement(
      'span',
      { className: 'relative flex h-2 w-2 flex-shrink-0' },
      cfg.pulse && React.createElement('span', {
        className: `animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60`,
      }),
      React.createElement('span', {
        className: `relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`,
      })
    ),
    // Optional label
    showLabel && React.createElement(
      'span',
      { className: 'text-xs text-forge-text-muted' },
      cfg.label
    )
  );
};

export default StatusBadge;
