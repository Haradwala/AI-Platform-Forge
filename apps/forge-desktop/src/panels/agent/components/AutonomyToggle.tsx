/**
 * AutonomyToggle.tsx — Phase 2
 *
 * Toggle between 'request-review' and 'agent-decides' autonomy modes.
 * Rendered in the AgentPanel header toolbar.
 *
 * Phase 3 extension: when 'request-review', the panel will show approval
 * prompts before writing files. When 'agent-decides', cards auto-accept.
 */

import React from 'react';
import * as Lucide from 'lucide-react';
import { useAgentStore } from '../../../stores/agent-store';

export const AutonomyToggle: React.FC = () => {
  const { autonomyMode, setAutonomyMode } = useAgentStore();
  const isReview = autonomyMode === 'request-review';

  const toggle = () =>
    setAutonomyMode(isReview ? 'agent-decides' : 'request-review');

  return React.createElement(
    'button',
    {
      id: 'forge-agent-autonomy-toggle',
      onClick: toggle,
      title: isReview
        ? 'Mode: Request Review — click to let agent decide autonomously'
        : 'Mode: Agent Decides — click to require review before changes',
      className: [
        'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all duration-150 border',
        isReview
          ? 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
          : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
      ].join(' '),
    },
    React.createElement(isReview ? Lucide.ShieldCheck : Lucide.Zap, { size: 11 }),
    React.createElement('span', null, isReview ? 'Review' : 'Auto')
  );
};

export default AutonomyToggle;
