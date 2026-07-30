import type { IIpcRouter, IWindowService } from '../../main/container/service-interfaces';
/**
 * Window IPC handlers — registered on the IPC router.
 *
 * All channels follow: window:*
 * Handler returns are typed for preload type safety.
 */
export declare function registerWindowHandlers(router: IIpcRouter, windowService: IWindowService): void;
