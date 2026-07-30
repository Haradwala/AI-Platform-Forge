/**
 * WindowRegistry — the single source of truth for all BrowserWindows.
 *
 * Rules:
 * - No code outside WindowRegistry may hold a BrowserWindow reference
 * - Every window is registered by string ID at creation time
 * - Main window ID is 'main'
 * - Registry is injected into WindowService as a dependency
 */

export interface IWindowEntry {
  readonly id: string;
  readonly window: Electron.BrowserWindow;
  readonly createdAt: number;
}

export interface IWindowRegistry {
  register(id: string, window: Electron.BrowserWindow): void;
  unregister(id: string): void;
  get(id: string): Electron.BrowserWindow | null;
  getAll(): readonly IWindowEntry[];
  has(id: string): boolean;
  count(): number;
}

export class WindowRegistry implements IWindowRegistry {
  private readonly windows = new Map<string, IWindowEntry>();

  register(id: string, window: Electron.BrowserWindow): void {
    if (this.windows.has(id)) {
      throw new Error(`WindowRegistry: Window "${id}" is already registered.`);
    }
    this.windows.set(id, { id, window, createdAt: Date.now() });

    // Auto-unregister on close
    window.once('closed', () => this.unregister(id));
  }

  unregister(id: string): void {
    this.windows.delete(id);
  }

  get(id: string): Electron.BrowserWindow | null {
    return this.windows.get(id)?.window ?? null;
  }

  getAll(): readonly IWindowEntry[] {
    return Array.from(this.windows.values());
  }

  has(id: string): boolean {
    return this.windows.has(id);
  }

  count(): number {
    return this.windows.size;
  }
}
