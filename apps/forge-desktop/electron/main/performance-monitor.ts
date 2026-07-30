import type { IPerformanceMonitor, IDesktopLogger } from './container/service-interfaces';

export class PerformanceMonitor implements IPerformanceMonitor {
  private readonly logger: IDesktopLogger;
  private readonly latencies = new Map<string, number[]>();

  constructor(logger: IDesktopLogger) {
    this.logger = logger;
  }

  record(channel: string, durationMs: number): void {
    if (durationMs < 0) return;
    const bucket = this.latencies.get(channel) ?? [];
    bucket.push(durationMs);
    this.latencies.set(channel, bucket);

    if (durationMs > 100) {
      this.logger.warn(`[PerformanceMonitor] High latency detected on channel "${channel}": ${durationMs}ms`);
    }
  }

  snapshot(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [ch, times] of this.latencies.entries()) {
      if (times.length === 0) {
        out[ch] = 0;
        continue;
      }
      const sorted = [...times].sort((a, b) => a - b);
      // Return 95th percentile latency
      const p95Idx = Math.floor(sorted.length * 0.95);
      out[ch] = sorted[p95Idx];
    }
    return out;
  }

  reset(): void {
    this.latencies.clear();
    this.logger.info('[PerformanceMonitor] Performance counters reset.');
  }
}
export default PerformanceMonitor;
