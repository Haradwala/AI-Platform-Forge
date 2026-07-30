"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcModule = void 0;
const tokens_1 = require("../container/tokens");
/**
 * IpcModule — registers IIpcRouter with Logger and Metrics middleware pre-wired.
 * The real IpcRouter implementation from Epic 4 is used directly here.
 *
 * Imports are lazy (inside the factory) to keep this module Electron-independent
 * at parse time, making it safely importable by Vitest without Electron running.
 *
 * Epic 6 (StartupManager) calls ipcRouter.attach() during boot().
 */
class IpcModule {
    name = 'IpcModule';
    dependencies = ['CoreModule'];
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.IIpcRouter,
            name: 'IIpcRouter',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IDesktopLogger],
            factory: () => {
                // Lazy require keeps Electron imports out of module parse time
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { IpcRouter } = require('../../ipc/ipc-router');
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { LoggerMiddleware, MetricsMiddleware } = require('../../ipc/ipc-middleware');
                const router = new IpcRouter();
                router.use(new LoggerMiddleware());
                router.use(new MetricsMiddleware());
                return router;
            },
            dispose: (router) => router.detach?.(),
        });
    }
}
exports.IpcModule = IpcModule;
//# sourceMappingURL=ipc.module.js.map