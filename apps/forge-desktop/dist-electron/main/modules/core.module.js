"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const tokens_1 = require("../container/tokens");
const desktop_logger_1 = require("../logging/desktop-logger");
const console_sink_1 = require("../logging/console-sink");
// ─── EventBus stub (replaced by full DesktopEventBus in Epic 10) ─────────────
const events_1 = require("events");
class StubDesktopEventBus {
    windowRegistryResolver;
    emitter = new events_1.EventEmitter();
    constructor(windowRegistryResolver) {
        this.windowRegistryResolver = windowRegistryResolver;
    }
    emit(topic, payload) {
        this.emitter.emit(topic, payload);
        try {
            const registry = this.windowRegistryResolver?.();
            if (registry) {
                for (const entry of registry.getAll()) {
                    if (entry.window && !entry.window.isDestroyed()) {
                        entry.window.webContents.send(topic, payload);
                    }
                }
            }
        }
        catch {
            // Non-fatal if window registry is unmounted or window is destroyed
        }
    }
    on(topic, listener) {
        this.emitter.on(topic, listener);
        return () => { this.emitter.off(topic, listener); };
    }
    off(topic, listener) {
        this.emitter.off(topic, listener);
    }
}
// ─── Module ───────────────────────────────────────────────────────────────────
/**
 * CoreModule — registers IDesktopLogger (real DesktopLogger) and IDesktopEventBus.
 * Must be loaded first; all other modules depend on it.
 *
 * Epic 19 wired: DesktopLogger with ConsoleSink replaces the previous stub.
 * Epic 10 wired: StubDesktopEventBus replaced by full DesktopEventBus.
 */
class CoreModule {
    options;
    name = 'CoreModule';
    dependencies = [];
    constructor(options) {
        this.options = options;
    }
    register(container) {
        container.registerSingleton({
            token: tokens_1.T.IDesktopLogger,
            name: 'IDesktopLogger',
            lifetime: 'singleton',
            dependencies: [],
            factory: () => {
                const logger = new desktop_logger_1.DesktopLogger({
                    namespace: 'Forge',
                    minLevel: this.options?.minLevel ?? 'debug',
                });
                if (!this.options?.noConsole) {
                    logger.addSink(new console_sink_1.ConsoleSink(process.env.NODE_ENV !== 'test'));
                }
                return logger;
            },
            dispose: (logger) => logger.dispose(),
        });
        container.registerSingleton({
            token: tokens_1.T.IDesktopEventBus,
            name: 'IDesktopEventBus',
            lifetime: 'singleton',
            dependencies: [],
            factory: (resolver) => new StubDesktopEventBus(() => resolver.tryResolve(tokens_1.T.IWindowRegistry) ?? null),
        });
    }
}
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map