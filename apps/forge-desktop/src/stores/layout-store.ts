import { create } from 'zustand';

export interface IFloatingWindow {
  readonly id: string;
  readonly panelId: string;
  readonly title: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly focused: boolean;
  readonly minimized: boolean;
}

export interface WorkbenchLayout {
  readonly version: number;
  readonly profile: string;
  readonly activityBar: { readonly visible: boolean };
  readonly sidebar: { readonly activePanelId: string | null; readonly width: number };
  readonly editor: { readonly visible: boolean };
  readonly dock: {
    readonly activePanelId: string | null;
    readonly position: 'bottom' | 'left' | 'right';
    readonly height: number;
    readonly width: number;
    readonly dockState: 'collapsed' | 'opening' | 'open' | 'dragging' | 'maximized' | 'minimized' | 'closing';
    readonly previousDockHeight: number;
    readonly previousDockWidth: number;
  };
  readonly statusBar: { readonly visible: boolean };
  readonly secondarySidebar: { readonly visible: boolean; readonly activePanelId: string | null; readonly width: number };
  readonly floatingWindows: { readonly windows: IFloatingWindow[] };
  /** Phase 1 — right-side Agent Panel shell. Content wired in Phase 2. */
  readonly agentPanel: { readonly visible: boolean; readonly width: number };
}

export interface LayoutProfile {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly layout: WorkbenchLayout;
}

export const createDefaultLayout = (profileName: string = 'Development'): WorkbenchLayout => ({
  version: 1,
  profile: profileName,
  activityBar: { visible: true },
  sidebar: { activePanelId: 'explorer', width: 260 },
  editor: { visible: true },
  dock: {
    activePanelId: 'terminal',
    position: 'bottom',
    height: 250,
    width: 300,
    dockState: 'collapsed',
    previousDockHeight: 250,
    previousDockWidth: 300,
  },
  statusBar: { visible: true },
  secondarySidebar: { visible: false, activePanelId: null, width: 260 },
  floatingWindows: { windows: [] },
  agentPanel: { visible: false, width: 380 },
});

export const layoutProfiles: Record<string, LayoutProfile> = {
  Development: {
    id: 'Development',
    name: 'Development',
    description: 'Standard coding workspace with explorer sidebar and bottom terminal.',
    icon: 'Code',
    layout: createDefaultLayout('Development'),
  },
  AI: {
    id: 'AI',
    name: 'AI Workspace',
    description: 'AI-first workflow layout placing chat panels on the right side dock.',
    icon: 'Brain',
    layout: {
      ...createDefaultLayout('AI'),
      sidebar: { activePanelId: 'chat', width: 300 },
      dock: {
        activePanelId: 'ai_logs',
        position: 'right',
        height: 250,
        width: 350,
        dockState: 'open',
        previousDockHeight: 250,
        previousDockWidth: 350,
      },
    },
  },
  Debugging: {
    id: 'Debugging',
    name: 'Debugging',
    description: 'Layout designed for troubleshooting sessions showing the debug console.',
    icon: 'Bug',
    layout: {
      ...createDefaultLayout('Debugging'),
      dock: {
        activePanelId: 'debug',
        position: 'bottom',
        height: 300,
        width: 300,
        dockState: 'open',
        previousDockHeight: 300,
        previousDockWidth: 300,
      },
    },
  },
  Git: {
    id: 'Git',
    name: 'Git Version Control',
    description: 'Focused view of code changes and repository git logs.',
    icon: 'GitBranch',
    layout: {
      ...createDefaultLayout('Git'),
      dock: {
        activePanelId: 'git',
        position: 'bottom',
        height: 280,
        width: 300,
        dockState: 'open',
        previousDockHeight: 280,
        previousDockWidth: 300,
      },
    },
  },
  Minimal: {
    id: 'Minimal',
    name: 'Minimalist Focus',
    description: 'Distraction-free environment with hidden sidebars and terminals.',
    icon: 'EyeOff',
    layout: {
      ...createDefaultLayout('Minimal'),
      sidebar: { activePanelId: null, width: 260 },
      dock: {
        activePanelId: null,
        position: 'bottom',
        height: 250,
        width: 300,
        dockState: 'collapsed',
        previousDockHeight: 250,
        previousDockWidth: 300,
      },
    },
  },
  Database: {
    id: 'Database',
    name: 'Database Console',
    description: 'Structured grid interface displaying the Database console.',
    icon: 'Database',
    layout: {
      ...createDefaultLayout('Database'),
      dock: {
        activePanelId: 'database',
        position: 'bottom',
        height: 320,
        width: 300,
        dockState: 'open',
        previousDockHeight: 320,
        previousDockWidth: 300,
      },
    },
  },
};

interface LayoutState {
  // Structured layout object & histories
  layout: WorkbenchLayout;
  history: WorkbenchLayout[];
  redoHistory: WorkbenchLayout[];

  // Backward-compatible properties derived or mapped
  activePanelId: string | null;
  sidebarWidth: number;
  terminalHeight: number;
  isTerminalVisible: boolean;

  // State transitions & mutations
  openDock: () => void;
  closeDock: () => void;
  toggleDock: () => void;
  setDockState: (state: WorkbenchLayout['dock']['dockState']) => void;
  setDockActivePanel: (id: string | null) => void;
  setDockHeight: (height: number) => void;
  setDockWidth: (width: number) => void;
  setDockPosition: (pos: WorkbenchLayout['dock']['position']) => void;
  maximizeDock: () => void;
  minimizeDock: () => void;

  // Sidebar controls
  toggleSidebar: () => void;
  setActivePanel: (id: string | null) => void;
  setSidebarWidth: (width: number) => void;

  // History & profiles actions
  applyLayoutProfile: (profileId: string) => void;
  undoLayout: () => void;
  redoLayout: () => void;

  // Legacy actions mapped
  setTerminalHeight: (height: number) => void;
  toggleTerminal: () => void;
  resetLayout: () => void;

  // ── Agent Panel (Phase 1 shell) ──────────────────────────────────────────
  toggleAgentPanel: () => void;
  setAgentPanelWidth: (width: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => {
  const initialLayout = createDefaultLayout('Development');

  const pushState = (state: LayoutState, nextLayout: WorkbenchLayout) => {
    const nextHistory = [...state.history, state.layout].slice(-20);
    return {
      layout: nextLayout,
      history: nextHistory,
      redoHistory: [],
      activePanelId: nextLayout.sidebar.activePanelId,
      sidebarWidth: nextLayout.sidebar.width,
      terminalHeight: nextLayout.dock.height,
      isTerminalVisible: nextLayout.dock.dockState !== 'collapsed',
    };
  };

  return {
    layout: initialLayout,
    history: [],
    redoHistory: [],

    activePanelId: 'explorer',
    sidebarWidth: 260,
    terminalHeight: 250,
    isTerminalVisible: false,

    openDock: () =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, dockState: 'open' as const },
        };
        return pushState(state, nextLayout);
      }),

    closeDock: () =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, dockState: 'collapsed' as const },
        };
        return pushState(state, nextLayout);
      }),

    toggleDock: () =>
      set((state) => {
        const isCurrentlyOpen = state.layout.dock.dockState !== 'collapsed';
        const nextState = isCurrentlyOpen ? ('collapsed' as const) : ('open' as const);
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, dockState: nextState },
        };
        return pushState(state, nextLayout);
      }),

    setDockState: (dockState) =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, dockState },
        };
        return pushState(state, nextLayout);
      }),

    setDockActivePanel: (id) =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, activePanelId: id },
        };
        return pushState(state, nextLayout);
      }),

    setDockHeight: (height) =>
      set((state) => {
        const safeHeight = Math.max(180, Math.min(500, height));
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, height: safeHeight },
        };
        return pushState(state, nextLayout);
      }),

    setDockWidth: (width) =>
      set((state) => {
        const safeWidth = Math.max(180, Math.min(800, width));
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, width: safeWidth },
        };
        return pushState(state, nextLayout);
      }),

    setDockPosition: (dockPosition) =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, position: dockPosition },
        };
        return pushState(state, nextLayout);
      }),

    maximizeDock: () =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: {
            ...state.layout.dock,
            dockState: 'maximized' as const,
            previousDockHeight: state.layout.dock.height,
            previousDockWidth: state.layout.dock.width,
          },
        };
        return pushState(state, nextLayout);
      }),

    minimizeDock: () =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, dockState: 'minimized' as const },
        };
        return pushState(state, nextLayout);
      }),

    toggleSidebar: () =>
      set((state) => {
        const nextId = state.layout.sidebar.activePanelId ? null : 'explorer';
        const nextLayout = {
          ...state.layout,
          sidebar: { ...state.layout.sidebar, activePanelId: nextId },
        };
        return pushState(state, nextLayout);
      }),

    setActivePanel: (id) =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          sidebar: { ...state.layout.sidebar, activePanelId: id },
        };
        return pushState(state, nextLayout);
      }),

    setSidebarWidth: (width) =>
      set((state) => {
        const safeWidth = Math.max(150, Math.min(600, width));
        const nextLayout = {
          ...state.layout,
          sidebar: { ...state.layout.sidebar, width: safeWidth },
        };
        return pushState(state, nextLayout);
      }),

    applyLayoutProfile: (profileId) =>
      set((state) => {
        const profile = layoutProfiles[profileId];
        if (!profile) return {};
        return pushState(state, profile.layout);
      }),

    undoLayout: () =>
      set((state) => {
        if (state.history.length === 0) return {};
        const prevLayout = state.history[state.history.length - 1];
        const nextHistory = state.history.slice(0, -1);
        return {
          layout: prevLayout,
          history: nextHistory,
          redoHistory: [state.layout, ...state.redoHistory],
          activePanelId: prevLayout.sidebar.activePanelId,
          sidebarWidth: prevLayout.sidebar.width,
          terminalHeight: prevLayout.dock.height,
          isTerminalVisible: prevLayout.dock.dockState !== 'collapsed',
        };
      }),

    redoLayout: () =>
      set((state) => {
        if (state.redoHistory.length === 0) return {};
        const nextLayout = state.redoHistory[0];
        const remainingRedo = state.redoHistory.slice(1);
        return {
          layout: nextLayout,
          history: [...state.history, state.layout],
          redoHistory: remainingRedo,
          activePanelId: nextLayout.sidebar.activePanelId,
          sidebarWidth: nextLayout.sidebar.width,
          terminalHeight: nextLayout.dock.height,
          isTerminalVisible: nextLayout.dock.dockState !== 'collapsed',
        };
      }),

    setTerminalHeight: (height) =>
      set((state) => {
        const safeHeight = Math.max(180, Math.min(500, height));
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, height: safeHeight },
        };
        return pushState(state, nextLayout);
      }),

    toggleTerminal: () =>
      set((state) => {
        const isCurrentlyOpen = state.layout.dock.dockState !== 'collapsed';
        const nextState = isCurrentlyOpen ? ('collapsed' as const) : ('open' as const);
        const nextLayout = {
          ...state.layout,
          dock: { ...state.layout.dock, dockState: nextState },
        };
        return pushState(state, nextLayout);
      }),

    resetLayout: () =>
      set(() => ({
        layout: createDefaultLayout('Development'),
        history: [],
        redoHistory: [],
        activePanelId: 'explorer',
        sidebarWidth: 260,
        terminalHeight: 250,
        isTerminalVisible: false,
      })),

    // ── Agent Panel (Phase 1 shell) ──────────────────────────────────────────
    toggleAgentPanel: () =>
      set((state) => {
        const nextLayout = {
          ...state.layout,
          agentPanel: {
            ...state.layout.agentPanel,
            visible: !state.layout.agentPanel.visible,
          },
        };
        return pushState(state, nextLayout);
      }),

    setAgentPanelWidth: (width) =>
      set((state) => {
        const safeWidth = Math.max(280, Math.min(760, width));
        const nextLayout = {
          ...state.layout,
          agentPanel: { ...state.layout.agentPanel, width: safeWidth },
        };
        return pushState(state, nextLayout);
      }),
  };
});
