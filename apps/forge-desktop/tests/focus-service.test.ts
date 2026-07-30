import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFocusStore } from '../src/stores/focus-store';
import { FocusService } from '../src/services/focus-service';
import { DesktopEventBus } from '../src/eventbus/desktop-eventbus';

describe('FocusService & FocusStore', () => {
  let eventBus: DesktopEventBus;

  beforeEach(() => {
    eventBus = new DesktopEventBus();
    FocusService.setEventBus(eventBus);
    useFocusStore.setState({ currentFocus: null });
  });

  it('updates state reactive regions correctly', () => {
    expect(FocusService.currentFocus()).toBeNull();

    FocusService.setFocus('editor');
    expect(FocusService.currentFocus()).toBe('editor');
    expect(useFocusStore.getState().currentFocus).toBe('editor');
  });

  it('broadcasts event bus changes on focus changed transitions', () => {
    const listener = vi.fn();
    eventBus.on('focus:changed', listener);

    FocusService.setFocus('dock');
    expect(listener).toHaveBeenCalledWith({
      oldFocus: null,
      newFocus: 'dock',
    });

    FocusService.setFocus('sidebar');
    expect(listener).toHaveBeenLastCalledWith({
      oldFocus: 'dock',
      newFocus: 'sidebar',
    });
  });
});
