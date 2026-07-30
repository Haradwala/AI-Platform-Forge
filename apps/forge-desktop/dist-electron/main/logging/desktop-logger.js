"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesktopLogger = void 0;
const LEVEL_ORDER = {
    debug: 0, info: 1, warn: 2, error: 3,
};
/**
 * DesktopLogger — main-process logger.
 *
 * Features:
 * - Multiple sinks (console + file simultaneously)
 * - Level filtering (minimum level)
 * - Namespaced child loggers (parent.child → "Forge:WorkspaceService")
 * - All services call logger.child('ServiceName') to get namespaced loggers
 * - Sinks receive structured ILogEntry objects
 *
 * Used as IDesktopLogger in the DI container (replaces StubDesktopLogger).
 */
class DesktopLogger {
    sinks_;
    namespace_;
    minLevel_;
    constructor(options) {
        this.sinks_ = options?.sinks ?? [];
        this.namespace_ = options?.namespace ?? 'Forge';
        this.minLevel_ = options?.minLevel ?? 'debug';
    }
    // ─── ILogger ───────────────────────────────────────────────────────────────
    debug(message, ...args) { this.log('debug', message, args); }
    info(message, ...args) { this.log('info', message, args); }
    warn(message, ...args) { this.log('warn', message, args); }
    error(message, ...args) { this.log('error', message, args); }
    child(namespace) {
        return new DesktopLogger({
            sinks: this.sinks_,
            namespace: `${this.namespace_}:${namespace}`,
            minLevel: this.minLevel_,
        });
    }
    // ─── Sink management ───────────────────────────────────────────────────────
    addSink(sink) {
        this.sinks_.push(sink);
    }
    removeSink(name) {
        const idx = this.sinks_.findIndex((s) => s.name === name);
        if (idx !== -1)
            this.sinks_.splice(idx, 1);
    }
    setMinLevel(level) {
        this.minLevel_ = level;
    }
    async flush() {
        await Promise.all(this.sinks_.map((s) => s.flush?.()));
    }
    dispose() {
        this.sinks_.forEach((s) => s.dispose?.());
        this.sinks_.length = 0;
    }
    // ─── Private ───────────────────────────────────────────────────────────────
    log(level, message, args) {
        if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel_])
            return;
        const entry = {
            level,
            namespace: this.namespace_,
            message,
            args,
            timestamp: Date.now(),
        };
        for (const sink of this.sinks_) {
            try {
                sink.write(entry);
            }
            catch (err) {
                // Never let sink failures break service code
                console.error(`[DesktopLogger] Sink "${sink.name}" threw:`, err);
            }
        }
    }
}
exports.DesktopLogger = DesktopLogger;
//# sourceMappingURL=desktop-logger.js.map