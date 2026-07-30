"use strict";
/**
 * workspace-application-service.ts — Application Service for Workspace Operations
 *
 * Encapsulates workspace filesystem application use-cases, routing all mutations
 * through the Action System (ActionExecutor) to enforce permission validation,
 * audit logging, and undo/redo capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceApplicationService = void 0;
class WorkspaceApplicationService {
    actionExecutor;
    workspaceService;
    constructor(actionExecutor, workspaceService) {
        this.actionExecutor = actionExecutor;
        this.workspaceService = workspaceService;
    }
    async readFile(workspaceRoot, filePath) {
        const res = await this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'fs.read_file',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { filePath },
        });
        if (res.status === 'COMPLETED' && res.data?.content !== undefined) {
            return res.data.content;
        }
        if (this.workspaceService) {
            return this.workspaceService.readFile(filePath);
        }
        throw new Error(res.error || `Failed to read file: ${filePath}`);
    }
    async writeFile(workspaceRoot, filePath, content) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'fs.write_file',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { filePath, content },
        });
    }
    async createFile(workspaceRoot, filePath) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'fs.write_file',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { filePath, content: '' },
        });
    }
    async createFolder(workspaceRoot, folderPath) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'fs.create_folder',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { folderPath },
        });
    }
    async renameEntry(workspaceRoot, oldPath, newPath) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'fs.rename_file',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { oldPath, newPath },
        });
    }
    async deleteEntry(workspaceRoot, filePath) {
        return this.actionExecutor.executeAction({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            actionId: 'fs.delete_file',
            runtimeId: 'system',
            timestamp: Date.now(),
            workspaceRoot,
            params: { filePath },
        });
    }
}
exports.WorkspaceApplicationService = WorkspaceApplicationService;
//# sourceMappingURL=workspace-application-service.js.map