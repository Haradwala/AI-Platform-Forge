"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupModule = void 0;
const tokens_1 = require("../container/tokens");
const startup_manager_1 = require("../startup-manager");
/**
 * StartupModule — registers the real StartupManager (not the stub).
 *
 * StartupManager requires the IDesktopContainer itself so it can:
 * - Call container.validate() in Stage 1
 * - Call container.initializeAll() in Stage 2
 * - Call container.freeze() in Stage 8
 * - Call container.shutdownAll() during shutdown
 *
 * Must be the last module loaded.
 */
class StartupModule {
    container;
    name = 'StartupModule';
    dependencies = [
        'CoreModule',
        'IpcModule',
        'WindowModule',
        'WorkspaceModule',
        'ThemeModule',
        'TerminalModule',
        'SessionModule',
        'PerformanceModule',
    ];
    constructor(container) {
        this.container = container;
    }
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.IStartupManager,
            name: 'IStartupManager',
            lifetime: 'singleton',
            dependencies: [
                tokens_1.T.IDesktopLogger,
                tokens_1.T.IDesktopEventBus,
                tokens_1.T.IIpcRouter,
                tokens_1.T.IWindowService,
                tokens_1.T.IWorkspaceService,
                tokens_1.T.IThemeService,
                tokens_1.T.ITerminalService,
                tokens_1.T.ISessionManager,
                tokens_1.T.IPerformanceMonitor,
            ],
            // The factory receives the container reference captured at construction time,
            // not via resolver — this is intentional. StartupManager must control the
            // full container lifecycle (validate, freeze, shutdownAll).
            factory: () => new startup_manager_1.StartupManager(this.container),
        });
    }
}
exports.StartupModule = StartupModule;
//# sourceMappingURL=startup.module.js.map