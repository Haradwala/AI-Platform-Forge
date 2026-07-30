/**
 * ilanguage-parser.ts — Plugin Interface for Multilingual AST Parsers
 */
import { KnowledgeNode, KnowledgeEdge } from '../contracts/intelligence-types';
export interface ParseResult {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
}
export interface ILanguageParser {
    readonly languageId: string;
    readonly supportedExtensions: string[];
    parseFile(filePath: string, content: string, fileId: string): Promise<ParseResult>;
}
