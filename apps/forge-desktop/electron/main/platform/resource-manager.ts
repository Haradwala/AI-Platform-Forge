import { IRuntimeService } from './runtime-service';

export class ResourceManager implements IRuntimeService {
  readonly id = 'ResourceManager';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private ramUsage = 0;
  private cpuUsage = 0;
  private ptyCount = 0;
  private isThrottled = false;
  private readonly startTime = Date.now();

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      ramUsageMb: this.ramUsage,
      cpuUsagePercent: this.cpuUsage,
      ptyCount: this.ptyCount,
      isThrottled: this.isThrottled,
    };
  }

  onStart(): void {
    this.pollResources();
  }

  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {}

  private pollResources(): void {
    const mem = process.memoryUsage();
    this.ramUsage = Math.round(mem.heapUsed / 1024 / 1024);
    this.cpuUsage = Math.round(Math.random() * 30);

    if (this.ramUsage > 500) {
      this.isThrottled = true;
      this.health = 'warning';
    } else {
      this.isThrottled = false;
      this.health = 'healthy';
    }
  }

  checkThrottle(): boolean {
    this.pollResources();
    return this.isThrottled;
  }

  registerPty(): void {
    this.ptyCount++;
  }

  unregisterPty(): void {
    if (this.ptyCount > 0) this.ptyCount--;
  }
}
