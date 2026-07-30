"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerThemeHandlers = registerThemeHandlers;
const tokens_1 = require("../../main/container/tokens");
/**
 * Registers theme IPC handlers.
 */
function registerThemeHandlers(router, container) {
    const themeService = container.resolve(tokens_1.T.IThemeService);
    router.handle('theme:list', async () => {
        return themeService.listThemes();
    });
    router.handle('theme:get-active', async () => {
        return themeService.getActiveTheme();
    });
    router.handle('theme:set', async (ctx) => {
        const themeId = ctx.args[0];
        await themeService.loadTheme(themeId);
        return { success: true };
    });
}
//# sourceMappingURL=theme-handlers.js.map