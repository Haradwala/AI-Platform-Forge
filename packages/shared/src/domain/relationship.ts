import { ISourceRange } from './symbol';

export type RelationshipType =
  | 'imports'
  | 'exports'
  | 'calls'
  | 'extends'
  | 'implements'
  | 'defines'
  | 'references'
  | 'instantiates'
  | 'reads'
  | 'writes'
  | 'throws'
  | 'returns';

export interface IRelationship {
  readonly sourceSymbolId: string;
  readonly targetSymbolId: string;
  readonly type: RelationshipType;
  readonly range?: ISourceRange;
}
