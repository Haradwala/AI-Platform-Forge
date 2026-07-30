/**
 * agent-store.ts — Phase 30 Agent System Zustand Store
 *
 * Tracks agents, active tasks, timeline, memory, active agent, and execution graph.
 */

import { create } from 'zustand';

export interface AgentInfo {
  role: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface AgentTaskEntry {
  id: string;
  agentRole: string;
  title: string;
  prompt: string;
  status: 'IDLE' | 'SCHEDULED' | 'RUNNING' | 'WAITING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress?: number;
  runtimeId?: string;
  durationMs?: number;
  output?: string;
  error?: string;
}

export type AutonomyMode = 'request-review' | 'agent-decides' | 'interactive' | 'semi-autonomous' | 'autonomous';

export interface AgentStoreState {
  agents: AgentInfo[];
  activeTasks: AgentTaskEntry[];
  timeline: AgentTaskEntry[];
  memory: any[];
  activeAgentRole: string | null;
  selectedTask: AgentTaskEntry | null;
  autonomyMode: AutonomyMode;

  runWorkflow: (goal: string, workspaceRoot: string) => Promise<any>;
  cancelTask: (taskId: string) => Promise<boolean>;
  loadAgents: () => Promise<void>;
  loadMemory: (workspaceRoot: string) => Promise<void>;
  selectTask: (task: AgentTaskEntry | null) => void;
  setActiveAgentRole: (role: string | null) => void;
  setAutonomyMode: (mode: AutonomyMode) => void;
  handleAgentEvent: (event: any) => void;
}

export const useAgentStore = create<AgentStoreState>((set, get) => ({
  agents: [],
  activeTasks: [],
  timeline: [],
  memory: [],
  activeAgentRole: null,
  selectedTask: null,
  autonomyMode: 'semi-autonomous',

  runWorkflow: async (goal, workspaceRoot) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('agent:run-workflow', {
        id: `wf_${Date.now()}`,
        goal,
        workspaceRoot,
      })) as any;
      if (res && res.result) {
        return res.result;
      }
    }
    return null;
  },

  cancelTask: async (taskId) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('agent:cancel-task', { taskId })) as any;
      if (res?.success) {
        set((state) => ({
          activeTasks: state.activeTasks.filter((t) => t.id !== taskId),
        }));
        return true;
      }
    }
    return false;
  },

  loadAgents: async () => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('agent:list')) as any;
      if (res?.success && Array.isArray(res.agents)) {
        set({ agents: res.agents });
      }
    }
  },

  loadMemory: async (workspaceRoot) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('agent:get-memory', workspaceRoot)) as any;
      if (res?.success && Array.isArray(res.entries)) {
        set({ memory: res.entries });
      }
    }
  },

  selectTask: (task) => set({ selectedTask: task }),
  setActiveAgentRole: (role) => set({ activeAgentRole: role }),
  setAutonomyMode: (mode) => set({ autonomyMode: mode }),

  handleAgentEvent: (event: any) => {
    if (!event || !event.taskId) return;
    const entry: AgentTaskEntry = {
      id: event.taskId,
      agentRole: event.agentRole,
      title: `Agent Task (${event.agentRole})`,
      prompt: event.result?.output || `Role: ${event.agentRole}`,
      status: event.state,
      progress: event.progress,
      runtimeId: event.runtimeId || event.result?.runtimeId,
      durationMs: event.result?.durationMs,
      output: event.result?.output,
      error: event.error || event.result?.error,
    };

    set((state) => {
      const activeIdx = state.activeTasks.findIndex((t) => t.id === entry.id);
      let updatedActive = [...state.activeTasks];
      if (activeIdx >= 0) {
        updatedActive[activeIdx] = entry;
      } else if (entry.status === 'RUNNING' || entry.status === 'SCHEDULED' || entry.status === 'WAITING') {
        updatedActive.push(entry);
      }

      if (entry.status === 'COMPLETED' || entry.status === 'FAILED' || entry.status === 'CANCELLED') {
        updatedActive = updatedActive.filter((t) => t.id !== entry.id);
      }

      return {
        activeTasks: updatedActive,
        timeline: [entry, ...state.timeline.filter((t) => t.id !== entry.id)].slice(0, 100),
      };
    });
  },
}));
