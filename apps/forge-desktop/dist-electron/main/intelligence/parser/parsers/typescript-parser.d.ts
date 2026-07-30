/**
 * typescript-parser.ts — TypeScript & JavaScript AST Symbol & Relationship Parser
 */
import { ILanguageParser, ParseResult } from '../ilanguage-parser';
export declare class TypeScriptParser implements ILanguageParser {
    readonly languageId = "typescript";
    readonly supportedExtensions: string[];
    parseFile(filePath: string, content: string, fileId: string): Promise<ParseResult>;
}
