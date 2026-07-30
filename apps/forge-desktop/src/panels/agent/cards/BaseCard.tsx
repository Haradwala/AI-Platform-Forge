/**
 * BaseCard.tsx — Phase 3
 *
 * Reusable wrapper component for all Agent Cards in the Engineering Timeline.
 * Provides standard header, card type icon, title, collapsible content container, and optional action buttons.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import type { CardType } from '../../../types/agent';

interface BaseCardProps {
  type: CardType;
  title: string;
  timestamp?: number;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  defaultCollapsed?: boolean;
  badge?: React.ReactNode;
}

const CARD_META: Record<CardType, { label: string; icon: React.ElementType; color: string }> = {
  'task-list':           { label: 'Task List',           icon: Lucide.CheckSquare,    color: 'text-indigo-400' },
  'implementation-plan': { label: 'Implementation Plan', icon: Lucide.FileText,       color: 'text-amber-400' },
  'diff':                { label: 'Code Diff',           icon: Lucide.FileCode2,      color: 'text-emerald-400' },
  'tool':                { label: 'Tool Execution',      icon: Lucide.Wrench,         color: 'text-blue-400' },
  'verification':        { label: 'Verification',        icon: Lucide.ShieldCheck,    color: 'text-purple-400' },
  'walkthrough':         { label: 'Walkthrough',         icon: Lucide.BookOpen,       color: 'text-teal-400' },
  'preview':             { label: 'Workspace Preview',   icon: Lucide.Globe,          color: 'text-indigo-400' },
  'runtime-dashboard':   { label: 'Runtime Dashboard',   icon: Lucide.Cpu,            color: 'text-emerald-400' },
  'context-inspector':   { label: 'Context Inspector',   icon: Lucide.Layers,         color: 'text-blue-400' },
};

function formatTime(timestamp?: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const BaseCard: React.FC<BaseCardProps> = ({
  type,
  title,
  timestamp,
  icon,
  actions,
  children,
  defaultCollapsed = false,
  badge,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const meta = CARD_META[type] || { label: type, icon: Lucide.Box, color: 'text-forge-text-muted' };
  const IconComponent = icon || meta.icon;

  return React.createElement(
    'div',
    {
      role: 'article',
      'aria-label': `${meta.label}: ${title}`,
      className:
        'animate-fade-in my-2 mx-3 border border-forge-border bg-forge-bg rounded-lg overflow-hidden transition-all duration-150 hover:border-forge-border-focus/40 shadow-sm',
    },
    // Header
    React.createElement(
      'div',
      {
        className:
          'flex items-center gap-2 px-3 py-2 bg-forge-bg-elevated/70 border-b border-forge-border/60 select-none cursor-pointer',
        onClick: () => setCollapsed((v) => !v),
      },
      // Icon
      React.createElement(IconComponent, { size: 14, className: `${meta.color} flex-shrink-0` }),
      // Title
      React.createElement(
        'span',
        { className: 'text-xs font-semibold text-forge-text flex-1 truncate' },
        title
      ),
      // Badge
      badge,
      // Timestamp
      timestamp &&
        React.createElement(
          'span',
          { className: 'text-[10px] text-forge-text-subtle tabular-nums flex-shrink-0 ml-1' },
          formatTime(timestamp)
        ),
      // Actions container (stops collapse propagation)
      actions &&
        React.createElement(
          'div',
          {
            className: 'flex items-center gap-1.5 ml-1',
            onClick: (e: React.MouseEvent) => e.stopPropagation(),
          },
          actions
        ),
      // Collapse Chevron
      React.createElement(collapsed ? Lucide.ChevronRight : Lucide.ChevronDown, {
        size: 13,
        className: 'text-forge-text-subtle flex-shrink-0 ml-1',
      })
    ),
    // Body Content
    !collapsed &&
      React.createElement('div', { className: 'p-3 text-xs text-forge-text' }, children)
  );
};

export default BaseCard;
