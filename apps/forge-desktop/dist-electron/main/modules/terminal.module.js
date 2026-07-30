"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalModule = void 0;
const tokens_1 = require("../container/tokens");
const terminal_service_1 = require("../terminal-service");
class TerminalModule {
    name = 'TerminalModule';
    dependencies = ['CoreModule'];
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.ITerminalService,
            name: 'ITerminalService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IDesktopLogger, tokens_1.T.IDesktopEventBus],
            factory: () => new terminal_service_1.TerminalService(container.resolve(tokens_1.T.IDesktopLogger), container.resolve(tokens_1.T.IDesktopEventBus)),
        });
    }
}
exports.TerminalModule = TerminalModule;
//# sourceMappingURL=terminal.module.js.map