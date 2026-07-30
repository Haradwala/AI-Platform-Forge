"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthIpcHandlers = registerHealthIpcHandlers;
function registerHealthIpcHandlers(ipcRouter, healthService) {
    if (!ipcRouter)
        return;
    ipcRouter.handle('repository:scan', async (rootPath) => {
        return healthService.scanRepository(rootPath);
    });
    ipcRouter.handle('repository:health', async () => {
        return healthService.getHealthReport();
    });
    ipcRouter.handle('repository:findings', async (severity, category) => {
        return healthService.getFindings(severity, category);
    });
    ipcRouter.handle('repository:snapshot', async () => {
        return healthService.getSnapshot();
    });
    ipcRouter.handle('repository:dead-code', async () => {
        return healthService.getFindings(undefined, 'dead-code');
    });
    ipcRouter.handle('repository:duplicates', async () => {
        return healthService.getFindings(undefined, 'duplicate');
    });
    ipcRouter.handle('repository:architecture', async () => {
        return healthService.getFindings(undefined, 'architecture');
    });
    ipcRouter.handle('repository:complexity', async () => {
        return healthService.getFindings(undefined, 'complexity');
    });
}
//# sourceMappingURL=health-ipc-handlers.js.map