import type { IPerformanceMonitor, IDesktopLogger } from './container/service-interfaces';
export declare class PerformanceMonitor implements IPerformanceMonitor {
    private readonly logger;
    private readonly latencies;
    constructor(logger: IDesktopLogger);
    record(channel: string, durationMs: number): void;
    snapshot(): Record<string, number>;
    reset(): void;
}
export default PerformanceMonitor;
