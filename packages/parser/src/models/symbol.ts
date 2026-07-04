import { ISymbol, SymbolKind, ISourceRange } from '@forge/shared';

export { ISymbol, SymbolKind };

export class ForgeSymbol implements ISymbol {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly kind: SymbolKind,
    public readonly range: ISourceRange,
    public readonly selectionRange: ISourceRange,
    public readonly visibility: 'public' | 'private' | 'protected' | 'package',
    public readonly childrenIds: string[] = [],
    public readonly parentId?: string,
    public readonly documentation?: string
  ) {}
}
