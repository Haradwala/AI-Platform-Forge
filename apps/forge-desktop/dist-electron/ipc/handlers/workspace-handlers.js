"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWorkspaceHandlers = registerWorkspaceHandlers;
const electron_1 = require("electron");
/**
 * Workspace IPC handlers — binds workspace IPC channels to WorkspaceApplicationService and WorkspaceService.
 */
function registerWorkspaceHandlers(router, workspaceService, workspaceAppService) {
    /**
     * workspace:pick-folder — opens a native OS folder-picker dialog.
     * Returns the selected absolute path string, or null if the user cancelled.
     */
    router.handle('workspace:pick-folder', async (ctx) => {
        const win = electron_1.BrowserWindow.fromWebContents(ctx.sender);
        const result = await electron_1.dialog.showOpenDialog(win ?? electron_1.BrowserWindow.getFocusedWindow() ?? undefined, {
            title: 'Open Folder',
            properties: ['openDirectory', 'createDirectory'],
        });
        if (result.canceled || result.filePaths.length === 0)
            return null;
        return result.filePaths[0];
    });
    router.handle('workspace:open-folder', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:open-folder');
        return workspaceService.open(path);
    });
    router.handle('workspace:close', async () => {
        return workspaceService.close();
    });
    router.handle('workspace:get-tree', async () => {
        return workspaceService.getTree();
    });
    router.handle('workspace:read-file', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:read-file');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            return workspaceAppService.readFile(root, path);
        }
        return workspaceService.readFile(path);
    });
    router.handle('workspace:write-file', async (ctx) => {
        const path = ctx.args[0];
        const content = ctx.args[1];
        if (!path)
            throw new Error('Path is required for workspace:write-file');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.writeFile(root, path, content ?? '');
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to write file');
            return true;
        }
        return workspaceService.writeFile(path, content ?? '');
    });
    router.handle('workspace:create-file', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:create-file');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.createFile(root, path);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to create file');
            return true;
        }
        return workspaceService.createFile(path);
    });
    router.handle('workspace:create-folder', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:create-folder');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.createFolder(root, path);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to create folder');
            return true;
        }
        return workspaceService.createFolder(path);
    });
    router.handle('workspace:rename-entry', async (ctx) => {
        const oldPath = ctx.args[0];
        const newPath = ctx.args[1];
        if (!oldPath || !newPath)
            throw new Error('oldPath and newPath are required for workspace:rename-entry');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.renameEntry(root, oldPath, newPath);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to rename entry');
            return true;
        }
        return workspaceService.renameEntry(oldPath, newPath);
    });
    router.handle('workspace:delete-entry', async (ctx) => {
        const path = ctx.args[0];
        if (!path)
            throw new Error('Path is required for workspace:delete-entry');
        const root = workspaceService.getRootPath() || '';
        if (workspaceAppService) {
            const res = await workspaceAppService.deleteEntry(root, path);
            if (res.status === 'FAILED')
                throw new Error(res.error || 'Failed to delete entry');
            return true;
        }
        return workspaceService.deleteEntry(path);
    });
    router.handle('workspace:get-recent', async () => {
        return workspaceService.getRecentWorkspaces();
    });
}
//# sourceMappingURL=workspace-handlers.js.map