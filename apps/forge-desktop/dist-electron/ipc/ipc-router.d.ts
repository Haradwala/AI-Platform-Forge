import { IpcMainInvokeEvent } from 'electron';
import { IIpcRouter, IIpcMiddleware, IpcHandlerFn, IIpcResponse } from './interfaces';
/**
 * IpcRouter — central routing layer for all IPC communication.
 *
 * All ipcMain.handle() registrations flow through this router.
 * Cross-cutting concerns (logging, metrics, auth) are added as middleware.
 *
 * Architecture:
 *   ipcRenderer.invoke(channel, ...args)
 *     → ipcMain.handle (catch-all via per-channel registration)
 *       → middleware pipeline
 *         → route match (exact → pattern)
 *           → handler
 *             → IIpcResponse
 *
 * Epic 4 ships: Logger middleware + the router itself.
 * Epic 20 adds: Metrics middleware.
 * Future epics add: Auth middleware.
 */
export declare class IpcRouter implements IIpcRouter {
    private readonly handlers;
    private readonly patternHandlers;
    private readonly middleware;
    private readonly registeredChannels;
    use(middleware: IIpcMiddleware): void;
    handle(channel: string, handler: IpcHandlerFn): void;
    handlePattern(pattern: string, handler: IpcHandlerFn): void;
    attach(): void;
    detach(): void;
    dispatch(channel: string, event: IpcMainInvokeEvent, args: unknown[]): Promise<IIpcResponse>;
    private resolveHandler;
    private runMiddleware;
}
