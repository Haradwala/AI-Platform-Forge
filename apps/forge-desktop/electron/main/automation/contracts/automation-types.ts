/**
 * automation-types.ts — Phase 31 Engineering Automation Engine Core Contracts
 *
 * Defines declarative workflow schemas, triggers, jobs, steps, matrices,
 * expressions, artifacts, and execution states.
 */

export type WorkflowTriggerType = 'push' | 'pull_request' | 'schedule' | 'file_change' | 'manual' | 'event';
export type AutomationStepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELLED';
export type PipelineExecutionStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type StepPriority = 'high' | 'normal' | 'low';

export interface AutomationTriggerCondition {
  type: WorkflowTriggerType;
  branches?: string[];
  paths?: string[];
  cron?: string;
  events?: string[];
  inputs?: Record<string, {
    description?: string;
    required?: boolean;
    default?: any;
  }>;
}

export interface AutomationStepDefinition {
  id: string;
  name: string;
  if?: string;
  action?: string;           // E.g., 'term.run_tests', 'fs.write_file', 'git.commit'
  agent?: string;            // E.g., 'Planner', 'Architect', 'Coder', 'Reviewer', 'Tester'
  prompt?: string;           // For agent steps
  params?: Record<string, any>;
  env?: Record<string, string>;
  inputArtifact?: string;    // Name of upstream artifact to consume
  outputArtifact?: string;   // Name of artifact to produce
  retry?: number;
  timeoutMs?: number;
  priority?: StepPriority;
}

export interface AutomationJobDefinition {
  id: string;
  name: string;
  needs?: string[];
  if?: string;
  matrix?: Record<string, string[]>;
  steps: AutomationStepDefinition[];
}

export interface AutomationWorkflowDefinition {
  id: string;
  name: string;
  workspaceRoot: string;
  format?: 'yaml' | 'json' | 'ts';
  on: AutomationTriggerCondition[];
  env?: Record<string, string>;
  variables?: Record<string, any>;
  secrets?: string[];
  jobs: Record<string, AutomationJobDefinition>;
}

export interface AutomationArtifact {
  id: string;
  executionId: string;
  stepId: string;
  name: string;
  path: string;
  mimeType?: string;
  sizeBytes: number;
  createdAt: number;
}

export interface AutomationStepResult {
  stepId: string;
  jobId: string;
  status: AutomationStepStatus;
  startTime: number;
  endTime?: number;
  durationMs: number;
  data?: any;
  outputArtifacts?: AutomationArtifact[];
  logs?: string[];
  error?: string;
}

export interface PipelineExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  workspaceRoot: string;
  status: PipelineExecutionStatus;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  inputs?: Record<string, any>;
  variables?: Record<string, any>;
  stepResults: Record<string, AutomationStepResult>;
  outputs: Record<string, any>;
  error?: string;
}

export interface WorkflowTemplateInfo {
  id: string;
  name: string;
  description: string;
  category: 'ci' | 'review' | 'refactor' | 'security' | 'architecture';
  format: 'yaml' | 'json';
  content: string;
}
