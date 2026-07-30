"use strict";
/**
 * WindowRegistry — the single source of truth for all BrowserWindows.
 *
 * Rules:
 * - No code outside WindowRegistry may hold a BrowserWindow reference
 * - Every window is registered by string ID at creation time
 * - Main window ID is 'main'
 * - Registry is injected into WindowService as a dependency
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowRegistry = void 0;
class WindowRegistry {
    windows = new Map();
    register(id, window) {
        if (this.windows.has(id)) {
            throw new Error(`WindowRegistry: Window "${id}" is already registered.`);
        }
        this.windows.set(id, { id, window, createdAt: Date.now() });
        // Auto-unregister on close
        window.once('closed', () => this.unregister(id));
    }
    unregister(id) {
        this.windows.delete(id);
    }
    get(id) {
        return this.windows.get(id)?.window ?? null;
    }
    getAll() {
        return Array.from(this.windows.values());
    }
    has(id) {
        return this.windows.has(id);
    }
    count() {
        return this.windows.size;
    }
}
exports.WindowRegistry = WindowRegistry;
//# sourceMappingURL=window-registry.js.map