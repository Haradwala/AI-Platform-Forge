"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTerminalHandlers = registerTerminalHandlers;
const tokens_1 = require("../../main/container/tokens");
/**
 * Terminal IPC handlers — wires terminal IPC channels to TerminalService (node-pty).
 *
 * Data flow (main → renderer):
 *   TerminalService.create() → IDesktopEventBus.emit(`terminal:data:<id>`) →
 *   terminal-handlers (subscribed) → ctx.sender.send(`terminal:data:<id>`, data) →
 *   preload terminal.onData() → xterm.js
 *
 * Data flow (renderer → main):
 *   xterm.js keypress → forge.terminal.write() → IPC → TerminalService.write() → pty
 */
function registerTerminalHandlers(router, container) {
    const terminalService = container.resolve(tokens_1.T.ITerminalService);
    const eventBus = container.resolve(tokens_1.T.IDesktopEventBus);
    /**
     * terminal:create — spawns a new pty session.
     * Args: [sessionId: string]
     */
    router.handle('terminal:create', async (ctx) => {
        const id = ctx.args[0];
        if (!id)
            throw new Error('terminal:create requires a session ID');
        await terminalService.create(id);
        // Subscribe to pty output on the event bus and push it to the renderer window.
        // We store the unsubscribe fn so we can clean up when the session is killed.
        const unsubscribeData = eventBus.on(`terminal:data:${id}`, (data) => {
            if (ctx.sender && !ctx.sender.isDestroyed()) {
                ctx.sender.send(`terminal:data:${id}`, data);
            }
        });
        const unsubscribeExit = eventBus.on(`terminal:exit:${id}`, (info) => {
            if (ctx.sender && !ctx.sender.isDestroyed()) {
                ctx.sender.send(`terminal:exit:${id}`, info);
            }
            // Auto-cleanup subscriptions when pty exits
            unsubscribeData();
            unsubscribeExit();
        });
        return { success: true };
    });
    /**
     * terminal:write — writes raw input data to a pty session.
     * Args: [sessionId: string, data: string]
     */
    router.handle('terminal:write', async (ctx) => {
        const id = ctx.args[0];
        const data = ctx.args[1];
        if (!id)
            throw new Error('terminal:write requires a session ID');
        terminalService.write(id, data ?? '');
        return { success: true };
    });
    /**
     * terminal:resize — resizes the pty window.
     * Args: [sessionId: string, cols: number, rows: number]
     */
    router.handle('terminal:resize', async (ctx) => {
        const id = ctx.args[0];
        const cols = ctx.args[1];
        const rows = ctx.args[2];
        if (!id)
            throw new Error('terminal:resize requires a session ID');
        terminalService.resize(id, cols ?? 80, rows ?? 24);
        return { success: true };
    });
    /**
     * terminal:kill — terminates a pty session.
     * Args: [sessionId: string]
     */
    router.handle('terminal:kill', async (ctx) => {
        const id = ctx.args[0];
        if (!id)
            throw new Error('terminal:kill requires a session ID');
        await terminalService.kill(id);
        return { success: true };
    });
}
//# sourceMappingURL=terminal-handlers.js.map