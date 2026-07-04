import { ILanguageParser } from './interfaces/parser';

export class ParserRegistry {
  private parsers = new Map<string, ILanguageParser>();

  register(languageId: string, parser: ILanguageParser): void {
    if (this.parsers.has(languageId)) {
      throw new Error(`ParserRegistry: Parser already registered for language ${languageId}`);
    }
    this.parsers.set(languageId, parser);
  }

  resolve(languageId: string): ILanguageParser | undefined {
    return this.parsers.get(languageId);
  }

  clear(): void {
    this.parsers.clear();
  }
}
