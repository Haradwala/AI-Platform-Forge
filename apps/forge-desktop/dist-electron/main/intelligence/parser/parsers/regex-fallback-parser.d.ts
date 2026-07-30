/**
 * regex-fallback-parser.ts — Multilingual Regex-based Fallback AST Parser
 */
import { ILanguageParser, ParseResult } from '../ilanguage-parser';
export declare class RegexFallbackParser implements ILanguageParser {
    readonly languageId = "generic_regex";
    readonly supportedExtensions: never[];
    parseFile(filePath: string, content: string, fileId: string): Promise<ParseResult>;
}
