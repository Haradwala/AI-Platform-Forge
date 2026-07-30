import { ILanguageParser, IUnifiedCodeModel } from './repository-types';
export declare class RegexParser implements ILanguageParser {
    readonly id = "RegexParser";
    readonly language = "Generic";
    supports(filePath: string): boolean;
    parse(filePath: string, content: string): IUnifiedCodeModel;
    private detectLanguageByExt;
}
