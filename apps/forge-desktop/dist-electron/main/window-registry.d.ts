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
export declare class WindowRegistry implements IWindowRegistry {
    private readonly windows;
    register(id: string, window: Electron.BrowserWindow): void;
    unregister(id: string): void;
    get(id: string): Electron.BrowserWindow | null;
    getAll(): readonly IWindowEntry[];
    has(id: string): boolean;
    count(): number;
}
