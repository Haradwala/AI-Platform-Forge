"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSystemHandlers = registerSystemHandlers;
const electron_1 = require("electron");
const tokens_1 = require("../../main/container/tokens");
/**
 * System IPC handlers — basic system information channels.
 *
 * Channels:
 *   system:ping              → 'pong'
 *   system:get-version       → app version string
 *   system:get-platform      → process.platform
 *   system:get-startup-stage → StartupManager.getCurrentStage()
 */
function registerSystemHandlers(router, container) {
    router.handle('system:ping', async (_ctx) => {
        return 'pong';
    });
    router.handle('system:get-version', async (_ctx) => {
        return electron_1.app.getVersion();
    });
    router.handle('system:get-platform', async (_ctx) => {
        return process.platform;
    });
    router.handle('system:get-startup-stage', async (_ctx) => {
        const startup = container.tryResolve(tokens_1.T.IStartupManager);
        return startup ? startup.getCurrentStage() : 'unknown';
    });
    router.handle('system:get-performance-snapshot', async (_ctx) => {
        const monitor = container.tryResolve(tokens_1.T.IPerformanceMonitor);
        const latencies = monitor ? monitor.snapshot() : {};
        return {
            timestamp: new Date().toISOString(),
            rendererMemoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            ipcLatencyP95Ms: latencies,
            workspaceLoadMs: 0,
            startupMs: 0,
        };
    });
}
exports.default = registerSystemHandlers;
//# sourceMappingURL=system-handlers.js.map