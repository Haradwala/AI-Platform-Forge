"use strict";
/**
 * terminal-application-service.ts — Application Service for Terminal & Command Operations
 *
 * Encapsulates terminal execution application use-cases, routing command invocations
 * through the Action System (ActionExecutor) to enforce audit logging and policy checks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalApplicationService = void 0;
class TerminalApplicationService {
    actionExecutor;
    constructor(actionExecutor) {
        this.actionExecutor = actionExecutor;
    }
    async runCommand(workspaceRoot, command) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'term.run_command',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { command },
        });
    }
    async runTests(workspaceRoot, testCommand) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'term.run_tests',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { testCommand },
        });
    }
    async runBuild(workspaceRoot, buildCommand) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'term.run_build',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { buildCommand },
        });
    }
    async runLint(workspaceRoot, lintCommand) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'term.run_lint',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { lintCommand },
        });
    }
}
exports.TerminalApplicationService = TerminalApplicationService;
//# sourceMappingURL=terminal-application-service.js.map