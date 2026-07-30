/**
 * Logging interfaces — shared contracts for main process and renderer.
 *
 * ILogger       — the surface all services program against
 * ILogSink      — receives structured log entries
 * ILogEntry     — the data passed to each sink
 * ILogLevel     — ordered severity levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface ILogEntry {
    readonly level: LogLevel;
    readonly namespace: string;
    readonly message: string;
    readonly args: readonly unknown[];
    readonly timestamp: number;
}
export interface ILogSink {
    readonly name: string;
    write(entry: ILogEntry): void;
    flush?(): Promise<void>;
    dispose?(): void;
}
export interface ILogger {
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    /** Create a child logger with an appended namespace segment. */
    child(namespace: string): ILogger;
}
