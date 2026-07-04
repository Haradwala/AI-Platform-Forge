import { IRelationship, RelationshipType, ISourceRange } from '@forge/shared';

export { IRelationship, RelationshipType };

export class ForgeRelationship implements IRelationship {
  constructor(
    public readonly sourceSymbolId: string,
    public readonly targetSymbolId: string,
    public readonly type: RelationshipType,
    public readonly range?: ISourceRange
  ) {}
}
