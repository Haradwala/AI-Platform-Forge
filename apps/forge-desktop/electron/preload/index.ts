import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script — the secure boundary between the renderer and the main process.
 *
 * Rules enforced here:
 * 1. contextIsolation is ON — the renderer has no access to Node.js globals
 * 2. nodeIntegration is OFF — require() does not exist in the renderer
 * 3. Only explicitly listed channels are bridged
 * 4. ipcRenderer is never exposed directly — only typed wrappers
 *
 * The exposed API shape is typed in src/types/forge-api.d.ts
 *
 * Channels registered here must match the IPC Router routes (Epic 4).
 */

// ─── Allowed IPC channels ────────────────────────────────────────────────────

/** Channels the renderer is allowed to invoke (request → response) */
const ALLOWED_INVOKE_CHANNELS = [
  // System
  'system:ping',
  'system:get-version',
  'system:get-platform',
  'system:get-startup-stage',
  'system:get-performance-snapshot',
  // Window (Epic 7)
  'window:maximize',
  'window:unmaximize',
  'window:minimize',
  'window:toggle-fullscreen',
  'window:close',
  'window:get-state',
  // Workspace (Epic 8)
  'workspace:pick-folder',
  'workspace:open-folder',
  'workspace:close',
  'workspace:get-tree',
  'workspace:read-file',
  'workspace:write-file',
  'workspace:create-file',
  'workspace:create-folder',
  'workspace:rename-entry',
  'workspace:delete-entry',
  'workspace:get-recent',
  // Theme (Epic 15)
  'theme:load',
  'theme:set',
  'theme:list',
  'theme:get-active',
  // Session (Epic 18)
  'session:save',
  'session:restore',
  'session:clear',
  // Terminal (Epic 17) — invoke channels
  'terminal:create',
  'terminal:write',
  'terminal:resize',
  'terminal:kill',
  // AI Foundation (Epic 14.1 - 14.7)
  'ai:get-providers',
  'ai:set-provider',
  'ai:get-models',
  'ai:set-model',
  'ai:collect-context',
  'ai:execute-task',
  'ai:cancel-task',
  'ai:generate-plan',
  'ai:execute-plan',
  'ai:cancel-execution',
  'ai:request',
  'ai:get-diagnostics',
  'ai:get-journal',
  // Phase 23 Runtime Discovery
  'runtime:discover',
  'runtime:get-diagnostics',
  'runtime:validate',
  'runtime:check-health',
  'runtime:update-config',
  // Phase 24 Runtime Execution Hub
  'runtime:launch-session',
  'runtime:stop-session',
  'runtime:restart-session',
  'runtime:respond-approval',
  'runtime:get-active-sessions',
  // Phase 25-28 Orchestration, Session, Profile, Repo Import, Intelligence
  'runtime:route-intent',
  'workspace:save-session',
  'workspace:restore-session',
  'workspace:get-profile',
  'workspace:save-profile',
  'repository:import',
  'workspace:analyze',
  // Phase 29 Engineering Action System
  'action:execute',
  'action:approve',
  'action:reject',
  'action:cancel',
  'action:history',
  'action:list',
  // Phase 30 Agent Framework
  'agent:run-workflow',
  'agent:cancel-task',
  'agent:get-memory',
  'agent:list',
] as const;

/** Channels the main process is allowed to push to the renderer (server → client events) */
const ALLOWED_ON_CHANNELS = [
  'workspace:file-changed',
  'workspace:file-created',
  'workspace:file-deleted',
  'window:state-changed',
  'startup:stage-changed',
  'menu:toggle-terminal',
  'menu:toggle-command-palette',
  'menu:open-folder',
  // AI Foundation events
  'ai:token',
  'ai:execute-command',
  'ai:task-started',
  'ai:task-completed',
  'ai:event',
  'ai:plan-completed',
  // Phase 23 Runtime Discovery events
  'runtime:event',
  'runtime:discovery-changed',
  'action:event',
  'agent:event',
] as const;

/** Allowed terminal session-data channel prefix (dynamic: terminal:data:<id>, terminal:exit:<id>) */
const TERMINAL_DATA_PREFIX = 'terminal:data:';
const TERMINAL_EXIT_PREFIX = 'terminal:exit:';

type InvokeChannel = typeof ALLOWED_INVOKE_CHANNELS[number];
type OnChannel = typeof ALLOWED_ON_CHANNELS[number];

// ─── Typed Bridge ─────────────────────────────────────────────────────────────

const forgeApi = {
  /** Invoke a main-process handler and await the response */
  invoke: (channel: InvokeChannel, ...args: unknown[]): Promise<unknown> => {
    if (!ALLOWED_INVOKE_CHANNELS.includes(channel)) {
      return Promise.reject(new Error(`[Preload] Blocked invoke on unlisted channel: ${channel}`));
    }
    return ipcRenderer.invoke(channel, ...args).then((res: any) => {
      if (res && typeof res === 'object' && 'ok' in res) {
        if (res.ok) {
          return res.data;
        } else {
          throw new Error(res.error || `IPC invocation failed on channel: ${channel}`);
        }
      }
      return res;
    });
  },

  /** Subscribe to push events from the main process */
  on: (channel: OnChannel, listener: (...args: unknown[]) => void): (() => void) => {
    if (!ALLOWED_ON_CHANNELS.includes(channel)) {
      console.warn(`[Preload] Blocked subscription to unlisted channel: ${channel}`);
      return () => {};
    }
    const wrappedListener = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
      listener(...args);
    ipcRenderer.on(channel, wrappedListener);
    // Return an unsubscribe function so React hooks can clean up
    return () => ipcRenderer.removeListener(channel, wrappedListener);
  },

  /** Remove all listeners for a push channel */
  removeAllListeners: (channel: OnChannel): void => {
    if (ALLOWED_ON_CHANNELS.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },

  /**
   * Terminal-specific bridge — allows dynamic per-session channels without
   * exposing ipcRenderer directly. Only 'terminal:data:<id>' and
   * 'terminal:exit:<id>' channels are accepted.
   */
  terminal: {
    /**
     * Subscribe to raw pty output for a terminal session.
     * Returns an unsubscribe function.
     */
    onData: (sessionId: string, listener: (data: string) => void): (() => void) => {
      const channel = `${TERMINAL_DATA_PREFIX}${sessionId}`;
      const wrapped = (_event: Electron.IpcRendererEvent, data: string) => listener(data);
      ipcRenderer.on(channel, wrapped);
      return () => ipcRenderer.removeListener(channel, wrapped);
    },

    /** Subscribe to pty exit events for a terminal session. */
    onExit: (sessionId: string, listener: (info: { exitCode: number; signal?: number }) => void): (() => void) => {
      const channel = `${TERMINAL_EXIT_PREFIX}${sessionId}`;
      const wrapped = (_event: Electron.IpcRendererEvent, info: any) => listener(info);
      ipcRenderer.on(channel, wrapped);
      return () => ipcRenderer.removeListener(channel, wrapped);
    },

    /** Send a create request for a new terminal session. */
    create: (sessionId: string): Promise<unknown> =>
      ipcRenderer.invoke('terminal:create', sessionId),

    /** Write raw input data to a running terminal session. */
    write: (sessionId: string, data: string): Promise<unknown> =>
      ipcRenderer.invoke('terminal:write', sessionId, data),

    /** Resize the terminal pty. */
    resize: (sessionId: string, cols: number, rows: number): Promise<unknown> =>
      ipcRenderer.invoke('terminal:resize', sessionId, cols, rows),

    /** Kill the terminal session. */
    kill: (sessionId: string): Promise<unknown> =>
      ipcRenderer.invoke('terminal:kill', sessionId),
  },

  // ── Convenience namespaces (thin wrappers over invoke) ────────────────────

  system: {
    ping:                 (): Promise<string>  => forgeApi.invoke('system:ping') as Promise<string>,
    getVersion:           (): Promise<string>  => forgeApi.invoke('system:get-version') as Promise<string>,
    getPlatform:          (): Promise<string>  => forgeApi.invoke('system:get-platform') as Promise<string>,
    getStartupStage:      (): Promise<string>  => forgeApi.invoke('system:get-startup-stage') as Promise<string>,
    getPerformanceSnapshot: (): Promise<unknown> => forgeApi.invoke('system:get-performance-snapshot'),
  },
} as const;

// ─── Expose to renderer ───────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('forge', forgeApi);
