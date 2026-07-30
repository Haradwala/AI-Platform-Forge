import type { ILogSink, ILogEntry } from './interfaces';
/**
 * FileSink — writes structured log entries to a daily rotating log file.
 *
 * Path: <logDir>/forge-YYYY-MM-DD.log
 * Format: JSON Lines — one JSON object per line.
 *
 * - Opens the file lazily on first write.
 * - Rotates the file descriptor when the calendar day changes.
 * - flush() flushes pending writes.
 * - dispose() closes the file descriptor.
 */
export declare class FileSink implements ILogSink {
    private readonly logDir;
    readonly name = "FileSink";
    private fd;
    private currentDate;
    private readonly queue;
    private flushing;
    constructor(logDir: string);
    write(entry: ILogEntry): void;
    flush(): Promise<void>;
    dispose(): void;
    private drainQueue;
}
