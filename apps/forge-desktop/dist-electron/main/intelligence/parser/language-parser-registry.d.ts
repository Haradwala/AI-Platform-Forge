/**
 * language-parser-registry.ts — Plugin Registry for Multilingual AST Parsers
 */
import { ILanguageParser, ParseResult } from './ilanguage-parser';
export declare class LanguageParserRegistry {
    private parsers;
    private fallbackParser;
    constructor();
    private registerDefaults;
    registerParser(parser: ILanguageParser): void;
    getParserForFile(filePath: string): ILanguageParser;
    parseFile(filePath: string, content: string, fileId: string): Promise<ParseResult>;
}
