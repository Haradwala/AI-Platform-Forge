import { describe, it, expect } from 'vitest';
import { ParserPipeline } from '../src/pipeline';
import { LanguageDetector } from '../src/detector';
import { ParserRegistry } from '../src/registry';
import { MarkdownLanguageParser } from '../src/languages/markdown/parser';
import { IExtractorPlugin, IASTNode } from '../src/interfaces/extractor';
import { ParserContext } from '../src/context';
import { ForgeSymbol } from '../src/models/symbol';
import { ForgeRelationship } from '../src/models/relationship';
import { CancellationToken } from '../src/scheduler';

class MockEventBus {
  public readonly events: { topic: string; payload: any }[] = [];

  publish(topic: string, payload: any): void {
    this.events.push({ topic, payload });
  }

  subscribe(): any {}
  unsubscribe(): void {}
}

class HeadingSymbolExtractor implements IExtractorPlugin {
  readonly id = 'HeadingSymbolExtractor';
  readonly priority = 10;

  async extract(node: IASTNode, context: ParserContext): Promise<void> {
    if (node.type.startsWith('heading_')) {
      const depth = parseInt(node.type.split('_')[1], 10);
      const symbolId = `${context.filePath}:${node.text}`;
      const symbol = new ForgeSymbol(
        symbolId,
        node.text,
        depth === 1 ? 'module' : 'class',
        node.range,
        node.range,
        'public'
      );
      context.symbols.set(symbolId, symbol);
    }
  }
}

class LinkRelationExtractor implements IExtractorPlugin {
  readonly id = 'LinkRelationExtractor';
  readonly priority = 5;

  async extract(node: IASTNode, context: ParserContext): Promise<void> {
    if (node.type === 'link') {
      const linkTarget = node.children[1]?.text || '';

      const relationship = new ForgeRelationship(
        context.filePath,
        linkTarget,
        'references',
        node.range
      );
      context.relationships.push(relationship);
    }
  }
}

describe('ParserPipeline & Plugins Integration', () => {
  it('should parse content and execute registered extractor plugins', async () => {
    const detector = new LanguageDetector();
    const registry = new ParserRegistry();
    registry.register('markdown', new MarkdownLanguageParser());

    const eventBus = new MockEventBus() as any;
    const pipeline = new ParserPipeline(detector, registry, eventBus);

    pipeline.registerExtractor(new HeadingSymbolExtractor());
    pipeline.registerExtractor(new LinkRelationExtractor());

    const sampleMarkdown = `
# Project Document
This is a document talking about [Sprint 4 Architecture](https://github.com/Haradwala/AI-Platform-Forge).

## Section Detailed Setup
Review setup instructions [Here](https://vitejs.dev).
`;

    const token = new CancellationToken();
    const result = await pipeline.parseFile(
      'w-1',
      'README.md',
      sampleMarkdown,
      token
    );

    expect(result.symbols.length).toBe(2);
    expect(result.symbols[0].name).toBe('Project Document');
    expect(result.symbols[0].kind).toBe('module');
    expect(result.symbols[1].name).toBe('Section Detailed Setup');
    expect(result.symbols[1].kind).toBe('class');

    expect(result.relationships.length).toBe(2);
    expect(result.relationships[0].targetSymbolId).toBe('https://github.com/Haradwala/AI-Platform-Forge');
    expect(result.relationships[0].type).toBe('references');
    expect(result.relationships[1].targetSymbolId).toBe('https://vitejs.dev');

    const completedEvent = eventBus.events.find((e: any) => e.topic === 'parser.file.completed');
    expect(completedEvent).toBeDefined();
    expect(completedEvent?.payload.symbolsCount).toBe(2);
  });
});
