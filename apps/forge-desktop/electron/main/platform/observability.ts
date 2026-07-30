import { IRuntimeService } from './runtime-service';

export class Observability implements IRuntimeService {
  readonly id = 'Observability';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private activeSpanId: string | null = null;
  private logsCount = 0;
  private readonly startTime = Date.now();

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      activeSpanId: this.activeSpanId,
      logsCount: this.logsCount,
    };
  }

  onStart(): void {}
  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {}

  createTrace(): string {
    const traceId = `tr_${Math.random().toString(36).substring(2, 10)}`;
    this.activeSpanId = traceId;
    return traceId;
  }

  logInfo(message: string, traceId?: string): void {
    this.logsCount++;
    const active = traceId || this.activeSpanId || 'global';
    console.log(`[Observability] [INFO] [Trace: ${active}] ${message}`);
  }

  logError(message: string, err: any, traceId?: string): void {
    this.logsCount++;
    const active = traceId || this.activeSpanId || 'global';
    console.error(`[Observability] [ERROR] [Trace: ${active}] ${message}`, err);
  }

  startProfiler(label: string): () => void {
    const start = Date.now();
    return () => {
      const dur = Date.now() - start;
      this.logInfo(`Profiler [${label}] completed in ${dur}ms`);
    };
  }
}
