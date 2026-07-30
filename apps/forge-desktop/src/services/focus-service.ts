import { useFocusStore, FocusRegion } from '../stores/focus-store';
import { DesktopEventBus } from '../eventbus/desktop-eventbus';

let globalEventBus: DesktopEventBus | null = null;

export class FocusService {
  static setEventBus(bus: DesktopEventBus): void {
    globalEventBus = bus;
  }

  static currentFocus(): FocusRegion {
    return useFocusStore.getState().currentFocus;
  }

  static setFocus(region: FocusRegion): void {
    const oldFocus = useFocusStore.getState().currentFocus;
    if (oldFocus === region) return;

    useFocusStore.getState().setFocus(region);

    if (globalEventBus) {
      globalEventBus.emit('focus:changed', { oldFocus, newFocus: region });
    }
  }

  static focusEditor(): void {
    this.setFocus('editor');
    const el = document.querySelector('.monaco-editor textarea') as HTMLTextAreaElement;
    if (el) el.focus();
  }

  static focusDock(): void {
    this.setFocus('dock');
    const el = document.querySelector('.xterm-helper-textarea') as HTMLTextAreaElement;
    if (el) el.focus();
  }

  static focusSidebar(): void {
    this.setFocus('sidebar');
    const el = document.querySelector('#forge-activity-sidebar') as HTMLElement;
    if (el) el.focus();
  }

  static focusActivityBar(): void {
    this.setFocus('activityBar');
    const el = document.querySelector('#forge-activity-sidebar button') as HTMLElement;
    if (el) el.focus();
  }

  static focusAI(): void {
    this.setFocus('ai');
    const el = document.querySelector('#ai-chat-input') as HTMLTextAreaElement;
    if (el) el.focus();
  }
}
export default FocusService;
