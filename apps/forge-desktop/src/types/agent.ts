/**
 * agent.ts — Phase 3
 *
 * Core type definitions for the Forge Agent Panel, including card payload contracts.
 */

// ── Status unions ──────────────────────────────────────────────────────────────

export type RunStatus = 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled';
export type StageStatus = 'pending' | 'running' | 'completed' | 'failed';

// ── Card types ─────────────────────────────────────────────────────────────────

export type CardType =
  | 'task-list'
  | 'implementation-plan'
  | 'diff'
  | 'tool'
  | 'verification'
  | 'walkthrough'
  | 'preview'
  | 'runtime-dashboard'
  | 'context-inspector';

// ── Card Payload Interfaces ─────────────────────────────────────────────────────

export interface TaskItem {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface TaskListPayload {
  title?: string;
  tasks: TaskItem[];
}

export interface PlanFileItem {
  path: string;
  action: 'create' | 'modify' | 'delete';
  description?: string;
}

export interface ImplementationPlanPayload {
  goal: string;
  summary: string;
  files: PlanFileItem[];
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface DiffFileItem {
  filePath: string;
  additions: number;
  deletions: number;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface DiffPayload {
  filePath?: string;
  language?: string;
  oldContent?: string;
  newContent?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  files?: DiffFileItem[];
}

export interface ToolPayload {
  toolId: string;
  toolName: string;
  params: Record<string, unknown>;
  args?: Record<string, unknown>;
  result?: unknown;
  durationMs?: number;
  status: 'running' | 'completed' | 'failed';
  error?: string;
  logs?: string[];
}

export interface VerificationPayload {
  passed: boolean;
  status?: 'passed' | 'failed';
  summary?: string;
  state?: 'completed' | 'failed';
  durationMs?: number;
  metrics?: {
    testsPassed?: number;
    testsTotal?: number;
    lintErrors?: number;
    typeErrors?: number;
  };
  errors?: Array<{ message: string; file?: string; line?: number }>;
  logs?: string;
}

export interface WalkthroughStep {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface WalkthroughPayload {
  summary: string;
  steps: WalkthroughStep[];
  filesChanged?: string[];
}

export interface TimelineStage {
  readonly id: string;
  /** Phase label sent by the orchestrator (e.g. 'MEMORY', 'CONTEXT', 'RUNTIME', 'TOOLS', 'WORKSPACE', 'VERIFICATION') */
  readonly phase: string;
  /** Human-readable stage name (e.g. 'Retrieve memories', 'Collect context') */
  readonly name: string;
  status: StageStatus;
  readonly startTime: number;
  endTime?: number;
  durationMs?: number;
  runtimeId?: string;
  modelId?: string;
  tokenCount?: number;
  promptTokens?: number;
  completionTokens?: number;
  memoryUsageMb?: number;
  logs?: string[];
  toolOutput?: unknown;
  diagnostics?: string[];
  graphNodes?: Array<{ id: string; label: string; status: string }>;
}

// ── Card ──────────────────────────────────────────────────────────────────────

export interface AgentCard {
  readonly id: string;
  readonly type: CardType;
  readonly runId: string;
  readonly payload:
    | TaskListPayload
    | ImplementationPlanPayload
    | DiffPayload
    | ToolPayload
    | VerificationPayload
    | WalkthroughPayload
    | unknown;
  readonly timestamp: number;
}

// ── Agent run — the top-level unit tracked in run-store ───────────────────────

export interface AgentRun {
  readonly id: string;
  readonly requestId?: string;
  title: string;
  status: RunStatus;
  reviewStatus?: 'pending_review' | 'approved' | 'rejected';
  readonly runtimeId: string;
  readonly modelId: string;
  readonly startTime: number;
  endTime?: number;
  /** Ordered list of pipeline stages, appended as ai:events arrive */
  timeline: TimelineStage[];
  /** Ordered list of output cards */
  cards: AgentCard[];
}
