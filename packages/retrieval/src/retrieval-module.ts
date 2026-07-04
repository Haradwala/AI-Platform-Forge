import { IForgeModule, IForgeContext } from '@forge/core-runtime';
import { RetrievalProviderRegistry } from './registry';
import { ProviderHealthMonitor } from './health/health-monitor';
import { RetrievalPlanCompiler } from './compiler';
import { RetrievalCoordinator } from './coordinator';
import { RetrievalPipeline } from './pipeline';
import { RetrievalCache } from './cache/retrieval-cache';
import { WorkspaceRetriever } from './providers/workspace/workspace-retriever';
import { GraphRetriever } from './providers/graph/graph-retriever';
import { KeywordRetriever } from './providers/keyword/keyword-retriever';

export class RetrievalModule implements IForgeModule {
  readonly name = 'RetrievalModule';
  readonly version = '0.1.0';
  readonly dependencies = ['GraphModule'];

  private cache?: RetrievalCache;

  async initialize(context: IForgeContext): Promise<void> {
    context.logger.info('RetrievalModule: Initializing...');

    const registry = new RetrievalProviderRegistry();
    const healthMonitor = new ProviderHealthMonitor(context.eventBus);
    const compiler = new RetrievalPlanCompiler();
    const coordinator = new RetrievalCoordinator(healthMonitor);
    const pipeline = new RetrievalPipeline(coordinator, context.eventBus);
    const cache = new RetrievalCache(context.eventBus);

    this.cache = cache;

    const queryEngine = context.di.resolve<any>('QueryEngine');
    
    const workspaceRetriever = new WorkspaceRetriever();
    const graphRetriever = new GraphRetriever(queryEngine);
    const keywordRetriever = new KeywordRetriever();

    registry.register(workspaceRetriever);
    registry.register(graphRetriever);
    registry.register(keywordRetriever);

    context.di.registerInstance('RetrievalProviderRegistry', registry);
    context.di.registerInstance('ProviderHealthMonitor', healthMonitor);
    context.di.registerInstance('RetrievalPlanCompiler', compiler);
    context.di.registerInstance('RetrievalCoordinator', coordinator);
    context.di.registerInstance('RetrievalPipeline', pipeline);
    context.di.registerInstance('RetrievalCache', cache);

    context.logger.info('RetrievalModule: Registered Hybrid Retrieval Engine services in DI.');
  }

  async start(context: IForgeContext): Promise<void> {
    context.logger.info('RetrievalModule: Started.');
  }

  async stop(context: IForgeContext): Promise<void> {
    context.logger.info('RetrievalModule: Stopping...');
    if (this.cache) {
      this.cache.invalidate('Service shut down');
    }
  }

  async checkHealth(): Promise<'healthy' | 'degraded' | 'failed'> {
    return this.cache ? 'healthy' : 'failed';
  }
}
