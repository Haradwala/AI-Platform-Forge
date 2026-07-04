import * as path from 'path';
import { IEventBus } from '@forge/core';
import { IParseResult } from './interfaces/parser';
import { IExtractorPlugin } from './interfaces/extractor';
import { ICancellationToken } from './interfaces/scheduler';
import { LanguageDetector } from './detector';
import { ParserRegistry } from './registry';
import { ParserContext } from './context';

export class ParserPipeline {
  private extractors: IExtractorPlugin[] = [];

  constructor(
    private readonly detector: LanguageDetector,
    private readonly registry: ParserRegistry,
    private readonly eventBus: IEventBus
  ) {}

  registerExtractor(plugin: IExtractorPlugin): void {
    this.extractors.push(plugin);
    this.extractors.sort((a, b) => b.priority - a.priority);
  }

  getExtractors(): IExtractorPlugin[] {
    return [...this.extractors];
  }

  async parseFile(
    workspaceId: string,
    filePath: string,
    content: string,
    cancellationToken: ICancellationToken
  ): Promise<IParseResult> {
    const relativePath = path.basename(filePath);
    const timestamp = new Date();
    this.eventBus.publish('parser.file.started', { workspaceId, relativePath, timestamp });

    try {
      const lang = this.detector.detect(filePath, content);
      const parser = this.registry.resolve(lang);
      if (!parser) {
        throw new Error(`ParserRegistry: No parser registered for language "${lang}"`);
      }

      const context = new ParserContext(workspaceId, filePath, content, this.eventBus, cancellationToken);
      
      const result = await parser.parse(content, filePath, context, this.extractors);
      
      this.eventBus.publish('parser.file.completed', {
        workspaceId,
        relativePath,
        symbolsCount: result.symbols.length,
        timestamp: new Date()
      });

      return result;
    } catch (err: any) {
      this.eventBus.publish('parser.file.failed', {
        workspaceId,
        relativePath,
        error: err.message || String(err),
        timestamp
      });
      throw err;
    }
  }
}
