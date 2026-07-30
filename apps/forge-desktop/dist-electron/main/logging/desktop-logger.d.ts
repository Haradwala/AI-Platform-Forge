import type { ILogger, ILogSink, LogLevel } from './interfaces';
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
export declare class DesktopLogger implements ILogger {
    private readonly sinks_;
    private readonly namespace_;
    private readonly minLevel_;
    constructor(options?: {
        sinks?: ILogSink[];
        namespace?: string;
        minLevel?: LogLevel;
    });
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    child(namespace: string): ILogger;
    addSink(sink: ILogSink): void;
    removeSink(name: string): void;
    setMinLevel(level: LogLevel): void;
    flush(): Promise<void>;
    dispose(): void;
    private log;
}
