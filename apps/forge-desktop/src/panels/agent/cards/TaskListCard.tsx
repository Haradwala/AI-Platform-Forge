/**
 * TaskListCard.tsx — Phase 12 Interactive Review System
 *
 * Renders an interactive checklist with plan approval controls (Approve Plan, Reject Plan,
 * Edit Plan, Pause, Resume, Cancel), individual task approve/reject/edit actions, and inline comment threading.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import type { TaskListPayload, TaskItem } from '../../../types/agent';
import { Button } from '../../../components/ui/Button';
import { CommentThread } from '../../../components/review/CommentThread';

interface TaskListCardProps {
  payload: TaskListPayload;
  timestamp?: number;
  onApprovePlan?: () => void;
  onRejectPlan?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({
  payload,
  timestamp,
  onApprovePlan,
  onRejectPlan,
  onPause,
  onResume,
  onCancel,
}) => {
  const { title = 'Task List', tasks: initialTasks = [] } = payload;

  const [taskList, setTaskList] = useState<TaskItem[]>(initialTasks);
  const [isEditing, setIsEditing] = useState(false);
  const [planStatus, setPlanStatus] = useState<'pending' | 'approved' | 'rejected' | 'paused'>('pending');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const completedCount = taskList.filter((t) => t.status === 'completed').length;
  const progressPercent = taskList.length > 0 ? Math.round((completedCount / taskList.length) * 100) : 0;

  const handleApprovePlan = () => {
    setPlanStatus('approved');
    setTaskList((prev) => prev.map((t) => ({ ...t, status: t.status === 'pending' ? 'running' : t.status })));
    onApprovePlan?.();
  };

  const handleRejectPlan = () => {
    setPlanStatus('rejected');
    onRejectPlan?.();
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTaskList((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleStartEditTask = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditedText(task.label);
  };

  const handleSaveTaskEdit = (taskId: string) => {
    if (editedText.trim()) {
      setTaskList((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, label: editedText.trim() } : t))
      );
    }
    setEditingTaskId(null);
  };

  const badge = (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-forge-bg-active text-forge-text-muted border border-forge-border tabular-nums font-mono">
        {completedCount}/{taskList.length} ({progressPercent}%)
      </span>
      {planStatus === 'approved' && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
          Approved
        </span>
      )}
      {planStatus === 'rejected' && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-semibold uppercase">
          Rejected
        </span>
      )}
    </div>
  );

  const headerActions = (
    <div className="flex items-center gap-1">
      {planStatus === 'pending' && (
        <>
          <Button variant="ghost" size="xs" onClick={() => setIsEditing(!isEditing)}>
            <Lucide.Edit3 size={11} /> {isEditing ? 'Done' : 'Edit Plan'}
          </Button>
          <Button variant="danger" size="xs" onClick={handleRejectPlan}>
            Reject
          </Button>
          <Button variant="primary" size="xs" onClick={handleApprovePlan}>
            Approve Plan
          </Button>
        </>
      )}
      {planStatus === 'approved' && (
        <>
          <button
            onClick={() => { setPlanStatus('paused'); onPause?.(); }}
            title="Pause execution"
            className="p-1 rounded text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <Lucide.Pause size={12} />
          </button>
          <button
            onClick={() => { onCancel?.(); }}
            title="Cancel execution"
            className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Lucide.Square size={12} />
          </button>
        </>
      )}
      {planStatus === 'paused' && (
        <Button variant="primary" size="xs" onClick={() => { setPlanStatus('approved'); onResume?.(); }}>
          <Lucide.Play size={11} /> Resume
        </Button>
      )}
    </div>
  );

  return (
    <BaseCard type="task-list" title={title} timestamp={timestamp} badge={badge} actions={headerActions}>
      <div className="flex flex-col gap-2">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-forge-bg-active rounded-full overflow-hidden">
          <div
            className="h-full bg-forge-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="flex flex-col gap-1.5 mt-1">
          {taskList.map((task) => (
            <div key={task.id} className="flex flex-col p-2 rounded bg-forge-bg-elevated/50 border border-forge-border/40 text-xs gap-1">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className="flex items-center gap-2 flex-1 text-left cursor-pointer group truncate"
                >
                  {task.status === 'completed' ? (
                    <Lucide.CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  ) : task.status === 'running' ? (
                    <Lucide.Loader2 size={13} className="text-emerald-400 animate-spin flex-shrink-0" />
                  ) : task.status === 'failed' ? (
                    <Lucide.XCircle size={13} className="text-red-500 flex-shrink-0" />
                  ) : (
                    <Lucide.Circle size={13} className="text-forge-text-subtle group-hover:text-forge-text flex-shrink-0" />
                  )}

                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTaskEdit(task.id)}
                      onBlur={() => handleSaveTaskEdit(task.id)}
                      className="flex-1 bg-forge-bg px-1.5 py-0.5 rounded border border-forge-accent text-xs text-forge-text focus:outline-none"
                    />
                  ) : (
                    <span
                      className={`truncate ${
                        task.status === 'completed'
                          ? 'line-through text-forge-text-subtle'
                          : task.status === 'failed'
                          ? 'text-red-400'
                          : 'text-forge-text font-medium'
                      }`}
                    >
                      {task.label}
                    </span>
                  )}
                </button>

                {/* Per-task actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEditTask(task)}
                    title="Edit task label"
                    className="p-1 rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-colors"
                  >
                    <Lucide.Pencil size={11} />
                  </button>
                  <button
                    onClick={() =>
                      setTaskList((prev) =>
                        prev.map((t) => (t.id === task.id ? { ...t, status: 'completed' } : t))
                      )
                    }
                    title="Approve task"
                    className="p-1 rounded text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Lucide.Check size={11} />
                  </button>
                  <button
                    onClick={() =>
                      setTaskList((prev) =>
                        prev.map((t) => (t.id === task.id ? { ...t, status: 'failed' } : t))
                      )
                    }
                    title="Reject task"
                    className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Lucide.X size={11} />
                  </button>
                </div>
              </div>

              {/* Inline comment thread for this task */}
              <CommentThread targetId={task.id} />
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default TaskListCard;
