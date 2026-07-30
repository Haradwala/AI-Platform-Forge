import type { ILogSink, ILogEntry, LogLevel } from './interfaces';

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info:  '\x1b[32m', // green
  warn:  '\x1b[33m', // yellow
  error: '\x1b[31m', // red
};
const RESET = '\x1b[0m';

/**
 * ConsoleSink — writes log entries to stdout/stderr with coloured output.
 * Used in development. Disabled in production (FileSink takes over).
 */
export class ConsoleSink implements ILogSink {
  readonly name = 'ConsoleSink';

  constructor(private readonly useColor = true) {}

  write(entry: ILogEntry): void {
    const ts  = new Date(entry.timestamp).toISOString().substring(11, 23); // HH:MM:SS.mmm
    const ns  = entry.namespace ? `[${entry.namespace}]` : '';
    const lvl = entry.level.toUpperCase().padEnd(5);
    const color = this.useColor ? LEVEL_COLORS[entry.level] : '';
    const reset = this.useColor ? RESET : '';
    const prefix = `${color}${ts} ${lvl}${reset} ${ns}`;
    const method = entry.level === 'error' ? console.error
                 : entry.level === 'warn'  ? console.warn
                 : entry.level === 'debug' ? console.debug
                 : console.info;
    method(prefix, entry.message, ...entry.args);
  }
}
