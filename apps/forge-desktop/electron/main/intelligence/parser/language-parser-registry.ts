/**
 * language-parser-registry.ts — Plugin Registry for Multilingual AST Parsers
 */

import { ILanguageParser, ParseResult } from './ilanguage-parser';
import { RegexFallbackParser } from './parsers/regex-fallback-parser';
import { TypeScriptParser } from './parsers/typescript-parser';

export class LanguageParserRegistry {
  private parsers = new Map<string, ILanguageParser>();
  private fallbackParser: ILanguageParser = new RegexFallbackParser();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.registerParser(new TypeScriptParser());
  }

  registerParser(parser: ILanguageParser): void {
    for (const ext of parser.supportedExtensions) {
      const normalizedExt = ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
      this.parsers.set(normalizedExt, parser);
    }
  }

  getParserForFile(filePath: string): ILanguageParser {
    const dotIdx = filePath.lastIndexOf('.');
    if (dotIdx !== -1) {
      const ext = filePath.substring(dotIdx).toLowerCase();
      if (this.parsers.has(ext)) {
        return this.parsers.get(ext)!;
      }
    }
    return this.fallbackParser;
  }

  async parseFile(filePath: string, content: string, fileId: string): Promise<ParseResult> {
    const parser = this.getParserForFile(filePath);
    return parser.parseFile(filePath, content, fileId);
  }
}
