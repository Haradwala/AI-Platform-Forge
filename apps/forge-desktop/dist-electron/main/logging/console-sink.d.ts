import type { ILogSink, ILogEntry } from './interfaces';
/**
 * ConsoleSink — writes log entries to stdout/stderr with coloured output.
 * Used in development. Disabled in production (FileSink takes over).
 */
export declare class ConsoleSink implements ILogSink {
    private readonly useColor;
    readonly name = "ConsoleSink";
    constructor(useColor?: boolean);
    write(entry: ILogEntry): void;
}
