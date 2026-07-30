import { create } from 'zustand';

export interface IMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  content: string;
}

export interface IAiStore {
  readonly messages: IMessage[];
  readonly providers: Array<{ id: string; name: string }>;
  readonly activeProviderId: string;
  readonly models: string[];
  readonly activeModelId: string;
  readonly isStreaming: boolean;
  readonly plan: any | null;
  readonly isExecutingPlan: boolean;
  readonly diagnostics: any | null;

  readonly init: () => Promise<void>;
  readonly setProvider: (id: string) => Promise<void>;
  readonly setModel: (id: string) => Promise<void>;
  readonly sendMessage: (prompt: string, editorState: any) => Promise<void>;
  readonly cancelTask: () => Promise<void>;
  readonly clearHistory: () => void;
  readonly generatePlan: (prompt: string, editorState: any) => Promise<void>;
  readonly executePlan: () => Promise<void>;
  readonly cancelExecution: () => Promise<void>;
  readonly fetchDiagnostics: () => Promise<void>;
}

let _aiStoreInitialized = false;
const _aiStoreSubscriptions = new Set<() => void>();

export const useAiStore = create<IAiStore>((set, get) => ({
  messages: [],
  providers: [],
  activeProviderId: 'mock',
  models: [],
  activeModelId: '',
  isStreaming: false,
  plan: null,
  isExecutingPlan: false,
  diagnostics: null,

  init: async () => {
    if (_aiStoreInitialized) return;
    _aiStoreInitialized = true;

    // Clear any previous listeners
    for (const unsub of _aiStoreSubscriptions) {
      try { unsub(); } catch { /* ignore */ }
    }
    _aiStoreSubscriptions.clear();

    try {
      const providers = await window.forge.invoke('ai:get-providers') as Array<{ id: string; name: string }>;
      const models = await window.forge.invoke('ai:get-models') as string[];
      set({
        providers,
        models,
        activeModelId: models[0] || ''
      });

      if (typeof window === 'undefined' || !window.forge) return;

      // Unified event stream listener
      const unsubEvent = window.forge.on('ai:event', (evt: any) => {
        const data = evt as { type: string; payload: any };
        set((state) => {
          // Find the last assistant message
          const lastAssistant = [...state.messages].reverse().find((m) => m.role === 'assistant');
          if (!lastAssistant) return {};

          let contentUpdate = '';
          if (data.type === 'PIPELINE_STARTED') {
            contentUpdate = `[Pipeline Started] Request ID: ${data.payload.id}\n`;
          } else if (data.type === 'STAGE_STARTED') {
            contentUpdate = `➜ Phase: ${data.payload.phase} | Stage: ${data.payload.stageName}...\n`;
          } else if (data.type === 'STAGE_COMPLETED') {
            contentUpdate = `✔ Done: ${data.payload.stageName} (${data.payload.status}, took ${data.payload.durationMs}ms)\n`;
          } else if (data.type === 'PIPELINE_COMPLETED') {
            contentUpdate = `\n[Pipeline Completed] Status: ${data.payload.status}`;
          } else if (data.type === 'TOKEN') {
            contentUpdate = data.payload.token;
          } else if (data.type === 'ERROR') {
            contentUpdate = `\n❌ Error: ${data.payload.error}`;
          }

          const nextMsgs = state.messages.map((m) => {
            if (m.id === lastAssistant.id) {
              return { ...m, content: m.content + contentUpdate };
            }
            return m;
          });
          return { messages: nextMsgs };
        });
      });
      _aiStoreSubscriptions.add(unsubEvent);

      // Set up legacy plan progress listeners
      const unsubTaskStarted = window.forge.on('ai:task-started', (evt: any) => {
        const data = evt as { taskId: string; planId: string };
        set((state) => {
          if (!state.plan || state.plan.id !== data.planId) return {};
          const nextTasks = state.plan.tasks.map((t: any) => {
            if (t.id === data.taskId) {
              return { ...t, status: 'running' as const };
            }
            return t;
          });
          return { plan: { ...state.plan, tasks: nextTasks } };
        });
      });
      _aiStoreSubscriptions.add(unsubTaskStarted);

      const unsubTaskCompleted = window.forge.on('ai:task-completed', (evt: any) => {
        const data = evt as { taskId: string; status: 'completed' | 'failed'; error?: string; planId: string };
        set((state) => {
          if (!state.plan || state.plan.id !== data.planId) return {};
          const nextTasks = state.plan.tasks.map((t: any) => {
            if (t.id === data.taskId) {
              return { ...t, status: data.status, error: data.error };
            }
            return t;
          });
          return { plan: { ...state.plan, tasks: nextTasks } };
        });
      });
      _aiStoreSubscriptions.add(unsubTaskCompleted);

      const unsubPlanCompleted = window.forge.on('ai:plan-completed', () => {
        set({ isExecutingPlan: false });
      });
      _aiStoreSubscriptions.add(unsubPlanCompleted);
    } catch (err) {
      console.error('[useAiStore] init failed:', err);
      _aiStoreInitialized = false;
    }
  },

  setProvider: async (id) => {
    try {
      await window.forge.invoke('ai:set-provider', id);
      const models = await window.forge.invoke('ai:get-models') as string[];
      set({
        activeProviderId: id,
        models,
        activeModelId: models[0] || ''
      });
    } catch (err) {
      console.error('[useAiStore] setProvider failed:', err);
    }
  },

  setModel: async (id) => {
    try {
      await window.forge.invoke('ai:set-model', id);
      set({ activeModelId: id });
    } catch (err) {
      console.error('[useAiStore] setModel failed:', err);
    }
  },

  sendMessage: async (prompt, editorState) => {
    if (!prompt.trim() || get().isStreaming) return;

    const reqId = `req_${Date.now()}`;
    const userMessage: IMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: prompt
    };

    const assistantMessage: IMessage = {
      id: `msg_assist_${Date.now()}`,
      role: 'assistant',
      content: ''
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
      isStreaming: true
    }));

    try {
      const response = (await window.forge.invoke('ai:request', { id: reqId, prompt })) as {
        success: boolean;
        result: { response: string; metadata: Record<string, any> };
        finalContext: any;
      };

      // Update the assistant placeholder with the backend-generated response text.
      // If the ai:event stream already wrote tokens into the message during generation,
      // the existing content is preserved and the final text overwrites it cleanly.
      const finalText = response?.result?.response || 'Task completed.';
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantMessage.id ? { ...m, content: finalText } : m
        ),
      }));
    } catch (err: any) {
      console.error('[useAiStore] request error:', err);
      set((state) => {
        const nextMsgs = state.messages.map((m) => {
          if (m.id === assistantMessage.id && !m.content) {
            return { ...m, content: `Error: ${err.message || 'Pipeline crashed.'}` };
          }
          return m;
        });
        return { messages: nextMsgs };
      });
    } finally {
      set({ isStreaming: false });

      // Fetch latest diagnostics snapshot after request completion
      await get().fetchDiagnostics();
    }
  },

  cancelTask: async () => {
    try {
      await window.forge.invoke('ai:cancel-task');
      set({ isStreaming: false });
    } catch (err) {
      console.error('[useAiStore] cancelTask failed:', err);
    }
  },

  clearHistory: () => {
    set({ messages: [] });
  },

  generatePlan: async (prompt, editorState) => {
    try {
      const { plan } = await window.forge.invoke('ai:generate-plan', { prompt, context: editorState }) as { plan: any };
      set({ plan });
    } catch (err) {
      console.error('[useAiStore] generatePlan failed:', err);
    }
  },

  executePlan: async () => {
    const { plan } = get();
    if (!plan) return;
    set({ isExecutingPlan: true });
    try {
      await window.forge.invoke('ai:execute-plan', { plan });
    } catch (err) {
      console.error('[useAiStore] executePlan failed:', err);
      set({ isExecutingPlan: false });
    }
  },

  cancelExecution: async () => {
    try {
      await window.forge.invoke('ai:cancel-execution');
      set({ isExecutingPlan: false });
    } catch (err) {
      console.error('[useAiStore] cancelExecution failed:', err);
    }
  },

  fetchDiagnostics: async () => {
    try {
      const diagnostics = await window.forge.invoke('ai:get-diagnostics');
      set({ diagnostics });
    } catch (err) {
      console.error('[useAiStore] fetchDiagnostics failed:', err);
    }
  }
}));
