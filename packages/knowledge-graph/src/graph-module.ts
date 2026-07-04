import { IForgeModule, IForgeContext } from '@forge/core-runtime';
import { MemoryGraphStorage } from './storage/memory';
import { GraphBuilderCoordinator } from './builder/coordinator';
import { QueryEngine } from './query/engine';
import { GraphAnalyticsEngine } from './analytics/metrics';
import { GraphEnricherManager } from './enricher/manager';

export class GraphModule implements IForgeModule {
  readonly name = 'GraphModule';
  readonly version = '0.1.0';
  readonly dependencies = [];

  private storage?: MemoryGraphStorage;

  async initialize(context: IForgeContext): Promise<void> {
    context.logger.info('GraphModule: Initializing Knowledge Graph...');

    const storage = new MemoryGraphStorage();
    await storage.initialize();

    const coordinator = new GraphBuilderCoordinator(storage, context.eventBus);
    const queryEngine = new QueryEngine(storage);
    const analyticsEngine = new GraphAnalyticsEngine(storage);
    const enricherManager = new GraphEnricherManager();

    this.storage = storage;

    context.di.registerInstance('GraphStorage', storage);
    context.di.registerInstance('GraphBuilderCoordinator', coordinator);
    context.di.registerInstance('QueryEngine', queryEngine);
    context.di.registerInstance('GraphAnalyticsEngine', analyticsEngine);
    context.di.registerInstance('GraphEnricherManager', enricherManager);

    context.logger.info('GraphModule: Registered Knowledge Graph services in DI container.');
  }

  async start(context: IForgeContext): Promise<void> {
    context.logger.info('GraphModule: Started.');
  }

  async stop(context: IForgeContext): Promise<void> {
    context.logger.info('GraphModule: Stopping...');
    if (this.storage) {
      await this.storage.close();
    }
  }

  async checkHealth(): Promise<'healthy' | 'degraded' | 'failed'> {
    return this.storage ? 'healthy' : 'failed';
  }
}
