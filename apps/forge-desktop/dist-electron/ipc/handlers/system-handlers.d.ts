import type { IDesktopContainer } from '../../main/container/interfaces';
import type { IIpcRouter } from '../../main/container/service-interfaces';
/**
 * System IPC handlers — basic system information channels.
 *
 * Channels:
 *   system:ping              → 'pong'
 *   system:get-version       → app version string
 *   system:get-platform      → process.platform
 *   system:get-startup-stage → StartupManager.getCurrentStage()
 */
export declare function registerSystemHandlers(router: IIpcRouter, container: IDesktopContainer): void;
export default registerSystemHandlers;
