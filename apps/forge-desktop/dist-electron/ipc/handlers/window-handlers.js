"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWindowHandlers = registerWindowHandlers;
/**
 * Window IPC handlers — registered on the IPC router.
 *
 * All channels follow: window:*
 * Handler returns are typed for preload type safety.
 */
function registerWindowHandlers(router, windowService) {
    router.handle('window:maximize', async () => { windowService.maximize(); });
    router.handle('window:minimize', async () => { windowService.minimize(); });
    router.handle('window:restore', async () => { windowService.restore(); });
    router.handle('window:toggleFullscreen', async () => { windowService.toggleFullscreen(); });
    router.handle('window:close', async () => { windowService.close(); });
    router.handle('window:focus', async () => { windowService.focus(); });
    router.handle('window:hide', async () => { windowService.hide(); });
    router.handle('window:show', async () => { windowService.show(); });
    router.handle('window:getState', async () => windowService.getState());
    router.handle('window:setTitle', async (ctx) => {
        const title = ctx.args[0];
        windowService.setTitle(title);
    });
}
//# sourceMappingURL=window-handlers.js.map