import { IIpcMiddleware, IIpcContext } from './interfaces';
/**
 * Logger middleware — logs every IPC call with channel, duration, and result.
 * Registered first in the middleware stack so it wraps all other middleware.
 */
export declare class LoggerMiddleware implements IIpcMiddleware {
    readonly name = "logger";
    handle(ctx: IIpcContext, next: () => Promise<void>): Promise<void>;
}
/**
 * Metrics middleware placeholder — records latency per channel.
 * Epic 20 (Performance Monitor) will replace this stub with real collection.
 */
export declare class MetricsMiddleware implements IIpcMiddleware {
    readonly name = "metrics";
    private readonly latencies;
    handle(ctx: IIpcContext, next: () => Promise<void>): Promise<void>;
    getP95(channel: string): number | null;
    snapshot(): Record<string, number>;
    reset(): void;
}
