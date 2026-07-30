import { app } from 'electron';
import { IIpcContext } from '../interfaces';
import type { IDesktopContainer } from '../../main/container/interfaces';
import { T } from '../../main/container/tokens';
import type { IStartupManager, IPerformanceMonitor, IIpcRouter } from '../../main/container/service-interfaces';

/**
 * System IPC handlers — basic system information channels.
 *
 * Channels:
 *   system:ping              → 'pong'
 *   system:get-version       → app version string
 *   system:get-platform      → process.platform
 *   system:get-startup-stage → StartupManager.getCurrentStage()
 */
export function registerSystemHandlers(router: IIpcRouter, container: IDesktopContainer): void {
  router.handle('system:ping', async (_ctx: IIpcContext) => {
    return 'pong';
  });

  router.handle('system:get-version', async (_ctx: IIpcContext) => {
    return app.getVersion();
  });

  router.handle('system:get-platform', async (_ctx: IIpcContext) => {
    return process.platform;
  });

  router.handle('system:get-startup-stage', async (_ctx: IIpcContext) => {
    const startup = container.tryResolve<IStartupManager>(T.IStartupManager);
    return startup ? startup.getCurrentStage() : 'unknown';
  });

  router.handle('system:get-performance-snapshot', async (_ctx: IIpcContext) => {
    const monitor = container.tryResolve<IPerformanceMonitor>(T.IPerformanceMonitor);
    const latencies = monitor ? monitor.snapshot() : {};
    return {
      timestamp: new Date().toISOString(),
      rendererMemoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      ipcLatencyP95Ms: latencies,
      workspaceLoadMs: 0,
      startupMs: 0,
    };
  });
}
export default registerSystemHandlers;
