"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceModule = void 0;
const tokens_1 = require("../container/tokens");
const workspace_service_1 = require("../workspace-service");
/**
 * WorkspaceModule — registers the WorkspaceService.
 *
 * Dependencies:
 * - CoreModule (provides T.IDesktopLogger, T.IDesktopEventBus)
 * - WindowModule (provides T.IWindowRegistry)
 */
class WorkspaceModule {
    name = 'WorkspaceModule';
    dependencies = ['CoreModule', 'WindowModule'];
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.IWorkspaceService,
            name: 'IWorkspaceService',
            lifetime: 'singleton',
            dependencies: [tokens_1.T.IWindowRegistry, tokens_1.T.IDesktopLogger, tokens_1.T.IDesktopEventBus],
            factory: (resolver) => new workspace_service_1.WorkspaceService(resolver.resolve(tokens_1.T.IWindowRegistry), resolver.resolve(tokens_1.T.IDesktopLogger), resolver.resolve(tokens_1.T.IDesktopEventBus)),
        });
    }
}
exports.WorkspaceModule = WorkspaceModule;
//# sourceMappingURL=workspace.module.js.map