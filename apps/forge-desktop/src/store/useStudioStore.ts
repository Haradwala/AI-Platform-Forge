/**
 * useStudioStore.ts — React Store for Composable Panel Grid & Engineering Timeline
 */

import { create } from 'zustand';
import {
  PanelId,
  ComposablePanelConfig,
  TimelineEventPayload,
  AgentExecutionNode,
  AIDecisionAudit,
} from '../contracts/studio-types';

export interface StudioState {
  panels: ComposablePanelConfig[];
  timelineEvents: TimelineEventPayload[];
  executionNodes: AgentExecutionNode[];
  selectedDecision: AIDecisionAudit | null;
  replayTimeMs: number | null;
  isPlayingReplay: boolean;

  togglePanelVisibility: (id: PanelId) => void;
  togglePanelFloat: (id: PanelId) => void;
  addTimelineEvent: (evt: TimelineEventPayload) => void;
  setExecutionNodes: (nodes: AgentExecutionNode[]) => void;
  setSelectedDecision: (decision: AIDecisionAudit | null) => void;
  setReplayTimeMs: (time: number | null) => void;
  setIsPlayingReplay: (playing: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  panels: [
    { id: 'code-terminal', title: 'Code & Terminal', gridColumn: 'span 8', gridRow: 'span 2', isVisible: true, isFloating: false },
    { id: 'agent-execution-graph', title: 'Agent Execution Graph', gridColumn: 'span 4', gridRow: 'span 2', isVisible: true, isFloating: false },
    { id: 'runtime-telemetry', title: 'Runtime Telemetry', gridColumn: 'span 4', gridRow: 'span 1', isVisible: true, isFloating: false },
    { id: 'context-decision-inspector', title: 'Context & AI Decision Inspector', gridColumn: 'span 4', gridRow: 'span 1', isVisible: true, isFloating: false },
    { id: 'knowledge-graph', title: 'Knowledge Graph', gridColumn: 'span 4', gridRow: 'span 1', isVisible: true, isFloating: false },
  ],
  timelineEvents: [],
  executionNodes: [
    {
      id: 'node-1',
      agentRole: 'PlannerAgent',
      taskTitle: 'Decompose Personal OS Architecture',
      status: 'completed',
      subtasks: ['Audit roadmap', 'Simplify middleware', 'Refactor panel grid'],
      reasoningSteps: ['Identified zero-value enterprise features', 'Consolidated SQLite storage'],
      timestamp: Date.now() - 60000,
    },
    {
      id: 'node-2',
      agentRole: 'CoderAgent',
      taskTitle: 'Implement Composable Panel Grid',
      status: 'active',
      subtasks: ['Create studio-types.ts', 'Build ComposablePanelGrid.tsx'],
      reasoningSteps: ['Refactored layout to CSS Grid', 'Bound Timeline Event Bus'],
      timestamp: Date.now() - 30000,
    },
  ],
  selectedDecision: null,
  replayTimeMs: null,
  isPlayingReplay: false,

  togglePanelVisibility: (id) =>
    set((state) => ({
      panels: state.panels.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p)),
    })),
  togglePanelFloat: (id) =>
    set((state) => ({
      panels: state.panels.map((p) => (p.id === id ? { ...p, isFloating: !p.isFloating } : p)),
    })),
  addTimelineEvent: (evt) =>
    set((state) => ({ timelineEvents: [evt, ...state.timelineEvents] })),
  setExecutionNodes: (executionNodes) => set({ executionNodes }),
  setSelectedDecision: (selectedDecision) => set({ selectedDecision }),
  setReplayTimeMs: (replayTimeMs) => set({ replayTimeMs }),
  setIsPlayingReplay: (isPlayingReplay) => set({ isPlayingReplay }),
}));
