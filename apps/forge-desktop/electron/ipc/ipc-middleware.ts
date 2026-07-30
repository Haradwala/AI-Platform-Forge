import { IIpcMiddleware, IIpcContext } from './interfaces';

/**
 * Logger middleware — logs every IPC call with channel, duration, and result.
 * Registered first in the middleware stack so it wraps all other middleware.
 */
export class LoggerMiddleware implements IIpcMiddleware {
  readonly name = 'logger';

  async handle(ctx: IIpcContext, next: () => Promise<void>): Promise<void> {
    const label = `[IPC] ${ctx.channel}`;
    try {
      await next();
      const ms = Date.now() - ctx.startedAt;
      console.info(`${label} → ok (${ms}ms)`);
    } catch (err) {
      const ms = Date.now() - ctx.startedAt;
      console.error(`${label} → error (${ms}ms)`, err);
      throw err;
    }
  }
}

/**
 * Metrics middleware placeholder — records latency per channel.
 * Epic 20 (Performance Monitor) will replace this stub with real collection.
 */
export class MetricsMiddleware implements IIpcMiddleware {
  readonly name = 'metrics';
  private readonly latencies = new Map<string, number[]>();

  async handle(ctx: IIpcContext, next: () => Promise<void>): Promise<void> {
    await next();
    const ms = Date.now() - ctx.startedAt;
    const bucket = this.latencies.get(ctx.channel) ?? [];
    bucket.push(ms);
    this.latencies.set(ctx.channel, bucket);
  }

  getP95(channel: string): number | null {
    const samples = this.latencies.get(channel);
    if (!samples || samples.length === 0) return null;
    const sorted = [...samples].sort((a, b) => a - b);
    const idx = Math.floor(sorted.length * 0.95);
    return sorted[idx] ?? sorted[sorted.length - 1];
  }

  snapshot(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const channel of this.latencies.keys()) {
      const p95 = this.getP95(channel);
      if (p95 !== null) result[channel] = p95;
    }
    return result;
  }

  reset(): void {
    this.latencies.clear();
  }
}
