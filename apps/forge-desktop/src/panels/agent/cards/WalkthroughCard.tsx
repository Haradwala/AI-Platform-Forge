/**
 * WalkthroughCard.tsx — Phase 3
 *
 * Renders the final walkthrough summary, step-by-step description of completed work,
 * and list of changed files.
 */

import React from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import type { WalkthroughPayload } from '../../../types/agent';

interface WalkthroughCardProps {
  payload: WalkthroughPayload;
  timestamp?: number;
}

export const WalkthroughCard: React.FC<WalkthroughCardProps> = ({ payload, timestamp }) => {
  const { summary, steps = [], filesChanged = [] } = payload;

  return React.createElement(
    BaseCard,
    { type: 'walkthrough', title: 'Execution Walkthrough', timestamp },
    React.createElement(
      'div',
      { className: 'flex flex-col gap-3' },
      // Summary
      React.createElement(
        'div',
        { className: 'p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300' },
        summary
      ),
      // Step-by-step walkthrough
      steps.length > 0 &&
        React.createElement(
          'div',
          { className: 'flex flex-col gap-2' },
          React.createElement('span', { className: 'text-[10px] font-semibold uppercase text-forge-text-subtle' }, 'Completed Steps'),
          ...steps.map((step, idx) =>
            React.createElement(
              'div',
              { key: idx, className: 'flex gap-2.5 p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40 text-xs' },
              React.createElement(
                'span',
                { className: 'flex h-5 w-5 items-center justify-center rounded-full bg-forge-accent/20 text-forge-accent text-[11px] font-semibold flex-shrink-0' },
                idx + 1
              ),
              React.createElement(
                'div',
                { className: 'flex flex-col gap-1 flex-1' },
                React.createElement('span', { className: 'font-medium text-forge-text' }, step.title),
                React.createElement('p', { className: 'text-forge-text-muted leading-relaxed' }, step.description),
                step.codeSnippet &&
                  React.createElement(
                    'pre',
                    { className: 'font-mono text-[10px] bg-forge-bg p-1.5 rounded border border-forge-border/40 text-forge-text-subtle overflow-x-auto mt-1' },
                    step.codeSnippet
                  )
              )
            )
          )
        ),
      // Files modified summary
      filesChanged.length > 0 &&
        React.createElement(
          'div',
          { className: 'flex flex-col gap-1' },
          React.createElement('span', { className: 'text-[10px] font-semibold uppercase text-forge-text-subtle' }, `Modified Files (${filesChanged.length})`),
          React.createElement(
            'div',
            { className: 'flex flex-wrap gap-1' },
            ...filesChanged.map((f, i) =>
              React.createElement(
                'span',
                { key: i, className: 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-forge-bg-active text-forge-text-muted border border-forge-border' },
                f
              )
            )
          )
        )
    )
  );
};

export default WalkthroughCard;
