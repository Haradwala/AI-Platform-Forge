import { IForgeModule, IForgeContext } from '@forge/core-runtime';
import { LanguageDetector } from './detector';
import { ParserRegistry } from './registry';
import { ParseWorkerPool } from './worker-pool';
import { ParseScheduler } from './scheduler';
import { ParserPipeline } from './pipeline';
import { MarkdownLanguageParser } from './languages/markdown/parser';

export class ParserModule implements IForgeModule {
  readonly name = 'ParserModule';
  readonly version = '0.1.0';
  readonly dependencies = [];

  private pipeline?: ParserPipeline;
  private scheduler?: ParseScheduler;
  private workerPool?: ParseWorkerPool;

  async initialize(context: IForgeContext): Promise<void> {
    context.logger.info('ParserModule: Initializing...');

    const detector = new LanguageDetector();
    const registry = new ParserRegistry();

    registry.register('markdown', new MarkdownLanguageParser());

    const pipeline = new ParserPipeline(detector, registry, context.eventBus);
    const workerPool = new ParseWorkerPool(detector, registry, context.eventBus, () => pipeline.getExtractors());
    const scheduler = new ParseScheduler(workerPool);

    this.workerPool = workerPool;
    this.scheduler = scheduler;
    this.pipeline = pipeline;

    context.di.registerInstance('LanguageDetector', detector);
    context.di.registerInstance('ParserRegistry', registry);
    context.di.registerInstance('ParseWorkerPool', workerPool);
    context.di.registerInstance('ParseScheduler', scheduler);
    context.di.registerInstance('ParserPipeline', pipeline);

    context.logger.info('ParserModule: Registered parser services in DI.');
  }

  async start(context: IForgeContext): Promise<void> {
    context.logger.info('ParserModule: Starting...');
  }

  async stop(context: IForgeContext): Promise<void> {
    context.logger.info('ParserModule: Stopping...');
    if (this.scheduler) {
      this.scheduler.cancelAll();
    }
    if (this.workerPool) {
      await this.workerPool.shutdown();
    }
  }

  async checkHealth(): Promise<'healthy' | 'degraded' | 'failed'> {
    return this.pipeline && this.scheduler ? 'healthy' : 'failed';
  }
}
