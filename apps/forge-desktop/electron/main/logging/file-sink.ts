import type { ILogSink, ILogEntry, LogLevel } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';

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
export class FileSink implements ILogSink {
  readonly name = 'FileSink';

  private fd: number | null = null;
  private currentDate = '';
  private readonly queue: string[] = [];
  private flushing = false;

  constructor(private readonly logDir: string) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  write(entry: ILogEntry): void {
    const line = JSON.stringify({
      ts:        entry.timestamp,
      level:     entry.level,
      ns:        entry.namespace,
      msg:       entry.message,
      args:      entry.args.length > 0 ? entry.args : undefined,
    }) + '\n';
    this.queue.push(line);
    this.drainQueue();
  }

  async flush(): Promise<void> {
    await new Promise<void>((resolve) => {
      const drain = () => {
        if (this.queue.length === 0) { resolve(); return; }
        setTimeout(drain, 5);
      };
      drain();
    });
  }

  dispose(): void {
    if (this.fd !== null) {
      try { fs.closeSync(this.fd); } catch { /* no-op */ }
      this.fd = null;
    }
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private drainQueue(): void {
    if (this.flushing || this.queue.length === 0) return;
    this.flushing = true;

    const ensureFd = () => {
      const today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
      if (this.currentDate !== today) {
        this.dispose(); // close old fd
        this.currentDate = today;
        const filePath = path.join(this.logDir, `forge-${today}.log`);
        this.fd = fs.openSync(filePath, 'a');
      }
    };

    // Batch all queued lines into one write
    try {
      ensureFd();
      const batch = this.queue.splice(0, this.queue.length).join('');
      if (this.fd !== null) {
        fs.writeSync(this.fd, batch);
      }
    } catch (err) {
      console.error('[FileSink] Write error:', err);
    } finally {
      this.flushing = false;
      if (this.queue.length > 0) this.drainQueue();
    }
  }
}
