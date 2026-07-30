import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutStore } from '../src/stores/layout-store';

describe('LayoutStore', () => {
  beforeEach(() => {
    useLayoutStore.getState().resetLayout();
  });

  it('sets active panel', () => {
    const store = useLayoutStore.getState();
    expect(store.activePanelId).toBe('explorer');

    store.setActivePanel('terminal');
    expect(useLayoutStore.getState().activePanelId).toBe('terminal');

    store.setActivePanel(null);
    expect(useLayoutStore.getState().activePanelId).toBeNull();
  });

  it('toggles sidebar visibility', () => {
    const store = useLayoutStore.getState();
    expect(store.activePanelId).toBe('explorer');

    store.toggleSidebar();
    expect(useLayoutStore.getState().activePanelId).toBeNull();

    store.toggleSidebar();
    expect(useLayoutStore.getState().activePanelId).toBe('explorer');
  });

  it('sets sidebar width within boundaries', () => {
    const store = useLayoutStore.getState();

    store.setSidebarWidth(300);
    expect(useLayoutStore.getState().sidebarWidth).toBe(300);

    // Below minimum boundary (150)
    store.setSidebarWidth(50);
    expect(useLayoutStore.getState().sidebarWidth).toBe(150);

    // Above maximum boundary (600)
    store.setSidebarWidth(1000);
    expect(useLayoutStore.getState().sidebarWidth).toBe(600);
  });

  it('sets terminal height within boundaries', () => {
    const store = useLayoutStore.getState();

    store.setTerminalHeight(250);
    expect(useLayoutStore.getState().terminalHeight).toBe(250);

    // Below minimum boundary (180 for DockHost)
    store.setTerminalHeight(30);
    expect(useLayoutStore.getState().terminalHeight).toBe(180);

    // Above maximum boundary (500)
    store.setTerminalHeight(1000);
    expect(useLayoutStore.getState().terminalHeight).toBe(500);
  });

  it('toggles terminal visibility', () => {
    const store = useLayoutStore.getState();
    expect(store.isTerminalVisible).toBe(false);

    store.toggleTerminal();
    expect(useLayoutStore.getState().isTerminalVisible).toBe(true);

    store.toggleTerminal();
    expect(useLayoutStore.getState().isTerminalVisible).toBe(false);
  });

  it('manages Dock state machine transitions', () => {
    const store = useLayoutStore.getState();
    expect(store.layout.dock.dockState).toBe('collapsed');

    store.openDock();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('open');
    expect(useLayoutStore.getState().isTerminalVisible).toBe(true);

    store.maximizeDock();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('maximized');

    store.minimizeDock();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('minimized');

    store.closeDock();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('collapsed');
    expect(useLayoutStore.getState().isTerminalVisible).toBe(false);
  });

  it('configures Dock positions and sizes', () => {
    const store = useLayoutStore.getState();
    expect(store.layout.dock.position).toBe('bottom');

    store.setDockPosition('right');
    expect(useLayoutStore.getState().layout.dock.position).toBe('right');

    store.setDockWidth(400);
    expect(useLayoutStore.getState().layout.dock.width).toBe(400);

    store.setDockActivePanel('output');
    expect(useLayoutStore.getState().layout.dock.activePanelId).toBe('output');
  });

  it('applies layout profiles correctly', () => {
    const store = useLayoutStore.getState();
    store.applyLayoutProfile('AI');
    
    const layout = useLayoutStore.getState().layout;
    expect(layout.profile).toBe('AI');
    expect(layout.dock.position).toBe('right');
    expect(layout.sidebar.activePanelId).toBe('chat');
  });

  it('tracks layout undo/redo history correctly', () => {
    const store = useLayoutStore.getState();
    expect(store.layout.dock.dockState).toBe('collapsed');

    store.openDock();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('open');

    store.undoLayout();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('collapsed');

    store.redoLayout();
    expect(useLayoutStore.getState().layout.dock.dockState).toBe('open');
  });
});
