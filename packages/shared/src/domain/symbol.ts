import { IRelationship } from './relationship';

export type SymbolKind =
  | 'file'
  | 'namespace'
  | 'module'
  | 'class'
  | 'interface'
  | 'method'
  | 'function'
  | 'enum'
  | 'variable'
  | 'constant'
  | 'type_alias'
  | 'import'
  | 'export'
  | 'decorator'
  | 'parameter'
  | 'generic';

export interface ISourceLocation {
  readonly line: number;
  readonly column: number;
  readonly offset: number;
}

export interface ISourceRange {
  readonly start: ISourceLocation;
  readonly end: ISourceLocation;
}

export interface ISymbol {
  readonly id: string;
  readonly name: string;
  readonly kind: SymbolKind;
  readonly range: ISourceRange;
  readonly selectionRange: ISourceRange;
  readonly documentation?: string;
  readonly visibility: 'public' | 'private' | 'protected' | 'package';
  readonly parentId?: string;
  readonly childrenIds: string[];
}

export interface IDiagnostic {
  readonly message: string;
  readonly severity: 'error' | 'warning' | 'info';
  readonly range: ISourceRange;
}

export interface IParseResult {
  readonly symbols: ISymbol[];
  readonly relationships: IRelationship[];
  readonly diagnostics: IDiagnostic[];
}
