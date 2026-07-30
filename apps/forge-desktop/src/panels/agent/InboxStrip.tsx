/**
 * InboxStrip.tsx — Phase 2
 *
 * Horizontally scrollable strip of AgentRun pills sitting at the top of the
 * Agent Panel. Each pill shows:
 *   - Status dot (pulsing for 'running')
 *   - Run title (truncated)
 *   - Runtime badge
 *   - Elapsed / total duration
 *
 * Clicking a pill calls setActiveRun; the active pill is highlighted.
 *
 * Phase 4 note: runs are currently created manually (run-store.createRun).
 * The IPC bridge in Phase 4 will call createRun on PIPELINE_STARTED events.
 */

import React from 'react';
import * as Lucide from 'lucide-react';
import { useRunStore } from '../../stores/run-store';
import { StatusBadge } from './components/StatusBadge';
import type { AgentRun } from '../../types/agent';

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDuration(run: AgentRun): string {
  const end = run.endTime ?? Date.now();
  const ms = end - run.startTime;
  if (ms < 1000)  return '<1s';
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  const m = Math.floor(ms / 60000);
  const s = Math.round((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

// ── Single Run Pill ────────────────────────────────────────────────────────────

interface RunPillProps {
  run: AgentRun;
  isActive: boolean;
  onClick: () => void;
}

const RunPill: React.FC<RunPillProps> = ({ run, isActive, onClick }) => {
  return React.createElement(
    'button',
    {
      key: run.id,
      onClick,
      title: `${run.title} — ${run.runtimeId} / ${run.modelId}`,
      'aria-pressed': isActive,
      className: [
        'animate-pill-pop flex-shrink-0 flex flex-col gap-0.5 px-3 py-2 rounded-lg border transition-all duration-150 text-left min-w-[140px] max-w-[180px]',
        isActive
          ? 'border-forge-accent/60 bg-forge-accent/10 text-forge-text'
          : 'border-forge-border bg-forge-bg text-forge-text-muted hover:bg-forge-bg-hover hover:text-forge-text',
      ].join(' '),
    },
    // Row 1: status dot + title
    React.createElement(
      'div',
      { className: 'flex items-center gap-1.5 w-full overflow-hidden' },
      React.createElement(StatusBadge, { status: run.status }),
      React.createElement(
        'span',
        { className: 'text-xs font-medium truncate flex-1' },
        run.title
      )
    ),
    // Row 2: runtime badge + duration
    React.createElement(
      'div',
      { className: 'flex items-center gap-1.5' },
      React.createElement(
        'span',
        {
          className: 'text-[10px] px-1.5 py-px rounded bg-forge-bg-active text-forge-text-muted border border-forge-border',
        },
        run.runtimeId
      ),
      React.createElement(
        'span',
        { className: 'text-[10px] text-forge-text-subtle' },
        formatDuration(run)
      )
    )
  );
};

// ── InboxStrip ─────────────────────────────────────────────────────────────────

export const InboxStrip: React.FC = () => {
  const { runs, activeRunId, setActiveRun, clearRuns } = useRunStore();

  // ── Empty state ────────────────────────────────────────────────────────────
  if (runs.length === 0) {
    return React.createElement(
      'div',
      {
        id: 'forge-agent-inbox',
        className:
          'flex-shrink-0 h-[72px] border-b border-forge-border flex items-center justify-center gap-2 text-forge-text-subtle text-xs',
      },
      React.createElement(Lucide.Inbox, { size: 13, className: 'opacity-40' }),
      React.createElement('span', { className: 'opacity-40' }, 'No runs yet')
    );
  }

  return React.createElement(
    'div',
    {
      id: 'forge-agent-inbox',
      role: 'toolbar',
      'aria-label': 'Run Inbox',
      className:
        'flex-shrink-0 border-b border-forge-border bg-forge-bg flex flex-col',
    },
    // Strip header
    React.createElement(
      'div',
      { className: 'flex items-center justify-between px-3 pt-2 pb-1' },
      React.createElement(
        'span',
        { className: 'text-[10px] font-semibold uppercase tracking-wider text-forge-text-subtle' },
        `Runs · ${runs.length}`
      ),
      React.createElement(
        'button',
        {
          onClick: clearRuns,
          title: 'Clear all runs',
          className: 'text-forge-text-subtle hover:text-forge-text-muted transition-colors',
        },
        React.createElement(Lucide.Trash2, { size: 11 })
      )
    ),
    // Horizontally scrollable pill row
    React.createElement(
      'div',
      {
        className: 'flex gap-2 px-3 pb-2.5 overflow-x-auto',
        style: { scrollbarWidth: 'none' },
      },
      ...runs.map((run) =>
        React.createElement(RunPill, {
          key: run.id,
          run,
          isActive: run.id === activeRunId,
          onClick: () => setActiveRun(run.id === activeRunId ? null : run.id),
        })
      )
    )
  );
};

export default InboxStrip;
