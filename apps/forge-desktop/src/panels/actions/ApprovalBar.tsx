/**
 * ApprovalBar.tsx — Phase 29 Interactive Action Security Approval Bar
 */

import React from 'react';
import { useActionStore } from '../../stores/action-store';

export const ApprovalBar: React.FC = () => {
  const { pendingApprovals, approveAction, rejectAction } = useActionStore();

  if (!pendingApprovals || pendingApprovals.length === 0) {
    return null;
  }

  const current = pendingApprovals[0];

  return (
    <div className="bg-amber-950/80 border-y border-amber-600/50 px-4 py-2 flex items-center justify-between text-amber-200 text-sm backdrop-blur-sm z-30">
      <div className="flex items-center space-x-3">
        <span className="animate-pulse text-amber-400 text-base">⚠️</span>
        <div>
          <span className="font-semibold text-amber-100">Approval Required: </span>
          <span className="font-mono text-xs text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded mr-2">
            {current.actionId}
          </span>
          <span className="text-amber-200 text-xs">Runtime: {current.runtimeId}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => approveAction(current.id)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
        >
          Approve Action
        </button>
        <button
          onClick={() => rejectAction(current.id)}
          className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
};
