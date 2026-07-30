/**
 * ImplementationPlanCard.tsx — Phase 12 Interactive Review System
 *
 * Renders implementation plan details (Goal, Purpose, Risk, Dependencies, Impact summary,
 * affected files) with pre-execution edit capability and comment threading.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import type { ImplementationPlanPayload, PlanFileItem } from '../../../types/agent';
import { Button } from '../../../components/ui/Button';
import { CommentThread } from '../../../components/review/CommentThread';

interface ImplementationPlanCardProps {
  payload: ImplementationPlanPayload;
  timestamp?: number;
  onSavePlanEdits?: (updatedPayload: ImplementationPlanPayload) => void;
}

const ActionBadge: React.FC<{ action: PlanFileItem['action'] }> = ({ action }) => {
  switch (action) {
    case 'create':
      return <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono uppercase">[NEW]</span>;
    case 'modify':
      return <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 font-mono uppercase">[MOD]</span>;
    case 'delete':
      return <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/20 text-red-400 font-mono uppercase">[DEL]</span>;
  }
};

export const ImplementationPlanCard: React.FC<ImplementationPlanCardProps> = ({
  payload,
  timestamp,
  onSavePlanEdits,
}) => {
  const {
    goal: initialGoal,
    summary: initialSummary,
    files: initialFiles = [],
    riskLevel: initialRisk = 'low',
  } = payload;

  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(initialGoal);
  const [summary, setSummary] = useState(initialSummary);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>(initialRisk);
  const [files, setFiles] = useState<PlanFileItem[]>(initialFiles);

  const handleSaveEdits = () => {
    setIsEditing(false);
    onSavePlanEdits?.({ goal, summary, files, riskLevel });
  };

  const riskBadge = (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold border ${
        riskLevel === 'high'
          ? 'bg-red-500/10 text-red-400 border-red-500/30'
          : riskLevel === 'medium'
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      }`}
    >
      {riskLevel} Risk
    </span>
  );

  const headerActions = (
    <Button variant="ghost" size="xs" onClick={() => (isEditing ? handleSaveEdits() : setIsEditing(true))}>
      <Lucide.Pencil size={11} /> {isEditing ? 'Save Plan' : 'Edit Plan'}
    </Button>
  );

  return (
    <BaseCard
      type="implementation-plan"
      title="Implementation Plan"
      timestamp={timestamp}
      badge={riskBadge}
      actions={headerActions}
    >
      <div className="flex flex-col gap-3 text-xs">
        {/* Goal & Purpose */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase text-forge-text-subtle">Goal & Purpose</span>
          {isEditing ? (
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="bg-forge-bg px-2 py-1 rounded border border-forge-accent text-xs text-forge-text font-medium"
            />
          ) : (
            <p className="text-xs text-forge-text font-medium bg-forge-bg-elevated/40 p-2 rounded border border-forge-border/40">
              {goal}
            </p>
          )}
        </div>

        {/* Summary & Impact */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase text-forge-text-subtle">Summary & Impact</span>
          {isEditing ? (
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-forge-bg px-2 py-1 rounded border border-forge-accent text-xs text-forge-text font-mono"
            />
          ) : (
            <p className="text-xs text-forge-text-muted leading-relaxed bg-forge-bg-elevated/20 p-2 rounded border border-forge-border/30">
              {summary}
            </p>
          )}
        </div>

        {/* Risk Selector in Edit Mode */}
        {isEditing && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase text-forge-text-subtle">Risk Level:</span>
            {(['low', 'medium', 'high'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskLevel(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                  riskLevel === r ? 'bg-forge-accent text-white border-forge-accent' : 'bg-forge-bg border-forge-border text-forge-text-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Files Affected List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase text-forge-text-subtle">
              Affected Files ({files.length})
            </span>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex flex-col p-2 rounded bg-forge-bg-elevated/50 border border-forge-border/30 text-xs gap-1"
                >
                  <div className="flex items-center gap-2">
                    <ActionBadge action={file.action} />
                    <span className="font-mono text-xs text-forge-text truncate flex-1">{file.path}</span>
                    {file.description && (
                      <span className="text-[10px] text-forge-text-subtle truncate max-w-[120px]">
                        {file.description}
                      </span>
                    )}
                  </div>
                  {/* Inline comments per file */}
                  <CommentThread targetId={`file_${file.path}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default ImplementationPlanCard;
