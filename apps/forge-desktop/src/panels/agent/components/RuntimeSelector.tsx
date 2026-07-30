/**
 * RuntimeSelector.tsx — Phase 2
 *
 * Dropdown selector for AI runtime/provider, wired to ai-store.
 * Displayed in the AgentPanel header toolbar.
 */

import React from 'react';
import * as Lucide from 'lucide-react';
import { useAiStore } from '../../../stores/ai-store';

export const RuntimeSelector: React.FC = () => {
  const { providers, activeProviderId, setProvider } = useAiStore();

  if (providers.length === 0) {
    return React.createElement(
      'div',
      { className: 'flex items-center gap-1 text-xs text-forge-text-subtle' },
      React.createElement(Lucide.Loader2, { size: 11, className: 'animate-spin' }),
      'Loading…'
    );
  }

  return React.createElement(
    'div',
    { className: 'flex items-center gap-1' },
    React.createElement(Lucide.Cpu, { size: 11, className: 'text-forge-text-muted flex-shrink-0' }),
    React.createElement(
      'select',
      {
        id: 'forge-agent-runtime-selector',
        value: activeProviderId,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setProvider(e.target.value),
        className: [
          'bg-transparent border-none outline-none text-xs text-forge-text cursor-pointer',
          'focus:ring-0 max-w-[90px] truncate',
        ].join(' '),
        title: 'Select runtime',
      },
      ...providers.map((p) =>
        React.createElement('option', {
          key: p.id,
          value: p.id,
          className: 'bg-forge-bg text-forge-text',
        }, p.name)
      )
    )
  );
};

export default RuntimeSelector;
