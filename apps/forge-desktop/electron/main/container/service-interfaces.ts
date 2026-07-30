/**
 * Stub service interfaces for Epic 5.
 *
 * These are the minimal interface contracts consumed by the modules.
 * Each interface will be extended with full method signatures as the
 * corresponding epic is implemented:
 *
 * IDesktopLogger      → Epic 19 (Logging Infrastructure)
 * IDesktopEventBus    → Epic 10 (Desktop Event Bus)
 * IWindowService      → Epic 7  (Window Manager)
 * IWorkspaceService   → Epic 8  (Workspace Service)
 * IThemeService       → Epic 15 (Theme Engine)
 * ITerminalService    → Epic 17 (Terminal Integration)
 * ISessionManager     → Epic 18 (Session Manager)
 * IPerformanceMonitor → Epic 20 (Performance Monitor)
 * IStartupManager     → Epic 6  (Startup Manager)
 */
import type { IIpcContext, IpcHandlerFn } from '../../ipc/interfaces';
import type { IExecutionResult } from '../ai/execution/execution-types';

// ─── Core ─────────────────────────────────────────────────────────────────────

export interface IDesktopLogger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

export interface IDesktopEventBus {
  emit(topic: string, payload: unknown): void;
  on(topic: string, listener: (payload: unknown) => void): () => void;
  off(topic: string, listener: (payload: unknown) => void): void;
}

// ─── IPC ─────────────────────────────────────────────────────────────────────

export interface IIpcRouter {
  handle(channel: string, handler: IpcHandlerFn): void;
  handlePattern(pattern: string, handler: IpcHandlerFn): void;
  attach(): void;
  detach(): void;
}

// ─── Window ───────────────────────────────────────────────────────────────────

export interface IWindowService {
  createMainWindow(): Promise<void>;
  closeMainWindow(): void;
  maximize(): void;
  minimize(): void;
  restore(): void;
  toggleFullscreen(): void;
  close(): void;
  focus(): void;
  hide(): void;
  show(): void;
  getState(): IWindowState | null;
  setTitle(title: string): void;
  flashFrame(flag: boolean): void;
}

export interface IWindowState {
  readonly width: number;
  readonly height: number;
  readonly x: number | undefined;
  readonly y: number | undefined;
  readonly isMaximized: boolean;
  readonly isMinimized: boolean;
  readonly isFullScreen: boolean;
  readonly isFocused: boolean;
}


export interface IFileTreeItem {
  readonly name: string;
  readonly path: string;
  readonly isDirectory: boolean;
  readonly size?: number;
  readonly children?: readonly IFileTreeItem[];
}

export interface IWorkspaceService {
  open(workspaceRoot: string): Promise<IFileTreeItem>;
  close(): Promise<void>;
  getRecentWorkspaces(): Promise<string[]>;
  getTree(): Promise<IFileTreeItem | null>;
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  createFile(filePath: string): Promise<void>;
  createFolder(folderPath: string): Promise<void>;
  deleteEntry(entryPath: string): Promise<void>;
  renameEntry(oldPath: string, newPath: string): Promise<void>;
  getRootPath(): string | null;
}


// ─── Theme ───────────────────────────────────────────────────────────────────

export interface IThemeService {
  loadTheme(id: string): Promise<void>;
  getActiveTheme(): string;
  listThemes(): string[];
}

// ─── Terminal ────────────────────────────────────────────────────────────────

export interface ITerminalService {
  create(id: string): Promise<void>;
  write(id: string, data: string): void;
  resize(id: string, cols: number, rows: number): void;
  kill(id: string): Promise<void>;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface ISessionManager {
  save(state?: any): Promise<void>;
  restore(): Promise<any>;
  clear(): Promise<void>;
}

// ─── Performance ─────────────────────────────────────────────────────────────

export interface IPerformanceMonitor {
  record(channel: string, durationMs: number): void;
  snapshot(): Record<string, number>;
  reset(): void;
}

// ─── Startup ─────────────────────────────────────────────────────────────────

export interface IStartupManager {
  boot(): Promise<void>;
  shutdown(): Promise<void>;
  getCurrentStage(): string;
}

// ─── AI Foundation ────────────────────────────────────────────────────────────

export interface IAiTokenStream {
  onToken(callback: (token: string) => void): this;
  onComplete(callback: (fullText: string) => void): this;
  onError(callback: (err: Error) => void): this;
  cancel(): void;
}

export interface IAiModel {
  id: string;
  name: string;
  description?: string;
  contextWindow?: number;
}

export interface IAiProvider {
  readonly id: string;
  readonly name: string;
  generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream>;
  listAvailableModels(): Promise<string[]>;
}

export interface IProviderRegistry {
  register(provider: IAiProvider): void;
  getById(id: string): IAiProvider | null;
  getAll(): IAiProvider[];
}

// ─── Runtime Layer (Phase 1) ──────────────────────────────────────────────────
//
// "Runtime" is the generic term for any system that can execute AI requests.
// IAiRuntime extends IAiProvider so every existing consumer (kernel, session
// service, diagnostics) works without modification.
//
// These re-export the canonical definitions from ai/runtime/runtime-types.ts
// so the rest of the codebase can import from a single location.

export type { RuntimeType, RuntimeHealth, IAiRuntime, IRuntimeRegistry, IRuntimeManager, RuntimeListEntry } from '../ai/runtime/runtime-types';

// ─── Configuration Layer (Phase 3) ────────────────────────────────────────────
export type { IConfigurationService, ForgeConfig, ProviderConfig, ValidationResult } from '../config';

// ─── Tool Execution Engine (Phase 4) ──────────────────────────────────────────
import type {
  IToolExecutionEngine,
  ToolInvocation,
  ExecutionContext,
  ToolResult,
  ExecutionError,
  ToolNotFoundError,
  ToolError,
  TimeoutError,
  CancelledError,
} from '../ai/tools/tool-execution-engine';

export type {
  IToolExecutionEngine,
  ToolInvocation,
  ExecutionContext,
  ToolResult,
  ExecutionError,
  ToolNotFoundError,
  ToolError,
  TimeoutError,
  CancelledError,
};

// ─── Agent Loop (Phase 5) ─────────────────────────────────────────────────────
import type {
  IAgentLoop,
  AgentState,
  AgentStep,
  AgentResult,
  AgentTaskOptions,
} from '../ai/agent/agent-loop';

export type {
  IAgentLoop,
  AgentState,
  AgentStep,
  AgentResult,
  AgentTaskOptions,
};

// ─── Memory Engine (Phase 7) ──────────────────────────────────────────────────
import type {
  IMemoryEngine,
  MemoryType,
  MemoryItem,
  ScoredMemoryItem,
  MemoryQueryOptions,
  MemorySnapshot,
} from '../ai/memory/memory-types';

export type {
  IMemoryEngine,
  MemoryType,
  MemoryItem,
  ScoredMemoryItem,
  MemoryQueryOptions,
  MemorySnapshot,
};

// ─── Execution Pipeline Integration (Phase 8) ─────────────────────────────────
import type {
  IExecutionOrchestrator,
  OrchestrationRequest,
  OrchestrationResult,
} from '../ai/orchestration/execution-orchestrator';
import type {
  IPromptAssemblyEngine,
  AssembledPrompt,
  PromptAssemblyOptions,
} from '../ai/context/prompt-assembly-engine';
import type { GraphNode, PlanningGraph } from '../ai/planner/planning-graph';

/** Alias so consumers can use the interface-style name IPlanningGraph. */
export type IPlanningGraph = InstanceType<typeof PlanningGraph>;

export type {
  IExecutionOrchestrator,
  OrchestrationRequest,
  OrchestrationResult,
  IPromptAssemblyEngine,
  AssembledPrompt,
  PromptAssemblyOptions,
  GraphNode,
  PlanningGraph,
};

// ─── Code Intelligence Engine (Phase 9) ───────────────────────────────────────
import type {
  ICodeIntelligenceEngine,
  RepositoryStats,
} from '../ai/code-intelligence/code-intelligence-engine';
import type { SymbolDeclaration, SymbolKind, SymbolReference } from '../ai/code-intelligence/symbol-index';
import type { CallEdge } from '../ai/code-intelligence/call-graph';
import type { ScannedFile, ScannedPackage } from '../ai/code-intelligence/repository-scanner';

export type {
  ICodeIntelligenceEngine,
  RepositoryStats,
  SymbolDeclaration,
  SymbolKind,
  SymbolReference,
  CallEdge,
  ScannedFile,
  ScannedPackage,
};

// ─── Workspace Operations Engine (Phase 10) ───────────────────────────────────
import type { IWorkspaceEngine } from '../ai/workspace/workspace-engine';
import type { FilePatch, PatchOptions, PatchResult } from '../ai/workspace/patch-engine';
import type { FileDiffItem, WorkspaceDiffReport } from '../ai/workspace/workspace-diff';
import type { SnapshotState } from '../ai/workspace/workspace-snapshot';

export type {
  IWorkspaceEngine,
  FilePatch,
  PatchOptions,
  PatchResult,
  FileDiffItem,
  WorkspaceDiffReport,
  SnapshotState,
};

// ─── MCP Runtime (Model Context Protocol) ─────────────────────────────────────
import type { IMCPRuntime } from '../ai/mcp/mcp-runtime';
import type { MCPServerConfig, MCPHealth, MCPTransportType } from '../ai/mcp/mcp-server';
import type { MCPToolDefinition, MCPResource } from '../ai/mcp/mcp-client';

export type {
  IMCPRuntime,
  MCPServerConfig,
  MCPHealth,
  MCPTransportType,
  MCPToolDefinition,
  MCPResource,
};

// ─── CLI Process Engine ───────────────────────────────────────────────────────
import type { ICLIManager } from '../ai/cli/cli-manager';
import type { CLISessionStatus, CLISessionOptions, CLISessionInfo } from '../ai/cli/cli-types';

export type {
  ICLIManager,
  CLISessionStatus,
  CLISessionOptions,
  CLISessionInfo,
};

// ─── AI Runtimes & Providers ──────────────────────────────────────────────────
import type { BaseCLIRuntime } from '../ai/runtime/cli/cli-runtime';
import type { ClaudeCodeRuntime } from '../ai/runtime/cli/claude-runtime';
import type { GeminiCLIRuntime } from '../ai/runtime/cli/gemini-runtime';
import type { CodexCLIRuntime } from '../ai/runtime/cli/codex-runtime';
import type { AiderCLIRuntime } from '../ai/runtime/cli/aider-runtime';
import type { GooseCLIRuntime } from '../ai/runtime/cli/goose-runtime';
import type { MockProvider } from '../ai/providers/mock-provider';
import type { OllamaProvider } from '../ai/providers/ollama-provider';
import type { OpenAIRuntime } from '../ai/runtime/cloud/openai-runtime';
import type { AnthropicRuntime } from '../ai/runtime/cloud/anthropic-runtime';
import type { GeminiRuntime } from '../ai/runtime/cloud/gemini-runtime';
import type { GroqRuntime } from '../ai/runtime/cloud/groq-runtime';
import type { OpenRouterRuntime } from '../ai/runtime/cloud/openrouter-runtime';

export type {
  BaseCLIRuntime,
  ClaudeCodeRuntime,
  GeminiCLIRuntime,
  CodexCLIRuntime,
  AiderCLIRuntime,
  GooseCLIRuntime,
  MockProvider,
  OllamaProvider,
  OpenAIRuntime,
  AnthropicRuntime,
  GeminiRuntime,
  GroqRuntime,
  OpenRouterRuntime,
};

export interface IMemoryContext {
  readonly conversationId: string;
  readonly shortTermFacts: string[];
}

export interface IAiTaskRequest {
  readonly goal: string;
  readonly context?: IStructuredContext;
  readonly memory?: IMemoryContext;
  readonly executionMode: 'chat' | 'plan' | 'execute' | 'review';
}

export interface IAiSession {
  readonly id: string;
  activeProviderId: string;
  activeModelId: string;
  isStreaming: boolean;
  abortController: AbortController | null;
}

export interface IAiSessionService {
  createSession(): IAiSession;
  getSession(id: string): IAiSession | null;
  getActiveSession(): IAiSession | null;
  setActiveSession(session: IAiSession | null): void;
  setProvider(id: string): void;
  setModel(id: string): void;
}

export interface ICodeSelection {
  readonly filePath: string;
  readonly startLine: number;
  readonly endLine: number;
  readonly text: string;
}

export interface IEditorContext {
  readonly activeFilePath: string | null;
  readonly openFilePaths: string[];
  readonly currentSelection: ICodeSelection | null;
  readonly cursorPosition: { readonly line: number; readonly ch: number } | null;
}

export interface IStructuredContext {
  readonly timestamp: string;
  readonly editor: IEditorContext;
  readonly workspace: {
    readonly rootPath: string | null;
    readonly recentCommands: string[];
    readonly activeThemeId: string;
    readonly gitBranchPlaceholder: string;
  };
}

import type {
  ContextSnapshot,
  ContextEngineGatherOptions,
} from '../ai/context/context-engine';
import type { IndexedSymbol, IndexedFile } from '../ai/context/repository-indexer';

export type {
  ContextSnapshot,
  ContextEngineGatherOptions,
  IndexedSymbol,
  IndexedFile,
};

export interface IContextEngine {
  collectContext(editorState: IEditorContext): Promise<IStructuredContext>;
  gatherSnapshot?(options: ContextEngineGatherOptions): Promise<ContextSnapshot>;
}

export * from '../ai/context/prompt-normalizer';

export interface IToolDefinition {
  readonly id: string;
  readonly description: string;
  readonly inputSchema: Record<string, any>;
  readonly outputSchema: Record<string, any>;
}

export interface ITool<TInput = any, TOutput = any> extends IToolDefinition {
  execute(input: TInput): Promise<TOutput>;
}

export interface IToolRegistry {
  register(tool: ITool): void;
  getById(id: string): ITool | null;
  getAll(): IToolDefinition[];
  execute<TInput = any, TOutput = any>(id: string, input: TInput): Promise<TOutput>;
}

export interface IAiKernel {
  executeTask(request: IAiTaskRequest, onToken: (token: string) => void): Promise<string>;
  cancelActiveTask(): void;
  executeTool?<TInput = any, TOutput = any>(
    invocation: ToolInvocation,
    context?: ExecutionContext
  ): Promise<ToolResult<TOutput>>;
}

export interface ITask {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  readonly dependencies: string[];
  readonly toolCall?: { readonly toolId: string; readonly input: any };
  error?: string;
}

export interface IPlan {
  readonly id: string;
  readonly goal: string;
  readonly tasks: ITask[];
}

export interface IPlanner {
  generatePlan(goal: string, context: IStructuredContext): Promise<IPlan>;
}

export interface IJournalEntry {
  readonly planId: string;
  readonly goal: string;
  readonly startTime: string;
  endTime?: string;
  readonly tasksExecuted: Array<{
    readonly taskId: string;
    readonly toolId?: string;
    readonly status: 'completed' | 'failed';
    readonly durationMs: number;
    readonly error?: string;
  }>;
}

export interface IExecutionEngine {
  executePlan(plan: IPlan): Promise<IExecutionResult[]>;
  cancelActiveTask(): void;
  getJournal(): IJournalEntry[];
}

export * from '../platform/repository-types';
export * from '../ai/context/context-package';
export * from '../ai/context/context-collectors';
export * from '../ai/context/context-ranking-service';
export * from '../ai/context/token-budget-manager';
export * from '../ai/memory/memory-registry';
export * from '../ai/knowledge/semantic-knowledge-builder';
export * from '../ai/session/conversation-manager';
export * from '../ai/context/context-sufficiency';
export * from '../ai/planner/intent-detector';
export * from '../ai/planner/goal-extractor';
export * from '../ai/reasoning/reasoning-engine';
export * from '../ai/planner/dependency-resolver';
export * from '../ai/planner/task-planner';
export * from '../ai/planner/plan-validator';
export * from '../ai/planner/plan-scorer';
export * from '../ai/planner/plan-approval-policy';
export * from '../ai/planner/tool-selector';
export * from '../ai/planner/execution-planner';
export * from '../ai/execution/execution-types';
export * from '../ai/execution/execution-events';
export * from '../ai/execution/execution-graph-engine';
export * from '../ai/execution/execution-scheduler';
export * from '../ai/execution/task-dispatcher';
export * from '../ai/execution/execution-context';
export * from '../ai/execution/execution-snapshot-service';
export * from '../ai/execution/execution-metrics';
export * from '../ai/execution/execution-policy-registry';
export * from '../ai/execution/execution-observer';
export * from '../ai/execution/execution-state-machine';
export * from '../ai/verification/verification-types';
export * from '../ai/verification/verification-engine';
export * from '../ai/verification/verification-pipeline';
export * from '../ai/verification/verification-metrics';
export * from '../ai/verification/checkers/compilation-verifier';
export * from '../ai/verification/checkers/lint-verifier';
export * from '../ai/verification/checkers/formatting-checker';
export * from '../ai/verification/checkers/test-runner';
export * from '../ai/verification/checkers/repository-rules';
export * from '../ai/verification/checkers/security-scanner';
export * from '../ai/verification/checkers/performance-checker';
export * from '../ai/orchestrator/ai-orchestrator';
export * from '../ai/recovery/recovery-types';
export * from '../ai/recovery/recovery-orchestrator';
export * from '../ai/reflection/reflection-engine';
export * from '../ai/outcome/outcome-types';
export * from '../ai/outcome/outcome-manager';
export * from '../ai/learning/learning-engine';
export * from '../ai/runtime-discovery';
export * from '../ai/runtime/runtime-event-bus';
export * from '../ai/runtime/runtime-session-state';
export * from '../ai/runtime/runtime-session-storage';
export * from '../ai/runtime/runtime-execution-manager';
export * from '../ai/contracts/execution-contracts';
export * from '../ai/workflow/workflow-engine';
export * from '../ai/routing/intent-analyzer';
export * from '../ai/routing/capability-matcher';
export * from '../ai/routing/runtime-scorer';
export * from '../ai/routing/runtime-router';
export * from '../ai/learning/runtime-learning-engine';
export * from '../ai/session/workspace-session-manager';
export * from '../ai/session/workspace-profile';
export * from '../platform/repository-analyzer';
export * from '../platform/repository-importer';
export * from '../ai/actions/action-types';
export * from '../ai/actions/action-registry';
export * from '../ai/actions/action-validator';
export * from '../ai/actions/action-events';
export * from '../ai/actions/action-history';
export * from '../ai/actions/action-executor';
export * from '../ai/actions/providers/core-action-provider';
export * from '../ai/actions/providers/git-action-provider';
export * from '../ai/actions/providers/ui-action-provider';
export * from '../ai/agents/agent-types';
export * from '../ai/agents/agent-registry';
export * from '../ai/agents/built-in-agents';
export * from '../ai/agents/agent-memory';
export * from '../ai/agents/agent-events';
export * from '../ai/agents/agent-scheduler';
export * from '../ai/agents/agent-orchestrator';

// Application Layer Services
export * from '../application/workspace/workspace-application-service';
export * from '../application/terminal/terminal-application-service';
export * from '../application/git/git-application-service';
export * from '../application/runtime/runtime-application-service';
export * from '../application/runtime/multi-runtime-application-service';
export * from '../application/agents/agent-application-service';
export * from '../application/automation/automation-application-service';
export * from '../application/intelligence/intelligence-application-service';
export * from '../repository-health/application/repository-health-application-service';
export * from '../application/engineering-application-service';




