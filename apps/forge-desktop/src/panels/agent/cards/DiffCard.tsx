/**
 * DiffCard.tsx — Phase 12 Interactive Review System
 *
 * Granular code review component supporting per-file review, per-hunk review (Accept Hunk, Reject Hunk),
 * Accept All, Reject All, Rollback, line numbers, syntax highlights, and inline comment threading.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import type { DiffPayload, DiffFileItem } from '../../../types/agent';
import { Button } from '../../../components/ui/Button';
import { CommentThread } from '../../../components/review/CommentThread';

interface DiffCardProps {
  payload: DiffPayload;
  timestamp?: number;
  onAccept?: () => void;
  onReject?: () => void;
  onRollback?: () => void;
}

export interface DiffHunk {
  id: string;
  header: string;
  lines: Array<{ type: 'add' | 'del' | 'context'; lineNoOld?: number; lineNoNew?: number; text: string }>;
  status?: 'pending' | 'accepted' | 'rejected';
}

export const DiffCard: React.FC<DiffCardProps> = ({
  payload,
  timestamp,
  onAccept,
  onReject,
  onRollback,
}) => {
  const {
    filePath = 'Code Changes',
    oldContent = '',
    newContent = '',
    status: initialStatus = 'pending',
    files,
  } = payload;

  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(initialStatus);
  const [fileList, setFileList] = useState<DiffFileItem[]>(files || []);

  // Parse diff hunks for single file view
  const parseHunks = (): DiffHunk[] => {
    const oldLines = oldContent ? oldContent.split('\n') : [];
    const newLines = newContent ? newContent.split('\n') : [];

    const lines: DiffHunk['lines'] = [];
    oldLines.forEach((text, i) => lines.push({ type: 'del', lineNoOld: i + 1, text }));
    newLines.forEach((text, i) => lines.push({ type: 'add', lineNoNew: i + 1, text }));

    return [
      {
        id: 'hunk_1',
        header: `@@ -1,${oldLines.length || 1} +1,${newLines.length || 1} @@`,
        lines,
        status: 'pending',
      },
    ];
  };

  const [hunks, setHunks] = useState<DiffHunk[]>(parseHunks());

  const handleAcceptAll = () => {
    setStatus('accepted');
    setFileList((prev) => prev.map((f) => ({ ...f, status: 'accepted' })));
    setHunks((prev) => prev.map((h) => ({ ...h, status: 'accepted' })));
    onAccept?.();
  };

  const handleRejectAll = () => {
    setStatus('rejected');
    setFileList((prev) => prev.map((f) => ({ ...f, status: 'rejected' })));
    setHunks((prev) => prev.map((h) => ({ ...h, status: 'rejected' })));
    onReject?.();
  };

  const handleRollback = () => {
    setStatus('pending');
    setFileList((prev) => prev.map((f) => ({ ...f, status: 'pending' })));
    setHunks((prev) => prev.map((h) => ({ ...h, status: 'pending' })));
    onRollback?.();
  };

  const headerActions = (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleRollback}
        title="Rollback all changes"
        className="text-[11px] text-forge-text-muted hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <Lucide.RotateCcw size={11} /> Rollback
      </button>
      <button
        onClick={handleRejectAll}
        className="text-[11px] text-forge-text-muted hover:text-red-400 transition-colors cursor-pointer"
      >
        Reject all
      </button>
      <Button variant="primary" size="xs" onClick={handleAcceptAll}>
        Accept all
      </Button>
    </div>
  );

  // ── Multi-file changeset view ──────────────────────────────────────────────
  if (fileList.length > 0) {
    return (
      <BaseCard
        type="diff"
        title={`${fileList.length} Files With Changes`}
        timestamp={timestamp}
        actions={headerActions}
      >
        <div className="flex flex-col gap-1 mt-1 font-mono text-[11px]">
          {fileList.map((item, idx) => (
            <div key={idx} className="flex flex-col p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40 gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded text-[10px]">
                      +{item.additions}
                    </span>
                    <span className="text-red-400 bg-red-500/10 px-1 py-0.5 rounded text-[10px]">
                      -{item.deletions}
                    </span>
                  </span>
                  <span className="text-forge-text truncate">{item.filePath}</span>
                </div>

                {item.status === 'accepted' ? (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans font-medium">
                    <Lucide.Check size={11} /> Accepted
                  </span>
                ) : item.status === 'rejected' ? (
                  <span className="text-[10px] text-red-400 flex items-center gap-1 font-sans font-medium">
                    <Lucide.X size={11} /> Rejected
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setFileList((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, status: 'accepted' } : f))
                        )
                      }
                      title="Accept File"
                      className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      Accept File
                    </button>
                    <button
                      onClick={() =>
                        setFileList((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, status: 'rejected' } : f))
                        )
                      }
                      title="Reject File"
                      className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      Reject File
                    </button>
                  </div>
                )}
              </div>

              {/* Comment thread per file item */}
              <CommentThread targetId={`diff_file_${item.filePath}`} />
            </div>
          ))}
        </div>
      </BaseCard>
    );
  }

  // ── Single file per-hunk diff view ─────────────────────────────────────────
  return (
    <BaseCard type="diff" title={filePath} timestamp={timestamp} actions={headerActions}>
      <div className="flex flex-col gap-2 font-mono text-[11px]">
        {hunks.map((hunk) => (
          <div key={hunk.id} className="flex flex-col rounded border border-forge-border bg-forge-bg-elevated overflow-hidden">
            {/* Hunk Header */}
            <div className="flex items-center justify-between px-2.5 py-1 bg-forge-bg border-b border-forge-border text-forge-text-subtle text-[10px]">
              <span>{hunk.header}</span>
              {hunk.status === 'accepted' ? (
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <Lucide.Check size={11} /> Hunk Accepted
                </span>
              ) : hunk.status === 'rejected' ? (
                <span className="text-red-400 flex items-center gap-1 font-sans">
                  <Lucide.X size={11} /> Hunk Rejected
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setHunks((prev) =>
                        prev.map((h) => (h.id === hunk.id ? { ...h, status: 'accepted' } : h))
                      )
                    }
                    className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-sans"
                  >
                    Accept Hunk
                  </button>
                  <button
                    onClick={() =>
                      setHunks((prev) =>
                        prev.map((h) => (h.id === hunk.id ? { ...h, status: 'rejected' } : h))
                      )
                    }
                    className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-sans"
                  >
                    Reject Hunk
                  </button>
                </div>
              )}
            </div>

            {/* Hunk Lines */}
            <div className="p-2 overflow-x-auto max-h-64">
              {hunk.lines.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={`flex items-center gap-2 px-1 py-0.5 rounded-sm ${
                    line.type === 'add'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : line.type === 'del'
                      ? 'bg-red-500/10 text-red-400'
                      : 'text-forge-text-muted'
                  }`}
                >
                  <span className="w-6 text-right text-forge-text-subtle select-none text-[10px]">
                    {line.lineNoOld || line.lineNoNew || ''}
                  </span>
                  <span>{line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}</span>
                  <span className="truncate">{line.text}</span>
                </div>
              ))}
            </div>

            {/* Inline comment thread per hunk */}
            <div className="px-2 py-1 bg-forge-bg/40 border-t border-forge-border/40">
              <CommentThread targetId={`hunk_${hunk.id}`} />
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};

export default DiffCard;
