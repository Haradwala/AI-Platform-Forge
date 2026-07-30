import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IIpcRouter } from '../container/service-interfaces';
import { T } from '../container/tokens';

/**
 * IpcModule — registers IIpcRouter with Logger and Metrics middleware pre-wired.
 * The real IpcRouter implementation from Epic 4 is used directly here.
 *
 * Imports are lazy (inside the factory) to keep this module Electron-independent
 * at parse time, making it safely importable by Vitest without Electron running.
 *
 * Epic 6 (StartupManager) calls ipcRouter.attach() during boot().
 */
export class IpcModule implements IContainerModule {
  readonly name = 'IpcModule';
  readonly dependencies = ['CoreModule'];

  register(container: IDesktopContainer): void {
    container.registerSingleton<IIpcRouter>({
      token:        T.IIpcRouter,
      name:         'IIpcRouter',
      lifetime:     'singleton',
      dependencies: [T.IDesktopLogger],
      factory: () => {
        // Lazy require keeps Electron imports out of module parse time
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { IpcRouter }        = require('../../ipc/ipc-router')        as typeof import('../../ipc/ipc-router');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { LoggerMiddleware, MetricsMiddleware } = require('../../ipc/ipc-middleware') as typeof import('../../ipc/ipc-middleware');
        const router = new IpcRouter();
        router.use(new LoggerMiddleware());
        router.use(new MetricsMiddleware());
        return router;
      },
      dispose: (router: IIpcRouter) => (router as any).detach?.(),
    });
  }
}
