import { IEventBus } from '@forge/core';
import { ProviderHealthStatus } from './status';
import { IRetrievalProvider } from '../interfaces/provider';

export class ProviderHealthMonitor {
  private states = new Map<string, ProviderHealthStatus>();

  constructor(private readonly eventBus: IEventBus) {}

  async checkProvider(provider: IRetrievalProvider): Promise<ProviderHealthStatus> {
    try {
      const status = await provider.checkHealth();
      const old = this.states.get(provider.id);
      if (old !== status) {
        this.states.set(provider.id, status);
        this.eventBus.publish('health.changed', {
          serviceName: `Retrieval:${provider.id}`,
          status: status === ProviderHealthStatus.Healthy ? 'healthy' : status === ProviderHealthStatus.Degraded ? 'degraded' : 'failed',
          message: `Provider health set to ${status}`,
          timestamp: new Date()
        });
      }
      return status;
    } catch (err) {
      this.states.set(provider.id, ProviderHealthStatus.Unavailable);
      this.eventBus.publish('health.changed', {
        serviceName: `Retrieval:${provider.id}`,
        status: 'failed',
        message: `Health check failed: ${(err as Error).message}`,
        timestamp: new Date()
      });
      return ProviderHealthStatus.Unavailable;
    }
  }

  getHealth(providerId: string): ProviderHealthStatus {
    return this.states.get(providerId) || ProviderHealthStatus.Healthy;
  }
}
