import type { ILogger, ILogSink, ILogEntry, LogLevel } from './interfaces';

const LEVEL_ORDER: Record<LogLevel, number> = {
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
export class DesktopLogger implements ILogger {
  private readonly sinks_:    ILogSink[];
  private readonly namespace_: string;
  private readonly minLevel_:  LogLevel;

  constructor(options?: {
    sinks?: ILogSink[];
    namespace?: string;
    minLevel?: LogLevel;
  }) {
    this.sinks_     = options?.sinks     ?? [];
    this.namespace_ = options?.namespace ?? 'Forge';
    this.minLevel_  = options?.minLevel  ?? 'debug';
  }

  // ─── ILogger ───────────────────────────────────────────────────────────────

  debug(message: string, ...args: unknown[]): void { this.log('debug', message, args); }
  info(message: string, ...args: unknown[]):  void { this.log('info',  message, args); }
  warn(message: string, ...args: unknown[]):  void { this.log('warn',  message, args); }
  error(message: string, ...args: unknown[]): void { this.log('error', message, args); }

  child(namespace: string): ILogger {
    return new DesktopLogger({
      sinks:     this.sinks_,
      namespace: `${this.namespace_}:${namespace}`,
      minLevel:  this.minLevel_,
    });
  }

  // ─── Sink management ───────────────────────────────────────────────────────

  addSink(sink: ILogSink): void {
    this.sinks_.push(sink);
  }

  removeSink(name: string): void {
    const idx = this.sinks_.findIndex((s) => s.name === name);
    if (idx !== -1) this.sinks_.splice(idx, 1);
  }

  setMinLevel(level: LogLevel): void {
    (this as any).minLevel_ = level;
  }

  async flush(): Promise<void> {
    await Promise.all(this.sinks_.map((s) => s.flush?.()));
  }

  dispose(): void {
    this.sinks_.forEach((s) => s.dispose?.());
    this.sinks_.length = 0;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private log(level: LogLevel, message: string, args: unknown[]): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel_]) return;

    const entry: ILogEntry = {
      level,
      namespace: this.namespace_,
      message,
      args,
      timestamp: Date.now(),
    };

    for (const sink of this.sinks_) {
      try {
        sink.write(entry);
      } catch (err) {
        // Never let sink failures break service code
        console.error(`[DesktopLogger] Sink "${sink.name}" threw:`, err);
      }
    }
  }
}
