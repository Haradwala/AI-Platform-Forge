/**
 * RunTimeline.tsx — Phase 2
 *
 * The Engineering Timeline — the centrepiece of the Forge Agent Panel.
 *
 * Renders every pipeline stage of the active AgentRun in order, grouped by
 * phase. Each stage row shows: phase icon, stage name, status, duration.
 *
 * Phase grouping is visual only — stages are stored flat in the run's timeline
 * array and grouped on render.
 *
 * Extension seams:
 *   CARDS_SLOT — Phase 3 will render AgentCards after the timeline
 *   IPC_FEED   — Phase 4 will push stages into run-store via ai:event handlers
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { useRunStore, selectActiveRun } from '../../stores/run-store';
import { StatusBadge } from './components/StatusBadge';
import { CardRenderer } from './cards/CardRenderer';
import type { TimelineStage, StageStatus } from '../../types/agent';

// ── Phase metadata ─────────────────────────────────────────────────────────────

interface PhaseConfig {
  label: string;
  Icon: React.ElementType;
}

const PHASE_CONFIG: Record<string, PhaseConfig> = {
  MEMORY:       { label: 'Memory',       Icon: Lucide.Brain },
  CONTEXT:      { label: 'Context',      Icon: Lucide.FileSearch },
  PLANNING:     { label: 'Planning',     Icon: Lucide.GitBranch },
  PROMPT:       { label: 'Prompt Assembly', Icon: Lucide.MessageSquare },
  RUNTIME:      { label: 'Runtime',      Icon: Lucide.Cpu },
  TOOLS:        { label: 'Tools',        Icon: Lucide.Wrench },
  WORKSPACE:    { label: 'Workspace',    Icon: Lucide.FolderGit2 },
  VERIFICATION: { label: 'Verification', Icon: Lucide.CheckCircle2 },
  REFLECTION:   { label: 'Reflection',   Icon: Lucide.RefreshCw },
  COMPLETED:    { label: 'Completed',    Icon: Lucide.CheckCheck },
};

const DEFAULT_PHASE: PhaseConfig = { label: 'Stage', Icon: Lucide.Circle };

// ── Stage status icon ──────────────────────────────────────────────────────────

const StageIcon: React.FC<{ status: StageStatus }> = ({ status }) => {
  switch (status) {
    case 'running':
      return React.createElement(Lucide.Loader2, {
        size: 13,
        className: 'text-emerald-400 animate-spin flex-shrink-0',
      });
    case 'completed':
      return React.createElement(Lucide.CheckCircle2, {
        size: 13,
        className: 'text-emerald-500 flex-shrink-0',
      });
    case 'failed':
      return React.createElement(Lucide.XCircle, {
        size: 13,
        className: 'text-red-500 flex-shrink-0',
      });
    default:
      return React.createElement(Lucide.Circle, {
        size: 13,
        className: 'text-forge-text-subtle flex-shrink-0',
      });
  }
};

// ── Duration formatter ─────────────────────────────────────────────────────────

function fmtDuration(ms?: number): string {
  if (ms === undefined) return '';
  if (ms < 100)   return `${ms}ms`;
  if (ms < 1000)  return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60000);
  const s = Math.round((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

// ── Single stage row ───────────────────────────────────────────────────────────

const StageRow: React.FC<{ stage: TimelineStage; onSelectStage?: (stage: TimelineStage) => void }> = ({
  stage,
  onSelectStage,
}) => {
  return (
    <div
      role="listitem"
      onClick={() => onSelectStage?.(stage)}
      className={`animate-fade-in flex items-center gap-2 px-4 py-1.5 transition-colors cursor-pointer group ${
        stage.status === 'running' ? 'bg-emerald-500/5' : 'hover:bg-forge-bg-hover/60'
      }`}
    >
      <div className="w-px h-4 bg-forge-border flex-shrink-0 ml-[5px]" />
      <StageIcon status={stage.status} />
      <span
        className={`flex-1 text-xs truncate group-hover:text-forge-text transition-colors ${
          stage.status === 'failed' ? 'text-red-400' : 'text-forge-text-muted'
        }`}
      >
        {stage.name}
      </span>
      {stage.durationMs !== undefined && (
        <span className="text-[10px] text-forge-text-subtle flex-shrink-0 tabular-nums">
          {fmtDuration(stage.durationMs)}
        </span>
      )}
    </div>
  );
};

// ── Phase group ────────────────────────────────────────────────────────────────

interface PhaseGroupProps {
  phase: string;
  stages: TimelineStage[];
  onSelectStage?: (stage: TimelineStage) => void;
}

const PhaseGroup: React.FC<PhaseGroupProps> = ({ phase, stages, onSelectStage }) => {
  const cfg = PHASE_CONFIG[phase] ?? DEFAULT_PHASE;
  const allDone = stages.every((s) => s.status === 'completed');
  const anyRunning = stages.some((s) => s.status === 'running');
  const anyFailed = stages.some((s) => s.status === 'failed');
  const [collapsed, setCollapsed] = useState(false);

  const headerStatus: StageStatus = anyFailed ? 'failed' : anyRunning ? 'running' : allDone ? 'completed' : 'pending';

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-forge-bg-hover/40 transition-colors text-left w-full group cursor-pointer"
      >
        <cfg.Icon size={13} className="text-forge-accent flex-shrink-0" />
        <span className="flex-1 text-xs font-medium text-forge-text">{cfg.label}</span>
        <StatusBadge status={headerStatus} />
        {allDone && (
          <span className="text-[10px] text-forge-text-subtle tabular-nums font-mono">
            {fmtDuration(stages.reduce((acc, s) => acc + (s.durationMs ?? 0), 0))}
          </span>
        )}
        {collapsed ? (
          <Lucide.ChevronRight size={12} className="text-forge-text-subtle group-hover:text-forge-text-muted transition-colors" />
        ) : (
          <Lucide.ChevronDown size={12} className="text-forge-text-subtle group-hover:text-forge-text-muted transition-colors" />
        )}
      </button>

      {!collapsed && (
        <div role="list" className="flex flex-col">
          {stages.map((stage) => (
            <StageRow key={stage.id} stage={stage} onSelectStage={onSelectStage} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Group stages by phase ──────────────────────────────────────────────────────

interface PhaseSection {
  phase: string;
  stages: TimelineStage[];
}

function groupByPhase(stages: TimelineStage[]): PhaseSection[] {
  const sections: PhaseSection[] = [];
  for (const stage of stages) {
    const last = sections[sections.length - 1];
    if (last && last.phase === stage.phase) {
      last.stages.push(stage);
    } else {
      sections.push({ phase: stage.phase, stages: [stage] });
    }
  }
  return sections;
}

// ── RunTimeline ────────────────────────────────────────────────────────────────

import { StageDetailDrawer } from './StageDetailDrawer';

export const RunTimeline: React.FC = () => {
  const run = useRunStore(selectActiveRun);
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null);

  // ── No run selected ────────────────────────────────────────────────────────
  if (!run) {
    return (
      <div id="forge-agent-timeline" className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0 text-forge-text-subtle p-6">
        <Lucide.GitGraph size={32} className="opacity-20" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-medium text-forge-text-muted opacity-60">No active run</p>
          <p className="text-[11px] text-center opacity-40 max-w-[180px]">Send a request to start an Engineering Timeline.</p>
        </div>
      </div>
    );
  }

  // ── Run selected but no stages yet ────────────────────────────────────────
  if (run.timeline.length === 0) {
    return (
      <div id="forge-agent-timeline" className="flex-1 flex flex-col min-h-0">
        {renderRunHeader(run)}
        <div className="flex-1 flex items-center justify-center gap-2">
          <Lucide.Loader2 size={16} className="animate-spin text-forge-accent" />
          <span className="text-xs text-forge-text-muted">Waiting for pipeline…</span>
        </div>
      </div>
    );
  }

  const sections = groupByPhase(run.timeline);

  return (
    <div id="forge-agent-timeline" className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
      {renderRunHeader(run)}
      <div className="flex-1 overflow-y-auto min-h-0">
        {sections.map((sec) => (
          <PhaseGroup
            key={`${sec.phase}-${sec.stages[0]?.id}`}
            {...sec}
            onSelectStage={(st) => setSelectedStage(st)}
          />
        ))}

        {run.cards.length > 0 && (
          <div className="flex flex-col gap-1 mt-2 border-t border-forge-border/40 pt-2">
            {run.cards.map((card) => (
              <CardRenderer key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>

      {/* Stage Detail Drawer */}
      <StageDetailDrawer stage={selectedStage} onClose={() => setSelectedStage(null)} />
    </div>
  );
};

// ── Run header ─────────────────────────────────────────────────────────────────

function renderRunHeader(run: ReturnType<typeof selectActiveRun>) {
  if (!run) return null;
  return React.createElement(
    'div',
    {
      className: 'flex-shrink-0 px-3 py-2.5 border-b border-forge-border flex items-center gap-2',
    },
    React.createElement(StatusBadge, { status: run.status }),
    React.createElement(
      'span',
      { className: 'text-xs font-medium text-forge-text flex-1 truncate' },
      run.title
    ),
    React.createElement(
      'span',
      { className: 'text-[10px] text-forge-text-subtle flex-shrink-0' },
      `${run.timeline.length} stage${run.timeline.length !== 1 ? 's' : ''}`
    )
  );
}

export default RunTimeline;
