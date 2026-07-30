/**
 * runtime-workspace.ts — Phase 22 Runtime Workspace Integration
 *
 * Normalized type definitions for the unified Runtime Workspace.
 */

export type RuntimeTypeCategory = 'cli' | 'cloud' | 'mcp' | 'external' | 'local';

export type RuntimeStatusState = 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

export type NormalizedRuntimeEventType =
  | 'RUNTIME_STARTED'
  | 'RUNTIME_STOPPED'
  | 'SESSION_STARTED'
  | 'SESSION_ENDED'
  | 'TOKEN'
  | 'MESSAGE'
  | 'PROGRESS'
  | 'TOOL_CALL'
  | 'APPROVAL'
  | 'WARNING'
  | 'ERROR'
  | 'LOG'
  | 'COMPLETED';

export interface NormalizedRuntimeEvent {
  id: string;
  type: NormalizedRuntimeEventType;
  runtimeId: string;
  sessionId?: string;
  message: string;
  payload?: Record<string, unknown>;
  timestamp: number;
}

export interface RuntimeWorkspaceCapabilities {
  streaming: boolean;
  tools: boolean;
  mcp: boolean;
  approval: boolean;
  images?: boolean;
  resume?: boolean;
}

export interface RuntimeWorkspaceEntry {
  id: string;
  name: string;
  runtimeType: RuntimeTypeCategory;
  version: string;
  status: RuntimeStatusState;
  health: 'healthy' | 'degraded' | 'unhealthy';
  capabilities: RuntimeWorkspaceCapabilities;
  workingDir: string;
  pid?: number;
  activeSessionsCount: number;
  providerIcon?: string;
}

export interface RuntimeToolCallEntry {
  id: string;
  name: string;
  status: 'started' | 'progress' | 'finished' | 'error';
  args?: any;
  result?: any;
  progress?: number;
  timestamp: number;
}

export interface RuntimeSessionEntry {
  sessionId: string;
  runtimeId: string;
  adapterId?: string;
  workspaceRoot: string;
  terminalSessionId?: string;
  pid?: number;
  startTime: number;
  endTime?: number;
  status: RuntimeStatusState;
  capabilities: RuntimeWorkspaceCapabilities;
  eventHistory: any[];
  toolCalls: RuntimeToolCallEntry[];
  logs: string[];
  tokens: number;
  tokenUsage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export interface RuntimeTelemetryData {
  runtimeId: string;
  latencyMs: number;
  uptimeMs: number;
  totalTokens: number;
  memoryUsageMb: number;
  cpuPercent: number;
  activeSessions: number;
  lastUpdated: number;
}

export interface DiscoveredRuntime {
  id: string;
  name: string;
  category: RuntimeTypeCategory;
  installed: boolean;
  version: string | null;
  executablePath: string | null;
  status: RuntimeStatusState | 'unhealthy' | 'not_installed';
  health: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  envVars: Record<string, string>;
  capabilities: RuntimeWorkspaceCapabilities;
  installUrl?: string;
  missingDependencies?: string[];
  lastChecked: number;
}

export interface EnvironmentIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  affectedRuntimeId?: string;
}

export interface EnvironmentVariableStatus {
  key: string;
  status: 'set' | 'missing';
  isSecret: boolean;
  value?: string;
}

export interface EnvironmentDiagnostics {
  systemInfo: {
    platform: string;
    arch: string;
    nodeVersion: string;
    pathDirsCount: number;
    pathDirs: string[];
  };
  issues: EnvironmentIssue[];
  missingDependencies: string[];
  environmentVariables: EnvironmentVariableStatus[];
  timestamp: number;
}

