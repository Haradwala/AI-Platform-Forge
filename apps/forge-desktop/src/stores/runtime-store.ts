/**
 * runtime-store.ts — Phase 22 Runtime Workspace Integration
 *
 * Zustand state management for installed runtimes, active runtime, sessions, telemetry, and logs.
 */

import { create } from 'zustand';
import type {
  RuntimeWorkspaceEntry,
  RuntimeSessionEntry,
  RuntimeTelemetryData,
  NormalizedRuntimeEvent,
  RuntimeTypeCategory,
  DiscoveredRuntime,
  EnvironmentDiagnostics,
} from '../types/runtime-workspace';
import { runtimeSessionManager } from '../services/runtime/RuntimeSessionManager';
import { runtimeTelemetry } from '../services/runtime/RuntimeTelemetry';

interface RuntimeState {
  installedRuntimes: RuntimeWorkspaceEntry[];
  discoveredRuntimes: DiscoveredRuntime[];
  diagnostics: EnvironmentDiagnostics | null;
  activeRuntimeId: string | null;
  selectedRuntimeId: string | null;
  selectedSessionId: string | null;
  sessions: RuntimeSessionEntry[];
  activeSessions: RuntimeSessionEntry[];
  logs: Record<string, string[]>;
  telemetry: Record<string, RuntimeTelemetryData>;
  filterCategory: 'all' | RuntimeTypeCategory;
  searchQuery: string;
  isLoading: boolean;
  isDiscovering: boolean;
  activeTab: 'installed' | 'missing' | 'diagnostics' | 'active_sessions';

  // Actions
  setActiveRuntime: (id: string) => void;
  setSelectedRuntime: (id: string | null) => void;
  setSelectedSession: (id: string | null) => void;
  setFilterCategory: (category: 'all' | RuntimeTypeCategory) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: 'installed' | 'missing' | 'diagnostics' | 'active_sessions') => void;

  discoverRuntimes: (forceRefresh?: boolean) => Promise<void>;
  runDiagnostics: () => Promise<void>;
  testRuntime: (id: string) => Promise<void>;
  configureRuntime: (id: string, customPath: string) => Promise<void>;

  launchSession: (runtimeId: string, initialPrompt?: string) => Promise<void>;
  stopSession: (sessionId: string) => Promise<void>;
  restartSession: (sessionId: string) => Promise<void>;
  respondApproval: (sessionId: string, approvalId: string, decision: 'approve' | 'reject' | 'cancel') => Promise<void>;
  loadActiveSessions: () => Promise<void>;

  startRuntime: (id: string) => Promise<void>;
  stopRuntime: (id: string) => Promise<void>;
  restartRuntime: (id: string) => Promise<void>;
  startAllRuntimes: () => Promise<void>;
  stopAllRuntimes: () => Promise<void>;
  refreshHealth: () => Promise<void>;
  openTerminalForRuntime: (id: string) => Promise<string | undefined>;
  addLog: (runtimeId: string, message: string) => void;
}

const DEFAULT_RUNTIMES: RuntimeWorkspaceEntry[] = [
  {
    id: 'cli-generic',
    name: 'Generic CLI Runtime',
    runtimeType: 'cli',
    version: '1.0.0',
    status: 'running',
    health: 'healthy',
    capabilities: { streaming: true, tools: true, mcp: true, approval: true, resume: true },
    workingDir: '',
    activeSessionsCount: 1,
    providerIcon: 'terminal',
  },
  {
    id: 'openai-cloud',
    name: 'OpenAI Cloud Provider',
    runtimeType: 'cloud',
    version: '2.4.0',
    status: 'running',
    health: 'healthy',
    capabilities: { streaming: true, tools: true, mcp: false, approval: false },
    workingDir: '',
    activeSessionsCount: 1,
    providerIcon: 'cloud',
  },
  {
    id: 'mcp-server-hub',
    name: 'MCP Server Runtime',
    runtimeType: 'mcp',
    version: '1.2.0',
    status: 'running',
    health: 'healthy',
    capabilities: { streaming: true, tools: true, mcp: true, approval: true },
    workingDir: '',
    activeSessionsCount: 1,
    providerIcon: 'cpu',
  },
  {
    id: 'external-foundation',
    name: 'External Process Runtime',
    runtimeType: 'external',
    version: '1.8.0',
    status: 'stopped',
    health: 'healthy',
    capabilities: { streaming: true, tools: true, mcp: false, approval: true },
    workingDir: '',
    activeSessionsCount: 0,
    providerIcon: 'server',
  },
];

export const useRuntimeStore = create<RuntimeState>((set, get) => {
  // Subscribe to normalized runtime events from RuntimeSessionManager & IPC bridge
  runtimeSessionManager.on('runtime-event', (evt: NormalizedRuntimeEvent) => {
    get().addLog(evt.runtimeId, `[${evt.type}] ${evt.message}`);
    set({ telemetry: runtimeTelemetry.getAllTelemetry() });
  });

  if (typeof window !== 'undefined' && window.forge) {
    window.forge.on('runtime:event', (evt: any) => {
      if (evt && evt.sessionId) {
        get().addLog(evt.runtimeId || 'runtime', `[${evt.type}] ${evt.message}`);
        get().loadActiveSessions().catch(() => {});
      }
    });
  }

  return {
    installedRuntimes: DEFAULT_RUNTIMES,
    discoveredRuntimes: [],
    diagnostics: null,
    activeRuntimeId: typeof localStorage !== 'undefined' ? localStorage.getItem('forge_active_runtime') || 'cli-generic' : 'cli-generic',
    selectedRuntimeId: 'cli-generic',
    selectedSessionId: null,
    sessions: [],
    activeSessions: [],
    logs: {
      'cli-generic': ['[LOG] Generic CLI Runtime initialized.'],
      'openai-cloud': ['[LOG] OpenAI Cloud API key verified.'],
      'mcp-server-hub': ['[LOG] MCP Server tools mounted.'],
      'external-foundation': ['[LOG] External Runtime ready.'],
    },
    telemetry: runtimeTelemetry.getAllTelemetry(),
    filterCategory: 'all',
    searchQuery: '',
    isLoading: false,
    isDiscovering: false,
    activeTab: 'installed',

    setActiveRuntime: (id: string) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('forge_active_runtime', id);
      }
      set({ activeRuntimeId: id });
    },

    setSelectedRuntime: (id: string | null) => {
      set({ selectedRuntimeId: id });
    },

    setSelectedSession: (id: string | null) => {
      set({ selectedSessionId: id });
    },

    setFilterCategory: (category) => {
      set({ filterCategory: category });
    },

    setSearchQuery: (query) => {
      set({ searchQuery: query });
    },

    setActiveTab: (tab) => {
      set({ activeTab: tab });
    },

    discoverRuntimes: async (forceRefresh = false) => {
      if (typeof window === 'undefined' || !window.forge) return;
      set({ isDiscovering: true });
      try {
        const res = (await window.forge.invoke('runtime:discover', { forceRefresh })) as any;
        if (res && res.success && Array.isArray(res.runtimes)) {
          set({ discoveredRuntimes: res.runtimes });
        }
      } catch (err: any) {
        console.error('[RuntimeStore] Discovery error:', err.message);
      } finally {
        set({ isDiscovering: false });
      }
    },

    runDiagnostics: async () => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        const res = (await window.forge.invoke('runtime:get-diagnostics')) as any;
        if (res && res.success && res.diagnostics) {
          set({ diagnostics: res.diagnostics });
        }
      } catch (err: any) {
        console.error('[RuntimeStore] Diagnostics error:', err.message);
      }
    },

    testRuntime: async (id: string) => {
      if (typeof window === 'undefined' || !window.forge) return;
      get().addLog(id, '[TEST] Testing runtime responsiveness...');
      try {
        const res = (await window.forge.invoke('runtime:check-health', id)) as any;
        if (res && res.result) {
          get().addLog(id, `[TEST_RESULT] Health: ${res.result.health.toUpperCase()} (${res.result.latencyMs}ms) - ${res.result.statusMessage}`);
        }
      } catch (err: any) {
        get().addLog(id, `[TEST_ERROR] ${err.message}`);
      }
    },

    configureRuntime: async (id: string, customPath: string) => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        await window.forge.invoke('runtime:update-config', {
          customExecutablePaths: { [id]: customPath },
        });
        await get().discoverRuntimes(true);
        get().addLog(id, `[CONFIG] Updated custom binary path to: ${customPath}`);
      } catch (err: any) {
        console.error('[RuntimeStore] Configure error:', err.message);
      }
    },

    launchSession: async (runtimeId: string, initialPrompt?: string) => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        const res = (await window.forge.invoke('runtime:launch-session', {
          runtimeId,
          initialPrompt,
        })) as any;
        if (res && res.success && res.session) {
          set({
            selectedSessionId: res.session.sessionId,
            activeTab: 'active_sessions',
          });
          await get().loadActiveSessions();
          get().addLog(runtimeId, `[LAUNCH] Launched session ${res.session.sessionId}`);
        }
      } catch (err: any) {
        console.error('[RuntimeStore] Launch session error:', err.message);
      }
    },

    stopSession: async (sessionId: string) => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        await window.forge.invoke('runtime:stop-session', sessionId);
        await get().loadActiveSessions();
      } catch (err: any) {
        console.error('[RuntimeStore] Stop session error:', err.message);
      }
    },

    restartSession: async (sessionId: string) => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        const res = (await window.forge.invoke('runtime:restart-session', sessionId)) as any;
        if (res && res.success && res.session) {
          set({ selectedSessionId: res.session.sessionId });
          await get().loadActiveSessions();
        }
      } catch (err: any) {
        console.error('[RuntimeStore] Restart session error:', err.message);
      }
    },

    respondApproval: async (sessionId: string, approvalId: string, decision: 'approve' | 'reject' | 'cancel') => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        await window.forge.invoke('runtime:respond-approval', { sessionId, approvalId, decision });
        await get().loadActiveSessions();
      } catch (err: any) {
        console.error('[RuntimeStore] Respond approval error:', err.message);
      }
    },

    loadActiveSessions: async () => {
      if (typeof window === 'undefined' || !window.forge) return;
      try {
        const res = (await window.forge.invoke('runtime:get-active-sessions')) as any;
        if (res && res.success && Array.isArray(res.sessions)) {
          set({ activeSessions: res.sessions });
        }
      } catch (err: any) {
        console.error('[RuntimeStore] Load active sessions error:', err.message);
      }
    },

    startRuntime: async (id: string) => {
      const runtimes = get().installedRuntimes.map((r) =>
        r.id === id ? { ...r, status: 'running' as const, activeSessionsCount: 1 } : r
      );
      set({ installedRuntimes: runtimes });
      await runtimeSessionManager.createSession(id);
      get().addLog(id, '[RUNTIME_STARTED] Runtime started successfully.');
    },

    stopRuntime: async (id: string) => {
      const runtimes = get().installedRuntimes.map((r) =>
        r.id === id ? { ...r, status: 'stopped' as const, activeSessionsCount: 0 } : r
      );
      set({ installedRuntimes: runtimes });

      const sessions = runtimeSessionManager.getSessionsForRuntime(id);
      for (const s of sessions) {
        await runtimeSessionManager.stopSession(s.sessionId);
      }
      get().addLog(id, '[RUNTIME_STOPPED] Runtime stopped.');
    },

    restartRuntime: async (id: string) => {
      await get().stopRuntime(id);
      await get().startRuntime(id);
    },

    startAllRuntimes: async () => {
      for (const rt of get().installedRuntimes) {
        if (rt.status !== 'running') {
          await get().startRuntime(rt.id);
        }
      }
    },

    stopAllRuntimes: async () => {
      for (const rt of get().installedRuntimes) {
        if (rt.status === 'running') {
          await get().stopRuntime(rt.id);
        }
      }
    },

    refreshHealth: async () => {
      set({ isLoading: true });
      setTimeout(() => {
        set({ telemetry: runtimeTelemetry.getAllTelemetry(), isLoading: false });
      }, 300);
    },

    openTerminalForRuntime: async (id: string) => {
      const sessions = runtimeSessionManager.getSessionsForRuntime(id);
      let session = sessions[0];
      if (!session) {
        session = await runtimeSessionManager.createSession(id);
      }
      return session.terminalSessionId;
    },

    addLog: (runtimeId: string, message: string) => {
      const currentLogs = get().logs[runtimeId] || [];
      const updated = [...currentLogs, `[${new Date().toLocaleTimeString()}] ${message}`];
      if (updated.length > 500) updated.shift();
      set({ logs: { ...get().logs, [runtimeId]: updated } });
    },
  };
});
