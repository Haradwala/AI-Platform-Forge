import { IRuntimeService } from './runtime-service';
import { RuntimeKernel } from './runtime-kernel';

export class RuntimeHealthService implements IRuntimeService {
  readonly id = 'RuntimeHealthService';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private readonly startTime = Date.now();

  constructor(private readonly kernel: RuntimeKernel) {}

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      overallHealth: this.health,
    };
  }

  onStart(): void {}
  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {}

  checkHealth(): 'healthy' | 'warning' | 'degraded' | 'failed' {
    let overall: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
    for (const service of this.kernel.getServices()) {
      if (service.id === this.id) continue;
      if (service.health === 'failed') return 'failed';
      if (service.health === 'degraded') overall = 'degraded';
      if (service.health === 'warning' && overall === 'healthy') overall = 'warning';
    }
    this.health = overall;
    return overall;
  }
}
