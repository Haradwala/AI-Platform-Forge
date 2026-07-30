import { useWorkspaceStore } from '../stores/workspace-store';
import { useEditorStore } from '../stores/editor-store';
import { useLayoutStore, createDefaultLayout } from '../stores/layout-store';
import { SessionClient } from './session-client';

let isRestoring = false;

export async function restoreSession(): Promise<void> {
  if (isRestoring) return;
  isRestoring = true;

  try {
    const data = await SessionClient.restore();
    if (data && data.state) {
      const { editor, layout } = data.state;

      if (editor) {
        const editorStore = useEditorStore.getState();
        editorStore.clearTabs();
        if (editor.tabs) {
          editor.tabs.forEach((t: any) => {
            editorStore.openFile(t.path, t.name, t.content || '');
            if (t.isDirty === false) {
              useEditorStore.setState((state) => ({
                tabs: state.tabs.map((tab) =>
                  tab.path === t.path ? { ...tab, isDirty: false } : tab
                ),
              }));
            }
          });
        }
        if (editor.activeTabPath) {
          editorStore.setActiveTab(editor.activeTabPath);
        }
      }

      if (layout) {
        const defaultLayout = createDefaultLayout(layout.profile || 'Development');
        const restoredLayout = {
          ...defaultLayout,
          ...layout,
          sidebar: { ...defaultLayout.sidebar, ...(layout.sidebar || {}) },
          dock: { ...defaultLayout.dock, ...(layout.dock || {}) },
          secondarySidebar: { ...defaultLayout.secondarySidebar, ...(layout.secondarySidebar || {}) },
          floatingWindows: { ...defaultLayout.floatingWindows, ...(layout.floatingWindows || {}) },
        };
        useLayoutStore.setState(() => ({
          layout: restoredLayout,
          activePanelId: restoredLayout.sidebar.activePanelId,
          sidebarWidth: restoredLayout.sidebar.width,
          terminalHeight: restoredLayout.dock.height,
          isTerminalVisible: restoredLayout.dock.dockState !== 'collapsed',
        }));
      }
    }
  } catch (err) {
    console.error('[SessionHelper] Failed to restore session:', err);
  } finally {
    isRestoring = false;
  }
}

export async function saveSession(): Promise<void> {
  if (isRestoring) return;
  const workspaceState = useWorkspaceStore.getState();
  if (!workspaceState.rootPath) return;

  try {
    const editorState = useEditorStore.getState();
    const layoutState = useLayoutStore.getState();

    const stateToSave = {
      editor: {
        activeTabPath: editorState.activeTabPath,
        tabs: editorState.tabs.map((t) => ({
          path: t.path,
          name: t.name,
          content: t.content,
          isDirty: t.isDirty,
        })),
      },
      layout: layoutState.layout,
    };

    await SessionClient.save(stateToSave);
  } catch (err) {
    console.error('[SessionHelper] Failed to save session:', err);
  }
}

// Subscribe to store changes to trigger auto-saving.
// Both subscriptions share one debounce timer — whichever fires last wins.
// This prevents hundreds of consecutive saves during rapid state changes.
if (typeof window !== 'undefined') {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const scheduleSave = (): void => {
    if (debounceTimer !== null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      saveSession();
    }, 1500);
  };

  useEditorStore.subscribe(scheduleSave);
  useLayoutStore.subscribe(scheduleSave);
}
