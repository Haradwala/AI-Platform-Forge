import { IRuntimeService } from './runtime-service';
import { RuntimeRegistry } from './runtime-registry';

export class RuntimeKernel {
  private readonly registry = new RuntimeRegistry();
  private started = false;

  register(service: IRuntimeService): void {
    this.registry.register(service);
    if (this.started) {
      Promise.resolve(service.onStart()).then(() => {
        service.status = 'running';
        service.onRunning();
      });
    }
  }

  unregister(id: string): void {
    try {
      const service = this.registry.getService(id);
      if (service) {
        service.onShutdown();
        service.status = 'stopped';
      }
    } catch {
      // Ignored
    }
    this.registry.unregister(id);
  }

  getService<T extends IRuntimeService>(id: string): T {
    return this.registry.getService<T>(id);
  }

  getServices(): IRuntimeService[] {
    return this.registry.getAll();
  }

  async start(): Promise<void> {
    if (this.started) return;

    const sorted = this.registry.getSortedServices();
    for (const service of sorted) {
      service.status = 'starting';
      try {
        await service.onStart();
        service.status = 'running';
        await service.onRunning();
      } catch (err) {
        service.status = 'error';
        service.health = 'failed';
        throw err;
      }
    }

    this.started = true;
  }

  async stop(): Promise<void> {
    if (!this.started) return;

    const sorted = this.registry.getSortedServices().reverse();
    for (const service of sorted) {
      service.status = 'suspended';
      try {
        await service.onSuspend();
        await service.onShutdown();
        service.status = 'stopped';
      } catch (err) {
        service.status = 'error';
        service.health = 'failed';
      }
    }

    this.started = false;
  }

  diagnostics(): Record<string, any> {
    return {
      started: this.started,
      timestamp: new Date().toISOString(),
      services: this.registry.getAll().map((s) => ({
        id: s.id,
        version: s.version,
        health: s.health,
        status: s.status,
        dependencies: s.dependencies,
        metrics: s.metrics(),
      })),
    };
  }
}
