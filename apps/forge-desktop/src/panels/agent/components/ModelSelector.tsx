/**
 * ModelSelector.tsx — Phase 2
 *
 * Dropdown selector for active model, wired to ai-store.
 * Displayed in the AgentPanel header toolbar beside RuntimeSelector.
 */

import React from 'react';
import * as Lucide from 'lucide-react';
import { useAiStore } from '../../../stores/ai-store';

export const ModelSelector: React.FC = () => {
  const { models, activeModelId, setModel } = useAiStore();

  if (models.length === 0) return null;

  return React.createElement(
    'div',
    { className: 'flex items-center gap-1' },
    React.createElement(Lucide.BrainCircuit, { size: 11, className: 'text-forge-text-muted flex-shrink-0' }),
    React.createElement(
      'select',
      {
        id: 'forge-agent-model-selector',
        value: activeModelId,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setModel(e.target.value),
        className: [
          'bg-transparent border-none outline-none text-xs text-forge-text cursor-pointer',
          'focus:ring-0 max-w-[100px] truncate',
        ].join(' '),
        title: 'Select model',
      },
      ...models.map((m) =>
        React.createElement('option', {
          key: m,
          value: m,
          className: 'bg-forge-bg text-forge-text',
        }, m)
      )
    )
  );
};

export default ModelSelector;
