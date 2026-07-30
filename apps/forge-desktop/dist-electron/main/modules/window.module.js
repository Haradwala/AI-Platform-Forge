"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowModule = void 0;
const tokens_1 = require("../container/tokens");
const window_registry_1 = require("../window-registry");
const window_service_1 = require("../window-service");
/**
 * WindowModule — registers the WindowRegistry and WindowService in the container.
 *
 * Dependencies:
 * - CoreModule (provides T.IDesktopLogger)
 */
class WindowModule {
    name = 'WindowModule';
    dependencies = ['CoreModule'];
    register(container) {
        // 1. Register WindowRegistry as a singleton
        container.registerSingleton({
            token: tokens_1.T.IWindowRegistry,
            name: 'IWindowRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new window_registry_1.WindowRegistry(),
        });
        // 2. Register WindowService as a singleton
        container.registerSingleton({
            token: tokens_1.T.IWindowService,
            name: 'IWindowService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IWindowRegistry, tokens_1.T.IDesktopLogger],
            factory: (resolver) => new window_service_1.WindowService(resolver.resolve(tokens_1.T.IWindowRegistry), resolver.resolve(tokens_1.T.IDesktopLogger)),
        });
    }
}
exports.WindowModule = WindowModule;
//# sourceMappingURL=window.module.js.map