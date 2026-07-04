import { IForgeModule, IForgeContext } from '@forge/core-runtime';
import { IntentAnalyzer } from './intent/intent-analyzer';
import { ContextPlanner } from './planner/planner';
import { RetrievalOrchestrator } from './retrieval/orchestrator';
import { WorkspaceRetriever } from './retrieval/retrievers/workspace';
import { KnowledgeGraphRetriever } from './retrieval/retrievers/graph';
import { DocumentationRetriever } from './retrieval/retrievers/doc';
import { ContextRanker } from './ranking/ranker';
import { BudgetManager } from './budget/budget-manager';
import { CompressionPipeline } from './compression/pipeline';
import { ContextAssembler } from './assembler/assembler';
import { ContextCache } from './cache/context-cache';

export class ContextModule implements IForgeModule {
  readonly name = 'ContextModule';
  readonly version = '0.1.0';
  readonly dependencies = ['GraphModule'];

  private cache?: ContextCache;

  async initialize(context: IForgeContext): Promise<void> {
    context.logger.info('ContextModule: Initializing...');

    const analyzer = new IntentAnalyzer();
    const planner = new ContextPlanner();
    
    const queryEngine = context.di.resolve<any>('QueryEngine');
    
    const orchestrator = new RetrievalOrchestrator();
    orchestrator.registerRetriever(new WorkspaceRetriever());
    orchestrator.registerRetriever(new DocumentationRetriever());
    if (queryEngine) {
      orchestrator.registerRetriever(new KnowledgeGraphRetriever(queryEngine));
    }

    const ranker = new ContextRanker();
    const budgetManager = new BudgetManager();
    const compressionPipeline = new CompressionPipeline();
    const assembler = new ContextAssembler();
    const cache = new ContextCache(context.eventBus);

    this.cache = cache;

    context.di.registerInstance('IntentAnalyzer', analyzer);
    context.di.registerInstance('ContextPlanner', planner);
    context.di.registerInstance('RetrievalOrchestrator', orchestrator);
    context.di.registerInstance('ContextRanker', ranker);
    context.di.registerInstance('BudgetManager', budgetManager);
    context.di.registerInstance('CompressionPipeline', compressionPipeline);
    context.di.registerInstance('ContextAssembler', assembler);
    context.di.registerInstance('ContextCache', cache);

    context.logger.info('ContextModule: Registered Context Engine services in DI.');
  }

  async start(context: IForgeContext): Promise<void> {
    context.logger.info('ContextModule: Started.');
  }

  async stop(context: IForgeContext): Promise<void> {
    context.logger.info('ContextModule: Stopping...');
    if (this.cache) {
      this.cache.invalidate('Service shut down');
    }
  }

  async checkHealth(): Promise<'healthy' | 'degraded' | 'failed'> {
    return this.cache ? 'healthy' : 'failed';
  }
}
