import { ISourceRange } from '@forge/shared';
import { ParserContext } from '../context';

export interface IASTNode {
  readonly type: string;
  readonly range: ISourceRange;
  readonly text: string;
  readonly children: IASTNode[];
}

export interface IExtractorPlugin {
  readonly id: string;
  readonly priority: number;
  extract(node: IASTNode, context: ParserContext): Promise<void>;
}
