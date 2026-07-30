"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcRouter = void 0;
const electron_1 = require("electron");
/**
 * IpcRouter — central routing layer for all IPC communication.
 *
 * All ipcMain.handle() registrations flow through this router.
 * Cross-cutting concerns (logging, metrics, auth) are added as middleware.
 *
 * Architecture:
 *   ipcRenderer.invoke(channel, ...args)
 *     → ipcMain.handle (catch-all via per-channel registration)
 *       → middleware pipeline
 *         → route match (exact → pattern)
 *           → handler
 *             → IIpcResponse
 *
 * Epic 4 ships: Logger middleware + the router itself.
 * Epic 20 adds: Metrics middleware.
 * Future epics add: Auth middleware.
 */
class IpcRouter {
    handlers = new Map();
    patternHandlers = [];
    middleware = [];
    registeredChannels = [];
    // ── Middleware registration ────────────────────────────────────────────────
    use(middleware) {
        this.middleware.push(middleware);
    }
    // ── Handler registration ──────────────────────────────────────────────────
    handle(channel, handler) {
        if (this.handlers.has(channel)) {
            console.warn(`[IpcRouter] Overwriting handler for channel: ${channel}`);
        }
        this.handlers.set(channel, handler);
    }
    handlePattern(pattern, handler) {
        // pattern format: 'workspace:*' — matches any channel starting with 'workspace:'
        const prefix = pattern.endsWith(':*') ? pattern.slice(0, -1) : pattern;
        this.patternHandlers.push({ prefix, handler });
    }
    // ── Attach / Detach ───────────────────────────────────────────────────────
    attach() {
        const allChannels = Array.from(this.handlers.keys());
        for (const channel of allChannels) {
            electron_1.ipcMain.handle(channel, (event, ...args) => this.dispatch(channel, event, args));
            this.registeredChannels.push(channel);
        }
    }
    detach() {
        for (const channel of this.registeredChannels) {
            electron_1.ipcMain.removeHandler(channel);
        }
        this.registeredChannels.length = 0;
    }
    // ── Dispatch ──────────────────────────────────────────────────────────────
    async dispatch(channel, event, args) {
        const ctx = {
            channel,
            windowId: event.sender.id,
            sender: event.sender,
            args,
            startedAt: Date.now(),
        };
        try {
            await this.runMiddleware(ctx, 0, async () => {
                const handler = this.resolveHandler(channel);
                if (!handler) {
                    throw new Error(`[IpcRouter] No handler registered for channel: ${channel}`);
                }
                ctx.response = await handler(ctx);
            });
            return { ok: true, data: ctx.response };
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            ctx.error = error;
            return { ok: false, error: error.message };
        }
    }
    // ── Private helpers ────────────────────────────────────────────────────────
    resolveHandler(channel) {
        // Exact match first
        if (this.handlers.has(channel)) {
            return this.handlers.get(channel);
        }
        // Pattern match
        for (const { prefix, handler } of this.patternHandlers) {
            if (channel.startsWith(prefix)) {
                return handler;
            }
        }
        return undefined;
    }
    async runMiddleware(ctx, index, finalHandler) {
        if (index >= this.middleware.length) {
            return finalHandler();
        }
        const mw = this.middleware[index];
        await mw.handle(ctx, () => this.runMiddleware(ctx, index + 1, finalHandler));
    }
}
exports.IpcRouter = IpcRouter;
//# sourceMappingURL=ipc-router.js.map