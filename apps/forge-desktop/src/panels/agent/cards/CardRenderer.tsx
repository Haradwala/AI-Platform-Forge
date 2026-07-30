/**
 * CardRenderer.tsx — Phase 3
 *
 * Card Dispatcher component that maps any AgentCard to its specific renderer component.
 */

import React from 'react';
import type {
  AgentCard,
  TaskListPayload,
  ImplementationPlanPayload,
  DiffPayload,
  ToolPayload,
  VerificationPayload,
  WalkthroughPayload,
} from '../../../types/agent';
import { TaskListCard } from './TaskListCard';
import { ImplementationPlanCard } from './ImplementationPlanCard';
import { DiffCard } from './DiffCard';
import { ToolCard } from './ToolCard';
import { VerificationCard } from './VerificationCard';
import { WalkthroughCard } from './WalkthroughCard';
import { PreviewCard, PreviewPayload } from './PreviewCard';
import { RuntimeDashboardCard, RuntimeDashboardPayload } from './RuntimeDashboardCard';
import { ContextInspectorCard, ContextInspectorPayload } from './ContextInspectorCard';

interface CardRendererProps {
  card: AgentCard;
}

export const CardRenderer: React.FC<CardRendererProps> = ({ card }) => {
  switch (card.type) {
    case 'task-list':
      return React.createElement(TaskListCard, {
        payload: card.payload as TaskListPayload,
        timestamp: card.timestamp,
      });

    case 'implementation-plan':
      return React.createElement(ImplementationPlanCard, {
        payload: card.payload as ImplementationPlanPayload,
        timestamp: card.timestamp,
      });

    case 'diff':
      return React.createElement(DiffCard, {
        payload: card.payload as DiffPayload,
        timestamp: card.timestamp,
      });

    case 'tool':
      return React.createElement(ToolCard, {
        payload: card.payload as ToolPayload,
        timestamp: card.timestamp,
      });

    case 'verification':
      return React.createElement(VerificationCard, {
        payload: card.payload as VerificationPayload,
        timestamp: card.timestamp,
      });

    case 'walkthrough':
      return React.createElement(WalkthroughCard, {
        payload: card.payload as WalkthroughPayload,
        timestamp: card.timestamp,
      });

    case 'preview':
      return React.createElement(PreviewCard, {
        payload: card.payload as PreviewPayload,
        timestamp: card.timestamp,
      });

    case 'runtime-dashboard':
      return React.createElement(RuntimeDashboardCard, {
        payload: card.payload as RuntimeDashboardPayload,
        timestamp: card.timestamp,
      });

    case 'context-inspector':
      return React.createElement(ContextInspectorCard, {
        payload: card.payload as ContextInspectorPayload,
        timestamp: card.timestamp,
      });

    default:
      return null;
  }
};

export default CardRenderer;
