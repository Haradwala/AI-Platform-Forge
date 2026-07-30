"use strict";
/**
 * git-application-service.ts — Application Service for Git Source Control Operations
 *
 * Encapsulates Git application use-cases, routing repository state changes
 * through the Action System (ActionExecutor).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitApplicationService = void 0;
class GitApplicationService {
    actionExecutor;
    constructor(actionExecutor) {
        this.actionExecutor = actionExecutor;
    }
    async getStatus(workspaceRoot) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'git.status',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: {},
        });
    }
    async commit(workspaceRoot, message) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'git.commit',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { message },
        });
    }
    async checkout(workspaceRoot, branch) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'git.checkout',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { branch },
        });
    }
    async getDiff(workspaceRoot) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'git.diff',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: {},
        });
    }
    async pull(workspaceRoot) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'git.pull',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: {},
        });
    }
}
exports.GitApplicationService = GitApplicationService;
//# sourceMappingURL=git-application-service.js.map