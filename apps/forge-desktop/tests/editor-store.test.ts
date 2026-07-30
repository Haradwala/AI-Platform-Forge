import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEditorStore } from '../src/stores/editor-store';

describe('EditorStore', () => {
  beforeEach(() => {
    useEditorStore.getState().clearTabs();
  });

  it('opens a new file and focuses it', () => {
    const store = useEditorStore.getState();
    store.openFile('/a.txt', 'a.txt', 'hello');

    const state = useEditorStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.tabs[0].path).toBe('/a.txt');
    expect(state.tabs[0].isDirty).toBe(false);
    expect(state.activeTabPath).toBe('/a.txt');
  });

  it('switches active focus if file already open', () => {
    const store = useEditorStore.getState();
    store.openFile('/a.txt', 'a.txt', 'hello');
    store.openFile('/b.txt', 'b.txt', 'world');
    expect(useEditorStore.getState().activeTabPath).toBe('/b.txt');

    store.openFile('/a.txt', 'a.txt', 'hello');
    expect(useEditorStore.getState().activeTabPath).toBe('/a.txt');
  });

  it('closes files and updates active focus to previous tab', () => {
    const store = useEditorStore.getState();
    store.openFile('/a.txt', 'a.txt', 'hello');
    store.openFile('/b.txt', 'b.txt', 'world');

    store.closeFile('/b.txt');
    const state = useEditorStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.activeTabPath).toBe('/a.txt');
  });

  it('marks tabs as dirty when editing contents', () => {
    const store = useEditorStore.getState();
    store.openFile('/a.txt', 'a.txt', 'hello');
    store.updateContent('/a.txt', 'hello edited');

    const state = useEditorStore.getState();
    expect(state.tabs[0].isDirty).toBe(true);
    expect(state.tabs[0].content).toBe('hello edited');
  });

  it('saves active file and resets dirty flag', async () => {
    const store = useEditorStore.getState();
    store.openFile('/a.txt', 'a.txt', 'hello');
    store.updateContent('/a.txt', 'hello saved');

    const saveFn = vi.fn().mockResolvedValue(undefined);
    await store.saveActiveFile(saveFn);

    expect(saveFn).toHaveBeenCalledWith('/a.txt', 'hello saved');
    expect(useEditorStore.getState().tabs[0].isDirty).toBe(false);
  });
});
