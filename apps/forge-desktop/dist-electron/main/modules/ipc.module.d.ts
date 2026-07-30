import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
/**
 * IpcModule — registers IIpcRouter with Logger and Metrics middleware pre-wired.
 * The real IpcRouter implementation from Epic 4 is used directly here.
 *
 * Imports are lazy (inside the factory) to keep this module Electron-independent
 * at parse time, making it safely importable by Vitest without Electron running.
 *
 * Epic 6 (StartupManager) calls ipcRouter.attach() during boot().
 */
export declare class IpcModule implements IContainerModule {
    readonly name = "IpcModule";
    readonly dependencies: string[];
    register(container: IDesktopContainer): void;
}
