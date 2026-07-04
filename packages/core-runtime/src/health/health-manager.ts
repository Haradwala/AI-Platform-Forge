import { IHealthManager, IServiceHealth, HealthStatus } from '../interfaces/health';
import { IEventBus } from '@forge/core';

export class HealthManager implements IHealthManager {
  private healthReports = new Map<string, IServiceHealth>();
  private callbacks = new Set<(status: IServiceHealth) => void>();
  private eventBus?: IEventBus;

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus;
  }

  setEventBus(eventBus: IEventBus): void {
    this.eventBus = eventBus;
  }

  reportHealth(serviceName: string, status: HealthStatus, message?: string): void {
    const oldReport = this.healthReports.get(serviceName);
    const newReport: IServiceHealth = {
      name: serviceName,
      status,
      message,
      lastCheck: new Date(),
    };

    this.healthReports.set(serviceName, newReport);

    if (!oldReport || oldReport.status !== status || oldReport.message !== message) {
      for (const cb of this.callbacks) {
        cb(newReport);
      }

      if (this.eventBus) {
        this.eventBus.publish('health.changed', {
          serviceName,
          status,
          message,
          timestamp: newReport.lastCheck
        });
      }
    }
  }

  getServiceHealth(serviceName: string): IServiceHealth | undefined {
    return this.healthReports.get(serviceName);
  }

  getAggregateHealth(): HealthStatus {
    let hasDegraded = false;
    for (const report of this.healthReports.values()) {
      if (report.status === 'failed') {
        return 'failed';
      }
      if (report.status === 'degraded') {
        hasDegraded = true;
      }
    }
    return hasDegraded ? 'degraded' : 'healthy';
  }

  onHealthChanged(callback: (status: IServiceHealth) => void): void {
    this.callbacks.add(callback);
  }
}
