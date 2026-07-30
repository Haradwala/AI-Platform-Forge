"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModule = void 0;
const tokens_1 = require("../container/tokens");
const session_manager_1 = require("../session-manager");
class SessionModule {
    name = 'SessionModule';
    dependencies = ['CoreModule', 'WorkspaceModule'];
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.ISessionManager,
            name: 'ISessionManager',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IDesktopLogger, tokens_1.T.IWorkspaceService],
            factory: () => new session_manager_1.SessionManager(container.resolve(tokens_1.T.IDesktopLogger), container.resolve(tokens_1.T.IWorkspaceService)),
        });
    }
}
exports.SessionModule = SessionModule;
//# sourceMappingURL=session.module.js.map