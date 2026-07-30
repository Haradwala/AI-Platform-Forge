"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
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
];
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
];
/** Allowed terminal session-data channel prefix (dynamic: terminal:data:<id>, terminal:exit:<id>) */
const TERMINAL_DATA_PREFIX = 'terminal:data:';
const TERMINAL_EXIT_PREFIX = 'terminal:exit:';
// ─── Typed Bridge ─────────────────────────────────────────────────────────────
const forgeApi = {
    /** Invoke a main-process handler and await the response */
    invoke: (channel, ...args) => {
        if (!ALLOWED_INVOKE_CHANNELS.includes(channel)) {
            return Promise.reject(new Error(`[Preload] Blocked invoke on unlisted channel: ${channel}`));
        }
        return electron_1.ipcRenderer.invoke(channel, ...args).then((res) => {
            if (res && typeof res === 'object' && 'ok' in res) {
                if (res.ok) {
                    return res.data;
                }
                else {
                    throw new Error(res.error || `IPC invocation failed on channel: ${channel}`);
                }
            }
            return res;
        });
    },
    /** Subscribe to push events from the main process */
    on: (channel, listener) => {
        if (!ALLOWED_ON_CHANNELS.includes(channel)) {
            console.warn(`[Preload] Blocked subscription to unlisted channel: ${channel}`);
            return () => { };
        }
        const wrappedListener = (_event, ...args) => listener(...args);
        electron_1.ipcRenderer.on(channel, wrappedListener);
        // Return an unsubscribe function so React hooks can clean up
        return () => electron_1.ipcRenderer.removeListener(channel, wrappedListener);
    },
    /** Remove all listeners for a push channel */
    removeAllListeners: (channel) => {
        if (ALLOWED_ON_CHANNELS.includes(channel)) {
            electron_1.ipcRenderer.removeAllListeners(channel);
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
        onData: (sessionId, listener) => {
            const channel = `${TERMINAL_DATA_PREFIX}${sessionId}`;
            const wrapped = (_event, data) => listener(data);
            electron_1.ipcRenderer.on(channel, wrapped);
            return () => electron_1.ipcRenderer.removeListener(channel, wrapped);
        },
        /** Subscribe to pty exit events for a terminal session. */
        onExit: (sessionId, listener) => {
            const channel = `${TERMINAL_EXIT_PREFIX}${sessionId}`;
            const wrapped = (_event, info) => listener(info);
            electron_1.ipcRenderer.on(channel, wrapped);
            return () => electron_1.ipcRenderer.removeListener(channel, wrapped);
        },
        /** Send a create request for a new terminal session. */
        create: (sessionId) => electron_1.ipcRenderer.invoke('terminal:create', sessionId),
        /** Write raw input data to a running terminal session. */
        write: (sessionId, data) => electron_1.ipcRenderer.invoke('terminal:write', sessionId, data),
        /** Resize the terminal pty. */
        resize: (sessionId, cols, rows) => electron_1.ipcRenderer.invoke('terminal:resize', sessionId, cols, rows),
        /** Kill the terminal session. */
        kill: (sessionId) => electron_1.ipcRenderer.invoke('terminal:kill', sessionId),
    },
    // ── Convenience namespaces (thin wrappers over invoke) ────────────────────
    system: {
        ping: () => forgeApi.invoke('system:ping'),
        getVersion: () => forgeApi.invoke('system:get-version'),
        getPlatform: () => forgeApi.invoke('system:get-platform'),
        getStartupStage: () => forgeApi.invoke('system:get-startup-stage'),
        getPerformanceSnapshot: () => forgeApi.invoke('system:get-performance-snapshot'),
    },
};
// ─── Expose to renderer ───────────────────────────────────────────────────────
electron_1.contextBridge.exposeInMainWorld('forge', forgeApi);
//# sourceMappingURL=index.js.map