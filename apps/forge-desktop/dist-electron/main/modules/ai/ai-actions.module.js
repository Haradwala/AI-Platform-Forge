"use strict";
/**
 * ai-actions.module.ts — Sub-module for Engineering Action System
 *
 * Registers ActionRegistry, CoreActionProvider, GitActionProvider, UIActionProvider,
 * ActionHistory, and ActionExecutor.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiActionsModule = void 0;
const tokens_1 = require("../../container/tokens");
const action_registry_1 = require("../../ai/actions/action-registry");
const core_action_provider_1 = require("../../ai/actions/providers/core-action-provider");
const git_action_provider_1 = require("../../ai/actions/providers/git-action-provider");
const ui_action_provider_1 = require("../../ai/actions/providers/ui-action-provider");
const action_history_1 = require("../../ai/actions/action-history");
const action_executor_1 = require("../../ai/actions/action-executor");
class AiActionsModule {
    static register(container) {
        // Action Registry & Action Providers
        container.registerSingleton({
            token: tokens_1.T.IActionRegistry,
            name: 'IActionRegistry',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => {
                const registry = new action_registry_1.ActionRegistry();
                const wsService = resolver.tryResolve(tokens_1.T.IWorkspaceService);
                const termService = resolver.tryResolve(tokens_1.T.ITerminalService);
                const codeIntel = resolver.tryResolve(tokens_1.T.ICodeIntelligenceEngine);
                registry.registerProvider(new core_action_provider_1.CoreActionProvider(wsService ?? undefined, termService ?? undefined, codeIntel ?? undefined));
                registry.registerProvider(new git_action_provider_1.GitActionProvider());
                registry.registerProvider(new ui_action_provider_1.UIActionProvider());
                return registry;
            }
        });
        // Action History
        container.registerSingleton({
            token: tokens_1.T.IActionHistory,
            name: 'IActionHistory',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => new action_history_1.ActionHistory()
        });
        // Action Executor
        container.registerSingleton({
            token: tokens_1.T.IActionExecutor,
            name: 'IActionExecutor',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new action_executor_1.ActionExecutor(resolver.tryResolve(tokens_1.T.IActionRegistry) ?? new action_registry_1.ActionRegistry(), resolver.tryResolve(tokens_1.T.IActionHistory) ?? new action_history_1.ActionHistory())
        });
    }
}
exports.AiActionsModule = AiActionsModule;
//# sourceMappingURL=ai-actions.module.js.map