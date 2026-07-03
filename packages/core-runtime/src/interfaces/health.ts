export type HealthStatus = 'healthy' | 'degraded' | 'failed';

export interface IServiceHealth {
  name: string;
  status: HealthStatus;
  message?: string;
  lastCheck: Date;
}

export interface IHealthManager {
  reportHealth(serviceName: string, status: HealthStatus, message?: string): void;
  getServiceHealth(serviceName: string): IServiceHealth | undefined;
  getAggregateHealth(): HealthStatus;
  onHealthChanged(callback: (status: IServiceHealth) => void): void;
}
