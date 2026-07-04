import { ILanguageParser, IParseResult, IASTNode } from '../../interfaces';
import { ParserContext } from '../../context';
import { IExtractorPlugin } from '../../interfaces/extractor';

export class MarkdownLanguageParser implements ILanguageParser {
  readonly languageId = 'markdown';

  async parse(
    content: string,
    filePath: string,
    context: ParserContext,
    extractors: IExtractorPlugin[]
  ): Promise<IParseResult> {
    context.cancellationToken.throwIfCancelled();

    const rootNode: IASTNode = {
      type: 'document',
      range: {
        start: { line: 0, column: 0, offset: 0 },
        end: { line: content.split('\n').length, column: 0, offset: content.length }
      },
      text: content,
      children: []
    };

    const lines = content.split(/\r?\n/);
    let offset = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineStartOffset = offset;
      offset += line.length + 1;

      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const depth = headingMatch[1].length;
        const text = headingMatch[2];
        const headingNode: IASTNode = {
          type: `heading_${depth}`,
          range: {
            start: { line: i, column: 0, offset: lineStartOffset },
            end: { line: i, column: line.length, offset: lineStartOffset + line.length }
          },
          text,
          children: []
        };
        rootNode.children.push(headingNode);
      }

      const linkMatches = line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
      for (const match of linkMatches) {
        const linkNode: IASTNode = {
          type: 'link',
          range: {
            start: { line: i, column: match.index || 0, offset: lineStartOffset + (match.index || 0) },
            end: { line: i, column: (match.index || 0) + match[0].length, offset: lineStartOffset + (match.index || 0) + match[0].length }
          },
          text: match[0],
          children: [
            {
              type: 'link_text',
              text: match[1],
              range: { start: { line: i, column: 0, offset: 0 }, end: { line: i, column: 0, offset: 0 } },
              children: []
            },
            {
              type: 'link_target',
              text: match[2],
              range: { start: { line: i, column: 0, offset: 0 }, end: { line: i, column: 0, offset: 0 } },
              children: []
            }
          ]
        };
        rootNode.children.push(linkNode);
      }
    }

    await this.traverseAndExtract(rootNode, context, extractors);

    return {
      symbols: Array.from(context.symbols.values()),
      relationships: context.relationships,
      diagnostics: context.diagnostics
    };
  }

  async parseIncremental(
    content: string,
    filePath: string,
    previousResult: IParseResult,
    context: ParserContext,
    extractors: IExtractorPlugin[],
    edits?: any
  ): Promise<IParseResult> {
    return this.parse(content, filePath, context, extractors);
  }

  private async traverseAndExtract(
    node: IASTNode,
    context: ParserContext,
    extractors: IExtractorPlugin[]
  ): Promise<void> {
    context.cancellationToken.throwIfCancelled();

    for (const plugin of extractors) {
      await plugin.extract(node, context);
    }

    for (const child of node.children) {
      await this.traverseAndExtract(child, context, extractors);
    }
  }
}
