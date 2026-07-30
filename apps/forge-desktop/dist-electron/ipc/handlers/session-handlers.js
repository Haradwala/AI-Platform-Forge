"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSessionHandlers = registerSessionHandlers;
const tokens_1 = require("../../main/container/tokens");
function registerSessionHandlers(router, container) {
    const sessionManager = container.resolve(tokens_1.T.ISessionManager);
    router.handle('session:save', async (ctx) => {
        const state = ctx.args[0];
        await sessionManager.save(state);
        return { success: true };
    });
    router.handle('session:restore', async () => {
        const data = await sessionManager.restore();
        return data;
    });
    router.handle('session:clear', async () => {
        await sessionManager.clear();
        return { success: true };
    });
}
//# sourceMappingURL=session-handlers.js.map