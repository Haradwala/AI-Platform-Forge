import { ISymbol, IRelationship, ISourceLocation, ISourceRange, IDiagnostic, IParseResult } from '@forge/shared';
export { IDiagnostic, IParseResult };
import { ParserContext } from '../context';
import { IExtractorPlugin } from './extractor';

export interface ILanguageParser {
  readonly languageId: string;
  parse(
    content: string,
    filePath: string,
    context: ParserContext,
    extractors: IExtractorPlugin[]
  ): Promise<IParseResult>;
  parseIncremental(
    content: string,
    filePath: string,
    previousResult: IParseResult,
    context: ParserContext,
    extractors: IExtractorPlugin[],
    edits?: any
  ): Promise<IParseResult>;
}
