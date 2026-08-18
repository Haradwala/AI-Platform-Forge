import { DesktopEventMap } from './desktop-events';

export type EventListener<T> = (payload: T) => void;

/**
 * DesktopEventBus — central event broker in the renderer process.
 *
 * It bridges events from the main process (via window.forge.on) and handles
 * renderer-to-renderer events.
 */
export class DesktopEventBus {
  private readonly listeners = new Map<keyof DesktopEventMap, Set<EventListener<any>>>();

  constructor() {
    this.bridgeElectronEvents();
  }

  on<K extends keyof DesktopEventMap>(
    event: K,
    listener: EventListener<DesktopEventMap[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => this.off(event, listener);
  }

  off<K extends keyof DesktopEventMap>(
    event: K,
    listener: EventListener<DesktopEventMap[K]>,
  ): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof DesktopEventMap>(event: K, payload: DesktopEventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;

    for (const listener of set) {
      try {
        listener(payload);
      } catch (err) {
        console.error(`[DesktopEventBus] Error in listener for event "${String(event)}":`, err);
      }
    }
  }

  private bridgeElectronEvents(): void {
    if (typeof window === 'undefined' || !window.forge) return;

    // Bridge file creation
    window.forge.on('workspace:file-created', (data: any) => {
      this.emit('workspace:file-created', data);
    });

    // Bridge file changes
    window.forge.on('workspace:file-changed', (data: any) => {
      this.emit('workspace:file-changed', data);
    });

    // Bridge file deletion
    window.forge.on('workspace:file-deleted', (data: any) => {
      this.emit('workspace:file-deleted', data);
    });

    // Bridge window state changes
    window.forge.on('window:state-changed', (data: any) => {
      this.emit('window:state-changed', data);
    });

    // Bridge startup stage changes
    window.forge.on('startup:stage-changed', (data: any) => {
      this.emit('startup:stage-changed', data);
    });

    // Bridge AI execution commands from Main process to Renderer subscribers
    window.forge.on('ai:execute-command', (data: any) => {
      console.log('[AI OPEN] received', data);
      this.emit('ai:execute-command', data);
    });
  }
}
