import { IRuntimeService } from './runtime-service';

export interface IFeatureMetadata {
  readonly id: string;
  readonly description: string;
  readonly stage: 'Stable' | 'Experimental' | 'Preview' | 'Deprecated' | 'Disabled';
  readonly minVersion?: string;
  readonly permissions?: string[];
}

export class FeatureRegistry implements IRuntimeService {
  readonly id = 'FeatureRegistry';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private readonly features = new Map<string, IFeatureMetadata>();
  private readonly startTime = Date.now();

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      featuresCount: this.features.size,
    };
  }

  onStart(): void {
    this.register({
      id: 'ai.chat',
      description: 'Interact with AI assistant models via chat logs panels',
      stage: 'Stable',
    });
    this.register({
      id: 'ai.planning',
      description: 'Generates multi-task plans for coding tasks',
      stage: 'Experimental',
    });
    this.register({
      id: 'dock.floating-windows',
      description: 'Detach panels into floating browser window sessions',
      stage: 'Preview',
    });
  }

  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {}

  register(feature: IFeatureMetadata): void {
    this.features.set(feature.id, feature);
  }

  isEnabled(id: string): boolean {
    const f = this.features.get(id);
    if (!f) return false;
    return f.stage !== 'Disabled';
  }

  getFeature(id: string): IFeatureMetadata | undefined {
    return this.features.get(id);
  }

  getAll(): IFeatureMetadata[] {
    return Array.from(this.features.values());
  }
}
