/**
 * WindowService — IPC facade over the real BrowserWindow.
 *
 * All window operations go through WindowService.
 * No other file may call BrowserWindow methods directly.
 * Receives its BrowserWindow reference via IWindowRegistry.
 */
import type { IWindowRegistry } from './window-registry';
import type { IWindowService, IWindowState, IDesktopLogger } from './container/service-interfaces';
export declare class WindowService implements IWindowService {
    private readonly registry;
    private readonly logger;
    constructor(registry: IWindowRegistry, logger: IDesktopLogger);
    private get win();
    createMainWindow(): Promise<void>;
    private setupApplicationMenu;
    closeMainWindow(): void;
    maximize(): void;
    minimize(): void;
    restore(): void;
    toggleFullscreen(): void;
    close(): void;
    focus(): void;
    hide(): void;
    show(): void;
    setTitle(title: string): void;
    flashFrame(flag: boolean): void;
    getState(): IWindowState | null;
    private getAppIconPath;
}
