import { IParseWorkerPool } from './interfaces/worker-pool';
import { IParseJob, ICancellationToken } from './interfaces/scheduler';
import { IParseResult } from './interfaces/parser';
import { LanguageDetector } from './detector';
import { ParserRegistry } from './registry';
import { ParserContext } from './context';
import { IEventBus } from '@forge/core';
import { IExtractorPlugin } from './interfaces/extractor';
import * as fs from 'fs/promises';

export class ParseWorkerPool implements IParseWorkerPool {
  constructor(
    private readonly detector: LanguageDetector,
    private readonly registry: ParserRegistry,
    private readonly eventBus: IEventBus,
    private readonly getExtractors: () => IExtractorPlugin[]
  ) {}

  async execute(job: IParseJob, cancellationToken: ICancellationToken): Promise<IParseResult> {
    cancellationToken.throwIfCancelled();
    const content = await fs.readFile(job.path, 'utf8');
    cancellationToken.throwIfCancelled();

    const lang = this.detector.detect(job.path, content);
    if (lang === 'unknown') {
      return { symbols: [], relationships: [], diagnostics: [] };
    }

    const parser = this.registry.resolve(lang);
    if (!parser) {
      return { symbols: [], relationships: [], diagnostics: [] };
    }

    const context = new ParserContext(
      job.workspaceId,
      job.path,
      content,
      this.eventBus,
      cancellationToken
    );

    cancellationToken.throwIfCancelled();
    const result = await parser.parse(content, job.path, context, this.getExtractors());
    cancellationToken.throwIfCancelled();

    return result;
  }

  async shutdown(): Promise<void> {
    // Single-threaded stub has no resources to release
  }
}
