import { BrowserWindow } from 'electron';
export interface WindowManagerOptions {
    readonly isDev: boolean;
    readonly devServerUrl: string;
}
export interface IWindowState {
    readonly isMaximized: boolean;
    readonly isMinimized: boolean;
    readonly isFullscreen: boolean;
    readonly isFocused: boolean;
    readonly width: number;
    readonly height: number;
    readonly x: number | undefined;
    readonly y: number | undefined;
}
/**
 * WindowManager owns the main BrowserWindow lifecycle.
 *
 * Responsibilities:
 * - Create and configure the main BrowserWindow
 * - Load the renderer (Vite dev server or production dist)
 * - Expose typed window state queries
 * - Forward window state changes to the renderer (Epic 3+ via IPC)
 *
 * Epic 7 (Window Service) will extend this with the full IWindowService contract.
 * Epic 11 (Window Registry) will register windows here for multi-window support.
 */
export declare class WindowManager {
    private mainWindow;
    private readonly options;
    constructor(options: WindowManagerOptions);
    createMainWindow(): Promise<BrowserWindow>;
    getMainWindow(): BrowserWindow | null;
    getWindowState(): IWindowState | null;
    maximize(): void;
    unmaximize(): void;
    minimize(): void;
    close(): void;
    toggleFullscreen(): void;
    private getAppIconPath;
}
