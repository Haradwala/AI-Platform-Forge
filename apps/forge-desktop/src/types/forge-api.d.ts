/**
 * Type declarations for the window.forge API exposed by the preload script.
 *
 * These types must stay in sync with electron/preload/index.ts.
 * The preload enforces the channel whitelist at runtime;
 * these types enforce it at compile time in the renderer.
 */

export interface IForgeSystem {
  ping(): Promise<string>;
  getVersion(): Promise<string>;
  getPlatform(): Promise<string>;
  getStartupStage(): Promise<string>;
  getPerformanceSnapshot(): Promise<IPerformanceSnapshot>;
}

export interface IWindowState {
  isMaximized: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isFocused: boolean;
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
}

export interface IPerformanceSnapshot {
  timestamp: string;
  rendererMemoryMb: number;
  ipcLatencyP95Ms: Record<string, number>;
  workspaceLoadMs: number;
  startupMs: number;
}

export interface ITerminalExitInfo {
  exitCode: number;
  signal?: number;
}

export interface IForgeTerminal {
  /** Subscribe to raw pty output for a session. Returns unsubscribe fn. */
  onData(sessionId: string, listener: (data: string) => void): () => void;
  /** Subscribe to pty exit for a session. Returns unsubscribe fn. */
  onExit(sessionId: string, listener: (info: ITerminalExitInfo) => void): () => void;
  /** Spawn a new pty session. */
  create(sessionId: string): Promise<unknown>;
  /** Send input to the pty. */
  write(sessionId: string, data: string): Promise<unknown>;
  /** Resize the pty. */
  resize(sessionId: string, cols: number, rows: number): Promise<unknown>;
  /** Kill the pty session. */
  kill(sessionId: string): Promise<unknown>;
}

export type InvokeChannel =
  | 'system:ping'
  | 'system:get-version'
  | 'system:get-platform'
  | 'system:get-startup-stage'
  | 'system:get-performance-snapshot'
  | 'window:maximize'
  | 'window:unmaximize'
  | 'window:minimize'
  | 'window:toggle-fullscreen'
  | 'window:close'
  | 'window:get-state'
  | 'workspace:pick-folder'
  | 'workspace:open-folder'
  | 'workspace:close'
  | 'workspace:get-tree'
  | 'workspace:read-file'
  | 'workspace:write-file'
  | 'workspace:create-file'
  | 'workspace:create-folder'
  | 'workspace:rename-entry'
  | 'workspace:delete-entry'
  | 'workspace:get-recent'
  | 'theme:load'
  | 'theme:set'
  | 'theme:list'
  | 'theme:get-active'
  | 'session:save'
  | 'session:restore'
  | 'session:clear'
  | 'terminal:create'
  | 'terminal:write'
  | 'terminal:resize'
  | 'terminal:kill'
  | 'ai:get-providers'
  | 'ai:set-provider'
  | 'ai:get-models'
  | 'ai:set-model'
  | 'ai:collect-context'
  | 'ai:execute-task'
  | 'ai:cancel-task'
  | 'ai:generate-plan'
  | 'ai:execute-plan'
  | 'ai:cancel-execution'
  | 'ai:request'
  | 'ai:get-diagnostics'
  | 'ai:get-journal'
  | 'runtime:discover'
  | 'runtime:get-diagnostics'
  | 'runtime:validate'
  | 'runtime:check-health'
  | 'runtime:update-config'
  | 'runtime:launch-session'
  | 'runtime:stop-session'
  | 'runtime:restart-session'
  | 'runtime:respond-approval'
  | 'runtime:get-active-sessions'
  | 'runtime:route-intent'
  | 'workspace:save-session'
  | 'workspace:restore-session'
  | 'workspace:get-profile'
  | 'workspace:save-profile'
  | 'repository:import'
  | 'workspace:analyze'
  | 'action:execute'
  | 'action:approve'
  | 'action:reject'
  | 'action:cancel'
  | 'action:history'
  | 'action:list'
  | 'agent:run-workflow'
  | 'agent:cancel-task'
  | 'agent:get-memory'
  | 'agent:list';

export type OnChannel =
  | 'workspace:file-changed'
  | 'workspace:file-created'
  | 'workspace:file-deleted'
  | 'window:state-changed'
  | 'startup:stage-changed'
  | 'menu:toggle-terminal'
  | 'menu:toggle-command-palette'
  | 'menu:open-folder'
  | 'ai:token'
  | 'ai:execute-command'
  | 'ai:task-started'
  | 'ai:task-completed'
  | 'ai:event'
  | 'ai:plan-completed'
  | 'runtime:event'
  | 'runtime:discovery-changed'
  | 'action:event'
  | 'agent:event';

export interface IForgeApi {
  /** Generic typed invoke — prefer the convenience namespaces below */
  invoke(channel: InvokeChannel, ...args: unknown[]): Promise<unknown>;
  /** Subscribe to main-process push events. Returns an unsubscribe function. */
  on(channel: OnChannel, listener: (...args: unknown[]) => void): () => void;
  /** Remove all listeners for a push channel */
  removeAllListeners(channel: OnChannel): void;

  /** Secure per-session terminal bridge (node-pty backed) */
  readonly terminal: IForgeTerminal;

  // Convenience namespaces (populated as epics progress)
  readonly system: IForgeSystem;
}

declare global {
  interface Window {
    forge: IForgeApi;
  }
}
