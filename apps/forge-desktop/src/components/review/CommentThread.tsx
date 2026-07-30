/**
 * CommentThread.tsx — Phase 12 Interactive Review System
 *
 * Renders inline comment threads attached to tasks, plan files, or diff hunks.
 * Supports adding comments, replies, and resolving threads.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import type { CommentThreadData, CommentItem } from '../../types/comment-types';

interface CommentThreadProps {
  thread?: CommentThreadData;
  targetId: string;
  onAddComment?: (targetId: string, text: string) => void;
  onResolveThread?: (threadId: string) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  thread,
  targetId,
  onAddComment,
  onResolveThread,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [localComments, setLocalComments] = useState<CommentItem[]>(thread?.comments || []);
  const [isResolved, setIsResolved] = useState(thread?.status === 'resolved');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: 'User',
      text: inputText.trim(),
      timestamp: Date.now(),
    };
    setLocalComments((prev) => [...prev, newComment]);
    onAddComment?.(targetId, inputText.trim());
    setInputText('');
  };

  const handleResolve = () => {
    setIsResolved(true);
    if (thread?.id) onResolveThread?.(thread.id);
  };

  return (
    <div className="flex flex-col gap-1.5 mt-1 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] text-forge-text-muted hover:text-forge-text transition-colors self-start cursor-pointer"
      >
        <Lucide.MessageSquare size={12} className="text-forge-accent" />
        <span>
          {localComments.length > 0
            ? `${localComments.length} Comment${localComments.length > 1 ? 's' : ''}`
            : 'Add Comment'}
        </span>
        {isResolved && (
          <span className="text-[10px] px-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
            Resolved
          </span>
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 p-2 rounded bg-forge-bg-elevated border border-forge-border/60">
          {localComments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-0.5 p-1.5 rounded bg-forge-bg/60 border border-forge-border/30">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-forge-text">{comment.author}</span>
                <span className="text-forge-text-subtle">
                  {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-forge-text-muted">{comment.text}</p>
            </div>
          ))}

          {!isResolved && (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="text"
                placeholder="Write a comment or feedback..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-2 py-1 text-xs rounded bg-forge-bg border border-forge-border text-forge-text focus:outline-none focus:border-forge-accent"
              />
              <button
                onClick={handleSend}
                className="px-2.5 py-1 text-xs rounded font-medium bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors cursor-pointer"
              >
                Send
              </button>
              {localComments.length > 0 && (
                <button
                  onClick={handleResolve}
                  title="Resolve thread"
                  className="px-2 py-1 text-xs rounded font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  Resolve
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
