/**
 * studio-types.ts — Contracts for Personal Engineering OS Composable Panel Grid
 */

export type PanelId =
  | 'code-terminal'
  | 'agent-execution-graph'
  | 'runtime-telemetry'
  | 'context-decision-inspector'
  | 'knowledge-graph'
  | 'repository-health'
  | 'automation-studio';

export interface ComposablePanelConfig {
  id: PanelId;
  title: string;
  gridColumn: string;
  gridRow: string;
  isVisible: boolean;
  isFloating: boolean;
}

export interface TimelineEventPayload {
  id: string;
  type: string;
  subsystem: 'agent' | 'runtime' | 'automation' | 'intelligence';
  timestamp: number;
  message: string;
  data?: any;
}

export interface AgentExecutionNode {
  id: string;
  agentRole: string;
  taskTitle: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  subtasks: string[];
  reasoningSteps: string[];
  timestamp: number;
}

export interface AIDecisionAudit {
  id: string;
  agentRole: string;
  modelId: string;
  actionName: string;
  rationale: string;
  confidenceScore: number;
  alternativesConsidered: string[];
  promptTokens: number;
  completionTokens: number;
  costUSD: number;
  timestamp: number;
}
